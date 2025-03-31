import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';

interface AuthErrorPageProps {
  message: string;
  redirectTo: string;
  delay?: number; // Temps avant redirection (en ms), par défaut 3s
}

const AuthError: React.FC<AuthErrorPageProps> = ({ message, redirectTo, delay = 3000 }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(redirectTo, { replace: true });
    }, delay);

    return () => clearTimeout(timer);
  }, [redirectTo, delay, navigate]);

  return (
    <div className='flex h-screen flex-col items-center justify-center text-center'>
      <h1 className='text-2xl font-bold text-red-600'>{message}</h1>
      <p className='text-gray-600'>You are not authorized there ...</p>
    </div>
  );
};

export default AuthError;
