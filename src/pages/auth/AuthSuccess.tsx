import { useEffect } from 'react';
import { useLoggedUser } from '@/api/context/loggedUser/useLoggedUser';

const AuthSuccess = () => {
  const { handleOAuthCallback } = useLoggedUser();

  useEffect(() => {
    const fetchSessionAndLog = async () => {
      // Récupère la session via le callback défini dans le contexte
      await handleOAuthCallback();
    };

    fetchSessionAndLog();
  }, [handleOAuthCallback]);

  return <div>Authenticating... please wait.</div>;
};

export default AuthSuccess;
