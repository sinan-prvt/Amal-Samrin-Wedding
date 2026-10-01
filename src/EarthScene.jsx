import React from 'react';

/* Hand-built SVG botanicals in the Red Dahlia / Green Olive / Buttercream palette.
   Replaces the old sea photograph with an earthy, illustrated landscape. */

const Dahlia = ({ x, y, r, color = '#7a1f2b', shade = '#4b1219', rings = 3, petals = 14 }) => {
  const layers = [];
  for (let ring = 0; ring < rings; ring++) {
    const rr = r * (1 - ring * 0.28);
    const count = Math.max(6, petals - ring * 3);
    const offset = ring * (180 / count);
    for (let i = 0; i < count; i++) {
      const angle = (360 / count) * i + offset;
      layers.push(
        <ellipse
          key={`${ring}-${i}`}
          cx={0}
          cy={-rr * 0.55}
          rx={rr * 0.2}
          ry={rr * 0.5}
          fill={ring % 2 === 0 ? color : shade}
          opacity={0.92 - ring * 0.08}
          transform={`rotate(${angle})`}
        />
      );
    }
  }
  return (
    <g transform={`translate(${x} ${y})`}>
      {layers}
      <circle r={r * 0.16} fill={shade} />
      <circle r={r * 0.08} fill="#d9a441" opacity="0.8" />
    </g>
  );
};

const Bloom = ({ x, y, r, color = '#f6eedf', center = '#d9c49a' }) => (
  <g transform={`translate(${x} ${y})`}>
    {Array.from({ length: 6 }).map((_, i) => (
      <ellipse key={i} cx={0} cy={-r * 0.5} rx={r * 0.38} ry={r * 0.55} fill={color} transform={`rotate(${i * 60})`} stroke="#e3d4b8" strokeWidth="0.6" />
    ))}
    <circle r={r * 0.22} fill={center} />
  </g>
);

const Leaf = ({ x, y, len, angle, color = '#8a8a4e' }) => (
  <g transform={`translate(${x} ${y}) rotate(${angle})`}>
    <path d={`M0 0 Q ${len * 0.32} ${-len * 0.5} 0 ${-len} Q ${-len * 0.32} ${-len * 0.5} 0 0 Z`} fill={color} />
    <path d={`M0 0 L0 ${-len * 0.92}`} stroke="#3b3f22" strokeWidth="0.6" opacity="0.4" />
  </g>
);

const Stem = ({ d }) => <path d={d} stroke="#55582f" strokeWidth="1.4" fill="none" strokeLinecap="round" />;

/* A cluster of dahlias, cream blooms and olive leaves for a corner */
const Cluster = ({ flip = false }) => (
  <g transform={flip ? 'translate(400 0) scale(-1 1)' : undefined}>
    <Stem d="M-10 560 Q 40 470 70 420" />
    <Stem d="M-10 560 Q 90 500 140 470" />
    <Stem d="M10 560 Q 30 500 20 440" />
    <Leaf x={40} y={520} len={60} angle={-35} color="#55582f" />
    <Leaf x={70} y={500} len={52} angle={40} />
    <Leaf x={20} y={480} len={46} angle={-70} color="#a4a066" />
    <Leaf x={120} y={500} len={48} angle={65} color="#55582f" />
    <Leaf x={100} y={470} len={40} angle={10} color="#a4a066" />
    <Leaf x={8} y={440} len={40} angle={-15} />
    <Dahlia x={60} y={445} r={46} />
    <Dahlia x={140} y={505} r={34} color="#8e2a35" />
    <Bloom x={18} y={500} r={22} />
    <Bloom x={105} y={545} r={18} />
    <Dahlia x={-5} y={540} r={30} color="#5e1620" shade="#2e0a0f" />
    <circle cx={170} cy={470} r={4} fill="#7a1f2b" />
    <circle cx={180} cy={482} r={3} fill="#8a8a4e" />
    <circle cx={95} cy={400} r={3.5} fill="#f6eedf" />
  </g>
);

const EarthScene = () => (
  <svg viewBox="0 0 400 560" preserveAspectRatio="xMidYMax slice" className="earth-scene" aria-hidden="true">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#efe2cb" />
        <stop offset="55%" stopColor="#ead3b1" />
        <stop offset="100%" stopColor="#d9b48c" />
      </linearGradient>
      <radialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stopColor="#fbf3e2" />
        <stop offset="70%" stopColor="#f3dcb6" />
        <stop offset="100%" stopColor="#f3dcb6" stopOpacity="0" />
      </radialGradient>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix values="0 0 0 0 0.3  0 0 0 0 0.2  0 0 0 0 0.1  0 0 0 0.12 0" />
        <feComposite in2="SourceGraphic" operator="in" />
      </filter>
    </defs>

    <rect width="400" height="560" fill="url(#sky)" />
    <circle cx="200" cy="300" r="120" fill="url(#sun)" />
    <circle cx="200" cy="300" r="62" fill="#f8ead0" opacity="0.9" />

    {/* Rolling earth hills */}
    <path d="M0 330 C 80 290 150 310 210 300 S 340 280 400 300 L400 560 L0 560 Z" fill="#c9a77d" opacity="0.55" />
    <path d="M0 360 C 70 330 140 350 200 340 S 330 320 400 345 L400 560 L0 560 Z" fill="#a4a066" />
    <path d="M0 395 C 90 365 170 390 240 375 S 360 365 400 380 L400 560 L0 560 Z" fill="#8a8a4e" />
    <path d="M0 430 C 110 405 200 425 280 412 S 370 410 400 420 L400 560 L0 560 Z" fill="#6d6f3c" />
    <path d="M0 470 C 120 450 230 470 320 455 S 380 455 400 460 L400 560 L0 560 Z" fill="#55582f" />

    {/* Field furrows */}
    <g stroke="#3b3f22" strokeWidth="0.8" opacity="0.25" fill="none">
      <path d="M40 520 Q 200 480 360 520" />
      <path d="M20 540 Q 200 500 380 540" />
      <path d="M60 500 Q 200 465 340 500" />
    </g>

    {/* Distant cypress trees */}
    <g fill="#3b3f22" opacity="0.75">
      <path d="M300 372 q 6 -40 8 -55 q 2 15 8 55 z" />
      <path d="M318 370 q 4 -28 6 -38 q 2 10 6 38 z" />
      <path d="M86 360 q 5 -34 7 -46 q 2 12 7 46 z" />
    </g>

    {/* Flying birds */}
    <g stroke="#4b1219" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.6">
      <path d="M120 250 q 5 -5 10 0 q 5 -5 10 0" />
      <path d="M146 238 q 4 -4 8 0 q 4 -4 8 0" />
      <path d="M262 228 q 4 -4 8 0 q 4 -4 8 0" />
    </g>

    <Cluster />
    <Cluster flip />

    <rect width="400" height="560" filter="url(#grain)" opacity="0.6" />
  </svg>
);

export default EarthScene;
