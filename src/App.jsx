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

            {/* Main Invite Section */}
            <section className="invite-section">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="glass-card"
                style={{ marginTop: '20px', background: 'transparent', border: 'none', backdropFilter: 'none' }}
              >
                <motion.div variants={fadeUpVariant} className="bismillah">
                  Bismillah ir-Rahman ir-Rahim
                </motion.div>

                <motion.div variants={fadeUpVariant} className="wedding-invite-text">
                  Together with our families, we joyfully invite you to the wedding celebration of
                </motion.div>

                <motion.div variants={fadeUpVariant} className="couple-names">
                  <h1 className="name">Amal</h1>
                  <span className="ampersand">&</span>
                  <h1 className="name">Fathima</h1>
                </motion.div>

                <motion.div variants={fadeUpVariant} className="date-large">
                  DEC 24 & 26, 2026
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
                <h2 className="section-title">The Families</h2>

                <div className="families-grid">
                  <motion.div variants={fadeUpVariant}>
                    <h3 className="family-name">Amal Ammattikas</h3>
                    <div className="family-details">
                      <p>AMMATTIKAS HOUSE</p>
                      <span className="relation-label">Son of</span>
                      <p>PK Abdul Jabbar & Rahmath.k</p>
                      <span className="relation-label">Grandson of</span>
                      <p>Late Abdurahimankutty Kayakkal &<br /> Late Ibrahim Haji Nandi</p>
                    </div>
                  </motion.div>

                  <motion.div variants={fadeUpVariant}>
                    <h3 className="family-name">Fathima Samrin</h3>
                    <div className="family-details">
                      <p>VADAKANETHIL- (EXCEL)</p>
                      <span className="relation-label">Daughter of</span>
                      <p>Shamsudeen & Joonu Shamsudeen</p>
                      <span className="relation-label">Granddaughter of</span>
                      <p>VM Ibrahimkutty Haji &<br /> Late CK Ibrahim</p>
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
                <h2 className="section-title">Events</h2>

                <div className="events-grid">
                  {/* Nikah */}
                  <motion.div variants={fadeUpVariant} className="event-box">
                    <h3 className="event-title">Nikah</h3>

                    <div className="event-info-item">
                      <Calendar className="event-icon" size={24} />
                      <div className="event-info-text">
                        <h4>Date</h4>
                        <p>December 24, 2026</p>
                      </div>
                    </div>

                    <div className="event-info-item">
                      <Clock className="event-icon" size={24} />
                      <div className="event-info-text">
                        <h4>Time</h4>
                        <p>5:00 PM</p>
                      </div>
                    </div>

                    <div className="event-info-item">
                      <MapPin className="event-icon" size={24} />
                      <div className="event-info-text">
                        <h4>Venue</h4>
                        <p>CIAL Convention Center</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Reception */}
                  <motion.div variants={fadeUpVariant} className="event-box">
                    <h3 className="event-title">Reception</h3>

                    <div className="event-info-item">
                      <Calendar className="event-icon" size={24} />
                      <div className="event-info-text">
                        <h4>Date</h4>
                        <p>December 26, 2026</p>
                      </div>
                    </div>

                    <div className="event-info-item">
                      <Clock className="event-icon" size={24} />
                      <div className="event-info-text">
                        <h4>Time</h4>
                        <p>5:00 PM to 10:00 PM</p>
                      </div>
                    </div>

                    <div className="event-info-item">
                      <MapPin className="event-icon" size={24} />
                      <div className="event-info-text">
                        <h4>Venue</h4>
                        <p>Malhar Bhoomi<br />Pantheerankavu, Calicut</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </section>

            <footer className="footer">
              <div className="footer-names">Amal & Fathima</div>
              <p className="footer-thanks">We eagerly wait to share our joy with you</p>
            </footer>

          </motion.div>
        </div>
      )}
    </>
  );
}

export default App;
