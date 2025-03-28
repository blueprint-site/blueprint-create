// src/components/features/home/WhatIsBlueprint.tsx
import { useTranslation } from 'react-i18next';
import { Equal, Plus } from 'lucide-react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useEasterEgg } from '@/hooks/useEasterEgg';
// Import logos
import Logo from '@/assets/logo.webp';
import OldLogo from '@/assets/legacy_logo.webp';
// Import icons
import AddonIcon from '@/assets/sprite-icons/minecart_coupling.webp';
import SchematicIcon from '@/assets/sprite-icons/schematic.webp';

interface FeatureIconProps {
  src: string;
  alt: string;
  label: string;
  url: string;
  onClick?: () => void;
  className?: string;
}

const FeatureIcon = ({ src, alt, label, url, onClick, className }: FeatureIconProps) => (
  <a
    href={url}
    className={`text-foreground mt-4 flex flex-col items-center transition-transform duration-200 hover:scale-110 ${className || ''}`}
    target='_blank'
    rel='noopener noreferrer'
  >
    <img
      loading='lazy'
      src={src}
      alt={alt}
      className='w-8 object-contain sm:w-10 md:w-14 lg:w-20'
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : {}}
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
  const { isEggEnabled, incrementLogoClickCount } = useEasterEgg();

  // Use the legacy logo if the easter egg is enabled
  const logoSrc = isEggEnabled('legacyLogo') ? OldLogo : Logo;

  // Animation reference and state
  const logoRef = useRef<HTMLImageElement>(null);
  const isAnimatingRef = useRef(false);

  const [rotationDegrees, setRotationDegrees] = useState(0);

  // Update the handleLogoClick function

  const handleLogoClick = (e: ReactMouseEvent<HTMLImageElement>) => {
    // Stop event propagation to prevent the anchor tag from being triggered
    e.preventDefault();
    e.stopPropagation();

    incrementLogoClickCount();

    // Animate the logo when clicked - with continuous rotation
    if (!logoRef.current || isAnimatingRef.current) return;

    isAnimatingRef.current = true;

    // Increase the total rotation by 360 degrees
    const newRotation = rotationDegrees + 360;
    setRotationDegrees(newRotation);

    const element = logoRef.current;
    element.style.transition = 'transform 0.4s ease';
    element.style.transform = `rotate(${newRotation}deg)`;

    // Just set the animating flag back to false when done,
    // but don't reset the rotation
    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 450);
  };
  // Clean up animation styles on unmount
  useEffect(() => {
    const currentRef = logoRef.current;
    return () => {
      if (currentRef) {
        currentRef.style.transition = '';
        currentRef.style.transform = '';
      }
    };
  }, []);

  const features = [
    { src: AddonIcon, alt: 'Addon Icon', label: 'Addons', url: '/addons' },
    { src: SchematicIcon, alt: 'Schematic Icon', label: 'Schematics', url: '/schematics' },
    // Don't include the ref in the features array - we'll apply it directly in JSX
    { src: logoSrc, alt: 'Blueprint Logo', label: 'Blueprint', url: '/' },
  ];

  return (
    <div className='flex flex-col items-center space-y-5 text-center'>
      <div className='text-3xl font-bold tracking-tighter text-white/90 sm:text-4xl md:py-4 md:text-5xl'>
        {t('home.info.about.title')}
      </div>

      <p className='font-italic text-xl text-white/80'>{t('home.info.about.description')}</p>

      <div className='flex items-center justify-center gap-4 px-2'>
        {features.map((feature, index) => (
          <Fragment key={feature.label}>
            {feature.label === 'Blueprint' ? (
              <div className='text-foreground mt-4 flex flex-col items-center transition-transform duration-200 hover:scale-110'>
                <img
                  ref={logoRef}
                  loading='lazy'
                  src={feature.src}
                  alt={feature.alt}
                  className='w-8 cursor-pointer object-contain sm:w-10 md:w-14 lg:w-20'
                  onClick={handleLogoClick}
                />
                <div className='mt-2 text-base md:text-lg'>{feature.label}</div>
              </div>
            ) : (
              <FeatureIcon {...feature} />
            )}
            {index < features.length - 1 && <Separator type={index === 0 ? 'plus' : 'equal'} />}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default WhatIsBlueprint;
