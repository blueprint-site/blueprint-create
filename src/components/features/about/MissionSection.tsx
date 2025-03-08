import { useState } from 'react';
import { ContactLink } from './ContactLink';
import { motion } from 'framer-motion';
import { Compass, Share2, Code, Cog } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function MissionSection() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const cards = [
    {
      id: 'addons',
      title: 'Discover Addons',
      description: 'Browse and manage the growing ecosystem of Create Mod extensions.',
      icon: <Compass className='h-8 w-8 text-amber-500' />,
      link: '/addons',
      linkText: 'Explore Addons',
    },
    {
      id: 'schematics',
      title: 'Share Creations',
      description: 'Upload and showcase your automated contraptions and engineering designs.',
      icon: <Share2 className='h-8 w-8 text-emerald-500' />,
      link: '/schematics',
      linkText: 'Visit Schematics',
    },
    {
      id: 'community',
      title: 'Join Our Community',
      description: 'Connect with fellow Create enthusiasts and contribute to the ecosystem.',
      icon: <Code className='h-8 w-8 text-blue-500' />,
      link: '/about',
      linkText: 'Learn More',
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
          Our Mission
        </h2>
      </CardHeader>

      <CardContent>
        <div className='text-foreground-muted font-minecraft relative z-10 mb-8 space-y-4'>
          <p className='max-w-3xl text-lg leading-relaxed'>
            Blueprint emerged from recognizing the need for a centralized platform that serves the
            Create Mod community effectively. We built this site using modern web technologies to
            provide a robust solution for discovering and sharing content.
          </p>
          <p className='max-w-3xl text-lg leading-relaxed'>
            Our goal is to consolidate Create Mod resources in one accessible location - connecting
            addon developers with users and enabling easy sharing of contraption designs. We aim to
            enhance discoverability and foster collaboration within the community.
          </p>
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
        </div>
      </CardContent>
    </Card>
  );
}
