import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const SENT_KEY = 'amal-samrin-love-sent';

const readSent = () => {
  try {
    return localStorage.getItem(SENT_KEY) === '1';
  } catch {
    return false;
  }
};

const HeartIcon = ({ className }) => (
  <svg viewBox="0 0 32 30" className={className} aria-hidden="true">
    <path d="M16 29 C 5 21 0 15.5 0 9 C 0 4 3.8 0 8.6 0 C 11.8 0 14.5 1.8 16 4.6 C 17.5 1.8 20.2 0 23.4 0 C 28.2 0 32 4 32 9 C 32 15.5 27 21 16 29 Z" />
  </svg>
);

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

/* One tap = one blessing. Each device is counted once; extra taps just play the animation. */
const LoveWishes = () => {
  const [count, setCount] = useState(null);
  const [sent, setSent] = useState(readSent);
  const [bursts, setBursts] = useState([]);
  const burstId = useRef(0);
  const offline = useRef(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/love');
        const data = JSON.parse(await res.text());
        if (res.ok && typeof data.count === 'number') {
          setCount(data.count);
          return;
        }
      } catch {
        // Local dev (no serverless functions) or network error
      }
      offline.current = true;
      setCount(readSent() ? 1 : 0);
    };
    load();
  }, []);

  const burst = () => {
    const id = burstId.current++;
    const hearts = Array.from({ length: 10 }, (_, i) => ({
      angle: (i / 10) * Math.PI * 2 + Math.random() * 0.5,
      dist: 90 + Math.random() * 50,
      size: 14 + Math.random() * 12,
    }));
    setBursts((prev) => [...prev, { id, hearts }]);
    setTimeout(() => setBursts((prev) => prev.filter((b) => b.id !== id)), 1100);
  };

  const sendLove = async () => {
    burst();
    if (sent) return;

    setSent(true);
    setCount((c) => (c ?? 0) + 1);
    try {
      localStorage.setItem(SENT_KEY, '1');
    } catch {
      // Storage blocked: still counted for this visit
    }
    if (offline.current) return;

    try {
      const res = await fetch('/api/love', { method: 'POST' });
      const data = await res.json();
      if (res.ok && typeof data.count === 'number') setCount(data.count);
    } catch {
      // Keep the optimistic count
    }
  };

  return (
    <section className="love-section">
      <motion.div
        className="love-inner"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={{ visible: { transition: { staggerChildren: 0.18 } } }}
      >
        <motion.div variants={fadeUpVariant} className="eyebrow">Wishes &amp; Blessings</motion.div>
        <motion.h2 variants={fadeUpVariant} className="section-title">Send your <em>Love</em></motion.h2>
        <motion.p variants={fadeUpVariant} className="love-hint">
          {sent ? 'Thank you for your love and blessings' : 'Tap the heart to shower the couple with your blessings'}
        </motion.p>

        <motion.div variants={fadeUpVariant} className="love-button-wrap">
          <motion.button
            type="button"
            className={`love-button ${sent ? 'love-button--sent' : ''}`}
            onClick={sendLove}
            whileTap={{ scale: 0.86 }}
            aria-label={sent ? 'Love sent. Tap to send more hearts' : 'Send your love to Amal and Samrin'}
            aria-pressed={sent}
          >
            <span className="love-ring" aria-hidden="true" />
            <HeartIcon className="love-heart" />
          </motion.button>

          {bursts.map((b) => (
            <div key={b.id} className="love-burst" aria-hidden="true">
              {b.hearts.map((h, i) => (
                <motion.span
                  key={i}
                  className="love-burst-heart"
                  initial={{ x: 0, y: 0, scale: 0.4, opacity: 1 }}
                  animate={{ x: Math.cos(h.angle) * h.dist, y: Math.sin(h.angle) * h.dist - 30, scale: 1, opacity: [1, 1, 0] }}
                  transition={{ duration: 1, ease: 'easeOut', times: [0, 0.6, 1] }}
                  style={{ width: h.size, height: h.size }}
                >
                  <HeartIcon />
                </motion.span>
              ))}
            </div>
          ))}
        </motion.div>

        <motion.div variants={fadeUpVariant} className="love-count" aria-live="polite">
          {count === null ? ' ' : (
            <>
              <span className="love-count-number">{count}</span>
              <span className="love-count-label">{count === 1 ? 'blessing received' : 'blessings received'}</span>
            </>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default LoveWishes;
