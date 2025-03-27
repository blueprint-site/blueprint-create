import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import MinecraftTetrisGame from '@/components/features/games/tetris/MinecraftTetrisGame.tsx';

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div className='bg-background flex min-h-screen flex-col items-center justify-center px-4 text-center'>
      <div className='flex flex-col items-center gap-8 md:flex-row md:items-start'>
        <MinecraftTetrisGame />
        <div className='space-y-4'>
          <h1 className='text-primary text-6xl font-bold'>404</h1>
          <h2 className='font-minecraft text-2xl'>{t('error.page-not-found.title')}</h2>
          <div className='text-foreground-muted max-w-lg'>
            <p>{t('error.page-not-found.description1')}</p>
            <p>
              {t('error.page-not-found.description2')}{' '}
              <a href='mailto:blueprint-site@proton.me'>blueprint-site@proton.me</a>
            </p>
          </div>
          <Link to='/'>
            <Button className='mt-4'>
              <Home className='mr-2 h-4 w-4' />
              {t('error.page-not-found.action')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
