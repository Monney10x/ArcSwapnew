'use client';

import React from 'react';

export const ThreeDBackground: React.FC = () => {
  return (
    <div 
      className="fixed inset-0 w-full h-full overflow-hidden -z-50"
      style={{ 
        background: 'radial-gradient(circle at 50% 35%, #FFE699 0%, #FFD966 5%, #FFC966 10%, #FF8800 20%, #CC5500 35%, #663300 55%, #221100 80%, #000000 100%)',
        pointerEvents: 'none'
      }}
    >
      {/* Particle stars */}
      {[...Array(100)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${1 + Math.random() * 4}px`,
            height: `${1 + Math.random() * 4}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `rgba(255, ${200 + Math.random() * 55}, ${100 + Math.random() * 100}, ${0.5 + Math.random() * 0.3})`,
            boxShadow: `0 0 ${4 + Math.random() * 10}px rgba(255, 180, 100, 0.6)`,
            animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};
