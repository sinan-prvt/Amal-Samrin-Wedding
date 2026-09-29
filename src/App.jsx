import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Envelope from './Envelope';
import MusicPlayer from './MusicPlayer';
import CursorTrail from './CursorTrail';
import Guestbook from './Guestbook';
import './App.css';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
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
    <motion.div variants={fadeUpVariant} style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontStyle: 'italic', color: 'var(--color-green-olive)', marginBottom: '5px' }}>{timeLeft.days !== undefined ? String(timeLeft.days).padStart(2, '0') : '00'}</div>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.55rem', letterSpacing: '2px', color: 'var(--color-green-olive)' }}>DAYS</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontStyle: 'italic', color: 'var(--color-green-olive)', marginBottom: '5px' }}>{timeLeft.hours !== undefined ? String(timeLeft.hours).padStart(2, '0') : '00'}</div>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.55rem', letterSpacing: '2px', color: 'var(--color-green-olive)' }}>HOURS</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontStyle: 'italic', color: 'var(--color-green-olive)', marginBottom: '5px' }}>{timeLeft.minutes !== undefined ? String(timeLeft.minutes).padStart(2, '0') : '00'}</div>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.55rem', letterSpacing: '2px', color: 'var(--color-green-olive)' }}>MINUTES</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontStyle: 'italic', color: 'var(--color-green-olive)', marginBottom: '5px' }}>{timeLeft.seconds !== undefined ? String(timeLeft.seconds).padStart(2, '0') : '00'}</div>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.55rem', letterSpacing: '2px', color: 'var(--color-green-olive)' }}>SECONDS</div>
      </div>
    </motion.div>
  );
};

