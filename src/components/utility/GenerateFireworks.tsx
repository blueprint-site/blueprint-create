export const generateFireworks = (fireworksCount = 10) => {
  const fireworks = [];
  const numFireworks = fireworksCount;

  const keyframesStyle = `
    @keyframes particleBurst {
      0% {
        transform: scale(0.2);
        opacity: 0;
        filter: brightness(1.5); /* Start bright */
      }
      30% { /* Quickly expand and become visible */
        transform: scale(1);
        opacity: 1;
        filter: brightness(2);
      }
      80% { /* Hold and start to fade while expanding more slowly */
        transform: scale(1.6);
        opacity: 0.5;
        filter: brightness(1);
      }
      100% { /* Fade out completely */
        transform: scale(1.8);
        opacity: 0;
        filter: brightness(0.5);
      }
    }
  `;

  for (let i = 0; i < numFireworks; i++) {
    const size = Math.floor(Math.random() * 15) + 8;
    const left = Math.floor(Math.random() * 100);
    const top = Math.floor(Math.random() * 100);
    const baseDelay = Math.random() * 2; // Initial delay before it appears
    const animationDuration = Math.random() * 0.5 + 0.7; // Duration from 0.7s to 1.2s
    const color = `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`; // Brighter, more saturated

    fireworks.push(
      <div
        key={`firework-${i}`}
        className='absolute rounded-full'
        style={{
          width: `${size}px`,
          height: `${size}px`,
          left: `${left}%`,
          top: `${top}%`,
          backgroundColor: color,
          animation: `particleBurst ${animationDuration}s ease-out ${baseDelay}s forwards`,
          boxShadow: `0 0 ${size / 1.5}px ${size / 3}px ${color}66`,
          willChange: 'transform, opacity, filter',
        }}
      />
    );
  }

  return (
    <>
      <style>{keyframesStyle}</style>
      {fireworks}
    </>
  );
};
