import { useEffect } from 'react';
import { useUserStore } from '@/api/stores/userStore';
import { useNavigate } from 'react-router';

const AuthSuccess = () => {
  // Replace context with Zustand store
  const handleOAuthCallback = useUserStore((state) => state.handleOAuthCallback);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessionAndLog = async () => {
      try {
        // Call the OAuth callback handler from the store
        await handleOAuthCallback();
        // Redirect to home page or dashboard after successful authentication
        navigate('/');
      } catch (error) {
        console.error('Authentication error:', error);
        // Redirect to error page on failure
        navigate('/auth/error');
      }
    };

    fetchSessionAndLog();
  }, [handleOAuthCallback, navigate]);

  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <div className='text-center'>
        <h2 className='mb-2 text-2xl font-bold'>Authenticating...</h2>
        <p className='text-muted-foreground'>Please wait while we complete your login</p>
      </div>
    </div>
  );
};

export default AuthSuccess;
