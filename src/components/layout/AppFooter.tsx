// PROPOSAL 2: Compact Two-Tier Footer - Complete Implementation
import { cn } from '@/config/utils.ts';
import { useLogo } from '@/hooks';
import LanguageSwitcher from '@/components/features/settings/LanguageSwitcher.tsx';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button.tsx';
import { useNavigate } from 'react-router-dom';
import { Bug } from 'lucide-react';
import { SiGithub } from '@icons-pack/react-simple-icons';

interface FooterProps {
  className?: string;
}

const CompactTwoTierFooter = ({ className }: FooterProps) => {
  const { logoSrc } = useLogo();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <footer className={cn('w-full pt-2', className)}>
      <div className='py-2'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-1 items-center gap-2 md:grid-cols-3'>
            <div className='flex items-center justify-center gap-2 md:justify-start'>
              <img src={logoSrc} alt='Blueprint Site Logo' className='h-7 w-7' />
              <h4 className='text-base font-bold'>Blueprint</h4>
            </div>

            <div className='flex flex-wrap items-center justify-center gap-3 md:gap-4'>
              <Button
                variant='link'
                onClick={() => navigate('addons')}
                className='h-auto p-1 text-sm'
              >
                {t('navigation.label.addons')}
              </Button>
              <Button
                variant='link'
                onClick={() => navigate('schematics')}
                className='h-auto p-1 text-sm'
              >
                {t('navigation.label.schematics')}
              </Button>
              <Button
                variant='link'
                onClick={() => navigate('blog')}
                className='h-auto p-1 text-sm'
              >
                {t('navigation.label.blog')}
              </Button>
              <Button
                variant='link'
                onClick={() => navigate('about')}
                className='h-auto p-1 text-sm'
              >
                {t('navigation.label.about')}
              </Button>
              <Button
                variant='link'
                onClick={() => navigate('legal')}
                className='h-auto p-1 text-sm'
              >
                {t('navigation.label.legal')}
              </Button>
            </div>

            <div className='flex items-center justify-center gap-3 md:justify-end'>
              <Button variant='link' size='sm' asChild>
                <a
                  href='https://github.com/blueprint-site/blueprint-create'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-1 p-1 hover:opacity-70'
                  title={t('footer.github-source')}
                >
                  <SiGithub size={18} />
                </a>
              </Button>
              <Button variant='link' size='sm' asChild>
                <a
                  href='https://github.com/blueprint-site/blueprint-create/issues'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-1 p-1 hover:opacity-70'
                  title={t('footer.github-issues')}
                >
                  <Bug size={18} />
                </a>
              </Button>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CompactTwoTierFooter;
