import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SiModrinth } from '@icons-pack/react-simple-icons';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { ModrinthAuthProps } from '../types';
import eyeSquintGif from '@/assets/eyes/eye_squint.gif';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const validateToken = (token: string) => {
  if (!token) return { isValid: false, message: '' };

  // Check length first
  if (token.length !== 64) {
    return {
      isValid: false,
      message: 'Token must be exactly 64 characters long.',
    };
  }

  // Then check prefix if length is correct
  if (!token.startsWith('mrp_')) {
    return {
      isValid: false,
      message: "Token must start with 'mrp_'.",
    };
  }

  return {
    isValid: true,
    message: '',
  };
};

const TokenStatus = ({
  token,
  isValid,
  errorMessage,
}: {
  token: string;
  isValid: boolean;
  errorMessage: string;
}) => {
  if (!token) {
    return (
      <div id='token-help' className='text-muted-foreground text-xs'>
        Enter your PAT token to continue
      </div>
    );
  }
  if (isValid) {
    return <div className='text-xs text-green-600'>✓ Valid token format</div>;
  }
  return (
    <div id='token-error' className='text-xs text-red-500'>
      {errorMessage}
    </div>
  );
};

export default function ModrinthAuthStep({
  next,
  back,
  setModrinthToken,
  modrinthToken,
}: Readonly<ModrinthAuthProps>) {
  const [token, setToken] = useState(modrinthToken);
  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const { isValid, message } = validateToken(token);
    setIsValid(isValid);
    setErrorMessage(message);
    setModrinthToken(token);
  }, [token, setModrinthToken]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid) return;
    next();
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle>Modrinth Authentication</DialogTitle>
        <DialogDescription>
          Verify your Modrinth account to claim ownership of your addons
        </DialogDescription>
      </DialogHeader>

      <Card className='mb-6 flex items-center gap-3 bg-green-50 p-4 dark:bg-green-950/30'>
        <div className='flex-shrink-0 rounded-full bg-green-100 p-2 dark:bg-green-900/50'>
          <SiModrinth size={20} className='text-green-600' />
        </div>
        <div className='text-xs text-green-700/80 dark:text-green-400/80'>
          Please verify your Modrinth account to continue to claim ownership of your addons/mods.
        </div>
      </Card>

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div>
          <Label htmlFor='token' className='mb-1 block text-xs font-medium'>
            Enter your Modrinth PAT Token
          </Label>
          <Input
            id='token'
            type='password'
            className='w-full font-mono'
            placeholder='••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'
            value={token}
            onChange={handleChange}
            aria-invalid={!isValid && token.length > 0}
            aria-describedby='token-error token-help'
          />

          <div className='mt-1 flex justify-between'>
            <TokenStatus token={token} isValid={isValid} errorMessage={errorMessage} />
            <a
              href='/blog/howto-modrinth-pat'
              className='text-primary flex items-center text-xs hover:underline'
              target='_blank'
              rel='noopener noreferrer'
            >
              How to get your token <ExternalLink size={12} className='ml-1' />
            </a>
          </div>
        </div>

        <Card className='bg-muted/50 text-muted-foreground flex items-center justify-between border text-xs'>
          <div className='flex-1'>
            <CardHeader>
              <CardTitle>Why do we need your Modrinth token?</CardTitle>
              <CardDescription className='text-xs'>
                We use your Modrinth personal access token to verify that you're the legitimate
                owner of the addons you're claiming. We ask that you only provide{' '}
                <strong>read projects</strong> permissions and we never store your token after
                verification.
              </CardDescription>
            </CardHeader>
          </div>
          <img src={eyeSquintGif} alt='Verification' className='mr-4 h-10 w-10' />
        </Card>

        <DialogFooter>
          <Button type='button' variant='outline' onClick={back}>
            Back
          </Button>
          <Button type='submit' disabled={!isValid}>
            Next
          </Button>
        </DialogFooter>
      </form>
    </div>
  );
}
