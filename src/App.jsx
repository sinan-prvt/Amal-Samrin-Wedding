import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock } from 'lucide-react';
import Envelope from './Envelope';
import './App.css';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

const FallingPetals = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  
  if (!mounted) return null;
  
  const width = window.innerWidth;
  const height = window.innerHeight;
  const petals = Array.from({ length: 15 }); // Reduced count for elegance
  
  return (
    <div className="petals-container" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
      {petals.map((_, i) => {
        const size = Math.random() * 15 + 10; // Sizes between 10 and 25
        const startX = Math.random() * width;
        const blur = Math.random() > 0.5 ? 'blur(2px)' : 'none'; // Depth of field
        const duration = Math.random() * 10 + 15; // Slow, elegant fall (15-25s)
        const delay = Math.random() * -20; // Staggered start times
        
        return (
          <motion.div
            key={i}
            className="petal"
            initial={{ y: -50, x: startX, rotate: 0, opacity: 0 }}
            animate={{
              y: height + 50,
              x: [startX, startX + 50, startX - 50, startX + 20], // Elegant sway
              rotate: 720,
              opacity: [0, 0.8, 0.8, 0]
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              delay: delay,
              ease: "linear"
            }}
            style={{ position: 'absolute', filter: blur }}
          >
            {/* Elegant teardrop petal shape */}
            <svg width={size} height={size} viewBox="0 0 24 24" fill="var(--color-red-dahlia)" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.6 }}>
              <path d="M12 1.5C12 1.5 2 8.5 2 15.5C2 21 6.5 22.5 12 22.5C17.5 22.5 22 21 22 15.5C22 8.5 12 1.5 12 1.5Z" />
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
};

const CursorGlow = () => {
  const [mousePosition, setMousePosition] = useState({ x: -200, y: -200 });

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return (
    <>
      {/* Outer trailing circle */}
      <motion.div
        animate={{
          x: mousePosition.x - 25,
          y: mousePosition.y - 25,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.5 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '50px',
          height: '50px',
          border: '1px solid var(--color-red-dahlia)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: 0.5
        }}
      />
      {/* Inner precise dot */}
      <motion.div
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
        }}
        transition={{ type: "tween", ease: "linear", duration: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '8px',
          height: '8px',
          background: 'var(--color-green-olive)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />
    </>
  );
};

const CountdownTimer = () => {
  const calculateTimeLeft = () => {
    const difference = +new Date('2026-12-26T17:00:00') - +new Date();
    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  return (
    <motion.div variants={fadeUpVariant} className="countdown-box">
      <div className="time-unit">
        <span className="time-value">{timeLeft.days !== undefined ? timeLeft.days : '00'}</span>
        <span className="time-label">DAYS</span>
      </div>
      <div className="time-unit">
        <span className="time-value">{timeLeft.hours !== undefined ? timeLeft.hours : '00'}</span>
        <span className="time-label">HOURS</span>
      </div>
      <div className="time-unit">
        <span className="time-value">{timeLeft.minutes !== undefined ? timeLeft.minutes : '00'}</span>
        <span className="time-label">MINS</span>
      </div>
      <div className="time-unit">
        <span className="time-value">{timeLeft.seconds !== undefined ? timeLeft.seconds : '00'}</span>
        <span className="time-label">SECS</span>
      </div>
    </motion.div>
  );
};

function App() {
  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    if (isOpened) {
      window.scrollTo(0, 0);
    }
  }, [isOpened]);

  return (
    <>
      <Envelope onOpen={() => setIsOpened(true)} />

      {isOpened && (
        <div className="app-container">
          <motion.div
            className="bg-image"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          ></motion.div>

          <motion.div
            className="bg-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          ></motion.div>

          <FallingPetals />
          <CursorGlow />

          <motion.div
            className="content-wrapper"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >

            {/* Main Invite Section (Landing Page) */}
            <section className="invite-section hero-section">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="glass-card main-landing-card"
              >
                {/* Bismillah Header */}
                <motion.div variants={fadeUpVariant} className="bismillah" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', marginBottom: '20px' }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--color-green-olive)' }}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</div>
                </motion.div>

                {/* Invite Text */}
                <motion.div variants={fadeUpVariant} className="wedding-invite-text" style={{ textTransform: 'none', letterSpacing: '1px', marginBottom: '30px', fontSize: '0.9rem' }}>
                  Together with our families, we joyfully invite you to the wedding celebration of
                </motion.div>

                {/* Stacked Names */}
                <motion.div variants={fadeUpVariant} className="couple-names" style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
                  <h1 className="name" style={{ textTransform: 'uppercase' }}>Amal Ammattikas</h1>
                  <span className="ampersand" style={{ color: 'var(--color-green-olive)', fontFamily: 'var(--font-script)', textTransform: 'none' }}>With</span>
                  <h1 className="name" style={{ textTransform: 'uppercase' }}>Fathima Samrin</h1>
                </motion.div>

                {/* Date Footer */}
                <motion.div variants={fadeUpVariant} className="date-large" style={{ border: 'none', marginBottom: '0px' }}>
                  <span style={{ fontSize: '1rem', letterSpacing: '3px', display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>DECEMBER | 24 & 26 | 2026</span>
                </motion.div>
              </motion.div>
            </section>

            {/* The Families Section */}
            <section className="invite-section" style={{ paddingTop: 0 }}>
              <motion.div
                className="glass-card"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={staggerContainer}
              >
                <h2 className="section-title" style={{ fontSize: '2rem', letterSpacing: '3px' }}>The Families</h2>

                <div className="families-grid">
                  <motion.div variants={fadeUpVariant} className="family-card">
                    <h3 className="family-name">Amal Ammattikas</h3>
                    <div className="family-details">
                      <p className="house-name">AMMATTIKAS HOUSE</p>
                      <div className="relation-section">
                        <span className="relation-script">Son of</span>
                        <p className="parents-name">PK Abdul Jabbar & Rahmath.k</p>
                      </div>
                      <div className="relation-section">
                        <span className="relation-script">Grandson of</span>
                        <p className="grandparents-name">Late Abdurahimankutty Kayakkal<br />& Late Ibrahim Haji Nandi</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div variants={fadeUpVariant} className="family-card">
                    <h3 className="family-name">Fathima Samrin</h3>
                    <div className="family-details">
                      <p className="house-name">VADAKANETHIL (EXCEL)</p>
                      <div className="relation-section">
                        <span className="relation-script">Daughter of</span>
                        <p className="parents-name">Shamsudeen & Joonu Shamsudeen</p>
                      </div>
                      <div className="relation-section">
                        <span className="relation-script">Granddaughter of</span>
                        <p className="grandparents-name">VM Ibrahimkutty Haji<br />& Late CK Ibrahim</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </section>

            {/* Events Section */}
            <section className="invite-section" style={{ paddingTop: 0 }}>
              <motion.div
                className="glass-card"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={staggerContainer}
              >
                <h2 className="section-title" style={{ fontSize: '2.5rem' }}>The Grand Celebration</h2>

                <div className="events-grid">
                  {/* Nikah - Subtle Single Row */}
                  <motion.div variants={fadeUpVariant} className="minor-nikah-row">
                    <div className="nikah-label">Nikah Ceremony</div>
                    <div className="nikah-details">
                      Dec 24, 2026 &nbsp;|&nbsp; 5:00 PM &nbsp;|&nbsp; CIAL Convention Center
                    </div>
                  </motion.div>

                  {/* Reception - Main Event Card */}
                  <motion.div variants={fadeUpVariant} className="event-box main-event">
                    <h3 className="event-title">Reception</h3>

                    <div className="main-event-content">
                      <div className="event-info-item">
                        <Calendar className="event-icon" size={32} />
                        <div className="event-info-text">
                          <h4>Date</h4>
                          <p>December 26, 2026</p>
                        </div>
                      </div>

                      <div className="event-info-item">
                        <Clock className="event-icon" size={32} />
                        <div className="event-info-text">
                          <h4>Time</h4>
                          <p>5:00 PM to 10:00 PM</p>
                        </div>
                      </div>

                      <div className="event-info-item">
                        <MapPin className="event-icon" size={32} />
                        <div className="event-info-text">
                          <h4>Venue</h4>
                          <p>Malhar Bhoomi<br />Pantheerankavu, Calicut</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </section>

            <section className="invite-section" style={{ paddingTop: 0 }}>
              <CountdownTimer />

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={staggerContainer}
                className="location-box"
              >
                <div style={{ fontSize: '0.75rem', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--color-green-olive)', marginBottom: '10px' }}>FIND YOUR WAY</div>
                <div style={{ fontFamily: 'var(--font-script)', fontSize: '2.5rem', color: '#444' }}>Location Map</div>

                <motion.div variants={fadeUpVariant} className="qr-code-frame">
                  <a href="https://maps.google.com/?q=Malhar+Bhoomi+Pantheerankavu+Calicut" target="_blank" rel="noopener noreferrer">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://maps.google.com/?q=Malhar+Bhoomi+Pantheerankavu+Calicut" alt="Venue QR Code" />
                  </a>
                </motion.div>

                <motion.div variants={fadeUpVariant} className="location-scan-text">
                  CLICK OR SCAN FOR LOCATION
                </motion.div>
              </motion.div>
            </section>

            <footer className="footer-section" style={{ padding: '40px 20px', background: 'transparent', borderTop: 'none' }}>
              <p style={{ marginBottom: '10px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--color-green-olive)', fontSize: '0.8rem', fontWeight: 'bold', textShadow: '0 0 15px rgba(255,255,255,1), 0 0 5px rgba(255,255,255,1)' }}>WITH BEST REGARDS</p>
              <h2 className="footer-names" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-red-dahlia)', margin: '15px 0', textShadow: '0 0 20px rgba(255,255,255,0.9), 0 0 5px rgba(255,255,255,1)' }}>Amal & Fathima</h2>
              <p style={{ marginTop: '10px', fontSize: '1rem', color: '#333', fontStyle: 'italic', textShadow: '0 0 15px rgba(255,255,255,1), 0 0 5px rgba(255,255,255,1)', fontWeight: '500' }}>We eagerly wait to share our joy with you</p>
            </footer>

          </motion.div>
        </div>
      )}
    </>
  );
}

export default App;
