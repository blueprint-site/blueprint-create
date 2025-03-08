import Logo from '@/assets/logo.webp';
import OldLogo from '@/assets/legacy_logo.webp';
import { cn } from '@/config/utils.ts';
import { useEffect, useState } from 'react';
import { useToast } from '@/api';

interface FooterProps {
  className?: string;
}

const Footer = ({ className }: FooterProps) => {
  const { toast } = useToast();

  let clicks = 0;
  const [easterEgg, setEasterEgg] = useState(localStorage.getItem('oldLogo') === 'true');
  const button = document.querySelector('#easter-egg') as HTMLButtonElement | null;
  if (button) {
    let rotating = false;
    button.addEventListener('click', () => {
      if (!rotating) {
        rotating = true;
        button.style.transition = 'transform 0.4s ease';
        button.style.transform = 'rotate(360deg)';
        setTimeout(() => {
          button.style.transform = 'rotate(0deg)';
          rotating = false;
        }, 450);
      }
    });
  }

  function toggleEasterEgg() {
    clicks += 1;
    if (clicks === 5) {
      const isEnabled = localStorage.getItem('oldLogo') === 'true';
  
      if (isEnabled) {
        localStorage.setItem('oldLogo', 'false');
        setEasterEgg(false);
        toast({
          title: 'Disabled the easter egg!',
          description: 'All logos are set to the new logo! (refresh to see)',
        });
      } else {
        localStorage.setItem('oldLogo', 'true');
        setEasterEgg(true);
        toast({
          title: 'Enabled the easter egg!',
          description: 'All logos are set to the old logo! (refresh to see)',
        });
  
        // Store expiration timestamp
        const expirationTime = Date.now() + 300000; // 5 minutes from now
        localStorage.setItem('easterEggExpiration', expirationTime.toString());
      }
      
      clicks = 0;
      setTimeout(() => {
        clicks = 0;
      }, 6000);
    }
  }
  
  // Check expiration on page load
  useEffect(() => {
    const expiration = localStorage.getItem('easterEggExpiration');
    if (expiration && Date.now() > Number(expiration)) {
      localStorage.setItem('oldLogo', 'false');
      setEasterEgg(false);
      localStorage.removeItem('easterEggExpiration'); // Clean up storage
    }
  }, []);
  

  return (
    <footer className={cn('bg-surface-1 w-full py-4 md:pt-12', className)}>
      <div className='mx-auto px-4 md:container'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
          {/* Logo and Title Row */}
          <div className='flex flex-1 flex-col gap-2'>
            <div className='flex items-center gap-2'>
              <button onClick={toggleEasterEgg} id='easter-egg'>
                <img src={easterEgg ? OldLogo : Logo} alt='Blueprint Site Logo' className='w-8' />
              </button>
              <h4 className='text-lg font-bold'>Blueprint</h4>
            </div>

            <h6 className='text-xs font-normal'>
              Found a bug? Report it to{' '}
              <a
                href='https://github.com/blueprint-site/blueprint-site.github.io'
                className='hover:underline'>
                GitHub issues
              </a>
              .
            </h6>
          </div>
          <div className='flex-1'>
            {/* Links to site pages */}
            <div className='flex flex-wrap items-center gap-4 sm:justify-center'>
              <a href='/addons' className='text-xs font-normal hover:underline'>
                Addons
              </a>
              <a href='/schematics' className='text-xs font-normal hover:underline'>
                Schematics
              </a>
              <a
                href='https://blueprint-site.github.io/blueprint-blog/'
                className='text-xs font-normal hover:underline'>
                Blog
              </a>
              <a href='/about' className='text-xs font-normal hover:underline'>
                About
              </a>
              <a href='/privacy' className='text-xs font-normal hover:underline'>
                Privacy
              </a>
              <a href='/terms' className='text-xs font-normal hover:underline'>
                Terms
              </a>
            </div>
          </div>
          <div className='hidden flex-1 md:block'>{/* <ThemeToggle /> */}</div>
        </div>

        <div className='text-foreground mt-5 flex flex-col gap-1 text-center text-xs font-normal'>
          <div>
            NOT AN OFFICIAL MINECRAFT SERVICE. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR
            MICROSOFT.
          </div>
          <div>Not affiliated with Create Mod team or one of the addons in any way.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

