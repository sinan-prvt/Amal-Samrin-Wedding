import React, { useEffect, useRef, useState } from 'react';
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

/* A photo that falls back to a soft palette tile when the file is missing,
   so the page still looks finished before real photos are dropped in. */
export const Photo = ({ src, alt = '', tone = 'dahlia', label, className = '' }) => {
  const [failed, setFailed] = useState(false);
  if (failed || !src) {
    return (
      <div className={`photo photo--empty photo--${tone} ${className}`} role="img" aria-label={alt}>
        <svg viewBox="0 0 120 24" className="sprig photo-sprig" aria-hidden="true">
          <path d="M4 12 H116" stroke="currentColor" strokeWidth="0.8" />
          <g fill="currentColor">
            <path d="M60 12 q -10 -10 -22 -8 q 8 8 22 8 z" />
            <path d="M60 12 q 10 -10 22 -8 q -8 8 -22 8 z" />
            <circle cx="60" cy="12" r="2.6" />
          </g>
        </svg>
        {label && <span className="photo-label">{label}</span>}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`photo ${className}`}
      onError={() => setFailed(true)}
    />
  );
};

/* Image that drifts slower than the page — classic parallax */
export const ParallaxPhoto = ({ strength = 80, ...props }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-strength, strength]);
  return (
    <div ref={ref} className="parallax-frame">
      <motion.div style={{ y }} className="parallax-inner">
        <Photo {...props} />
      </motion.div>
    </div>
  );
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

/* Vertical scroll drives a sideways photo strip, pinned in place */
export const HorizontalGallery = ({ photos, title }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-72%']);
  return (
    <section ref={ref} className="hgallery" style={{ height: `${photos.length * 60 + 60}vh` }}>
      <div className="hgallery-sticky">
        <div className="hgallery-head">
          <div className="eyebrow">Moments</div>
          <h2 className="section-title">{title}</h2>
        </div>
        <motion.div className="hgallery-track" style={{ x }}>
          {photos.map((p, i) => (
            <figure key={i} className={`hgallery-card ${i % 2 ? 'hgallery-card--low' : ''}`}>
              <Photo src={p.src} alt={p.alt} tone={p.tone} label={p.label} />
              {p.caption && <figcaption>{p.caption}</figcaption>}
            </figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

/* Hero content fades & lifts away as you scroll down */
export const useHeroScroll = (ref) => {
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  return {
    archY: useTransform(scrollYProgress, [0, 1], [0, 160]),
    archScale: useTransform(scrollYProgress, [0, 1], [1, 0.88]),
    fade: useTransform(scrollYProgress, [0, 0.7], [1, 0]),
  };
};
