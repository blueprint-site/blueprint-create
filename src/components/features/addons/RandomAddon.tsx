import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import DevinsBadges from '@/components/utility/DevinsBadges';
import { Addon } from '@/types';

const RandomAddon = () => {
  const [addon, setAddon] = useState<Addon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addonsList] = useState<Addon[] | null>(null);

  const getRandomAddon = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!addonsList) {
        console.error('No addons found');
        return; // Exit function instead of throwing
      }
      if (!addonsList?.length) {
        console.error('Addon list is empty');
        return; // Exit function instead of throwing
      }

      const randomIndex = Math.floor(Math.random() * addonsList.length);
      setAddon(addonsList[randomIndex]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load addon');
      console.error(err);
    } finally {
      // Artificial delay for UX
      setTimeout(() => setIsLoading(false), 800);
    }
  }, []);

  useEffect(() => {
    getRandomAddon().then();
  }, [getRandomAddon]);

  if (error) {
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        <p className='text-destructive'>{error}</p>
        <Button onClick={getRandomAddon} className='mt-4'>
          Try Again
        </Button>
      </div>
    );
  }

  if (isLoading || !addon) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <Card className='mx-auto max-w-2xl'>
          <CardContent className='space-y-4 p-6'>
            <Skeleton className='mx-auto h-32 w-32 rounded-lg' />
            <Skeleton className='mx-auto h-8 w-3/4' />
            <Skeleton className='h-24 w-full' />
            <Skeleton className='mx-auto h-12 w-48' />
          </CardContent>
        </Card>
      </div>
    );
  }

  const colorHex = addon.modrinth_raw?.color?.toString(16).padStart(6, '0');

  const backgroundColor = colorHex
    ? `rgba(${parseInt(colorHex.slice(0, 2), 16)}, 
          ${parseInt(colorHex.slice(2, 4), 16)}, 
          ${parseInt(colorHex.slice(4, 6), 16)}, 0.7)`
    : 'transparent';

  return (
    <div className='container mx-auto space-y-8 px-4 py-8 text-center'>
      <Link to={`/addons/${addon.slug}`} className='block'>
        <Card
          className='mx-auto max-w-2xl transition-shadow hover:shadow-lg'
          style={{ backgroundColor }}
        >
          <CardContent className='space-y-4 p-6'>
            <img
              src={addon.icon}
              alt={addon.name}
              loading='lazy'
              className='mx-auto h-32 w-32 rounded-lg'
            />

            <div className='space-y-2'>
              <h2 className='text-2xl font-bold'>{addon.name}</h2>
              <p className='text-foreground-muted'>{addon.description}</p>
              <p className='text-sm'>Author: {addon.author}</p>
              <p className='text-sm'>Versions: {addon.versions.join(', ')}</p>
            </div>

            <a
              href={`https://modrinth.com/mod/${addon.slug}`}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-block'
              onClick={(e) => e.stopPropagation()}
            >
              <DevinsBadges
                type='compact'
                category='available'
                name='modrinth'
                format='png'
                height={46}
              />
            </a>
          </CardContent>
        </Card>
      </Link>

      <Button size='lg' onClick={getRandomAddon} className='font-minecraft'>
        Get Another Random Addon
      </Button>
    </div>
  );
};

export default RandomAddon;
