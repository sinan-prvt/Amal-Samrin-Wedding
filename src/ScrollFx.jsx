import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

/* Buttery inertia scrolling for the whole page */
export const useSmoothScroll = (enabled) => {
  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    let raf;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [enabled]);
};

/* Thin dahlia progress line across the top */
export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return <motion.div className="scroll-progress" style={{ scaleX }} />;
};

/* Words light up one by one as you scroll past */
export const ScrollRevealText = ({ text, className = '' }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'start 0.35'] });
  const words = text.split(' ');
  return (
    <p ref={ref} className={`reveal-text ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return <Word key={i} progress={scrollYProgress} range={[start, end]}>{word}</Word>;
      })}
    </p>
  );
};

const Word = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span style={{ opacity }} className="reveal-word">
      {children}&nbsp;
    </motion.span>
  );
};

/* Endless sliding ribbon of text */
export const Marquee = ({ items }) => {
  const row = [...items, ...items, ...items, ...items];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {row.map((item, i) => (
          <span key={i} className="marquee-item">
            {item}
            <span className="marquee-dot">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
};

/* Hero content fades & lifts away as you scroll down */
export const useHeroScroll = (ref) => {
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  return {
    sceneY: useTransform(scrollYProgress, [0, 1], [0, 260]),
    sceneScale: useTransform(scrollYProgress, [0, 1], [1, 1.12]),
    contentY: useTransform(scrollYProgress, [0, 1], [0, -120]),
    fade: useTransform(scrollYProgress, [0, 0.6], [1, 0]),
  };
};
