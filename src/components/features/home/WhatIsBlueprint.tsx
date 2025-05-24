// src/components/features/home/WhatIsBlueprint.tsx
import { useTranslation } from 'react-i18next';
import React, { useEffect, useRef, useState } from 'react';
import { useEasterEgg } from '@/hooks';
// Import logos
import Logo from '@/assets/logo.webp';
import OldLogo from '@/assets/legacy_logo.webp';
// Import icons
import AddonIcon from '@/assets/sprite-icons/minecart_coupling.webp';
import SchematicIcon from '@/assets/sprite-icons/schematic.webp';
import { Card } from '@/components/ui/card';

const WhatIsBlueprint = () => {
  const { t } = useTranslation();
  const { isEggEnabled, incrementLogoClickCount } = useEasterEgg();

  // Use the legacy logo if the easter egg is enabled
  const logoSrc = isEggEnabled('legacyLogo') ? OldLogo : Logo;

  // Animation reference and state
  const logoRef = useRef<HTMLImageElement>(null);
  const isAnimatingRef = useRef(false);

  const [rotationDegrees, setRotationDegrees] = useState(0);

  const handleLogoClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    incrementLogoClickCount();

    if (!logoRef.current || isAnimatingRef.current) return;

    isAnimatingRef.current = true;

    const newRotation = rotationDegrees + 360;
    setRotationDegrees(newRotation);

    const element = logoRef.current;
    element.style.transition = 'transform 0.4s ease';
    element.style.transform = `rotate(${newRotation}deg)`;

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

  return (
    <Card className='font-minecraft bg-blueprint container rounded-none py-6 md:rounded-xl md:py-12'>
      <div className='text-blueprint-foreground flex flex-col items-center space-y-5 text-center'>
        <div className='text-3xl font-bold tracking-tighter sm:text-4xl md:py-4 md:text-5xl'>
          {t('home.info.about.title')}
        </div>

        <p className='font-italic text-xl'>{t('home.info.about.description')}</p>

        <div className='flex items-center justify-center gap-4 px-2'>
          {/* Addons Icon */}
          <a
            href='/addons'
            className='text-blueprint-foreground-muted mt-4 flex flex-col items-center transition-transform duration-200 hover:scale-110'
            target='_blank'
            rel='noopener noreferrer'
          >
            <img
              loading='lazy'
              src={AddonIcon}
              alt='Addon Icon'
              className='w-8 cursor-pointer object-contain sm:w-10 md:w-14 lg:w-20'
            />
            <div className='text-md mt-2 md:text-lg'>Addons</div>
          </a>

          <span className='flex items-center justify-center px-2 text-3xl select-none md:text-5xl'>
            +
          </span>

          {/* Schematics Icon */}
          <a
            href='/schematics'
            className='text-blueprint-foreground-muted mt-4 flex flex-col items-center transition-transform duration-200 hover:scale-110'
            target='_blank'
            rel='noopener noreferrer'
          >
            <img
              loading='lazy'
              src={SchematicIcon}
              alt='Schematic Icon'
              className='w-8 cursor-pointer object-contain sm:w-10 md:w-14 lg:w-20'
            />
            <div className='text-md mt-2 md:text-lg'>Schematics</div>
          </a>

          <span className='flex items-center justify-center px-2 text-3xl font-extrabold select-none md:text-5xl'>
            =
          </span>

          {/* Blueprint Logo */}
          <button
            onClick={handleLogoClick}
            className='mt-4 flex flex-col items-center border-0 bg-transparent p-0 transition-transform duration-200 hover:scale-110 focus:outline-none'
            type='button'
            aria-label='Blueprint Logo'
          >
            <span className='flex flex-col items-center'>
              <img
                ref={logoRef}
                loading='lazy'
                src={logoSrc}
                alt='Blueprint Logo'
                className='w-8 cursor-pointer object-contain sm:w-10 md:w-14 lg:w-20'
              />
              <div className='text-md mt-2 md:text-lg'>Blueprint</div>
            </span>
          </button>
        </div>
      </div>
    </Card>
  );
};

export default WhatIsBlueprint;
