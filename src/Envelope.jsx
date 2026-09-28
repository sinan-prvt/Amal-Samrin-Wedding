import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Envelope.css';

const WelcomeScreen = ({ onOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    // After animation, hide welcome screen
    setTimeout(() => {
      setIsHidden(true);
      if (onOpen) onOpen();
    }, 1200);
  };

  if (isHidden) return null;

  return (
    <AnimatePresence>
      {!isHidden && (
        <motion.div 
          className="modern-welcome-wrapper"
          initial={{ opacity: 1 }}
          animate={{ opacity: isOpen ? 0 : 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="modern-welcome-bg"></div>
          
          <motion.div 
            className={`modern-glass-card ${isOpen ? 'open' : ''}`}
            onClick={handleOpen}
            animate={isOpen ? { scale: 1.2, opacity: 0 } : { scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <div className="welcome-content">
              <span className="welcome-subtitle">You are invited</span>
              <h1 className="welcome-names">Amal <br/>&<br/> Fathima</h1>
              
              {!isOpen && (
                <div className="tap-to-enter">
                  <span className="modern-pulse">Tap to Enter</span>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeScreen;
