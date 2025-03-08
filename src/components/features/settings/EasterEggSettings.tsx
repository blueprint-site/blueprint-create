// src/components/features/settings/EasterEggsSettings.tsx
import { useState } from 'react';
import { useEasterEgg } from '@/hooks/useEasterEgg';
import { EASTER_EGGS } from '@/config/easterEggs';
import { EasterEggDefinition } from '@/schemas/user.schema';

import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LockIcon, UnlockIcon } from 'lucide-react';

/**
 * Component for managing easter egg settings
 */
const EasterEggsSettings = () => {
  const { isEggDiscovered, isEggEnabled, toggleEasterEgg } = useEasterEgg();
  const [isUpdating, setIsUpdating] = useState(false);
  const handleToggle = async (eggId: string, enabled: boolean) => {
    setIsUpdating(true);
    await toggleEasterEgg(eggId, enabled);
    setIsUpdating(false);
  };

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold tracking-tight'>Easter Eggs</h2>
        <p className='text-muted-foreground'>
          Discover and toggle special features hidden throughout the application.
        </p>
      </div>

      <div className='space-y-4'>
        {EASTER_EGGS.map((egg: EasterEggDefinition) => {
          const discovered = isEggDiscovered(egg.id);
          const enabled = isEggEnabled(egg.id);

          return (
            <Card key={egg.id} className={`${discovered} ? "" : "opacity-70" border`}>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <CardTitle>{discovered ? egg.name : '???'}</CardTitle>
                    {discovered ? (
                      <Badge
                        variant='outline'
                        className='bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300'
                      >
                        <UnlockIcon className='mr-1 h-3 w-3' /> Discovered
                      </Badge>
                    ) : (
                      <Badge
                        variant='outline'
                        className='bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                      >
                        <LockIcon className='mr-1 h-3 w-3' /> Locked
                      </Badge>
                    )}
                  </div>

                  {discovered && (
                    <Switch
                      checked={enabled}
                      onCheckedChange={(checked) => handleToggle(egg.id, checked)}
                      disabled={isUpdating}
                      aria-label={`Toggle ${egg.name}`}
                    />
                  )}
                </div>
                <CardDescription>
                  {discovered ? egg.description : egg.discoveryHint}
                </CardDescription>
              </CardHeader>

              {discovered && enabled && egg.component && (
                <CardContent>
                  <div className='rounded-md border p-4'>
                    <egg.component enabled={enabled} />
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {EASTER_EGGS.some((egg) => !isEggDiscovered(egg.id)) && (
        <div className='text-muted-foreground mt-6 text-center text-sm'>
          Keep exploring to discover more easter eggs!
        </div>
      )}
    </div>
  );
};

export default EasterEggsSettings;
