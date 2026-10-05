import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Envelope.css';

/* Irregular wax edge: a circle whose radius ripples a little */
const waxEdge = (() => {
  const pts = [];
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    const r = 56 + 2.2 * Math.sin(a * 6) + 1.4 * Math.sin(a * 11 + 1.3);
    pts.push(`${(60 + r * Math.cos(a)).toFixed(2)},${(60 + r * Math.sin(a)).toFixed(2)}`);
  }
  return `M${pts.join(' L')} Z`;
})();

/* Gold laurel leaves along an arc (angles in degrees, 0 = right, clockwise) */
const laurel = (from, to, flip) => {
  const leaves = [];
  const steps = 11;
  for (let i = 0; i <= steps; i++) {
    const deg = from + ((to - from) * i) / steps;
    const a = (deg * Math.PI) / 180;
    const x = 60 + 41 * Math.cos(a);
    const y = 60 + 41 * Math.sin(a);
    const tilt = deg + (flip ? -35 : 35);
    const off = i % 2 ? 2.4 : -2.4;
    const ox = x + off * Math.cos(a);
    const oy = y + off * Math.sin(a);
    leaves.push(<ellipse key={i} cx={ox} cy={oy} rx="1.4" ry="3.6" transform={`rotate(${tilt} ${ox} ${oy})`} />);
  }
  return leaves;
};

const WaxSeal = () => (
  <svg className="wax-seal" viewBox="0 0 120 120" aria-label="Amal and Samrin">
    <defs>
      <radialGradient id="wax" cx="0.38" cy="0.32" r="0.75">
        <stop offset="0%" stopColor="#b8434f" />
        <stop offset="45%" stopColor="#8a2431" />
        <stop offset="100%" stopColor="#4b1219" />
      </radialGradient>
      <radialGradient id="waxPress" cx="0.5" cy="0.6" r="0.6">
        <stop offset="0%" stopColor="#7a1f2b" />
        <stop offset="100%" stopColor="#5a1520" />
      </radialGradient>
      <linearGradient id="seal-gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#f6e2b3" />
        <stop offset="50%" stopColor="#d4ac6e" />
        <stop offset="100%" stopColor="#a87b3e" />
      </linearGradient>
    </defs>

    {/* Wax body */}
    <path d={waxEdge} fill="url(#wax)" />
    <path d={waxEdge} fill="none" stroke="#3a0d14" strokeOpacity="0.35" strokeWidth="1" />

    {/* Pressed centre with a raised rim */}
    <circle cx="60" cy="60" r="46" fill="url(#waxPress)" />
    <circle cx="60" cy="60" r="46" fill="none" stroke="#c45a66" strokeOpacity="0.5" strokeWidth="1.2" />
    <circle cx="60" cy="61.2" r="46" fill="none" stroke="#2e0a0f" strokeOpacity="0.45" strokeWidth="1" />

    {/* Gold laurel wreath, open at the top */}
    <circle cx="60" cy="60" r="34" fill="none" stroke="url(#seal-gold)" strokeWidth="0.6" strokeOpacity="0.7" />
    <path d="M 80.5 24.5 A 41 41 0 0 1 56.4 100.8 M 39.5 24.5 A 41 41 0 0 0 63.6 100.8" fill="none" stroke="url(#seal-gold)" strokeWidth="0.7" />
    <g fill="url(#seal-gold)">
      {laurel(-60, 85, false)}
      {laurel(240, 95, true)}
    </g>
    <circle cx="60" cy="19" r="1.6" fill="url(#seal-gold)" />

    {/* Monogram: A ♥ S */}
    <text x="40" y="69" textAnchor="middle" className="wax-seal-letter">A</text>
    <text x="80" y="69" textAnchor="middle" className="wax-seal-letter">S</text>
    <path
      className="wax-seal-heart"
      d="M60 70 C 50 62 52.5 53.5 57.2 54.2 C 58.7 54.4 59.6 55.4 60 56.6 C 60.4 55.4 61.3 54.4 62.8 54.2 C 67.5 53.5 70 62 60 70 Z"
      fill="url(#seal-gold)"
    />

    {/* Soft shine */}
    <ellipse cx="42" cy="30" rx="15" ry="6" fill="#ffffff" opacity="0.07" transform="rotate(-30 42 30)" />
  </svg>
);

const WelcomeScreen = ({ onOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    if (onOpen) onOpen(); // Call instantly so music starts immediately!
    
    // Give time for the gatefold to slide open fully
    setTimeout(() => {
      setIsHidden(true);
    }, 800);
  };

  if (isHidden) return null;

  return (
    <div className="gatefold-scene">
      {/* LEFT PANEL */}
      <motion.div 
        className="gatefold-panel left-panel"
        initial={{ x: 0 }}
        animate={isOpen ? { x: '-100vw' } : { x: 0 }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
        style={{ position: 'absolute', overflow: 'hidden' }}
      >
        <img src="/floral-top-left.png" alt="" style={{ position: 'absolute', top: '-10px', left: '-20px', width: '200px', mixBlendMode: 'multiply', opacity: 0.8, pointerEvents: 'none' }} />
        <img src="/floral-top-left.png" alt="" style={{ position: 'absolute', bottom: '-10px', left: '-20px', width: '200px', mixBlendMode: 'multiply', opacity: 0.8, pointerEvents: 'none', transform: 'scaleY(-1)' }} />
        
        <div className="panel-content left-content" style={{ zIndex: 2 }}>
          <h1 className="gatefold-name">Amal</h1>
        </div>
      </motion.div>

      {/* RIGHT PANEL */}
      <motion.div 
        className="gatefold-panel right-panel"
        initial={{ x: 0 }}
        animate={isOpen ? { x: '100vw' } : { x: 0 }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
        style={{ position: 'absolute', overflow: 'hidden' }}
      >
        <img src="/floral-top-left.png" alt="" style={{ position: 'absolute', top: '-10px', right: '-20px', width: '200px', mixBlendMode: 'multiply', opacity: 0.8, pointerEvents: 'none', transform: 'scaleX(-1)' }} />
        <img src="/floral-top-left.png" alt="" style={{ position: 'absolute', bottom: '-10px', right: '-20px', width: '200px', mixBlendMode: 'multiply', opacity: 0.8, pointerEvents: 'none', transform: 'rotate(180deg)' }} />
        
        <div className="panel-content right-content" style={{ zIndex: 2 }}>
          <h1 className="gatefold-name">Samrin</h1>
        </div>
      </motion.div>

      {/* CENTER SEAL & CALL TO ACTION */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            className="gatefold-center-lock"
            initial={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={handleOpen}
          >
            <div className="wax-seal-wrapper">
              <WaxSeal />
              <div className="tap-pulse">Tap to Open</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WelcomeScreen;
