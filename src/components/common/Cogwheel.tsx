import CogwheelImage from '@/assets/cogwheel.png';
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    const main = document.getElementById('main');
    if (!main) return;

    let lastScrollTop = main.scrollTop;

    const handleScroll = () => {
      const scrollTop = main.scrollTop;
      const delta = scrollTop - lastScrollTop;
      lastScrollTop = scrollTop;
      setRotation((prev) => prev + delta / 10); // Change this value to adjust scroll rotation sensitivity
    };

    main.addEventListener('scroll', handleScroll);
    return () => main.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.1) % 360);
    }, 50);
    return () => clearInterval(interval);
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
        left: -offset,
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
