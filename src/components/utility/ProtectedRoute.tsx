import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { account } from "@/config/appwrite";
import { LoadingOverlay } from "@/components/loading-overlays/LoadingOverlay";
import { useToast } from "@/api";

interface ProtectedRouteProps {
  children: React.ReactNode;
  // Optional role requirement for future expansion
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasRequiredRole, setHasRequiredRole] = useState<boolean>(true);
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await account.getSession('current');

        // Basic authentication check
        if (!session) {
          setIsAuthenticated(false);
          return;
        }

        // Optional role check if requiredRole is specified
        if (requiredRole) {
          const user = await account.get();
          const userRoles = user.prefs?.roles || [];
          setHasRequiredRole(userRoles.includes(requiredRole));
        }

        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
        toast({
          title: "Authentication Error",
          description: "Please log in again",
          variant: "destructive",
        });
      }
    };

    checkSession();
  }, [requiredRole, toast]);

  // Show Blueprint's standard loading overlay during check
  if (isAuthenticated === null) {
    return <LoadingOverlay message="Verifying authentication..." />;
  }

  // Handle authentication failure
  if (!isAuthenticated) {
    // Include the current path as return URL
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?returnUrl=${returnUrl}`} replace />;
  }

  // Handle role requirement failure
  if (requiredRole && !hasRequiredRole) {
    toast({
      title: "Access Denied",
      description: `Required role: ${requiredRole}`,
      variant: "destructive",
    });
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;