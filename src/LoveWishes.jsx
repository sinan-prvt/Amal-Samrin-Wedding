import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

const FLUSH_MS = 700;        // batch quick taps into one request
const POLL_MS = 4000;        // refresh the live total while the section is on screen
const MAX_PER_REQUEST = 25;  // must match api/love.js
const MAX_FLOATING = 40;
const COLORS = ['#7a1f2b', '#9b3340', '#8a8a4e', '#c9a46a', '#7a1f2b'];

const HeartIcon = ({ className }) => (
  <svg viewBox="0 0 32 30" className={className} aria-hidden="true">
    <path d="M16 29 C 5 21 0 15.5 0 9 C 0 4 3.8 0 8.6 0 C 11.8 0 14.5 1.8 16 4.6 C 17.5 1.8 20.2 0 23.4 0 C 28.2 0 32 4 32 9 C 32 15.5 27 21 16 29 Z" />
  </svg>
);

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

/* Live "send your love": every tap counts, hearts float up like a live stream,
   and the total refreshes so guests see each other's love arrive. */
const LoveWishes = () => {
  const [count, setCount] = useState(null);
  const [tapped, setTapped] = useState(false);
  const [floating, setFloating] = useState([]);

  const sectionRef = useRef(null);
  const countRef = useRef(null);
  const pending = useRef(0);    // taps not yet sent
  const inFlight = useRef(false);
  const offline = useRef(false);
  const nextId = useRef(0);
  const flushTimer = useRef(null);
  const flushRef = useRef(null);

  const scheduleFlush = () => {
    if (!flushTimer.current) flushTimer.current = setTimeout(() => flushRef.current?.(), FLUSH_MS);
  };

  const spawn = useCallback((n, remote = false) => {
    const hearts = Array.from({ length: Math.min(n, 8) }, (_, i) => ({
      id: nextId.current++,
      x: (Math.random() - 0.5) * 70,
      sway: (Math.random() - 0.5) * 60,
      size: remote ? 14 + Math.random() * 8 : 18 + Math.random() * 12,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      duration: 2 + Math.random() * 0.8,
      delay: remote ? i * 0.25 : 0,
    }));
    setFloating((prev) => [...prev, ...hearts].slice(-MAX_FLOATING));
  }, []);

  const removeHeart = useCallback((id) => {
    setFloating((prev) => prev.filter((h) => h.id !== id));
  }, []);

  /* Merge a fresh server total; anything above what we already show is love from other guests */
  const applyServer = useCallback((serverCount) => {
    const next = serverCount + pending.current;
    const shown = countRef.current ?? 0;
    if (countRef.current !== null && next > shown) spawn(next - shown, true);
    if (countRef.current === null || next > shown) {
      countRef.current = next;
      setCount(next);
    }
  }, [spawn]);

  const fetchCount = useCallback(async () => {
    if (offline.current || inFlight.current) return;
    try {
      const res = await fetch('/api/love', { cache: 'no-store' });
      const data = JSON.parse(await res.text());
      if (res.ok && typeof data.count === 'number') applyServer(data.count);
      else throw new Error('bad response');
    } catch {
      if (countRef.current === null) {
        // Local dev (no serverless functions): count locally only
        offline.current = true;
        countRef.current = 0;
        setCount(0);
      }
    }
  }, [applyServer]);

  const flush = useCallback(async () => {
    flushTimer.current = null;
    if (offline.current || inFlight.current || pending.current === 0) return;
    const n = Math.min(pending.current, MAX_PER_REQUEST);
    pending.current -= n;
    inFlight.current = true;
    try {
      const res = await fetch('/api/love', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ n }),
      });
      const data = await res.json();
      inFlight.current = false;
      if (res.ok && typeof data.count === 'number') applyServer(data.count);
    } catch {
      inFlight.current = false;
    }
    if (pending.current > 0) scheduleFlush();
  }, [applyServer]);

  useEffect(() => {
    flushRef.current = flush;
  }, [flush]);

  // Initial load
  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  // Live polling only while the section is visible and the tab is active
  useEffect(() => {
    let visible = false;
    const tick = () => {
      if (visible && document.visibilityState === 'visible') fetchCount();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) tick();
    });
    if (sectionRef.current) observer.observe(sectionRef.current);
    const timer = setInterval(tick, POLL_MS);
    return () => {
      observer.disconnect();
      clearInterval(timer);
    };
  }, [fetchCount]);

  // Send any unsent taps when leaving the page
  useEffect(() => {
    const onHide = () => {
      if (offline.current || pending.current === 0) return;
      const n = Math.min(pending.current, MAX_PER_REQUEST);
      pending.current = 0;
      const body = new Blob([JSON.stringify({ n })], { type: 'application/json' });
      navigator.sendBeacon?.('/api/love', body);
    };
    window.addEventListener('pagehide', onHide);
    return () => window.removeEventListener('pagehide', onHide);
  }, []);

  const sendLove = () => {
    setTapped(true);
    spawn(1);
    countRef.current = (countRef.current ?? 0) + 1;
    setCount(countRef.current);
    if (offline.current) return;
    pending.current += 1;
    scheduleFlush();
  };

  return (
    <section className="love-section" ref={sectionRef}>
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
          {tapped ? 'Thank you! Keep the love coming' : 'Tap the heart as many times as you like'}
        </motion.p>

        <motion.div variants={fadeUpVariant} className="love-button-wrap">
          <div className="love-stream" aria-hidden="true">
            {floating.map((h) => (
              <motion.span
                key={h.id}
                className="love-float"
                initial={{ x: h.x, y: 0, scale: 0.3, opacity: 0 }}
                animate={{ x: [h.x, h.x + h.sway, h.x - h.sway / 2, h.x + h.sway / 3], y: -280, scale: 1, opacity: [0, 1, 1, 0] }}
                transition={{ duration: h.duration, delay: h.delay, ease: 'easeOut' }}
                onAnimationComplete={() => removeHeart(h.id)}
                style={{ width: h.size, height: h.size, fill: h.color }}
              >
                <HeartIcon />
              </motion.span>
            ))}
          </div>

          <motion.button
            type="button"
            className="love-button"
            onClick={sendLove}
            whileTap={{ scale: 0.86 }}
            aria-label="Send your love to Amal and Samrin"
          >
            <span className="love-ring" aria-hidden="true" />
            <HeartIcon className="love-heart" />
          </motion.button>
        </motion.div>

        <motion.div variants={fadeUpVariant} className="love-count" aria-live="polite">
          {count === null ? ' ' : (
            <>
              <motion.span
                key={count}
                className="love-count-number"
                initial={{ scale: 1.35, color: '#c9a46a' }}
                animate={{ scale: 1, color: '#7a1f2b' }}
                transition={{ duration: 0.4 }}
              >
                {count.toLocaleString('en-IN')}
              </motion.span>
              <span className="love-count-label">{count === 1 ? 'blessing received' : 'blessings received'}</span>
            </>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default LoveWishes;
