import Logo from '@/assets/logo.webp';
import { cn } from '@/config/utils.ts';
import SocialSharing from "@/components/features/social-sharing/SocialSharing.tsx";

interface FooterProps {
  className?: string;
}

const Footer = ({ className }: FooterProps) => {
  return (
    <footer className={cn('bg-surface-1 w-full py-4 md:pt-12', className)}>
      <div className='mx-auto px-4 md:container'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
          {/* Logo and Title Row */}
          <div className='flex flex-col gap-2 flex-1'>
            <div className='flex items-center gap-2'>
              <img src={Logo} alt='Blueprint Site Logo' className='w-8' />
              <h4 className='text-lg font-bold'>Blueprint</h4>
            </div>

            <h6 className='text-xs font-normal'>
              Found a bug? Report it to{' '}
              <a
                href='https://github.com/blueprint-site/blueprint-site.github.io'
                className='hover:underline'
              >
                GitHub issues
              </a>
              .
            </h6>
          </div>
          <div className='flex-1'>
            {/* Links to site pages */}
            <div className='flex flex-wrap gap-4 sm:justify-center items-center'>
              <a href='/addons' className='text-xs font-normal hover:underline'>
                Addons
              </a>
              <a href='/schematics' className='text-xs font-normal hover:underline'>
                Schematics
              </a>
              <a
                href='https://blueprint-site.github.io/blueprint-blog/'
                className='text-xs font-normal hover:underline'
              >
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
