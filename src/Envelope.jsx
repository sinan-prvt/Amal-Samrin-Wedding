import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Envelope.css';

const WelcomeScreen = ({ onOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    // Give time for the gatefold to slide open fully (1.5s)
    setTimeout(() => {
      setIsHidden(true);
      if (onOpen) onOpen();
    }, 1500);
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
              <div className="css-golden-seal">
                <span>A&S</span>
              </div>
              <div className="tap-pulse">Tap to Open</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WelcomeScreen;
