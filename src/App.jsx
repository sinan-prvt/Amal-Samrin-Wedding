import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Envelope from './Envelope';
import MusicPlayer from './MusicPlayer';
import CursorTrail from './CursorTrail';
import Guestbook from './Guestbook';
import {
  useSmoothScroll, ScrollProgress, ScrollRevealText, Marquee, useHeroScroll,
} from './ScrollFx';
import './App.css';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.18 } }
};

const Sprig = ({ className = '' }) => (
  <svg className={`sprig ${className}`} viewBox="0 0 120 24" aria-hidden="true">
    <path d="M4 12 H116" stroke="currentColor" strokeWidth="0.8" />
    <g fill="currentColor">
      <path d="M60 12 q -10 -10 -22 -8 q 8 8 22 8 z" />
      <path d="M60 12 q 10 -10 22 -8 q -8 8 -22 8 z" />
      <path d="M60 12 q -8 9 -18 9 q 6 -8 18 -9 z" opacity="0.6" />
      <path d="M60 12 q 8 9 18 9 q -6 -8 -18 -9 z" opacity="0.6" />
      <circle cx="60" cy="12" r="2.6" />
    </g>
  </svg>
);

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

  const units = [
    ['days', 'Days'],
    ['hours', 'Hours'],
    ['minutes', 'Minutes'],
    ['seconds', 'Seconds'],
  ];

  return (
    <motion.div variants={fadeUpVariant} className="countdown">
      {units.map(([key, label]) => (
        <div className="countdown-unit" key={key}>
          <div className="countdown-value">{timeLeft[key] !== undefined ? String(timeLeft[key]).padStart(2, '0') : '00'}</div>
          <div className="countdown-label">{label}</div>
        </div>
      ))}
    </motion.div>
  );
};

const PETAL_COLORS = ['#7a1f2b', '#8a8a4e', '#7a1f2b', '#e3d4b8'];

/* CSS-only petals: animated on the compositor, no per-frame JavaScript */
const FallingPetals = () => {
  const [petals] = useState(() =>
    Array.from({ length: 10 }, (_, i) => ({
      left: Math.random() * 100,
      duration: 16 + Math.random() * 18,
      delay: Math.random() * -30,
      size: 8 + Math.random() * 10,
      sway: (Math.random() > 0.5 ? 1 : -1) * (30 + Math.random() * 40),
      color: PETAL_COLORS[i % PETAL_COLORS.length],
      soft: Math.random() > 0.5,
    }))
  );
  return (
    <div className="petals" aria-hidden="true">
      {petals.map((p, i) => (
        <span
          key={i}
          className={`petal ${p.soft ? 'petal--soft' : ''}`}
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.2,
            backgroundColor: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            '--sway': `${p.sway}px`,
          }}
        />
      ))}
    </div>
  );
};

