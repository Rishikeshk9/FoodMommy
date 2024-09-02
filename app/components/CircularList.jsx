import React, { useState, useEffect } from 'react';

const CircularList = () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % alphabet.length);
    }, 1000); // Change letter every second

    return () => clearInterval(interval);
  }, []);

  const getVisibleLetters = () => {
    const visibleCount = 5; // Number of visible letters
    let letters = [];
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % alphabet.length;
      letters.push(alphabet[index]);
    }
    return letters;
  };

  return (
    <div className='relative flex items-center justify-center w-40 h-40'>
      {getVisibleLetters().map((letter, index) => {
        const angle = 180 - index * 45; // Spread letters over 180 degrees in the top half
        const radius = 60; // Adjust this value to change the size of the semi-circle
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = -Math.sin((angle * Math.PI) / 180) * radius; // Negative to flip the semicircle to the top half

        return (
          <div
            key={index}
            className={`absolute text-2xl font-bold transition-all duration-300 ${
              index === 2 ? 'text-4xl text-blue-500' : 'text-gray-400'
            }`}
            style={{
              transform: `translate(${x}px, ${y}px)`,
              opacity: index === 2 ? 1 : 0.5 - Math.abs(index - 2) * 0.2,
              filter: index !== 2 ? 'blur(1px)' : 'none',
            }}
          >
            {letter}
          </div>
        );
      })}
    </div>
  );
};

export default CircularList;
