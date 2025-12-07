import React, { useEffect, useState, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { account, teams } from '@/lib/appwrite';
import { Spinner } from './ui/spinner';

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

interface User {
  $id: string;
  name: string;
  email: string;
  prefs?: {
    roles?: string[];
  };
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  useMinimalLoading: _useMinimalLoading = false,
}) => {
  const authCache = getGlobalAuthCache();
  const CACHE_DURATION = 30 * 60 * 1000;
  const isCacheValid = !!(
    authCache &&
    authCache.timestamp &&
    Date.now() - authCache.timestamp < CACHE_DURATION &&
    authCache.isAuthenticated !== null
  );

  const initialAuth =
    isCacheValid && authCache.isAuthenticated === true
      ? true
      : isCacheValid && authCache.isAuthenticated === false
        ? false
        : null;
  const initialRole =
    requiredRole && isCacheValid && authCache.hasRequiredRole[requiredRole] !== undefined
      ? authCache.hasRequiredRole[requiredRole]
      : true;

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(initialAuth);
  const [hasRequiredRole, setHasRequiredRole] = useState<boolean>(initialRole);

  const checkSession = useCallback(async () => {
    const cache = getGlobalAuthCache();
    if (!cache) return;

    try {
      const session = await account.getSession({ sessionId: 'current' });

      if (!session) {
        setIsAuthenticated(false);
        cache.isAuthenticated = false;
        return;
      }

      setIsAuthenticated(true);
      cache.isAuthenticated = true;

      if (requiredRole) {
        const ADMIN_TEAM_ID = 'admin';
        const roleToTeamId: Record<string, string> = {
          admin: ADMIN_TEAM_ID,
        };

        const user = (await account.get()) as User;
        const userRoles = user.prefs?.roles || [];
        const hasPrefsRole = userRoles.includes(requiredRole);

        let hasTeamRole = false;
        if (roleToTeamId[requiredRole]) {
          try {
            const teamMemberships = await teams.listMemberships({
              teamId: roleToTeamId[requiredRole],
            });
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
      }
    } catch {
      setIsAuthenticated(false);
      cache.isAuthenticated = false;
    }
  }, [requiredRole]);

  useEffect(() => {
    if (isCacheValid && authCache?.isAuthenticated === true) {
      return;
    }

    const cache = getGlobalAuthCache();
    if (!cache) {
      checkSession();
      return;
    }

    if (
      cache.isAuthenticated === null ||
      !cache.timestamp ||
      Date.now() - cache.timestamp > CACHE_DURATION
    ) {
      checkSession();
      cache.timestamp = Date.now();
    }
  }, [checkSession, requiredRole, isCacheValid, authCache?.isAuthenticated, CACHE_DURATION]);

  if (isAuthenticated === null) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center bg-blueprint p-6 rounded animate-bounce'>
          <Spinner className='size-10 w-full' />
          <p className='font-minecraft mt-2'>Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  if (requiredRole && !hasRequiredRole) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className=' bg-destructive/30 p-10'>
          <h1 className='text-3xl font-bold text-red-600 font-minecraft'>Access Denied</h1>
          <p className='mt-2'>You don&apos;t have permission to access this page.</p>
          <p className='text-sm mt-1 opacity-80 dark:opacity-50 font-minecraft'>
            Required role: admin
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
