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
  const petals = Array.from({ length: 20 });
  return (
    <div className="petals-container" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
      {petals.map((_, i) => (
        <motion.div
          key={i}
          className="petal"
          initial={{ y: -50, x: Math.random() * (window.innerWidth || 1000), rotate: 0, opacity: 0 }}
          animate={{
            y: (window.innerHeight || 1000) + 50,
            x: Math.random() * (window.innerWidth || 1000),
            rotate: 360,
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear"
          }}
          style={{ position: 'absolute' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#7a1f24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C12 2 4 7 4 14C4 18.418 7.582 22 12 22C16.418 22 20 18.418 20 14C20 7 12 2 12 2Z" opacity="0.8"/>
          </svg>
        </motion.div>
      ))}
    </div>
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

          <motion.div 
            className="content-wrapper"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >

            {/* Main Invite Section (Landing Page) */}
            <section className="invite-section">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="glass-card"
                style={{ marginTop: '20px', background: 'transparent', border: 'none', backdropFilter: 'none', boxShadow: 'none' }}
              >
                {/* Bismillah Header */}
                <motion.div variants={fadeUpVariant} className="bismillah" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--color-green-olive)' }}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</div>
                  <div style={{ fontSize: '1rem', letterSpacing: '2px', color: 'var(--color-green-olive)', fontStyle: 'italic' }}>
                    In the name of Almighty<br/>
                    <span style={{ fontSize: '1.2rem', marginTop: '8px', display: 'block' }}>The Most Beneficent & The Most Merciful</span>
                  </div>
                </motion.div>

                {/* Invite Text */}
                <motion.div variants={fadeUpVariant} className="wedding-invite-text" style={{ textTransform: 'none', letterSpacing: '1px', marginBottom: '50px', fontSize: '1rem' }}>
                  Together with our families, we joyfully invite you to the wedding celebration of
                </motion.div>

                {/* Stacked Names */}
                <motion.div variants={fadeUpVariant} className="couple-names" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '50px' }}>
                  <h1 className="name" style={{ fontSize: '3rem', letterSpacing: '4px', textTransform: 'uppercase' }}>Amal Ammattikas</h1>
                  <span className="ampersand" style={{ fontSize: '2.5rem', color: 'var(--color-green-olive)', fontFamily: 'var(--font-script)', textTransform: 'none' }}>With</span>
                  <h1 className="name" style={{ fontSize: '3rem', letterSpacing: '4px', textTransform: 'uppercase' }}>Fathima Samrin</h1>
                </motion.div>

                {/* Date Footer */}
                <motion.div variants={fadeUpVariant} className="date-large" style={{ border: 'none', marginBottom: '10px' }}>
                  <span style={{ fontSize: '1.2rem', letterSpacing: '5px', display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>DECEMBER | 24 & 26 | 2026</span>
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
                  <motion.div variants={fadeUpVariant}>
                    <h3 className="family-name">Amal Ammattikas</h3>
                    <div className="family-details">
                      <p className="house-name">AMMATTIKAS HOUSE</p>
                      <div className="relation-section">
                        <span className="relation-label">Son of</span>
                        <p className="parents-name">PK Abdul Jabbar & Rahmath.k</p>
                      </div>
                      <div className="relation-section">
                        <span className="relation-label">Grandson of</span>
                        <p className="grandparents-name">Late Abdurahimankutty Kayakkal<br/>& Late Ibrahim Haji Nandi</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div variants={fadeUpVariant}>
                    <h3 className="family-name">Fathima Samrin</h3>
                    <div className="family-details">
                      <p className="house-name">VADAKANETHIL (EXCEL)</p>
                      <div className="relation-section">
                        <span className="relation-label">Daughter of</span>
                        <p className="parents-name">Shamsudeen & Joonu Shamsudeen</p>
                      </div>
                      <div className="relation-section">
                        <span className="relation-label">Granddaughter of</span>
                        <p className="grandparents-name">VM Ibrahimkutty Haji<br/>& Late CK Ibrahim</p>
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

                    <div className="event-info-item">
                      <Calendar className="event-icon" size={28} />
                      <div className="event-info-text">
                        <h4>Date</h4>
                        <p>December 26, 2026</p>
                      </div>
                    </div>

                    <div className="event-info-item">
                      <Clock className="event-icon" size={28} />
                      <div className="event-info-text">
                        <h4>Time</h4>
                        <p>5:00 PM to 10:00 PM</p>
                      </div>
                    </div>

                    <div className="event-info-item">
                      <MapPin className="event-icon" size={28} />
                      <div className="event-info-text">
                        <h4>Venue</h4>
                        <p>Malhar Bhoomi<br/>Pantheerankavu, Calicut</p>
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
                <div style={{ fontFamily: 'var(--font-script)', fontSize: '3rem', color: '#444' }}>Location Map</div>
                
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

            <footer className="footer">
              <p className="footer-thanks" style={{ marginBottom: '15px' }}>WITH BEST REGARDS</p>
              <div className="footer-names" style={{ fontSize: '1.8rem', color: '#444' }}>Amal & Fathima</div>
              <p className="footer-thanks" style={{ marginTop: '10px', fontSize: '1rem' }}>We eagerly wait to share our joy with you</p>
            </footer>

          </motion.div>
        </div>
      )}
    </>
  );
}

export default App;
