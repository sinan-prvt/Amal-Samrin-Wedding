import React from 'react';

/* Royal stage illustration for the landing hero:
   crystal chandeliers, hanging florals, red-dahlia flower walls,
   a gold Mughal arch and a glossy candle-lit aisle.
   Pure SVG, so it is crisp on every screen and costs no image download. */

const W = 1600;
const H = 1000;
const C = W / 2;
const GOLD = '#c9a46a';
const GOLD_SOFT = '#e6cfa0';

/* Deterministic random so the scene is identical on every render */
const rng = (seed) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const DAHLIAS = ['#7a1f2b', '#8e2a35', '#5e1620', '#9b3340', '#6b1a25'];
const CREAMS = ['#f6eedf', '#efe2cb', '#fbf5ea', '#e9dcc4'];
const LEAVES = ['#55582f', '#6d6f3c', '#8a8a4e', '#3b3f22', '#a4a066'];

const Dahlia = ({ x, y, r, color, shade = '#3a0d14' }) => {
  const parts = [];
  for (let ring = 0; ring < 3; ring++) {
    const rr = r * (1 - ring * 0.28);
    const count = 16 - ring * 4;
    for (let i = 0; i < count; i++) {
      parts.push(
        <ellipse
          key={`${ring}-${i}`}
          cy={-rr * 0.55}
          rx={rr * 0.19}
          ry={rr * 0.5}
          fill={ring === 1 ? shade : color}
          opacity={ring === 1 ? 0.55 : 0.95}
          transform={`rotate(${(360 / count) * i + ring * 11})`}
        />
      );
    }
  }
  return (
    <g transform={`translate(${x} ${y})`}>
      {parts}
      <circle r={r * 0.14} fill={shade} />
    </g>
  );
};

/* Cream hydrangea: a cloud of tiny florets */
const Hydrangea = ({ x, y, r, rand }) => {
  const florets = [];
  for (let i = 0; i < 26; i++) {
    const a = rand() * Math.PI * 2;
    const d = Math.sqrt(rand()) * r;
    florets.push(
      <circle key={i} cx={Math.cos(a) * d} cy={Math.sin(a) * d} r={r * (0.16 + rand() * 0.12)} fill={CREAMS[i % CREAMS.length]} />
    );
  }
  return <g transform={`translate(${x} ${y})`}>{florets}</g>;
};

const Leaf = ({ x, y, len, angle, color }) => (
  <path
    transform={`translate(${x} ${y}) rotate(${angle})`}
    d={`M0 0 Q ${len * 0.35} ${-len * 0.5} 0 ${-len} Q ${-len * 0.35} ${-len * 0.5} 0 0 Z`}
    fill={color}
  />
);

/* A flower wall that fills a region with dahlias, hydrangeas and leaves */
const FlowerWall = ({ x0, x1, y0, y1, seed }) => {
  const rand = rng(seed);
  const items = [];
  let k = 0;
  for (let i = 0; i < 60; i++) {
    items.push(<Leaf key={`l${k++}`} x={x0 + rand() * (x1 - x0)} y={y0 + rand() * (y1 - y0)} len={30 + rand() * 50} angle={rand() * 360} color={LEAVES[i % LEAVES.length]} />);
  }
  for (let i = 0; i < 26; i++) {
    const x = x0 + rand() * (x1 - x0);
    const y = y0 + rand() * (y1 - y0);
    if (i % 3 === 0) items.push(<Hydrangea key={`h${k++}`} x={x} y={y} r={28 + rand() * 26} rand={rand} />);
    else items.push(<Dahlia key={`d${k++}`} x={x} y={y} r={30 + rand() * 34} color={DAHLIAS[i % DAHLIAS.length]} />);
  }
  return <g>{items}</g>;
};

/* Hanging strands of tiny blooms ending in calla-lily drops */
const Strands = ({ seed }) => {
  const rand = rng(seed);
  const out = [];
  for (let i = 0; i < 70; i++) {
    const x = rand() * W;
    const nearCentre = Math.abs(x - C) < 220;
    const len = nearCentre ? 60 + rand() * 90 : 120 + rand() * 300;
    const dots = [];
    for (let y = 40; y < len; y += 11 + rand() * 8) {
      dots.push(<circle key={y} cx={x + Math.sin(y / 30) * 3} cy={y} r={1.4 + rand() * 2} fill={rand() > 0.3 ? CREAMS[i % 4] : '#a4a066'} />);
    }
    out.push(
      <g key={i} opacity={0.75 + rand() * 0.25}>
        <line x1={x} y1={0} x2={x} y2={len} stroke="#6d6f3c" strokeWidth="0.8" opacity="0.6" />
        {dots}
        <path d={`M${x} ${len} q 5 10 0 22 q -5 -12 0 -22 z`} fill="#fbf5ea" />
      </g>
    );
  }
  return <g>{out}</g>;
};

