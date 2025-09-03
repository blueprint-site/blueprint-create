import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import confetti from 'canvas-confetti';

interface AchievementNotificationProps {
  badge: {
    name: string;
    description: string;
    iconUrl?: string;
    tier?: string;
  };
  onClose: () => void;
}

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  badge,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  useEffect(() => {
    // Trigger confetti animation
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: Record<string, unknown>) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });

    // Auto-close after 10 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 10000);

    return () => clearTimeout(timer);
  }, [handleClose]);

  const getTierColor = (tier?: string) => {
    switch (tier) {
      case 'legendary':
        return 'from-yellow-400 to-orange-500';
      case 'epic':
        return 'from-purple-400 to-pink-500';
      case 'rare':
        return 'from-blue-400 to-cyan-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className='pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4'
        >
          <motion.div
            className='bg-background border-primary/20 pointer-events-auto relative w-full max-w-md rounded-lg border-2 p-6 shadow-2xl'
            initial={{ rotate: -2 }}
            animate={{ rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          >
            {/* Close button */}
            <Button
              variant='ghost'
              size='icon'
              className='absolute top-2 right-2'
              onClick={handleClose}
            >
              <X className='h-4 w-4' />
            </Button>

            {/* Sparkles decoration */}
            <div className='absolute -top-6 -left-6'>
              <Sparkles className='h-12 w-12 animate-pulse text-yellow-400' />
            </div>
            <div className='absolute -right-6 -bottom-6'>
              <Sparkles className='h-12 w-12 animate-pulse text-yellow-400' />
            </div>

            {/* Content */}
            <div className='text-center'>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className='mb-4'
              >
                <div className='from-primary/20 to-primary/10 inline-block rounded-full bg-gradient-to-br p-4'>
                  {badge.iconUrl ? (
                    <img
                      src={badge.iconUrl}
                      alt={badge.name}
                      className='h-20 w-20 rounded-full object-cover'
                    />
                  ) : (
                    <div
                      className={`rounded-full bg-gradient-to-br p-4 ${getTierColor(badge.tier)}`}
                    >
                      <Trophy className='h-12 w-12 text-white' />
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className='from-primary to-primary/60 mb-2 bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent'>
                  Achievement Unlocked!
                </h2>
                <h3 className='mb-2 text-xl font-semibold'>{badge.name}</h3>
                <p className='text-muted-foreground mb-4'>{badge.description}</p>

                {badge.tier && (
                  <Badge
                    variant='outline'
                    className={`inline-flex items-center gap-1 ${
                      badge.tier === 'legendary'
                        ? 'border-yellow-500 text-yellow-600'
                        : badge.tier === 'epic'
                          ? 'border-purple-500 text-purple-600'
                          : badge.tier === 'rare'
                            ? 'border-blue-500 text-blue-600'
                            : ''
                    }`}
                  >
                    {badge.tier.toUpperCase()}
                  </Badge>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className='mt-6'
              >
                <Button onClick={handleClose} className='w-full'>
                  Awesome!
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
