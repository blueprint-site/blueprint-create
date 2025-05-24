import { Button } from '@/components/ui/button';
import { generateFireworks } from '@/components/utility/GenerateFireworks';
import { useEffect, useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
} from '@/components/ui/dialog';

export const ConamiCodeEasterEgg = () => {
  const [displayPopup, setDisplayPopup] = useState(false);
  const [sequence, setSequence] = useState<string[]>([]);

  const konamiIndexRef = useRef(0);

  const handleDialogClose = () => {
    setDisplayPopup(false);
  };

  useEffect(() => {
    const konamiCode = [
      'ArrowUp',
      'ArrowUp',
      'ArrowDown',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowLeft',
      'ArrowRight',
      'b',
      'a',
    ];
    const keyMap: { [key: string]: string } = {
      ArrowUp: '↑',
      ArrowDown: '↓',
      ArrowLeft: '←',
      ArrowRight: '→',
      b: 'B',
      a: 'A',
      B: 'B',
      A: 'A',
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      const keyName = keyMap[key];

      if (keyName) {
        setSequence((prev) => [...prev, keyName].slice(-konamiCode.length)); // Show last N keys
      }

      // Core Konami logic using konamiIndexRef
      if (key === konamiCode[konamiIndexRef.current]) {
        konamiIndexRef.current++;

        if (konamiIndexRef.current === konamiCode.length) {
          konamiIndexRef.current = 0;
          setSequence([]);

          setTimeout(() => {
            setDisplayPopup(true);
          }, 600);
        }
      } else {
        // If a key is pressed that's not the *next* key in the Konami sequence,
        // or if it's an irrelevant key and they were partway through, reset.
        if (konamiIndexRef.current > 0) {
          setSequence([]);
        }
        konamiIndexRef.current = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const [fireworksKey, setFireworksKey] = useState(0);

  function fireworksAgain(): void {
    // Change the key to force re-mount the fireworks div
    setFireworksKey((k) => k + 1);
  }
  return (
    <>
      <Dialog open={displayPopup} onOpenChange={handleDialogClose}>
        <DialogOverlay className='animate-rainbow bg-primary/40 z-30'>
          <div key={fireworksKey} className='pointer-events-none fixed inset-0 z-50'>
            {generateFireworks(80)}
          </div>
        </DialogOverlay>

        <DialogContent className='bg-blueprint z-50 flex flex-col items-center'>
          <DialogHeader className='w-full'>
            <DialogTitle className='animate-pulseScale text-center text-2xl font-bold sm:text-3xl'>
              🏆 <span className='animate-rainbow text-primary'>Konami Code Found!</span> 🏆
            </DialogTitle>
            <DialogDescription className='text-blueprint-foreground font-minecraft mb-2 text-center font-semibold'>
              The ancient code has been entered.
            </DialogDescription>
          </DialogHeader>

          <iframe
            src='https://www.youtube.com/embed/SoI_ETK30OU?si=fevfOnoovPqMZt5K&amp;controls=0&autoplay=1'
            title='Blueprint Konami Code Easter Egg Video!'
            allow='autoplay; encrypted-media; gyroscope;'
            allowFullScreen
            className='aspect-video h-full w-full'
          />
          <Button size='sm' variant='ghost' className='font-bold' onClick={() => fireworksAgain()}>
            🎆 Fireworks Again!
          </Button>
          <Button
            variant='secondary'
            className='w-full font-bold sm:w-auto sm:min-w-48'
            onClick={() => handleDialogClose()}
          >
            Back to Reality...
          </Button>
        </DialogContent>
      </Dialog>

      {sequence.length > 0 && !displayPopup && (
        <div className='pointer-events-none fixed right-4 bottom-4 z-[70] rounded-lg bg-gray-900/75 p-3 text-2xl tracking-wider text-white shadow-xl'>
          {sequence.map((key, index) => (
            <span key={index} className='mx-0.5 inline-block p-1'>
              {key}
            </span>
          ))}
        </div>
      )}
    </>
  );
};
