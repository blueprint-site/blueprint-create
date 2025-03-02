import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { cn } from '@/config/utils';
import Cookie from '@/assets/cookie.webp'

export default function CookieDialog({
  variant = 'default',
  demo = false,
  onAcceptCallback = () => {},
  onDeclineCallback = () => {},
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hide, setHide] = useState(false);

  const accept = () => {
    setIsOpen(false);
    document.cookie = 'cookieConsent=true; expires=Fri, 31 Dec 9999 23:59:59 GMT';
    setTimeout(() => {
      setHide(true);
    }, 700);
    onAcceptCallback();
  };

  const decline = () => {
    setIsOpen(false);
    setTimeout(() => {
      setHide(true);
    }, 700);
    onDeclineCallback();
  };

  useEffect(() => {
    try {
      setIsOpen(true);
      if (document.cookie.includes('cookieConsent=true')) {
        if (!demo) {
          setIsOpen(false);
          setTimeout(() => {
            setHide(true);
          }, 700);
        }
      }
    } catch (e) {
      // console.log("Error: ", e);
    }
  }, []);

  return variant != 'small' ? (
    <div
      className={cn(
        'fixed right-0 bottom-0 left-0 z-[200] w-full duration-700 sm:bottom-4 sm:left-4 sm:max-w-md',
        !isOpen
          ? 'translate-y-8 opacity-0 transition-[opacity,transform]'
          : 'translate-y-0 opacity-100 transition-[opacity,transform]',
        hide && 'hidden'
      )}>
      <div className='dark:bg-card bg-background border-border m-3 rounded-md border shadow-lg'>
        <div className='grid gap-2'>
          <div className='border-border flex h-14 items-center justify-between border-b p-4'>
            <h1 className='my-0 p-0 text-lg leading-none font-medium'>We use cookies!</h1>
            <img src={Cookie} alt="A Minecraft Cookie" className='h-10 w-10'/>
          </div>
          <div className='p-4'>
            <p className='text-start text-sm font-normal'>
              We use cookies to save some data and improve your experience. And because they are tasty of course. My favourite ones are the chockolate chip cookies.
              <br />
              <br />
              <span className='text-xs'>
                By clicking "<span className='font-medium opacity-80'>Accept</span>
                ", you agree to our use of cookies.
              </span>
              <br />
              <a href='/privacy' className='text-xs underline'>
                Link to our privacy policy
              </a>
            </p>
          </div>
          <div className='border-border dark:bg-background/20 flex gap-2 border-t p-4 py-5'>
            <Button onClick={accept} className='w-full'>
              Accept
            </Button>
            <Button onClick={decline} className='w-full' variant='secondary'>
              Decline
            </Button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div
      className={cn(
        'fixed right-0 bottom-0 left-0 z-[200] w-full duration-700 sm:bottom-4 sm:left-4 sm:max-w-md',
        !isOpen
          ? 'translate-y-8 opacity-0 transition-[opacity,transform]'
          : 'translate-y-0 opacity-100 transition-[opacity,transform]',
        hide && 'hidden'
      )}>
      <div className='dark:bg-card bg-background border-border m-3 rounded-lg border'>
        <div className='flex items-center justify-between p-3'>
          <h1 className='text-lg font-medium'>We use cookies</h1>
          <img src={Cookie} alt="Minecraft cookie" />
        </div>
        <div className='-mt-2 p-3'>
          <p className='text-muted-foreground text-left text-sm'>
            We use cookies to ensure you get the best experience on our website. For more
            information on how we use cookies, please see our cookie policy.
          </p>
        </div>
        <div className='mt-2 flex items-center gap-2 border-t p-3'>
          <Button onClick={accept} className='h-9 w-full rounded-full'>
            accept
          </Button>
          <Button onClick={decline} className='h-9 w-full rounded-full' variant='outline'>
            decline
          </Button>
        </div>
      </div>
    </div>
  );
}
