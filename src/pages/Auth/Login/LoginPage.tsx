import { Input } from '@/components/ui/input';
import logo from '@/assets/logo.webp';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { account } from '@/lib/appwrite';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  async function handleLogin() {
    setIsLoading(true);

    const loginPromise = account.createEmailPasswordSession({
      email: username,
      password: password,
    });
    const delayPromise = new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const [result] = await Promise.all([loginPromise, delayPromise]);

      if (result.$id) {
        toast.success('Login successful!');
        window.location.href = '/';
      } else {
        toast.error('Login failed. Please check your credentials and try again.');
      }
    } catch (error) {
      toast.error('Login failed. Please check your credentials and try again.');
    }

    setIsLoading(false);
  }
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='flex flex-col w-full bg-blueprint text-black dark:bg-blue-300 py-10 px-5 gap-5 max-w-md mx-auto text-left items-start'>
        <h1 className='font-minecraft text-4xl text-left flex'>
          <img src={logo} alt='' className='w-10 mr-2' />
          Login to Blueprint{' '}
        </h1>
        <Input
          placeholder='Your email'
          className='text-black '
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        />
        <Input
          placeholder='Your password'
          className='text-black '
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        />
        <Button
          className='bg-accent px-10 font-minecraft transition-all'
          onClick={async () => await handleLogin()}
        >
          Login {isLoading && <Spinner />}
        </Button>
        <span className='opacity-50 -mt-3 text-sm font-minecraft font-light'>
          Note: Currently login is only needed for admins. If you are a user, there's no purpose to
          use it
        </span>
      </div>
      {/* <div className="h-20 w-40 bg-blueprint">
                <span>"Blueprint"</span>
            </div>
            <div className="h-20 w-40 bg-[#7594ED]">
                <span>#7594ED</span>
            </div>
            <div className="h-20 w-40 bg-[#71B9ED]">
                <span>#71B9ED</span>
            </div> */}
    </div>
  );
}
