import React, { useEffect, useState, useCallback, useRef } from 'react';
import { account } from '@/config/appwrite';
import { LoadingOverlay } from '@/components/loading-overlays/LoadingOverlay';
import AuthError from '@/pages/auth/AuthError.tsx';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasRequiredRole, setHasRequiredRole] = useState<boolean>(true);

  // Use useRef to hold the cache, so it persists across renders but doesn't trigger re-renders
  const authCache = useRef({
    isAuthenticated: null as boolean | null,
    hasRequiredRole: {} as { [role: string]: boolean },
    timestamp: null as number | null,
  });

  const checkSession = useCallback(async () => {
    try {
      const session = await account.getSession('current');

      if (!session) {
        setIsAuthenticated(false);
        authCache.current.isAuthenticated = false;
        return;
      }

      setIsAuthenticated(true);
      authCache.current.isAuthenticated = true;

      if (requiredRole) {
        const user = await account.get();
        console.log(user);
        const userRoles = user.labels || [];
        const hasRole = userRoles.includes(requiredRole);
        setHasRequiredRole(hasRole);
        authCache.current.hasRequiredRole[requiredRole] = hasRole;
      }
    } catch {
      setIsAuthenticated(false);
      authCache.current.isAuthenticated = false;
    }
  }, [requiredRole]);

  useEffect(() => {
    // Check if the cache is valid (e.g., within a certain time frame)
    if (
      authCache.current.isAuthenticated === null ||
      (authCache.current.timestamp && Date.now() - authCache.current.timestamp > 60000)
    ) {
      checkSession();
      authCache.current.timestamp = Date.now();
    } else {
      setIsAuthenticated(authCache.current.isAuthenticated);
      if (requiredRole && Object.hasOwn(authCache.current.hasRequiredRole, requiredRole)) {
        setHasRequiredRole(authCache.current.hasRequiredRole[requiredRole]);
      }
    }
  }, [checkSession, requiredRole]);

  if (isAuthenticated === null) {
    return <LoadingOverlay message='Verifying authentication...' />;
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
