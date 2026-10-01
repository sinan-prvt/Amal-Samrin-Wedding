import React, { useEffect, useState } from 'react';

const CursorTrail = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Only run on desktop devices
    if (window.innerWidth < 768) return;

    let particleId = 0;
    let last = 0;

    const handleMouseMove = (e) => {
      // Throttle by time so fast mouse moves don't flood React with updates
      const now = performance.now();
      if (now - last < 70) return;
      last = now;
      
      const newParticle = {
        id: particleId++,
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 1.5 + 0.5,
        xOffset: (Math.random() - 0.5) * 30, // Random horizontal drift
        yOffset: Math.random() * 30 + 10,    // Drift downwards like falling dust
      };

      setParticles((prev) => [...prev.slice(-10), newParticle]);
      
      setTimeout(() => {
        setParticles((prev) => prev.filter(p => p.id !== newParticle.id));
      }, newParticle.duration * 1000);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
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
            backgroundColor: '#b7895f',
            borderRadius: '50%',
            animation: `gold-dust-anim ${p.duration}s ease-out forwards`,
            boxShadow: '0 0 8px rgba(122, 31, 43, 0.35)',
            '--x-drift': `${p.xOffset}px`,
            '--y-drift': `${p.yOffset}px`
          }}
        />
      ))}
    </div>
  );
};

export default CursorTrail;