/* Leafy canopy across the ceiling */
const Canopy = ({ seed }) => {
  const rand = rng(seed);
  const out = [];
  for (let i = 0; i < 160; i++) {
    const x = rand() * W;
    out.push(<circle key={`c${i}`} cx={x} cy={rand() * 70 - 10} r={14 + rand() * 30} fill={LEAVES[i % LEAVES.length]} opacity={0.9} />);
  }
  const foliage = <g key="foliage" filter="url(#bokeh)">{out.splice(0)}</g>;
  out.push(foliage);
  for (let i = 0; i < 50; i++) {
    out.push(<Hydrangea key={`h${i}`} x={rand() * W} y={20 + rand() * 50} r={10 + rand() * 16} rand={rand} />);
  }
  for (let i = 0; i < 14; i++) {
    out.push(<Dahlia key={`d${i}`} x={rand() * W} y={30 + rand() * 50} r={16 + rand() * 18} color={DAHLIAS[i % DAHLIAS.length]} />);
  }
  return <g>{out}</g>;
};

const Glow = ({ x, y, r, opacity = 0.55 }) => <circle cx={x} cy={y} r={r} fill="url(#glow)" opacity={opacity} />;

const Chandelier = ({ x, y, s = 1 }) => {
  const crystals = [];
  for (let i = -5; i <= 5; i++) {
    const cx = x + i * 13 * s;
    const len = (46 - Math.abs(i) * 5) * s;
    crystals.push(
      <g key={i}>
        <line x1={cx} y1={y + 8 * s} x2={cx} y2={y + len} stroke={GOLD_SOFT} strokeWidth={0.6} opacity="0.7" />
        <path d={`M${cx} ${y + len} l ${3 * s} ${6 * s} l ${-3 * s} ${6 * s} l ${-3 * s} ${-6 * s} z`} fill="#fff8ec" opacity="0.9" />
      </g>
    );
  }
  const candles = [-48, -24, 0, 24, 48].map((dx) => (
    <g key={dx}>
      <rect x={x + dx * s - 2 * s} y={y - 16 * s} width={4 * s} height={12 * s} fill="#f6eedf" />
      <ellipse cx={x + dx * s} cy={y - 20 * s} rx={2.4 * s} ry={4.5 * s} fill="#ffe2a8" />
    </g>
  ));
  return (
    <g>
      <Glow x={x} y={y + 10 * s} r={150 * s} opacity={0.6} />
      <line x1={x} y1={0} x2={x} y2={y - 30 * s} stroke={GOLD} strokeWidth={1.2} />
      <path d={`M${x - 60 * s} ${y - 4 * s} Q ${x} ${y + 26 * s} ${x + 60 * s} ${y - 4 * s}`} stroke={GOLD} strokeWidth={2} fill="none" />
      <path d={`M${x - 40 * s} ${y - 24 * s} Q ${x} ${y - 6 * s} ${x + 40 * s} ${y - 24 * s}`} stroke={GOLD} strokeWidth={1.4} fill="none" />
      {crystals}
      {candles}
    </g>
  );
};

const Candle = ({ x, y, s }) => (
  <g>
    <Glow x={x} y={y - 18 * s} r={46 * s} opacity={0.7} />
    <rect x={x - 5 * s} y={y - 26 * s} width={10 * s} height={26 * s} rx={1.5 * s} fill="#f3ead9" />
    <ellipse cx={x} cy={y - 32 * s} rx={3 * s} ry={6 * s} fill="#ffd98a" />
  </g>
);

/* Mughal ogee arch path */
const archPath = (inset = 0) => {
  const l = 600 + inset;
  const r = 1000 - inset;
  const top = 150 + inset * 1.4;
  const spring = 430;
  return `M${l} 800 L${l} ${spring}
    C${l} ${spring - 120} ${l + 80} ${spring - 200} ${C - 40} ${top + 60}
    Q${C} ${top + 30} ${C} ${top}
    Q${C} ${top + 30} ${C + 40} ${top + 60}
    C${r - 80} ${spring - 200} ${r} ${spring - 120} ${r} ${spring} L${r} 800`;
};

