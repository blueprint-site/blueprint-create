import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Spinner } from './ui/spinner';
import { getCachedAuthState, refreshAuthState } from '@/utils/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  useMinimalLoading?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  useMinimalLoading: _useMinimalLoading = false,
}) => {
  const { isAuthenticated: cachedAuth, hasRequiredRole: cachedRole, isCacheValid } =
    getCachedAuthState(requiredRole);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(cachedAuth);
  const [hasRequiredRole, setHasRequiredRole] = useState<boolean>(cachedRole);

  useEffect(() => {
    let isMounted = true;

    if (isCacheValid && cachedAuth !== null) {
      setIsAuthenticated(cachedAuth);
      setHasRequiredRole(cachedRole);
      return () => {
        isMounted = false;
      };
    }

    async function ensureAuth() {
      const result = await refreshAuthState(requiredRole);
      if (!isMounted) return;
      setIsAuthenticated(result.isAuthenticated);
      setHasRequiredRole(result.hasRequiredRole);
    }

    void ensureAuth();

    return () => {
      isMounted = false;
    };
  }, [cachedAuth, cachedRole, isCacheValid, requiredRole]);

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
