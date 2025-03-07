import { useTranslation } from 'react-i18next';
import { Equal, Plus } from 'lucide-react';
import BlueprintLogo from '@/assets/logo.webp';
import AddonIcon from '@/assets/sprite-icons/minecart_coupling.webp';
import SchematicIcon from '@/assets/sprite-icons/schematic.webp';
import React from 'react';

interface FeatureIconProps {
  src: string;
  alt: string;
  label: string;
  url: string;
}

const FeatureIcon = ({ src, alt, label, url }: FeatureIconProps) => (
  <a
    href={url}
    className='text-foreground mt-4 flex flex-col items-center transition-transform duration-200 hover:scale-110'
    target='_blank'
    rel='noopener noreferrer'
  >
    <img
      loading='lazy'
      src={src}
      alt={alt}
      className='w-8 object-contain sm:w-10 md:w-14 lg:w-20'
    />
    <div className='mt-2 text-base md:text-lg'>{label}</div>
  </a>
);

const Separator = ({ type }: { type: 'plus' | 'equal' }) => {
  const Icon = type === 'plus' ? Plus : Equal;
  return <Icon className='h-8 sm:h-10 md:w-14 lg:h-24' />;
};

const WhatIsBlueprint = () => {
  const { t } = useTranslation();

  const features = [
    { src: AddonIcon, alt: 'Addon Icon', label: 'Addons', url: '/addons' },
    { src: SchematicIcon, alt: 'Schematic Icon', label: 'Schematics', url: '/schematics' },
    { src: BlueprintLogo, alt: 'Blueprint Logo', label: 'Blueprint', url: '/' },
  ];

  return (
    <div className='flex flex-col items-center space-y-5 text-center'>
      <div className='text-3xl font-bold tracking-tighter text-white/90 sm:text-4xl md:py-4 md:text-5xl'>
        {t('home.info.about.title')}
      </div>

      <p className='font-italic text-xl text-white/80'>{t('home.info.about.description')}</p>

      <div className='flex items-center justify-center gap-4 px-2'>
        {features.map((feature, index) => (
          <React.Fragment key={feature.label}>
            <FeatureIcon {...feature} />
            {index < features.length - 1 && <Separator type={index === 0 ? 'plus' : 'equal'} />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default WhatIsBlueprint;
