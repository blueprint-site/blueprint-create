// src/hooks/useEasterEgg.ts - Fixed version with proper trigger handling
import { useRef, useCallback, useEffect } from 'react';
import { useEasterEggStore } from '@/api/stores/easterEggStore';
import { useLoggedUser } from '@/api/context/loggedUser/loggedUserContext';
import { useToast } from '@/api/endpoints/useToast';
import Logo from '@/assets/logo.webp';
import LegacyLogo from '@/assets/legacy_logo.webp';
import { getEasterEggById, DEFAULT_EASTER_EGGS } from '@/config/easterEggs';
import { UserPreferences } from '@/schemas/user.schema';

// Rest of the imports and interfaces remain the same

export const useEasterEgg = () => {
  const {
    logoClickCount,
    incrementLogoClickCount,
    eggTriggered,
    resetEggTriggered
  } = useEasterEggStore();

  const { preferences, updatePreferences } = useLoggedUser();
  const { toast } = useToast();

  // Used to prevent multiple discovery attempts
  const isDiscoveringRef = useRef(false);

  // Check if an easter egg has been discovered
  const isEggDiscovered = useCallback((eggId: string): boolean => {
    return !!preferences?.easterEggs?.discovered?.includes(eggId);
  }, [preferences]);

  // Check if an easter egg is enabled
  const isEggEnabled = useCallback((eggId: string): boolean => {
    return !!preferences?.easterEggs?.enabled?.[eggId];
  }, [preferences]);

  // Toggle an easter egg on/off
  const toggleEasterEgg = useCallback(async (eggId: string, enabled: boolean) => {
    try {
      if (!preferences) return false;

      // Get current easter eggs or initialize with defaults
      const currentEasterEggs = preferences.easterEggs || {
        ...DEFAULT_EASTER_EGGS,
        discovered: [],
        enabled: {}
      };

      // Only allow toggling if the egg has been discovered
      if (!currentEasterEggs.discovered.includes(eggId)) {
        return false;
      }

      // Update enabled state
      const updatedPrefs: UserPreferences = {
        ...preferences,
        easterEggs: {
          ...currentEasterEggs,
          enabled: {
            ...currentEasterEggs.enabled,
            [eggId]: enabled
          }
        }
      };

      await updatePreferences(updatedPrefs);
      return true;
    } catch (error) {
      console.error('Error toggling easter egg:', error);
      return false;
    }
  }, [preferences, updatePreferences]);

  // Discover a new easter egg
  const discoverEasterEgg = useCallback(async (eggId: string) => {
    try {
      // Guard against concurrent discovery attempts
      if (isDiscoveringRef.current) {
        console.log('Already discovering an egg');
        return false;
      }

      isDiscoveringRef.current = true;
      console.log('Starting egg discovery process for:', eggId);

      if (!preferences) {
        console.log('No preferences available');
        isDiscoveringRef.current = false;
        return false;
      }

      // Get the easter egg metadata
      const eggDetails = getEasterEggById(eggId);
      if (!eggDetails) {
        console.log('Easter egg details not found for:', eggId);
        isDiscoveringRef.current = false;
        return false;
      }

      // Get current easter eggs or initialize with defaults
      const currentEasterEggs = preferences.easterEggs || {
        ...DEFAULT_EASTER_EGGS,
        discovered: [],
        enabled: {}
      };

      // Check if already discovered
      if (currentEasterEggs.discovered.includes(eggId)) {
        console.log('Easter egg already discovered:', eggId);
        isDiscoveringRef.current = false;
        return true;
      }

      console.log('Updating preferences to mark egg as discovered');

      // Update preferences to mark as discovered
      const updatedPrefs: UserPreferences = {
        ...preferences,
        easterEggs: {
          ...currentEasterEggs,
          discovered: [...currentEasterEggs.discovered, eggId],
          enabled: {
            ...currentEasterEggs.enabled,
            [eggId]: true // Enable by default when discovered
          },
          lastDiscovery: Date.now()
        }
      };

      await updatePreferences(updatedPrefs);
      console.log('Preferences updated successfully');

      // Show toast notification
      console.log('Showing toast notification');
      toast({
        title: `Easter Egg Discovered: ${eggDetails.name}!`,
        description: `${eggDetails.description} Check your settings to toggle this feature!`,
        duration: 5000
      });

      console.log('Easter egg discovery completed successfully');
      isDiscoveringRef.current = false;
      return true;
    } catch (error) {
      console.error('Error discovering easter egg:', error);
      isDiscoveringRef.current = false;
      return false;
    }
  }, [preferences, updatePreferences, toast]);

  // Handle the easter egg trigger once with a proper safeguard
  useEffect(() => {
    let isMounted = true; // Track if component is mounted

    if (eggTriggered && !isDiscoveringRef.current) {
      console.log('Handling easter egg discovery');

      (async () => {
        try {
          await discoverEasterEgg('legacyLogo');
        } finally {
          // Only reset the trigger if the component is still mounted
          if (isMounted) {
            resetEggTriggered();
          }
        }
      })();
    }

    return () => {
      isMounted = false; // Mark as unmounted on cleanup
    };
  }, [eggTriggered, discoverEasterEgg, resetEggTriggered]);

  return {
    logoClickCount,
    incrementLogoClickCount,
    isEggDiscovered,
    isEggEnabled,
    toggleEasterEgg,
    discoverEasterEgg
  };
};

/**
 * Hook that provides the logo source based on easter egg settings
 */
export const useLogo = (options = { enableClicks: false }) => {
  const { enableClicks = false } = options;
  const { incrementLogoClickCount, isEggEnabled } = useEasterEgg();

  // Use the legacy logo if the easter egg is enabled
  const logoSrc = isEggEnabled('legacyLogo') ? LegacyLogo : Logo;

  // Handler for logo clicks - only active if enableClicks is true
  const handleLogoClick = useCallback(() => {
    if (!enableClicks) return;
    incrementLogoClickCount();
  }, [incrementLogoClickCount, enableClicks]);

  return {
    logoSrc,
    handleLogoClick,
    isClickable: enableClicks
  };
};