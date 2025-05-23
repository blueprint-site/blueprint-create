// src/components/layout/AppFooter.tsx
import { cn } from '@/config/utils.ts';
import { useLogo } from '@/hooks';
import LanguageSwitcher from '@/components/features/settings/LanguageSwitcher.tsx';
import { useTranslation } from 'react-i18next';

interface FooterProps {
  className?: string;
}

const Footer = ({ className }: FooterProps) => {
  // Use non-clickable logo (default behavior)
  const { logoSrc } = useLogo();
  const { t } = useTranslation();
  return (
    <footer className={cn('bg-surface-1 w-full py-4 md:pt-12', className)}>
      <div className='mx-auto px-4 md:container'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
          {/* Logo and Title Row */}
          <div className='flex flex-1 flex-col gap-2'>
            <div className='flex items-center gap-2'>
              {/* Easter egg logo (now non-clickable) */}
              <img src={logoSrc} alt='Blueprint Site Logo' className='w-8' />
              <h4 className='text-lg font-bold'>Blueprint</h4>
            </div>

            <h6 className='text-xs font-normal'>
              {t('footer.found-bug')}{' '}
              <a
                href='https://github.com/blueprint-site/blueprint-create'
                className='hover:underline'
              >
                {t('footer.github-issues')}
              </a>
              .
            </h6>
            <LanguageSwitcher direction={'up'} />
          </div>
          <div className='flex-1'>
            {/* Links to site pages */}
            <div className='flex flex-wrap items-center gap-4 sm:justify-center'>
              <a href='/addons' className='text-xs font-normal hover:underline'>
                {t('navigation.label.addons')}
              </a>
              <a href='/schematics' className='text-xs font-normal hover:underline'>
                {t('navigation.label.schematics')}
              </a>
              <a
                href='https://blueprint-create.com/blueprint-blog/'
                className='text-xs font-normal hover:underline'
              >
                {t('navigation.label.blog')}
              </a>
              <a href='/about' className='text-xs font-normal hover:underline'>
                {t('navigation.label.about')}
              </a>
              <a href='/privacy' className='text-xs font-normal hover:underline'>
                {t('navigation.label.privacy')}
              </a>
              <a href='/terms' className='text-xs font-normal hover:underline'>
                {t('navigation.label.terms')}
              </a>
            </div>
          </div>
          <div className='hidden flex-1 md:block'>{/* <ThemeToggle /> */}</div>
        </div>

        <div className='text-foreground mt-5 flex flex-col gap-1 text-center text-xs font-normal'>
          <div>{t('footer.mojang-warning')}</div>
          <div>{t('footer.create-warning')}</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
