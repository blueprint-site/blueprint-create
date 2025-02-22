import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { account } from "@/config/appwrite.ts";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Vérifie la session lors du montage du composant
    const checkSession = async () => {
      try {
        // Méthode Appwrite pour obtenir la session actuelle
        const session = await account.getSession('current');
        setIsAuthenticated(!!session); // Définit à true si une session existe, false sinon
      } catch (error) {
        setIsAuthenticated(false); // Aucune session trouvée, l'utilisateur n'est pas authentifié
      }
    };

    checkSession();
  }, []);

  // Affiche un indicateur de chargement pendant la vérification de la session
  if (isAuthenticated === null) {
    return <div>Vérification de votre statut de connexion...</div>;
  }

  // Redirige vers la page de connexion si l'utilisateur n'est pas authentifié
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Rend les enfants si l'utilisateur est authentifié
  return <>{children}</>;
};

export default ProtectedRoute;
