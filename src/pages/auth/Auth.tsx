import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

import DiscordLogo from '@/assets/icons/discord-mark-white.svg?url';
import GithubLogo from '@/assets/icons/github-mark-white.svg?url';
import GoogleLogo from '@/assets/icons/google-mark-color.png';
import { Input } from '@/components/ui/input.tsx';
import { useUserStore } from '@/api/stores/userStore';

const AuthPage = () => {
  // Replace context with Zustand store
  const user = useUserStore((state) => state.user);
  const login = useUserStore((state) => state.login);
  const register = useUserStore((state) => state.register);
  const logout = useUserStore((state) => state.logout);
  const handleOAuthLogin = useUserStore((state) => state.handleOAuthLogin);
  const error = useUserStore((state) => state.error);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async () => {
    if (isRegistering) {
      await register(name, email, password);
    } else {
      await login(email, password);
    }
  };

  return (
    <div className='bg-background flex min-h-screen items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <CardTitle className='font-minecraft text-2xl'>Welcome to Blueprint</CardTitle>
          <CardDescription>Continue with your preferred method</CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4'>
          <div>
            <p>{user ? `Logged in as ${user.$id}` : null}</p>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className='grid gap-2'>
                {isRegistering && (
                  <Input type='text' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
                )}
                <Input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input
                  type='password'
                  placeholder='Password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className='mt-2 flex items-center gap-2'>
                <Button variant='outline' className='bg-white text-black/80 hover:bg-gray-50' onClick={handleSubmit}>
                  {isRegistering ? 'Register' : 'Login'}
                </Button>

                {user ? (
                  <Button type='button' onClick={logout}>
                    Logout
                  </Button>
                ) : null}
              </div>

              <div className='text-center'>
                <Button type='button' onClick={() => setIsRegistering(!isRegistering)} variant='link'>
                  {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
                </Button>
              </div>
            </form>
          </div>

          {error && <p className='text-destructive text-center text-sm'>{error}</p>}

          <div className='grid gap-2'>
            <Button
              variant='outline'
              className='bg-white text-black/80 hover:bg-gray-50'
              onClick={() => handleOAuthLogin('google')}
            >
              <img src={GoogleLogo} alt='Google' className='mr-2 h-5 w-5' />
              Continue with Google
            </Button>

            <Button
              variant='outline'
              className='bg-[#2D333B] text-white hover:bg-[#22272E]'
              onClick={() => handleOAuthLogin('github')}
            >
              <img src={GithubLogo} alt='GitHub' className='mr-2 h-5 w-5' />
              Continue with GitHub
            </Button>

            <Button
              variant='outline'
              className='bg-[#5865F2] text-white hover:bg-[#4752C4]'
              onClick={() => handleOAuthLogin('discord')}
            >
              <img src={DiscordLogo} alt='Discord' className='mr-2 h-5 w-5' />
              Continue with Discord
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
