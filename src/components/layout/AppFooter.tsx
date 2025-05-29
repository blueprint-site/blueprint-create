// src/components/layout/AppFooter.tsx
import { cn } from '@/config/utils.ts';
import { useLogo } from '@/hooks';
import LanguageSwitcher from '@/components/features/settings/LanguageSwitcher.tsx';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button.tsx';
import { useNavigate } from 'react-router-dom';
import { FeedbackWidget } from '@/components/FeedbackWidget';
import MinecraftIcon from '@/components/utility/MinecraftIcon';

interface FooterProps {
  className?: string;
}

const Footer = ({ className }: FooterProps) => {
  const { logoSrc } = useLogo();
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <footer className={cn('bg-surface-1 w-full py-4 md:pt-12', className)}>
      <div className='mx-auto flex items-center justify-center gap-4 px-4 md:container'>
        {/* Column 1 */}
        <div className='flex flex-shrink-0 flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <img src={logoSrc} alt='Blueprint Site Logo' className='w-8' />
            <h4 className='text-lg font-bold'>Blueprint</h4>
            {/* Feedback bug icon button */}
            <FeedbackWidget renderAsIconButton />
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
        {/* Column 2 (center, grows) */}
        <div className='flex flex-1 justify-center'>
          <div className='flex flex-wrap items-center gap-4'>
            <Button
              variant='link'
              onClick={() => navigate('addons')}
              className='text-xs font-normal hover:underline'
            >
              {t('navigation.label.addons')}
            </Button>
            <Button
              variant='link'
              onClick={() => navigate('schematics')}
              className='text-xs font-normal hover:underline'
            >
              {t('navigation.label.schematics')}
            </Button>
            <Button
              variant='link'
              onClick={() => navigate('blog')}
              className='text-xs font-normal hover:underline'
            >
              {t('navigation.label.blog')}
            </Button>
            <Button
              variant='link'
              onClick={() => navigate('about')}
              className='text-xs font-normal hover:underline'
            >
              {t('navigation.label.about')}
            </Button>
            <Button
              variant='link'
              onClick={() => navigate('privacy')}
              className='text-xs font-normal hover:underline'
            >
              {t('navigation.label.privacy')}
            </Button>
            <Button
              variant='link'
              onClick={() => navigate('terms')}
              className='text-xs font-normal hover:underline'
            >
              {t('navigation.label.terms')}
            </Button>
          </div>
        </div>
      </div>
      <div className='text-foreground mt-5 flex flex-col gap-1 text-center text-xs font-normal'>
        <div>{t('footer.mojang-warning')}</div>
        <div>{t('footer.create-warning')}</div>
      </div>
    </footer>
  );
};

export default Footer;
