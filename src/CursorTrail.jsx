import React, { useEffect, useState } from 'react';

const CursorTrail = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Only run on desktop devices
    if (window.innerWidth < 768) return;

    let particleId = 0;
    
    const handleMouseMove = (e) => {
      // Throttle spawn rate for elegance
      if (Math.random() > 0.4) return; 
      
      const newParticle = {
        id: particleId++,
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 1.5 + 0.5,
        xOffset: (Math.random() - 0.5) * 30, // Random horizontal drift
        yOffset: Math.random() * 30 + 10,    // Drift downwards like falling dust
      };

      setParticles((prev) => [...prev.slice(-20), newParticle]);
      
      setTimeout(() => {
        setParticles((prev) => prev.filter(p => p.id !== newParticle.id));
      }, newParticle.duration * 1000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 9999 }}>
      <style>
        {`
          @keyframes gold-dust-anim {
            0% { opacity: 0.8; transform: translate(0, 0) scale(1); }
            100% { opacity: 0; transform: translate(var(--x-drift), var(--y-drift)) scale(0); }
          }
        `}
      </style>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            backgroundColor: '#D4AF37',
            borderRadius: '50%',
            animation: `gold-dust-anim ${p.duration}s ease-out forwards`,
            boxShadow: '0 0 8px rgba(212, 175, 55, 0.8)',
            '--x-drift': `${p.xOffset}px`,
            '--y-drift': `${p.yOffset}px`
          }}
        />
      ))}
    </div>
  );
};

export default CursorTrail;
