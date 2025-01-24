import CogwheelImage from '@/assets/cogwheel.png';
import { useEffect, useState } from 'react';

const RotatingCogwheel = () => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.1) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed -bottom-[175px] -right-[175px] w-[400px] h-[400px]">
      <img
        src={CogwheelImage}
        alt="Rotating cogwheel"
        className="w-[400px] h-[400px]"
        style={{
          transform: `rotate(${rotation}deg)`,
          transformOrigin: 'center',
        }}
      />
    </div>
  );
};

export default RotatingCogwheel;