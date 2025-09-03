import React, { useEffect, useState, useCallback, useRef } from 'react';
import { account, teams } from '@/config/appwrite';
import { LoadingOverlay } from '@/components/loading-overlays/LoadingOverlay';
import { MinimalLoadingOverlay } from '@/components/loading-overlays/MinimalLoadingOverlay';
import AuthError from '@/pages/auth/AuthError.tsx';
import type { UserPreferences } from '@/types/appwrite';

// Global authentication cache stored in window to persist across HMR and navigation
const getGlobalAuthCache = () => {
  if (typeof window === 'undefined') return null;

  if (!window.__authCache) {
    window.__authCache = {
      isAuthenticated: null as boolean | null,
      hasRequiredRole: {} as { [role: string]: boolean },
      timestamp: null as number | null,
    };
  }
  return window.__authCache;
};

// Declare window type
declare global {
  interface Window {
    __authCache: {
      isAuthenticated: boolean | null;
      hasRequiredRole: { [role: string]: boolean };
      timestamp: number | null;
    };
  }
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  useMinimalLoading?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  useMinimalLoading = false,
}) => {
  // Generate unique instance ID for debugging
  const instanceId = useRef(Math.random().toString(36).substr(2, 9));

  // Get cache and check validity
  const authCache = getGlobalAuthCache();
  const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
  const isCacheValid = !!(
    authCache &&
    authCache.timestamp &&
    Date.now() - authCache.timestamp < CACHE_DURATION &&
    authCache.isAuthenticated !== null
  );

  // Debug logging
  console.log(`ProtectedRoute[${instanceId.current}] mount - cache state:`, {
    requiredRole,
    useMinimalLoading,
    cacheExists: !!authCache,
    isAuthenticated: authCache?.isAuthenticated,
    timestamp: authCache?.timestamp,
    hasRequiredRole: authCache?.hasRequiredRole,
    isCacheValid,
  });

  // Initialize state from cache if available AND valid
  // For admin role, if cache exists but role isn't cached yet, assume true
  const initialAuth =
    isCacheValid && authCache.isAuthenticated === true
      ? true
      : isCacheValid && authCache.isAuthenticated === false
        ? false
        : null;
  const initialRole =
    requiredRole && isCacheValid && authCache.hasRequiredRole[requiredRole] !== undefined
      ? authCache.hasRequiredRole[requiredRole]
      : true; // Default to true to prevent loading flash

  console.log(`ProtectedRoute[${instanceId.current}] initial states:`, {
    initialAuth,
    initialRole,
    requiredRole,
    isCacheValid,
    cacheAge: authCache?.timestamp ? Date.now() - authCache.timestamp : null,
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(initialAuth);
  const [hasRequiredRole, setHasRequiredRole] = useState<boolean>(initialRole);

  const checkSession = useCallback(async () => {
    const cache = getGlobalAuthCache();
    if (!cache) return;

    try {
      const session = await account.getSession('current');

      if (!session) {
        setIsAuthenticated(false);
        cache.isAuthenticated = false;
        return;
      }

      setIsAuthenticated(true);
      cache.isAuthenticated = true;

      if (requiredRole) {
        // Map role names to team IDs
        const ADMIN_TEAM_ID = 'admin';
        const roleToTeamId: Record<string, string> = {
          admin: ADMIN_TEAM_ID,
          // Add other role mappings as needed
        };

        // Check if user has role in preferences first
        const user = await account.get();
        const userRoles = (user.prefs as UserPreferences)?.roles || [];
        const hasPrefsRole = userRoles.includes(requiredRole);

        // Check team membership for admin role
        let hasTeamRole = false;
        if (roleToTeamId[requiredRole]) {
          try {
            // Check if user is a member of the admin team
            const teamMemberships = await teams.listMemberships(roleToTeamId[requiredRole]);
            hasTeamRole = teamMemberships.memberships.some(
              (membership) => membership.userId === user.$id
            );
          } catch (error) {
            console.error('Error checking team membership:', error);
            hasTeamRole = false;
          }
        }

        const hasRole = hasPrefsRole || hasTeamRole;
        setHasRequiredRole(hasRole);
        cache.hasRequiredRole[requiredRole] = hasRole;
        console.log(`ProtectedRoute - cached role ${requiredRole}:`, hasRole);
      }
    } catch {
      setIsAuthenticated(false);
      cache.isAuthenticated = false;
    }
  }, [requiredRole]);

  useEffect(() => {
    // Skip if we already have valid authentication from cache
    if (isCacheValid && authCache?.isAuthenticated === true) {
      console.log(
        `ProtectedRoute[${instanceId.current}] skipping auth check - valid cache with authenticated user`
      );
      return;
    }

    const cache = getGlobalAuthCache();
    if (!cache) {
      checkSession();
      return;
    }

    // Check if the cache needs refresh
    const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
    if (
      cache.isAuthenticated === null ||
      !cache.timestamp ||
      Date.now() - cache.timestamp > CACHE_DURATION
    ) {
      console.log(
        `ProtectedRoute[${instanceId.current}] cache expired or missing, checking session`
      );
      checkSession();
      cache.timestamp = Date.now();
    }
  }, [checkSession, requiredRole, isCacheValid, authCache?.isAuthenticated]);

  console.log(`ProtectedRoute[${instanceId.current}] render check:`, {
    isAuthenticated,
    hasRequiredRole,
    requiredRole,
  });

  // Only show loading if we truly don't know the auth state
  if (isAuthenticated === null) {
    console.log(`ProtectedRoute[${instanceId.current}] SHOWING LOADING - isAuthenticated is null`);
    return useMinimalLoading ? (
      <MinimalLoadingOverlay message='Verifying authentication...' />
    ) : (
      <LoadingOverlay message='Verifying authentication...' />
    );
  }

  if (!isAuthenticated) {
    return <AuthError message='Authentication Error. Please log in again.' redirectTo='/login' />;
  }

  if (requiredRole && !hasRequiredRole) {
    return (
      <AuthError message={`Access Denied. Required role: ${requiredRole}`} redirectTo='/login' />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
