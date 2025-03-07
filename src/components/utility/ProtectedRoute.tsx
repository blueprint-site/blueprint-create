import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await account.getSession('current');

        if (!session) {
          setIsAuthenticated(false);
          return;
        }

        if (requiredRole) {
          const user = await account.get();
          const userRoles = user.prefs?.roles || [];
          setHasRequiredRole(userRoles.includes(requiredRole));
        }

        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkSession();
  }, [requiredRole]);

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