const RoyalScene = () => {
  const aisleL = (t) => [C - 70 + (-300 + 70) * t, 800 + 200 * t];
  const aisleR = (t) => [C + 70 + (300 - 70) * t, 800 + 200 * t];
  const candleTs = [0.12, 0.38, 0.7];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="royal-scene" aria-hidden="true">
      <defs>
        <radialGradient id="stage" cx="0.5" cy="0.4" r="0.7">
          <stop offset="0%" stopColor="#5a1520" />
          <stop offset="55%" stopColor="#3a0d14" />
          <stop offset="100%" stopColor="#1c0508" />
        </radialGradient>
        <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ffe7b8" stopOpacity="0.9" />
          <stop offset="35%" stopColor="#f2c98a" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#f2c98a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="archFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a080d" />
          <stop offset="100%" stopColor="#4b1219" />
        </linearGradient>
        <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#14040a" />
          <stop offset="100%" stopColor="#2a0a10" />
        </linearGradient>
        <linearGradient id="aisle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d0306" />
          <stop offset="100%" stopColor="#1f070c" />
        </linearGradient>
        <pattern id="jali" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M20 4 L24 16 L36 20 L24 24 L20 36 L16 24 L4 20 L16 16 Z" fill="none" stroke={GOLD} strokeWidth="0.8" />
          <circle cx="0" cy="0" r="3" fill="none" stroke={GOLD} strokeWidth="0.6" />
          <circle cx="40" cy="40" r="3" fill="none" stroke={GOLD} strokeWidth="0.6" />
        </pattern>
        <clipPath id="archClip">
          <path d={archPath(0) + ' Z'} />
        </clipPath>
        <filter id="soft" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
        <filter id="bokeh" x="-5%" y="-20%" width="110%" height="140%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 0.9  0 0 0 0 0.8  0 0 0 0.06 0" />
        </filter>
      </defs>

      {/* Stage backdrop */}
      <rect width={W} height={H} fill="url(#stage)" />

      {/* Gold Mughal arch with jali screen */}
      <path d={archPath(0) + ' Z'} fill="url(#archFill)" />
      <rect width={W} height={H} fill="url(#jali)" opacity="0.13" clipPath="url(#archClip)" />
      <Glow x={C} y={470} r={260} opacity={0.22} />
      <path d={archPath(0)} fill="none" stroke={GOLD} strokeWidth="2.4" />
      <path d={archPath(16)} fill="none" stroke={GOLD} strokeWidth="0.9" opacity="0.7" />
      <path d={archPath(-14)} fill="none" stroke={GOLD} strokeWidth="0.7" opacity="0.45" />
      <circle cx={C} cy={128} r={6} fill={GOLD} />

      {/* Floor and reflective aisle */}
      <rect x="0" y="800" width={W} height="200" fill="url(#floor)" />
      <path d={`M${C - 70} 800 L${C + 70} 800 L${C + 300} 1000 L${C - 300} 1000 Z`} fill="url(#aisle)" />
      <g opacity="0.35" filter="url(#soft)">
        <ellipse cx={C} cy={880} rx={60} ry={110} fill="#f2c98a" opacity="0.25" />
        <ellipse cx={C - 260} cy={900} rx={40} ry={80} fill="#7a1f2b" />
        <ellipse cx={C + 260} cy={900} rx={40} ry={80} fill="#7a1f2b" />
      </g>
      <line x1="0" y1="800" x2={W} y2="800" stroke={GOLD} strokeWidth="0.8" opacity="0.4" />

      {/* Petal borders along the aisle */}
      <g>
        {Array.from({ length: 34 }).map((_, i) => {
          const t = i / 33;
          const [lx, ly] = aisleL(t);
          const [rx, ry] = aisleR(t);
          const r = 3 + t * 7;
          const col = i % 3 === 0 ? '#f6eedf' : DAHLIAS[i % DAHLIAS.length];
          return (
            <g key={i}>
              <circle cx={lx - 6} cy={ly} r={r} fill={col} />
              <circle cx={rx + 6} cy={ry} r={r} fill={col} />
            </g>
          );
        })}
      </g>

      {/* Flower walls either side */}
      <FlowerWall x0={-40} x1={560} y0={330} y1={860} seed={11} />
      <FlowerWall x0={1040} x1={1640} y0={330} y1={860} seed={29} />
      <FlowerWall x0={530} x1={650} y0={700} y1={850} seed={47} />
      <FlowerWall x0={950} x1={1070} y0={700} y1={850} seed={53} />

      {/* Candles lining the aisle */}
      {candleTs.map((t) => {
        const [lx, ly] = aisleL(t);
        const [rx, ry] = aisleR(t);
        const s = 0.8 + t * 1.2;
        return (
          <g key={t}>
            <Candle x={lx - 26 * s} y={ly + 4} s={s} />
            <Candle x={rx + 26 * s} y={ry + 4} s={s} />
          </g>
        );
      })}

      {/* Ceiling: canopy, hanging strands, chandeliers */}
      <Strands seed={7} />
      <Canopy seed={3} />
      <Chandelier x={C - 380} y={210} s={0.9} />
      <Chandelier x={C + 380} y={210} s={0.9} />
      <Chandelier x={C - 640} y={150} s={0.7} />
      <Chandelier x={C + 640} y={150} s={0.7} />
      <Chandelier x={C} y={92} s={0.75} />

      {/* Film grain + vignette */}
      <rect width={W} height={H} filter="url(#grain)" />
    </svg>
  );
};

export default RoyalScene;
