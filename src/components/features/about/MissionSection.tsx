import { useState } from 'react';
import { ContactLink } from './ContactLink';
import { motion } from 'framer-motion';
import {
  Compass,
  Share2,
  Code,
  Cog,
  ArrowUp,
  ArrowLeft,
  ArrowDown,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

export function MissionSection() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const { t } = useTranslation();
  const cards = [
    {
      id: 'addons',
      title: t('about.cards.card1.title'),
      description: t('about.cards.card1.description'),
      icon: <Compass className='h-8 w-8 text-amber-500' />,
      link: '/addons',
      linkText: t('about.cards.card1.link'),
    },
    {
      id: 'schematics',
      title: t('about.cards.card2.title'),
      description: t('about.cards.card2.description'),
      icon: <Share2 className='h-8 w-8 text-emerald-500' />,
      link: '/schematics',
      linkText: t('about.cards.card2.link'),
    },
    {
      id: 'community',
      title: t('about.cards.card3.title'),
      description: t('about.cards.card2.description'),
      icon: <Code className='h-8 w-8 text-blue-500' />,
      link: '/about',
      linkText: t('about.cards.card3.link'),
    },
  ];

  return (
    <Card className='relative mb-8 overflow-hidden px-4' aria-labelledby='mission'>
      <div className='absolute -top-12 -right-12 hidden opacity-5 md:block'>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}
        >
          <Cog className='h-48 w-48' />
        </motion.div>
      </div>
      <CardHeader>
        <h2
          id='mission'
          className='font-minecraft mb-6 text-center text-3xl font-semibold sm:text-left'
        >
          {t('about.subTitle')}
        </h2>
      </CardHeader>

      <CardContent>
        <div className='text-foreground-muted font-minecraft relative z-10 mb-8 space-y-4'>
          <p className='max-w-3xl text-lg leading-relaxed'>{t('about.content1')}</p>
          <p className='max-w-3xl text-lg leading-relaxed'>{t('about.content2')}</p>
        </div>

        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3'>
          {cards.map((card) => (
            <motion.div
              key={card.id}
              className='border-border hover:border-primary hover:bg-foreground/5 flex flex-col rounded-lg border p-6 transition-colors'
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className='mb-4 flex items-center gap-3'>
                {card.icon}
                <div className='font-minecraft text-xl font-medium'>{card.title}</div>
              </div>

              <p className='mb-4 flex-grow'>{card.description}</p>

              <ContactLink
                href={card.link}
                className='font-minecraft text-primary hover:text-primary/80 inline-flex items-center gap-2 self-start'
              >
                <span>{card.linkText}</span>
                <motion.span
                  animate={{ x: hoveredCard === card.id ? 5 : 0 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  →
                </motion.span>
              </ContactLink>
            </motion.div>
          ))}
          <div className='inline-flex w-full items-center gap-2 self-start opacity-30'>
            <ArrowUp />
            <ArrowUp />
            <ArrowDown />
            <ArrowDown />
            <ArrowLeft />
            <ArrowRight />
            <ArrowLeft />
            <ArrowRight />
            <span>B</span>
            <span>A</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
