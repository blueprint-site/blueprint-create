import { Button } from '@/components/ui/button';
import { generateFireworks } from '@/components/utility/GenerateFireworks';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks';

export const ConamiCodeEasterEgg = () => {
  const [popupAnimation, setPopupAnimation] = useState('');
  const [displayPopup, setDisplayPopup] = useState(false);
  const [sequence, setSequence] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up, Up, Down, Down, Left, Right, Left, Right, B, A
    let konamiIndex = 0;

    const keyMap: { [key: number]: string } = {
      38: '↑',
      40: '↓',
      37: '←',
      39: '→',
      66: 'B',
      65: 'A',
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = keyMap[event.keyCode];
      if (key) {
        setSequence((prev) => [...prev, key]);
      }

      if (event.keyCode === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          konamiIndex = 0;
          setSequence([]); // Clear sequence on success
          console.log('Konami Code activated!');
          toast({
            title: 'Easter egg activated!',
            description: 'Let the dance begin!',
          });

          // Animate the background before showing popup
          setPopupAnimation('popup-active');

          // Show popup with a slight delay for the animation to be visible
          setTimeout(() => {
            setDisplayPopup(true);
          }, 600);
        }
      } else {
        konamiIndex = 0;
        setSequence([]); // Reset sequence on failure
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Define keyframes for row scrolling animation and popup effects
  const keyframesStyle = `
        @keyframes particleBurst {
          0% {
            transform: scale(0.1);
            opacity: 0;
          }
          40% {
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        
        @keyframes popupEntrance {
          0% {
            transform: scale(0.6);
            opacity: 0;
          }
          60% {
            transform: scale(1.1);
          }
          80% {
            transform: scale(0.95);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes colorShift {
          0% {
            filter: hue-rotate(0deg);
          }
          50% {
            filter: hue-rotate(180deg);
          }
          100% {
            filter: hue-rotate(360deg);
          }
        }
        
        @keyframes flashBackground {
          0%, 100% {
            background-color: rgba(0, 0, 0, 0.3);
          }
          20%, 80% {
            background-color: rgba(25, 70, 189, 0.4);
          }
          40%, 60% {
            background-color: rgba(140, 20, 252, 0.4);
          }
        }
        
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-5px) rotate(-1deg);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(5px) rotate(1deg);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `;

  return (
    <div className={`${popupAnimation}`}>
      <style>{keyframesStyle}</style>
      <style>{`
                .popup-active .absolute.inset-0 {
                  animation: flashBackground 1.2s ease-out;
                }
                
                .firework-container {
                  position: fixed;
                  inset: 0;
                  z-index: 60;
                  pointer-events: none;
                }
                
                .popup-modal {
                  animation: popupEntrance 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                  box-shadow: 0 0 30px rgba(79, 70, 229, 0.4);
                }
                
                .popup-title {
                  animation: colorShift 4s infinite linear, pulse 1s infinite ease-in-out;
                }
                
                .popup-btn {
                  transition: all 0.3s ease;
                }
                
                .popup-btn:hover {
                  transform: scale(1.05);
                  box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
                }
              `}</style>

      {displayPopup && (
        <>
          <div className='firework-container'>{generateFireworks(40)}</div>

          <div className='bg-blueprint/30 fixed inset-0 z-50 flex items-center justify-center'>
            <div className='popup-modal max-w-md rounded-lg border border-gray-800 bg-blue-600/95 p-6 shadow-lg'>
              <center>
                <h1 className='popup-title text-2xl font-bold text-white'>🎉 Party time! 🎉</h1>
              </center>
              <span className='text-lg text-gray-300'>You entered the Konami code, congrats!</span>
              <div className='mt-2 aspect-video overflow-hidden rounded'>
                <iframe
                  src='https://www.youtube.com/embed/SoI_ETK30OU?si=fevfOnoovPqMZt5K&amp;controls=0&autoplay=1'
                  title='YouTube video player'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                  className='h-full w-full'
                />
              </div>
              <br />
              <center>
                <Button
                  variant='outline'
                  className='popup-btn w-full bg-blue-500 text-white hover:bg-blue-600 md:w-60'
                  onClick={() => {
                    setDisplayPopup(false);
                    setPopupAnimation('');
                  }}
                >
                  Close embed
                </Button>
              </center>
            </div>
          </div>
        </>
      )}
      {/* Konami Code overlay */}
      <div className='konami-overlay'>
        {sequence.map((key, index) => (
          <span key={index} className='konami-key'>
            {key}
          </span>
        ))}
      </div>
    </div>
  );
};
