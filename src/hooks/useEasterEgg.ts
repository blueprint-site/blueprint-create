// src/hooks/useEasterEgg.ts
import { useRef, useCallback, useEffect } from 'react';
import { useEasterEggStore } from '@/api/stores/easterEggStore';
import { useLoggedUser } from '@/api/context/loggedUser/loggedUserContext';
import { useToast } from '@/api/endpoints/useToast';
import Logo from '@/assets/logo.webp';
import LegacyLogo from '@/assets/legacy_logo.webp';
import { getEasterEggById, DEFAULT_EASTER_EGGS } from '@/config/easterEggs';
import { UserPreferences } from '@/schemas/user.schema';

interface UseLogoOptions {
  enableAnimation?: boolean;
}

/**
 * Hook for working with easter eggs in the application
 */
export const useEasterEgg = () => {
  const { logoClickCount, incrementLogoClickCount } = useEasterEggStore();
  const { preferences, updatePreferences } = useLoggedUser();
  const { toast } = useToast();

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
      if (!preferences) return false;

      // Get the easter egg metadata
      const eggDetails = getEasterEggById(eggId);
      if (!eggDetails) return false;

      // Get current easter eggs or initialize with defaults
      const currentEasterEggs = preferences.easterEggs || {
        ...DEFAULT_EASTER_EGGS,
        discovered: [],
        enabled: {}
      };

      // Check if already discovered
      if (currentEasterEggs.discovered.includes(eggId)) {
        return true;
      }

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

      // Show toast notification
      toast({
        title: `Easter Egg Discovered: ${eggDetails.name}!`,
        description: `${eggDetails.description} Check your settings to toggle this feature!`,
        duration: 5000
      });

      return true;
    } catch (error) {
      console.error('Error discovering easter egg:', error);
      return false;
    }
  }, [preferences, updatePreferences, toast]);

  // Effect to check for easter egg discovery based on click count
  useEffect(() => {
    if (logoClickCount >= 5) {
      discoverEasterEgg('legacyLogo');
    }
  }, [logoClickCount, discoverEasterEgg]);

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
 * and optionally adds click animation
 */
export const useLogo = (options: UseLogoOptions = {}) => {
  const { enableAnimation = true } = options;
  const { incrementLogoClickCount, isEggEnabled } = useEasterEgg();
  const logoRef = useRef<HTMLImageElement | null>(null);
  const isAnimatingRef = useRef(false);
  
  // Use the legacy logo if the easter egg is enabled
  const logoSrc = isEggEnabled('legacyLogo') ? LegacyLogo : Logo;
  
  // Animation function for the logo
  const animateLogo = useCallback(() => {
    if (!logoRef.current || isAnimatingRef.current || !enableAnimation) return;
    
    isAnimatingRef.current = true;
    
    const element = logoRef.current;
    element.style.transition = 'transform 0.4s ease';
    element.style.transform = 'rotate(360deg)';
    
    setTimeout(() => {
      if (logoRef.current) {
        logoRef.current.style.transform = 'rotate(0deg)';
      }
      isAnimatingRef.current = false;
    }, 450);
  }, [enableAnimation]);

  // Handler for logo clicks
  const handleLogoClick = useCallback(() => {
    incrementLogoClickCount();
    animateLogo();
  }, [incrementLogoClickCount, animateLogo]);

  // Clean up animation styles on unmount
  useEffect(() => {
    // Capture the current ref value to use in cleanup
    const currentRef = logoRef.current;

    return () => {
      if (currentRef) {
        currentRef.style.transition = '';
        currentRef.style.transform = '';
      }
    };
  }, []);
  
  return {
    logoSrc,
    logoRef,
    handleLogoClick
  };
};