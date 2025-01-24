import CogwheelImage from '@/assets/cogwheel.png';
import { useEffect, useState } from 'react';

const useWindowSize = () => {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
};

const RotatingCogwheel = () => {
  const [rotation, setRotation] = useState(0);
  const { width } = useWindowSize();

  const size = Math.min(width * 0.28, 400);
  const offset = size / 2.35;

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.1) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="fixed"
      style={{
        width: size,
        height: size,
        bottom: -offset,
        right: -offset,
      }}
    >
      <img
        src={CogwheelImage}
        alt="Rotating cogwheel"
        className="w-full h-full"
        style={{
          transform: `rotate(${rotation}deg)`,
          transformOrigin: 'center',
        }}
      />
    </div>
  );
};

export default RotatingCogwheel;