import { account } from '@/lib/appwrite';
import { AppwriteException } from 'appwrite';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { isAdmin, type User } from '@/utils/useAuth';
import { useNavigate } from 'react-router-dom';
export default function AuthManagerPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isAdminUser, setIsAdminUser] = useState<boolean | null>(null);
  const navigate = useNavigate();

  function isUnauthenticatedError(error: unknown): error is AppwriteException {
    if (!(error instanceof AppwriteException)) return false;
    return error.code === 401 || error.type === 'user_scope_mismatch';
  }

  async function checkSession(): Promise<boolean> {
    try {
      const session = await account.getSession({ sessionId: 'current' });
      const authenticated = Boolean(session.$id);
      if (!authenticated) {
        setIsAdminUser(false);
      }
      return authenticated;
    } catch (error) {
      setIsAdminUser(false);
      if (!isUnauthenticatedError(error)) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        toast.error('Error checking login status. ' + message);
        console.log('Error checking login status:', error);
      }
      return false;
    }
  }

  async function fetchAdminStatus(): Promise<boolean> {
    try {
      const user = (await account.get()) as User;
      return isAdmin(user);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error('Error determining admin status: ' + message);
      console.log('Error determining admin status:', error);
      return false;
    }
  }

  function logout() {
    account
      .deleteSession({
        sessionId: 'current',
      })
      .then(() => {
        toast.success('Logged out successfully.');
        setIsLoggedIn(false);
        setIsAdminUser(false);
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : 'Unknown error';
        toast.error('Error logging out: ' + message);
      });
  }

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const hasSession = await checkSession();
      if (!isMounted) return;

      setIsLoggedIn(hasSession);
      if (!hasSession) return;

      setIsAdminUser(null);
      const adminStatus = await fetchAdminStatus();
      if (!isMounted) return;
      setIsAdminUser(adminStatus);
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className='p-10 flex flex-col gap-5 text-black font-minecraft'>
      <div className=''>
        <h1 className='font-minecraft text-4xl dark:text-foreground'>Login</h1>
        <button
          onClick={() => navigate('/login')}
          className='px-5 py-1 bg-accent text-white hover:cursor-pointer hover:saturate-150 transition-all duration-300 '
        >
          Redirect to login page
        </button>
      </div>
      <div className=''>
        <span className='font-minecraft text-4xl dark:text-foreground'>Login Status:</span>
        <br />
        {isLoggedIn === null ? (
          <span className=''>Checking...</span>
        ) : isLoggedIn ? (
          <span className=' text-green-700 dark:text-lime-800 font-minecraft'>Logged In</span>
        ) : (
          <span className=' text-red-600 font-minecraft'>Not Logged In</span>
        )}
        {isLoggedIn === true && (
          <div className='mt-5'>
            <button
              className='px-10 bg-red-300 rounded py-1 hover:scale-105 hover:cursor-pointer transition-all duration-300'
              onClick={() => logout()}
            >
              Logout{' '}
            </button>
          </div>
        )}
      </div>
      <div className=''>
        <span className='font-minecraft text-4xl dark:text-foreground'>Admin Status:</span>
        <br />
        <div className='bg-blueprint w-30 px-5 py-1'>
          {isAdminUser === null ? (
            <span className=''>Checking...</span>
          ) : isAdminUser ? (
            <div className=''>
              <span className='text-green-700 dark:text-lime-800 font-minecraft'>Admin</span>
              <button
                onClick={() => navigate('/login')}
                className='px-5 py-1 bg-accent text-white hover:cursor-pointer hover:saturate-150 transition-all duration-300 '
              ></button>
            </div>
          ) : (
            <span className=' text-red-600 font-minecraft'>Not Admin</span>
          )}
        </div>
      </div>
    </div>
  );
}
