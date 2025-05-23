// src/components/ForCreators.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import DevinsBadges from '../../utility/DevinsBadges';
import { useTranslation } from 'react-i18next';

const ForCreators = () => {
  const { t } = useTranslation();
  return (
    <div className='flex flex-col items-center space-y-4 text-center'>
      <div className='font-minecraft space-y-2'>
        <h2 className='text-3xl font-bold sm:text-4xl'>{t('home.info.forCreator.title')}</h2>
        <p className='text-foreground/90 bg-background/25 mx-auto max-w-[700px] p-2'>
          {t('home.info.forCreator.description')}
        </p>
      </div>

      <Card className='md:bg-background h-full w-full'>
        <CardHeader>
          <CardTitle className='text-xl'>{t('home.info.forCreator.card.title')}</CardTitle>
          <CardDescription>{t('home.info.forCreator.card.description')}</CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4'>
          <p className='text-foreground-muted text-sm'>{t('home.info.forCreator.card.content')}</p>

          <div className='mx-auto mt-4 grid gap-4 md:grid-cols-2'>
            <div className='flex items-center justify-center'>
              <DevinsBadges
                type='cozy'
                category='social'
                name='discord-plural'
                height={64}
                format='svg'
                className='hidden cursor-pointer md:block'
              />
              <DevinsBadges
                type='compact'
                category='social'
                name='discord-plural'
                height={40}
                format='svg'
                className='cursor-pointer md:hidden'
              />
            </div>

            <Button
              className='h-[40px] cursor-pointer text-xl text-white/90 md:h-[56px]'
              onClick={() => (window.location.href = 'mailto:blueprint-site@proton.me')}
            >
              <Mail className='mr-2' size={24} />
              {t('home.info.forCreator.card.button')}
            </Button>
          </div>

          <div className='mt-4 flex items-center justify-center'>
            <p className='text-foreground-muted text-center text-xs tracking-wide'>
              Email: blueprint-site@proton.me
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForCreators;
