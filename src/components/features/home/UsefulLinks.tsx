import { useTranslation } from 'react-i18next';

import CreateFabricLogo from '@/assets/create_fabric.webp';
import CreateLogo from '@/assets/create_mod_logo.webp';
import WikiLogo from '@/assets/sprite-icons/brass_ingot.webp';

import { Card, CardContent } from '@/components/ui/card';

const UsefulLinks = () => {
  const { t } = useTranslation();

  const links = [
    {
      href: 'https://create.fandom.com/wiki/Create_Mod_Wiki',
      icon: WikiLogo,
      text: t('home.info.usefulLinks.link1.title'),
      description: t('home.info.usefulLinks.link1.description'),
      color: 'success',
    },
    {
      href: 'https://modrinth.com/mod/create',
      icon: CreateLogo,
      text: t('home.info.usefulLinks.link2.title'),
      description: t('home.info.usefulLinks.link2.description'),
      color: 'warning',
    },
    {
      href: 'https://modrinth.com/mod/create-fabric',
      icon: CreateFabricLogo,
      text: t('home.info.usefulLinks.link3.title'),
      description: t('home.info.usefulLinks.link3.description'),
      color: 'destructive',
    },
  ];

  return (
    <div className='flex flex-col items-center space-y-4 text-center'>
      <div className='space-y-2'>
        <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl'>
          {t('home.info.usefulLinks.title')}
        </h2>
        <p className='text-foreground/90 bg-background/25 mx-auto max-w-[700px] p-2'>
          {t('home.info.usefulLinks.description')}
        </p>
      </div>

      <Card className='md:bg-background w-full'>
        <CardContent className='flex flex-col gap-4 p-6'>
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target='_blank'
              rel='noopener noreferrer'
              className={`bg-${link.color} flex items-center justify-center gap-5 rounded-lg p-4 hover:bg-${link.color}/80 transition-colors duration-200`}
            >
              <img
                src={link.icon}
                alt={link.icon}
                loading='lazy'
                className='h-16 w-16 object-contain'
              />
              <div className='text-center'>
                <div className='font-minecraft text-semantic-foreground text-xl font-bold'>
                  {link.text}
                </div>
                <div className='text-semantic-foreground-muted line-clamp-2 text-sm'>
                  {link.description}
                </div>
              </div>
            </a>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default UsefulLinks;
