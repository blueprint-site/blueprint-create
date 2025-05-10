export const generateFireworks = (fireworksCount = 10) => {
  const fireworks = [];
  const numFireworks = fireworksCount;

  for (let i = 0; i < numFireworks; i++) {
    const size = Math.floor(Math.random() * 20) + 10;
    const left = Math.floor(Math.random() * 80) + 10;
    const top = Math.floor(Math.random() * 80) + 10;
    const delay = Math.random() * 0.6;
    const color = `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`;

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
          animation: `particleBurst 0.8s ease-out ${delay}s forwards`,
          boxShadow: `0 0 ${size / 2}px ${color}`,
        }}
      />
    );
  }

  return (
    <>
      <style>{`
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
        `}</style>
      {fireworks}
    </>
  );
};