const Hero = () => {
  const heroRef = useRef(null);
  const { sceneY, fade, contentY } = useHeroScroll(heroRef);
  return (
    <section className="hero" ref={heroRef}>
      <motion.div className="hero-scene" style={{ y: sceneY }}>
        <motion.div
          className="hero-scene-zoom"
          initial={{ scale: 1.12, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src="/hero-venue.webp"
            alt=""
            className="hero-photo"
            fetchPriority="high"
            decoding="async"
          />
        </motion.div>
      </motion.div>
      <div className="hero-veil" aria-hidden="true" />

      <motion.div
        className="hero-inner"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        style={{ opacity: fade, y: contentY }}
      >
        <div className="hero-card">
          <motion.div variants={fadeUpVariant} className="eyebrow eyebrow--hero">
            The Wedding Of
          </motion.div>

          <motion.h1 variants={fadeUpVariant} className="hero-names">
            <span>Amal</span>
            <em className="hero-amp">&amp;</em>
            <span>Samrin</span>
          </motion.h1>

          <motion.p variants={fadeUpVariant} className="hero-request">
            We request the pleasure of your company<br />to celebrate our wedding on
          </motion.p>

          <motion.div variants={fadeUpVariant} className="hero-date">
            <span className="hero-date-side">Thursday</span>
            <span className="hero-date-main">24 · 12 · 2026</span>
            <span className="hero-date-side">Six O'Clock</span>
          </motion.div>

          <motion.div variants={fadeUpVariant} className="hero-venue">
            <span className="eyebrow eyebrow--hero">To be held at</span>
            <span className="hero-venue-name">Malhar Bhoomi</span>
          </motion.div>
        </div>
      </motion.div>

      <div className="scroll-cue" aria-hidden="true"><span /></div>
    </section>
  );
};

const FamilyCard = ({ name, house, relation, parents, grandRelation, grandparents, tone }) => (
  <motion.div variants={fadeUpVariant} className={`family-card family-card--${tone}`}>
    <div className="family-card-arch">
      <div className="family-name">{name}</div>
      <div className="family-house">{house}</div>
      <Sprig className="family-sprig" />
      <div className="family-relation">{relation}</div>
      <div className="family-people">{parents}</div>
      <div className="family-relation">{grandRelation}</div>
      <div className="family-people">{grandparents}</div>
    </div>
  </motion.div>
);

function App() {
  const [isOpened, setIsOpened] = useState(false);
  useSmoothScroll(isOpened);

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
          <ScrollProgress />

          <motion.div
            className="content-wrapper"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Hero />

            <Marquee items={['Amal & Samrin', '26 · 12 · 2026', 'Malhar Bhoomi', 'Calicut']} />

            {/* ─── Countdown ─── */}
            <section className="countdown-section">
              <motion.div
                className="countdown-inner"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                <motion.div variants={fadeUpVariant} className="eyebrow">
                  Until 26 December 2026
                </motion.div>
                <CountdownTimer />
              </motion.div>
            </section>

            {/* ─── Quran Quote ─── */}
            <section className="quote-section">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="quote-container"
              >
                <motion.div variants={fadeUpVariant} className="eyebrow eyebrow--light">
                  From the Holy Quran
                </motion.div>

                <motion.div variants={fadeUpVariant} className="quote-arabic">
                  وَخَلَقْنَاكُمْ أَزْوَاجًا
                </motion.div>

                <ScrollRevealText className="quote-english" text="“And We created you in pairs.”" />

                <motion.div variants={fadeUpVariant}>
                  <Sprig className="quote-sprig" />
                </motion.div>

                <motion.div variants={fadeUpVariant} className="quote-reference">
                  Holy Quran · 78:08
                </motion.div>
              </motion.div>
            </section>

            {/* ─── Families ─── */}
            <section className="invite-section families">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={staggerContainer}
                className="families-inner"
              >
                <motion.div variants={fadeUpVariant} className="section-head">
                  <div className="eyebrow">With the blessings of</div>
                  <h2 className="section-title">Our <em>Families</em></h2>
                </motion.div>

                <div className="family-grid">
                  <FamilyCard
                    tone="dahlia"
                    name="Amal Ammattikas"
                    house="Ammattikas House"
                    relation="Son of"
                    parents="PK Abdul Jabbar & Rahmath K"
                    grandRelation="Grandson of"
                    grandparents={<>Late Abdurahimankutty Kayakkal &<br />Late Ibrahim Haji Nandi</>}
                  />
                  <FamilyCard
                    tone="olive"
                    name="Fathima Samrin"
                    house="Vadakanethil (Excel)"
                    relation="Daughter of"
                    parents="Shamsudeen & Joonu Shamsudeen"
                    grandRelation="Granddaughter of"
                    grandparents="VM Ibrahimkutty Haji & Late CK Ibrahim"
                  />
                </div>
              </motion.div>
            </section>

            {/* ─── Events ─── */}
            <section className="events-section">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={staggerContainer}
                className="events-inner"
              >
                <motion.div variants={fadeUpVariant} className="eyebrow">Celebrating our union</motion.div>

                <motion.h2 variants={fadeUpVariant} className="events-title">
                  Wedding <em>Reception</em>
                </motion.h2>

                <motion.div variants={fadeUpVariant} className="event-grid">
                  <div className="event-cell">
                    <div className="eyebrow">When</div>
                    <div className="event-value">Saturday, December 26<br />at 5:00 PM</div>
                  </div>
                  <div className="event-rule" />
                  <div className="event-cell">
                    <div className="eyebrow">Where</div>
                    <div className="event-value">Malhar Bhoomi<br />Pantheerankavu, Calicut</div>
                  </div>
                </motion.div>

                <motion.div variants={fadeUpVariant} className="minor-event">
                  <span className="minor-event-label">Nikah Ceremony</span>
                  <span className="minor-event-text">
                    Thursday, December 24 at 5:00 PM · CIAL Convention Center
                  </span>
                </motion.div>
              </motion.div>
            </section>

            {/* ─── Location ─── */}
            <section className="invite-section location-section">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={staggerContainer}
                className="location-inner"
              >
                <motion.div variants={fadeUpVariant} className="section-head">
                  <div className="eyebrow">Find your way</div>
                  <h2 className="section-title">The <em>Venue</em></h2>
                </motion.div>

                <motion.div variants={fadeUpVariant} className="qr-code-frame">
                  <a href="https://maps.google.com/?q=Malhar+Bhoomi+Pantheerankavu+Calicut" target="_blank" rel="noopener noreferrer">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=4b1219&bgcolor=f3ead9&data=https://maps.google.com/?q=Malhar+Bhoomi+Pantheerankavu+Calicut" alt="Venue QR Code" />
                  </a>
                </motion.div>

                <motion.a
                  variants={fadeUpVariant}
                  className="map-button"
                  href="https://maps.google.com/?q=Malhar+Bhoomi+Pantheerankavu+Calicut"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in Maps
                </motion.a>
              </motion.div>
            </section>
          </motion.div>

          {/* Guestbook Section */}
          <Guestbook />

          <footer className="footer-section">
            <div className="footer-watermark" aria-hidden="true">A&amp;S</div>
            <div className="footer-inner">
              <div className="eyebrow eyebrow--light">With best regards</div>
              <div className="footer-names">
                Amal <em>&amp;</em> Samrin
              </div>
              <Sprig className="footer-sprig" />
              <div className="footer-note">We eagerly wait to share our joy with you</div>
            </div>
          </footer>
        </div>
      )}
    </>
  );
}

export default App;