const FallingPetals = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  const petals = Array.from({ length: 15 });
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 999, overflow: 'hidden' }}>
      {petals.map((_, i) => {
        const left = Math.random() * 100;
        const animDuration = 15 + Math.random() * 20;
        const delay = Math.random() * -20;
        const size = 8 + Math.random() * 12;
        const isBlurred = Math.random() > 0.5;

        return (
          <motion.div
            key={i}
            initial={{ y: -50, x: 0, rotate: 0, opacity: 0 }}
            animate={{
              y: '100vh',
              x: [0, 60, -60, 0],
              rotate: 360,
              opacity: [0, 0.5, 0.5, 0]
            }}
            transition={{
              duration: animDuration,
              delay: delay,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              position: 'absolute',
              left: `${left}%`,
              width: size,
              height: size * 1.2,
              backgroundColor: '#7A1F24',
              borderTopLeftRadius: '50%',
              borderBottomRightRadius: '50%',
              borderTopRightRadius: '2px',
              borderBottomLeftRadius: '2px',
              filter: isBlurred ? 'blur(3px)' : 'blur(0.5px)',
            }}
          />
        );
      })}
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
          <CursorTrail />
          <FallingPetals />
          <MusicPlayer />

          <motion.div
            className="content-wrapper"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Main Invite Section */}
            {/* Main Invite Section */}
            <section className="invite-section hero-section" style={{ paddingTop: 'clamp(10vh, 15vw, 28vh)', paddingBottom: '15vh', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '0' }}
              >

                <motion.div variants={fadeUpVariant} style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', color: 'var(--color-text-primary)', marginBottom: '15px', letterSpacing: '2px', fontWeight: 'bold' }}>
                  A <span style={{ fontFamily: 'var(--font-script)', fontSize: '2rem', fontStyle: 'italic', margin: '0 5px', color: 'var(--color-text-primary)' }}>&</span> S
                </motion.div>

                <motion.div variants={fadeUpVariant} className="couple-names" style={{ marginBottom: '20px', flexDirection: 'row', alignItems: 'center', gap: '10px', width: '100%', justifyContent: 'center' }}>
                  <h1 className="name" style={{ fontFamily: 'var(--font-script)', fontSize: 'clamp(2.2rem, 8vw, 3.5rem)', fontWeight: 400, color: 'var(--color-text-primary)', margin: 0, background: 'none', WebkitTextFillColor: 'initial', animation: 'none', textTransform: 'capitalize' }}>Amal</h1>
                  <span className="ampersand" style={{ fontFamily: 'var(--font-script)', fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', color: 'var(--color-text-secondary)', margin: 0 }}>&</span>
                  <h1 className="name" style={{ fontFamily: 'var(--font-script)', fontSize: 'clamp(2.2rem, 8vw, 3.5rem)', fontWeight: 400, color: 'var(--color-text-primary)', margin: 0, background: 'none', WebkitTextFillColor: 'initial', animation: 'none', textTransform: 'capitalize' }}>Samrin</h1>
                </motion.div>

                <motion.div variants={fadeUpVariant} style={{ fontFamily: 'var(--font-serif)', fontSize: '0.65rem', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--color-text-primary)', textAlign: 'center', lineHeight: '2', marginBottom: '25px', maxWidth: '500px' }}>
                  We request the pleasure of your company<br />to celebrate our wedding on
                </motion.div>

                <motion.div variants={fadeUpVariant} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderTop: '1px solid var(--color-text-secondary)', borderBottom: '1px solid var(--color-text-secondary)', padding: '12px 0', width: '220px', marginBottom: '30px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '2px' }}>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.8rem', letterSpacing: '2px', color: 'var(--color-text-primary)' }}>DEC</span>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: '3.5rem', lineHeight: '1', color: 'var(--color-text-primary)' }}>24</span>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.8rem', letterSpacing: '2px', color: 'var(--color-text-primary)' }}>2026</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.65rem', letterSpacing: '5px', textTransform: 'uppercase', color: 'var(--color-text-primary)' }}>THURSDAY</div>
                </motion.div>

                <motion.div variants={fadeUpVariant} style={{ fontFamily: 'var(--font-serif)', fontSize: '0.7rem', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--color-text-primary)', marginBottom: '10px' }}>
                  TO BE HELD AT
                </motion.div>

                <motion.div variants={fadeUpVariant} style={{ fontFamily: 'var(--font-script)', fontSize: '3rem', color: 'var(--color-text-primary)', marginBottom: '15px', textAlign: 'center', lineHeight: '1' }}>
                  Malhar Bhoomi
                </motion.div>

                <motion.div variants={fadeUpVariant} style={{ fontFamily: 'var(--font-serif)', fontSize: '0.65rem', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--color-text-primary)', marginBottom: '0px' }}>
                  AT SIX O' CLOCK IN THE EVENING
                </motion.div>

              </motion.div>
            </section>

            {/* Countdown Section */}
            <section className="countdown-section">
              {/* Left Pillar */}
              <img src="/stone-pillar.png" alt="" style={{ position: 'absolute', left: 0, top: 0, bottom: 0, height: '100%', width: 'auto', maxWidth: 'none', transform: 'translateX(-48%)', mixBlendMode: 'multiply' }} />
              {/* Right Pillar (Flipped) */}
              <img src="/stone-pillar.png" alt="" style={{ position: 'absolute', right: 0, top: 0, bottom: 0, height: '100%', width: 'auto', maxWidth: 'none', transform: 'scaleX(-1) translateX(-48%)', mixBlendMode: 'multiply' }} />

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                style={{ position: 'relative', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 20px', width: '100%', maxWidth: '600px' }}
              >
                <motion.div variants={fadeUpVariant} style={{ fontFamily: 'var(--font-serif)', fontSize: '0.8rem', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--color-green-olive)', marginBottom: '40px' }}>
                  UNTIL 26 DECEMBER 2026
                </motion.div>

                <CountdownTimer />
              </motion.div>
            </section>

            {/* Quran Quote Section */}
            <section className="quote-section">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="quote-container"
              >
                <motion.div variants={fadeUpVariant} className="quote-subtitle">
                  <span className="quote-line"></span>
                  FROM THE HOLY QURAN
                  <span className="quote-line"></span>
                </motion.div>

                <motion.div variants={fadeUpVariant} className="quote-arabic">
                  وَخَلَقْنَاكُمْ أَزْوَاجًا
                </motion.div>

                <motion.div variants={fadeUpVariant} className="quote-english">
                  "And We created you in pairs."
                </motion.div>

                <motion.div variants={fadeUpVariant} className="quote-reference">
                  HOLY QURAN • 78:08
                </motion.div>
              </motion.div>
            </section>

            {/* Families Section - Glass Cards */}
            <section className="invite-section" style={{ paddingTop: '80px', paddingBottom: '40px' }}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '50px' }}
              >
                <div className="subtitle" style={{ letterSpacing: '4px', marginBottom: '10px' }}>WITH THE BLESSINGS OF</div>

                {/* Groom's Family Card */}
                <motion.div variants={fadeUpVariant} style={{ position: 'relative', width: '90%', maxWidth: '450px', backgroundColor: '#F4F1E8', borderRadius: '25px', padding: '50px 30px', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.05)', border: '1px solid rgba(130, 138, 80, 0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
                  <img src="/floral-top-left.png" alt="" style={{ position: 'absolute', top: '-40px', left: '-40px', width: '160px', pointerEvents: 'none', mixBlendMode: 'multiply' }} />

                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '5px', letterSpacing: '1px' }}>Amal Ammattikas</div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.65rem', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: '30px' }}>Ammattikas House</div>

                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.85rem', color: 'var(--color-text-primary)', textAlign: 'center', lineHeight: '2' }}>
                    <span style={{ fontSize: '0.6rem', letterSpacing: '3px', color: 'var(--color-green-olive)', textTransform: 'uppercase' }}>Son of</span><br />
                    PK Abdul Jabbar & Rahmath K<br />
                    <div style={{ margin: '15px 0' }}></div>
                    <span style={{ fontSize: '0.6rem', letterSpacing: '3px', color: 'var(--color-green-olive)', textTransform: 'uppercase' }}>Grandson of</span><br />
                    Late Abdurahimankutty Kayakkal &<br />Late Ibrahim Haji Nandi
                  </div>
                </motion.div>

                {/* Bride's Family Card */}
                <motion.div variants={fadeUpVariant} style={{ position: 'relative', width: '90%', maxWidth: '450px', backgroundColor: '#F4F1E8', borderRadius: '25px', padding: '50px 30px', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.05)', border: '1px solid rgba(130, 138, 80, 0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
                  <img src="/floral-drapes-tr.png" alt="" style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', pointerEvents: 'none', mixBlendMode: 'multiply' }} />

                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '5px', position: 'relative', zIndex: 2, letterSpacing: '1px' }}>Fathima Samrin</div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.65rem', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: '30px', position: 'relative', zIndex: 2 }}>Vadakanethil (Excel)</div>

                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.85rem', color: 'var(--color-text-primary)', textAlign: 'center', lineHeight: '2', position: 'relative', zIndex: 2 }}>
                    <span style={{ fontSize: '0.6rem', letterSpacing: '3px', color: 'var(--color-green-olive)', textTransform: 'uppercase' }}>Daughter of</span><br />
                    Shamsudeen & Joonu Shamsudeen<br />
                    <div style={{ margin: '15px 0' }}></div>
                    <span style={{ fontSize: '0.6rem', letterSpacing: '3px', color: 'var(--color-green-olive)', textTransform: 'uppercase' }}>Granddaughter of</span><br />
                    VM Ibrahimkutty Haji & Late CK Ibrahim
                  </div>
                </motion.div>

              </motion.div>
            </section>

            {/* Events Section */}
            <section className="invite-section" style={{ paddingTop: '80px', paddingBottom: '80px', position: 'relative', overflow: 'hidden' }}>
              <img src="/floral-top-left.png" alt="" style={{ position: 'absolute', top: '-20px', left: '-40px', width: '250px', opacity: 0.9, pointerEvents: 'none', mixBlendMode: 'multiply' }} />

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                {/* Reception - Main Highlight */}
                <motion.div variants={fadeUpVariant} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%', marginTop: '40px', zIndex: 10 }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.65rem', letterSpacing: '5px', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: '15px' }}>CELEBRATING OUR UNION</div>

                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(3.5rem, 12vw, 5rem)', color: 'var(--color-green-olive)', lineHeight: '1.1', marginBottom: '0' }}>
                    Wedding<br />Reception
                  </div>
                </motion.div>

                <motion.div variants={fadeUpVariant} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%', marginTop: '30px' }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.65rem', letterSpacing: '5px', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: '15px' }}>WHEN</div>

                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--color-text-primary)', marginBottom: '30px', lineHeight: '1.8' }}>
                    Saturday, December 26<br />At 5:00 PM
                  </div>

                  <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--color-text-secondary)', opacity: 0.3, marginBottom: '30px' }}></div>

                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.65rem', letterSpacing: '5px', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: '15px' }}>WHERE</div>

                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--color-text-primary)', marginBottom: '30px', lineHeight: '1.8' }}>
                    Malhar Bhoomi<br />Pantheerankavu, Calicut
                  </div>
                </motion.div>

                {/* Nikah - Minor Event */}
                <motion.div variants={fadeUpVariant} className="minor-event-box">
                  <div className="minor-event-label">NIKAH CEREMONY</div>
                  <div className="minor-event-text">
                    Thursday, December 24 at 5:00 PM &nbsp;&bull;&nbsp; CIAL Convention Center
                  </div>
                </motion.div>
              </motion.div>
            </section>

            {/* Location Map Section */}
            <section className="invite-section" style={{ position: 'relative', overflow: 'hidden' }}>
              <img src="/floral-drapes-tr.png" alt="" style={{ position: 'absolute', top: '-20px', right: '-40px', width: '250px', opacity: 0.9, pointerEvents: 'none', mixBlendMode: 'multiply' }} />

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={staggerContainer}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', position: 'relative', zIndex: 10 }}
              >
                <div className="subtitle" style={{ letterSpacing: '4px', marginBottom: '10px' }}>FIND YOUR WAY</div>
                <h2 className="section-title">Location Map</h2>

                <motion.div variants={fadeUpVariant} className="qr-code-frame">
                  <a href="https://maps.google.com/?q=Malhar+Bhoomi+Pantheerankavu+Calicut" target="_blank" rel="noopener noreferrer">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://maps.google.com/?q=Malhar+Bhoomi+Pantheerankavu+Calicut" alt="Venue QR Code" />
                  </a>
                </motion.div>
              </motion.div>
            </section>

          </motion.div>

          {/* Guestbook Section */}
          <Guestbook />

          <footer className="footer-section" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '100px 20px 80px', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily: 'var(--font-serif)', fontSize: '35vw', color: 'rgba(130, 138, 80, 0.04)', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 0 }}>
              A & S
            </div>

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.65rem', letterSpacing: '6px', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: '30px' }}>
                With Best Regards
              </div>

              <div style={{ fontFamily: 'var(--font-script)', fontSize: 'clamp(3rem, 10vw, 4.5rem)', color: 'var(--color-green-olive)', lineHeight: '1.2', textAlign: 'center', marginBottom: '20px' }}>
                Amal <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.6em', fontStyle: 'italic', margin: '0 10px' }}>&</span> Samrin
              </div>

              <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--color-green-olive)', opacity: 0.4, marginBottom: '30px' }}></div>

              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.9rem', color: 'var(--color-text-primary)', fontStyle: 'italic', letterSpacing: '1px' }}>
                We eagerly wait to share our joy with you
              </div>
            </div>
          </footer>
        </div>
      )}
    </>
  );
}

export default App;
