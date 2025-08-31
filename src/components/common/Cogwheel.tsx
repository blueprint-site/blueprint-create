import CogwheelImage from '@/assets/cogwheel.png';
import { useEffect, useState, useRef } from 'react';
import logMessage from '@/components/utility/logs/sendLogs.tsx';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { ToolsBox } from '@/components/layout/ToolsBox.tsx';
import { useThemeStore } from '@/api/stores/themeStore.ts';

const useWindowSize = () => {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
};

const RotatingCogwheel = () => {
  const [rotation, setRotation] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const { width } = useWindowSize();
  const { isDarkMode } = useThemeStore();
  const size = Math.min(width * 0.28, 350);
  const offset = size / 2.35;
  const rotationRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  // Combined rotation effect with both scroll and animation
  useEffect(() => {
    const main = document.getElementById('main');
    let lastScrollTop = main?.scrollTop || 0;
    let lastTime = Date.now();
    let updateTimer: ReturnType<typeof setInterval> | null = null;

    // Update the actual state periodically
    const updateRotationState = () => {
      setRotation(rotationRef.current % 360);
    };

    // Animation frame for continuous rotation
    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime;

      // Update rotation ref continuously
      if (deltaTime >= 50) {
        lastTime = currentTime;
        rotationRef.current += 0.5;

        // Add scroll-based rotation if main exists
        if (main) {
          const scrollTop = main.scrollTop;
          const scrollDelta = scrollTop - lastScrollTop;
          if (Math.abs(scrollDelta) > 0.5) {
            rotationRef.current += scrollDelta / 10;
            lastScrollTop = scrollTop;
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);

    // Update state periodically (every 100ms) instead of on every frame
    updateTimer = setInterval(updateRotationState, 100);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (updateTimer) {
        clearInterval(updateTimer);
      }
    };
  }, []);

  const handleClick = () => {
    setClickCount((prev) => {
      const newCount = prev + 1;
      if (newCount >= 100) {
        logMessage(`You have clicked ${clickCount} `, 0, 'default');
        window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      }
      return newCount;
    });
  };

  return (
    <div
      className='fixed'
      style={{
        width: size,
        height: size,
        bottom: -offset,
        right: -offset,
      }}
      onClick={handleClick}
    >
      <Drawer>
        <DrawerTrigger>
          {' '}
          <img
            src={CogwheelImage}
            alt='Rotating cogwheel'
            className='h-full w-full cursor-pointer'
            style={{
              transform: `rotate(${rotation}deg)`,
              transformOrigin: 'center',
            }}
          />
        </DrawerTrigger>
        <DrawerContent className={isDarkMode ? 'bg-brass_casing' : 'bg-refined_radiance_casing'}>
          <DrawerHeader>
            <DrawerTitle className={'text-center'}>
              {' '}
              <div className={'text-foreground'}>Blueprint ToolBox</div>{' '}
            </DrawerTitle>
            <ToolsBox></ToolsBox>
          </DrawerHeader>
          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default RotatingCogwheel;
