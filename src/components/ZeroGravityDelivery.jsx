import React from 'react';

/**
 * ZeroGravityDelivery
 * ─────────────────────────────────────────────────────────
 * 2D flat vector animation — anti-gravity food delivery scene
 * Colors:
 *   Background env : Muted Sage Grey   #A5A79B
 *   UI / highlights: Warm Cream Beige  #E8D2B5
 *   Accent clothing: Deep Burgundy     #590907
 *
 * Props:
 *   width  – SVG width  (default "100%")
 *   height – SVG height (default 420)
 *   className – extra Tailwind classes
 */
export default function ZeroGravityDelivery({ width = '100%', height = 420, className = '' }) {
  return (
    <>
      {/* ── Keyframe styles scoped to this component ── */}
      <style>{`
        /* Rider body — slow weightless drift */
        @keyframes riderFloat {
          0%,100% { transform: translateY(0px) rotate(-1deg); }
          25%      { transform: translateY(-14px) rotate(1.5deg); }
          50%      { transform: translateY(-8px) rotate(0.5deg); }
          75%      { transform: translateY(-18px) rotate(-2deg); }
        }
        /* Hair / scarf subtle sway */
        @keyframes scarfSway {
          0%,100% { transform: rotate(0deg); }
          50%      { transform: rotate(8deg); }
        }
        /* Individual food item drifts */
        @keyframes foodFloat1 {
          0%,100% { transform: translate(0px, 0px) rotate(0deg); }
          30%      { transform: translate(6px, -20px) rotate(8deg); }
          60%      { transform: translate(-4px, -10px) rotate(-5deg); }
          80%      { transform: translate(8px, -24px) rotate(12deg); }
        }
        @keyframes foodFloat2 {
          0%,100% { transform: translate(0px, 0px) rotate(0deg); }
          25%      { transform: translate(-8px, -18px) rotate(-10deg); }
          55%      { transform: translate(5px, -26px) rotate(6deg); }
          80%      { transform: translate(-3px, -12px) rotate(-3deg); }
        }
        @keyframes foodFloat3 {
          0%,100% { transform: translate(0px, 0px) rotate(0deg); }
          20%      { transform: translate(10px, -15px) rotate(14deg); }
          50%      { transform: translate(-6px, -28px) rotate(-8deg); }
          75%      { transform: translate(4px, -18px) rotate(5deg); }
        }
        @keyframes foodFloat4 {
          0%,100% { transform: translate(0px, 0px) rotate(0deg); }
          35%      { transform: translate(-10px, -22px) rotate(-12deg); }
          65%      { transform: translate(7px, -14px) rotate(9deg); }
          85%      { transform: translate(-5px, -30px) rotate(-6deg); }
        }
        @keyframes foodFloat5 {
          0%,100% { transform: translate(0px, 0px) rotate(0deg); }
          40%      { transform: translate(12px, -20px) rotate(16deg); }
          70%      { transform: translate(-8px, -10px) rotate(-10deg); }
        }
        /* Bag burst — box jiggles */
        @keyframes bagJiggle {
          0%,100% { transform: rotate(-3deg) scale(1); }
          25%      { transform: rotate(3deg) scale(1.03); }
          50%      { transform: rotate(-2deg) scale(0.98); }
          75%      { transform: rotate(4deg) scale(1.02); }
        }
        /* Legs pedal */
        @keyframes legLeft {
          0%,100% { transform: rotate(0deg); }
          50%      { transform: rotate(18deg); }
        }
        @keyframes legRight {
          0%,100% { transform: rotate(0deg); }
          50%      { transform: rotate(-18deg); }
        }
        /* Arm wave */
        @keyframes armWave {
          0%,100% { transform: rotate(0deg); }
          50%      { transform: rotate(-20deg); }
        }
        /* Buildings parallax scroll */
        @keyframes buildingsDrift {
          0%   { transform: translateX(0px); }
          100% { transform: translateX(-120px); }
        }
        /* Stars / particles */
        @keyframes starTwinkle {
          0%,100% { opacity: 0.2; transform: scale(0.8); }
          50%      { opacity: 0.9; transform: scale(1.4); }
        }
        /* Halo pulse around rider */
        @keyframes haloPulse {
          0%,100% { opacity: 0.1; r: 68; }
          50%      { opacity: 0.22; r: 76; }
        }
        /* Scroll the whole scene horizontally */
        @keyframes sceneScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-220px); }
        }
        /* Clouds drift */
        @keyframes cloudDrift1 {
          0%   { transform: translateX(0px); }
          100% { transform: translateX(-360px); }
        }
        @keyframes cloudDrift2 {
          0%   { transform: translateX(0px); }
          100% { transform: translateX(-280px); }
        }

        .rider-body { animation: riderFloat 4.8s ease-in-out infinite; transform-origin: center center; }
        .food-1     { animation: foodFloat1 5.2s ease-in-out infinite; transform-origin: center center; }
        .food-2     { animation: foodFloat2 4.4s ease-in-out infinite 0.6s; transform-origin: center center; }
        .food-3     { animation: foodFloat3 6.1s ease-in-out infinite 1.1s; transform-origin: center center; }
        .food-4     { animation: foodFloat4 5.7s ease-in-out infinite 0.3s; transform-origin: center center; }
        .food-5     { animation: foodFloat5 4.9s ease-in-out infinite 1.8s; transform-origin: center center; }
        .bag        { animation: bagJiggle  3.8s ease-in-out infinite; transform-origin: center bottom; }
        .leg-left   { animation: legLeft    1.4s ease-in-out infinite; transform-origin: 50% 0%; }
        .leg-right  { animation: legRight   1.4s ease-in-out infinite; transform-origin: 50% 0%; }
        .arm-wave   { animation: armWave    2.6s ease-in-out infinite; transform-origin: 100% 0%; }
        .scarf      { animation: scarfSway  3s ease-in-out infinite; transform-origin: 0% 0%; }
        .star-1     { animation: starTwinkle 2.1s ease-in-out infinite; }
        .star-2     { animation: starTwinkle 3.3s ease-in-out infinite 0.7s; }
        .star-3     { animation: starTwinkle 2.7s ease-in-out infinite 1.4s; }
        .star-4     { animation: starTwinkle 1.9s ease-in-out infinite 0.4s; }
        .star-5     { animation: starTwinkle 3.8s ease-in-out infinite 1.1s; }
        .halo       { animation: haloPulse  3.5s ease-in-out infinite; }
        .buildings  { animation: buildingsDrift 18s linear infinite; }
        .cloud-1    { animation: cloudDrift1 24s linear infinite; }
        .cloud-2    { animation: cloudDrift2 32s linear infinite 4s; }
      `}</style>

      <svg
        width={width}
        height={height}
        viewBox="0 0 900 420"
        xmlns="http://www.w3.org/2000/svg"
        className={`block select-none ${className}`}
        aria-label="Anti-gravity food delivery animation"
        role="img"
      >
        <defs>
          {/* Sky gradient */}
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#C4C6BB" />
            <stop offset="100%" stopColor="#A5A79B" />
          </linearGradient>
          {/* Ground strip */}
          <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#8E9085" />
            <stop offset="100%" stopColor="#6B6D63" />
          </linearGradient>
          {/* Rider skin */}
          <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#F2C89D" />
            <stop offset="100%" stopColor="#E8A87C" />
          </linearGradient>
          {/* Bag gradient */}
          <linearGradient id="bagGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#6B0A08" />
            <stop offset="100%" stopColor="#590907" />
          </linearGradient>
          {/* Halo glow */}
          <radialGradient id="haloGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#E8D2B5" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#E8D2B5" stopOpacity="0" />
          </radialGradient>
          {/* Cream gradient */}
          <linearGradient id="creamGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#F0DECA" />
            <stop offset="100%" stopColor="#E8D2B5" />
          </linearGradient>
          {/* Shadow */}
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.15" />
          </filter>
          {/* Clip scene */}
          <clipPath id="sceneClip">
            <rect width="900" height="420" />
          </clipPath>
        </defs>

        <g clipPath="url(#sceneClip)">
          {/* ══════════════════════════════════════════════
              BACKGROUND — sky
          ══════════════════════════════════════════════ */}
          <rect width="900" height="420" fill="url(#skyGrad)" />

          {/* Subtle horizontal speed lines */}
          {[60, 110, 170, 220, 280, 340].map((y, i) => (
            <line key={i} x1="0" y1={y} x2="900" y2={y}
              stroke="#B8BAB0" strokeWidth={i % 2 === 0 ? 1 : 0.5} strokeDasharray="40 20" opacity="0.4" />
          ))}

          {/* ══════════════════════════════════════════════
              CLOUDS (parallax scrolling)
          ══════════════════════════════════════════════ */}
          <g className="cloud-1" opacity="0.55">
            {/* Cloud set 1 */}
            {[0, 460, 920].map((offset, ci) => (
              <g key={ci} transform={`translate(${offset}, 0)`}>
                <ellipse cx="130" cy="80" rx="55" ry="22" fill="#D8DAD0" />
                <ellipse cx="160" cy="72" rx="38" ry="18" fill="#DDDFD5" />
                <ellipse cx="105" cy="76" rx="32" ry="16" fill="#D5D7CD" />
                <ellipse cx="650" cy="55" rx="45" ry="18" fill="#D8DAD0" />
                <ellipse cx="678" cy="47" rx="30" ry="15" fill="#DDDFD5" />
              </g>
            ))}
          </g>
          <g className="cloud-2" opacity="0.35">
            {[0, 520].map((offset, ci) => (
              <g key={ci} transform={`translate(${offset}, 0)`}>
                <ellipse cx="380" cy="100" rx="40" ry="16" fill="#CFD1C8" />
                <ellipse cx="405" cy="93"  rx="27" ry="13" fill="#D4D6CD" />
              </g>
            ))}
          </g>

          {/* ══════════════════════════════════════════════
              BUILDINGS (looping parallax)
          ══════════════════════════════════════════════ */}
          <g className="buildings">
            {/* Building set A */}
            <g opacity="0.7">
              {/* Far building 1 */}
              <rect x="10"  y="200" width="60" height="200" rx="4" fill="#8E9085" />
              <rect x="10"  y="200" width="60" height="8"   rx="2" fill="#7B7D73" />
              {[210, 230, 250, 270, 290, 310, 330, 350].map((wy, wi) => (
                <g key={wi}>
                  <rect x="18"  y={wy} width="10" height="12" rx="1" fill="#E8D2B5" opacity={wi % 3 === 0 ? 0.9 : 0.4} />
                  <rect x="34"  y={wy} width="10" height="12" rx="1" fill="#E8D2B5" opacity={wi % 3 === 1 ? 0.9 : 0.4} />
                  <rect x="50"  y={wy} width="10" height="12" rx="1" fill="#E8D2B5" opacity={wi % 3 === 2 ? 0.9 : 0.4} />
                </g>
              ))}
              {/* Far building 2 */}
              <rect x="80"  y="160" width="80" height="240" rx="4" fill="#969890" />
              <rect x="80"  y="160" width="80" height="8"   rx="2" fill="#848680" />
              {[172, 192, 212, 232, 252, 272, 292, 312, 332, 352].map((wy, wi) => (
                <g key={wi}>
                  <rect x="88"  y={wy} width="12" height="12" rx="1" fill="#E8D2B5" opacity={wi % 2 === 0 ? 0.8 : 0.3} />
                  <rect x="106" y={wy} width="12" height="12" rx="1" fill="#E8D2B5" opacity={wi % 2 === 1 ? 0.8 : 0.3} />
                  <rect x="124" y={wy} width="12" height="12" rx="1" fill="#E8D2B5" opacity={wi % 3 === 0 ? 0.8 : 0.3} />
                  <rect x="140" y={wy} width="12" height="12" rx="1" fill="#E8D2B5" opacity={wi % 3 === 1 ? 0.8 : 0.3} />
                </g>
              ))}
              {/* Tall thin building */}
              <rect x="170" y="130" width="40" height="270" rx="3" fill="#9A9C94" />
              <rect x="170" y="130" width="40" height="8"   rx="2" fill="#888A82" />
              <rect x="183" y="118" width="14" height="16"  rx="2" fill="#8E9085" />
              <rect x="188" y="108" width="4"  height="12"  rx="1" fill="#7B7D73" />
              {[142, 162, 182, 202, 222, 242, 262, 282, 302, 322, 342, 362].map((wy, wi) => (
                <g key={wi}>
                  <rect x="176" y={wy} width="8"  height="10" rx="1" fill="#E8D2B5" opacity={wi % 2 === 0 ? 0.9 : 0.35} />
                  <rect x="190" y={wy} width="8"  height="10" rx="1" fill="#E8D2B5" opacity={wi % 2 === 1 ? 0.9 : 0.35} />
                </g>
              ))}
              {/* Wide low building */}
              <rect x="220" y="240" width="120" height="160" rx="4" fill="#888A82" />
              <rect x="220" y="240" width="120" height="8"   rx="2" fill="#76786F" />
              {[252, 272, 292, 312, 332, 352].map((wy, wi) => (
                <g key={wi}>
                  {[228, 248, 268, 288, 308, 316].map((wx, xi) => (
                    <rect key={xi} x={wx} y={wy} width="12" height="12" rx="1"
                      fill="#E8D2B5" opacity={(wi + xi) % 3 === 0 ? 0.85 : 0.3} />
                  ))}
                </g>
              ))}
              {/* Building 5 */}
              <rect x="350" y="190" width="70" height="210" rx="4" fill="#929489" />
              {[202, 222, 242, 262, 282, 302, 322, 342, 362].map((wy, wi) => (
                <g key={wi}>
                  <rect x="358" y={wy} width="11" height="12" rx="1" fill="#E8D2B5" opacity={wi % 2 === 0 ? 0.8 : 0.3} />
                  <rect x="376" y={wy} width="11" height="12" rx="1" fill="#E8D2B5" opacity={wi % 2 === 1 ? 0.8 : 0.3} />
                  <rect x="394" y={wy} width="11" height="12" rx="1" fill="#E8D2B5" opacity={wi % 3 === 0 ? 0.8 : 0.3} />
                </g>
              ))}
              {/* Building 6 */}
              <rect x="430" y="170" width="55" height="230" rx="4" fill="#9C9E96" />
              {[182, 202, 222, 242, 262, 282, 302, 322, 342, 362].map((wy, wi) => (
                <g key={wi}>
                  <rect x="438" y={wy} width="10" height="12" rx="1" fill="#E8D2B5" opacity={wi % 2 === 0 ? 0.75 : 0.3} />
                  <rect x="454" y={wy} width="10" height="12" rx="1" fill="#E8D2B5" opacity={wi % 2 === 1 ? 0.75 : 0.3} />
                  <rect x="468" y={wy} width="10" height="12" rx="1" fill="#E8D2B5" opacity={wi % 3 === 0 ? 0.75 : 0.3} />
                </g>
              ))}
              {/* Building 7 */}
              <rect x="495" y="210" width="90" height="210" rx="4" fill="#888A82" />
              {[222, 242, 262, 282, 302, 322, 342, 362].map((wy, wi) => (
                <g key={wi}>
                  {[503, 522, 541, 560].map((wx, xi) => (
                    <rect key={xi} x={wx} y={wy} width="11" height="12" rx="1"
                      fill="#E8D2B5" opacity={(wi + xi) % 3 === 0 ? 0.8 : 0.3} />
                  ))}
                </g>
              ))}
              {/* Building 8 */}
              <rect x="595" y="150" width="50" height="270" rx="3" fill="#9E9F97" />
              <rect x="608" y="138" width="24" height="16"  rx="2" fill="#8C8D86" />
              <rect x="618" y="128" width="4"  height="14"  rx="1" fill="#7B7C74" />
              {[162, 182, 202, 222, 242, 262, 282, 302, 322, 342, 362].map((wy, wi) => (
                <g key={wi}>
                  <rect x="602" y={wy} width="9" height="11" rx="1" fill="#E8D2B5" opacity={wi % 2 === 0 ? 0.85 : 0.35} />
                  <rect x="617" y={wy} width="9" height="11" rx="1" fill="#E8D2B5" opacity={wi % 2 === 1 ? 0.85 : 0.35} />
                  <rect x="630" y={wy} width="9" height="11" rx="1" fill="#E8D2B5" opacity={wi % 3 === 0 ? 0.85 : 0.35} />
                </g>
              ))}
              {/* Building 9 */}
              <rect x="655" y="220" width="100" height="200" rx="4" fill="#848680" />
              {[232, 252, 272, 292, 312, 332, 352].map((wy, wi) => (
                <g key={wi}>
                  {[663, 682, 701, 720, 737].map((wx, xi) => (
                    <rect key={xi} x={wx} y={wy} width="11" height="12" rx="1"
                      fill="#E8D2B5" opacity={(wi + xi) % 3 === 0 ? 0.75 : 0.28} />
                  ))}
                </g>
              ))}
              {/* Building 10 */}
              <rect x="765" y="180" width="65" height="240" rx="4" fill="#969890" />
              {[192, 212, 232, 252, 272, 292, 312, 332, 352].map((wy, wi) => (
                <g key={wi}>
                  <rect x="773" y={wy} width="11" height="12" rx="1" fill="#E8D2B5" opacity={wi % 2 === 0 ? 0.8 : 0.3} />
                  <rect x="790" y={wy} width="11" height="12" rx="1" fill="#E8D2B5" opacity={wi % 2 === 1 ? 0.8 : 0.3} />
                  <rect x="807" y={wy} width="11" height="12" rx="1" fill="#E8D2B5" opacity={wi % 3 === 0 ? 0.8 : 0.3} />
                </g>
              ))}
              {/* Building 11 */}
              <rect x="840" y="200" width="80" height="220" rx="4" fill="#8C8E86" />
              {[212, 232, 252, 272, 292, 312, 332, 352].map((wy, wi) => (
                <g key={wi}>
                  {[848, 867, 886].map((wx, xi) => (
                    <rect key={xi} x={wx} y={wy} width="11" height="12" rx="1"
                      fill="#E8D2B5" opacity={(wi + xi) % 3 === 0 ? 0.8 : 0.3} />
                  ))}
                </g>
              ))}
            </g>
          </g>

          {/* ══════════════════════════════════════════════
              GROUND STRIP
          ══════════════════════════════════════════════ */}
          <rect x="0" y="380" width="900" height="40" fill="url(#groundGrad)" />
          {/* Road markings */}
          <rect x="0" y="386" width="900" height="3" fill="#7B7D73" opacity="0.6" />
          {[0, 60, 120, 180, 240, 300, 360, 420, 480, 540, 600, 660, 720, 780, 840].map((x, i) => (
            <rect key={i} x={x} y="392" width="40" height="4" rx="2"
              fill="#E8D2B5" opacity="0.35" />
          ))}

          {/* ══════════════════════════════════════════════
              TWINKLING PARTICLES / STARS
          ══════════════════════════════════════════════ */}
          <circle className="star-1" cx="80"  cy="55"  r="3" fill="#E8D2B5" />
          <circle className="star-2" cx="220" cy="38"  r="2" fill="#E8D2B5" />
          <circle className="star-3" cx="490" cy="65"  r="2.5" fill="#E8D2B5" />
          <circle className="star-4" cx="720" cy="42"  r="2" fill="#E8D2B5" />
          <circle className="star-5" cx="840" cy="70"  r="3" fill="#E8D2B5" />
          <circle className="star-1" cx="310" cy="90"  r="1.5" fill="#D4A88A" opacity="0.7" />
          <circle className="star-3" cx="600" cy="35"  r="2" fill="#D4A88A" opacity="0.7" />

          {/* ══════════════════════════════════════════════
              FLOATING FOOD ITEMS (scattered)
          ══════════════════════════════════════════════ */}

          {/* BURGER — left float zone */}
          <g className="food-1" transform="translate(140, 170)">
            <g filter="url(#softShadow)">
              {/* Bun top */}
              <ellipse cx="0" cy="-28" rx="22" ry="12" fill="#C8842A" />
              <ellipse cx="0" cy="-36" rx="22" ry="6" fill="#D4902E" />
              {/* Sesame seeds */}
              <ellipse cx="-8"  cy="-38" rx="3" ry="1.5" fill="#E8A030" />
              <ellipse cx="6"   cy="-39" rx="3" ry="1.5" fill="#E8A030" />
              <ellipse cx="0"   cy="-41" rx="2.5" ry="1.2" fill="#E8A030" />
              {/* Patty */}
              <rect x="-22" y="-22" width="44" height="8" rx="2" fill="#6B3A1F" />
              {/* Cheese */}
              <path d="M-22,-22 L22,-22 L24,-14 L-24,-14 Z" fill="#FFB930" />
              {/* Lettuce */}
              <path d="M-24,-14 Q-18,-10 -12,-14 Q-6,-10 0,-14 Q6,-10 12,-14 Q18,-10 24,-14 L24,-12 Q18,-8 12,-12 Q6,-8 0,-12 Q-6,-8 -12,-12 Q-18,-8 -24,-12 Z" fill="#5A8A3C" />
              {/* Bun bottom */}
              <ellipse cx="0" cy="-8" rx="23" ry="8" fill="#C8842A" />
            </g>
          </g>

          {/* PIZZA SLICE — upper right */}
          <g className="food-2" transform="translate(730, 130)">
            <g filter="url(#softShadow)">
              {/* Crust */}
              <path d="M0,0 L-30,55 L30,55 Z" fill="#D4902E" />
              <path d="M-28,52 Q0,62 28,52 L30,55 L-30,55 Z" fill="#C07820" />
              {/* Sauce */}
              <path d="M0,4 L-26,50 L26,50 Z" fill="#C0391A" />
              {/* Cheese */}
              <path d="M0,6 L-24,48 L24,48 Z" fill="#F2D060" />
              {/* Toppings (pepperoni) */}
              <circle cx="0"  cy="30" r="5" fill="#A82010" />
              <circle cx="-10" cy="42" r="4" fill="#A82010" />
              <circle cx="10" cy="42" r="4" fill="#A82010" />
              {/* Mozzarella blobs */}
              <circle cx="-5"  cy="22" r="3" fill="#FAEEA0" />
              <circle cx="8"   cy="34" r="3" fill="#FAEEA0" />
            </g>
          </g>

          {/* DELIVERY BOX — upper mid */}
          <g className="food-3" transform="translate(390, 100)">
            <g filter="url(#softShadow)">
              {/* Box body */}
              <rect x="-22" y="-20" width="44" height="38" rx="4" fill="url(#creamGrad)" />
              {/* Box lid */}
              <rect x="-24" y="-28" width="48" height="12" rx="4" fill="#E8D2B5" />
              <rect x="-24" y="-28" width="48" height="6"  rx="4" fill="#F0DECA" />
              {/* Ribbon V */}
              <rect x="-2" y="-28" width="4" height="50" rx="2" fill="#590907" />
              <rect x="-24" y="-4" width="48" height="4" rx="2" fill="#590907" />
              {/* Bow */}
              <path d="M-12,-28 Q-6,-38 0,-28 Q6,-38 12,-28" stroke="#590907" strokeWidth="3" fill="none" strokeLinecap="round" />
              {/* Logo dot */}
              <circle cx="0" cy="-28" r="4" fill="#590907" />
              <circle cx="0" cy="-28" r="2" fill="#E8D2B5" />
            </g>
          </g>

          {/* COFFEE CUP — lower left float */}
          <g className="food-4" transform="translate(195, 290)">
            <g filter="url(#softShadow)">
              {/* Cup body */}
              <path d="M-14,-10 L-16,24 Q-16,30 -8,30 L8,30 Q16,30 16,24 L14,-10 Z" fill="#E8D2B5" />
              {/* Sleeve */}
              <path d="M-13,-2 L-15,22 L15,22 L13,-2 Z" fill="#590907" opacity="0.8" />
              {/* Lid */}
              <ellipse cx="0" cy="-10" rx="15" ry="5" fill="#D0BCA0" />
              <rect x="-4" cy="-14" width="8" height="6" rx="2" fill="#D0BCA0" y="-15" />
              {/* Steam */}
              <path d="M-4,-16 Q-6,-22 -4,-28 Q-2,-34 -4,-40" stroke="#C4C6BB" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
              <path d="M4,-16 Q6,-22 4,-28 Q2,-34 4,-40"  stroke="#C4C6BB" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
            </g>
          </g>

          {/* FRIES BOX — right float */}
          <g className="food-5" transform="translate(820, 220)">
            <g filter="url(#softShadow)">
              {/* Box */}
              <path d="M-16,0 L-20,32 L20,32 L16,0 Z" fill="#E8302A" />
              <path d="M-16,0 L16,0 L14,-6 L-14,-6 Z" fill="#C0251F" />
              {/* Fries */}
              <rect x="-10" y="-28" width="4" height="32" rx="2" fill="#FFD060" />
              <rect x="-3"  y="-34" width="4" height="38" rx="2" fill="#FFDA70" />
              <rect x="4"   y="-30" width="4" height="34" rx="2" fill="#FFD060" />
              <rect x="11"  y="-26" width="4" height="30" rx="2" fill="#FFDA70" />
              {/* Arch logo */}
              <text x="-7" y="24" fontFamily="Arial" fontWeight="900" fontSize="16" fill="#FFD060" letterSpacing="0">B</text>
            </g>
          </g>

          {/* ══════════════════════════════════════════════
              RIDER — center stage
          ══════════════════════════════════════════════ */}
          <g className="rider-body" transform="translate(445, 220)">

            {/* Halo glow */}
            <circle className="halo" cx="0" cy="0" r="68" fill="url(#haloGrad)" />

            {/* ── LEGS ── */}
            {/* Left leg */}
            <g className="leg-left" transform="translate(-10, 55)">
              <rect x="-7" y="0" width="14" height="40" rx="7" fill="#590907" />
              {/* Shoe */}
              <ellipse cx="-7" cy="40" rx="12" ry="6" fill="#2A2A2A" />
              <ellipse cx="-4" cy="38" rx="8"  ry="4"  fill="#3A3A3A" />
            </g>
            {/* Right leg */}
            <g className="leg-right" transform="translate(10, 55)">
              <rect x="-7" y="0" width="14" height="40" rx="7" fill="#590907" />
              {/* Shoe */}
              <ellipse cx="7" cy="40" rx="12" ry="6" fill="#2A2A2A" />
              <ellipse cx="4" cy="38" rx="8"  ry="4"  fill="#3A3A3A" />
            </g>

            {/* ── BODY — jacket ── */}
            {/* Torso */}
            <rect x="-24" y="-10" width="48" height="62" rx="10" fill="#590907" />
            {/* Jacket lapels */}
            <path d="M-24,-10 L-10,20 L0,10 L10,20 L24,-10 Z" fill="#6B0A08" opacity="0.6" />
            {/* Logo badge on chest */}
            <circle cx="0" cy="10" r="8" fill="#E8D2B5" opacity="0.9" />
            <text x="0" y="14" fontFamily="Arial" fontWeight="900" fontSize="9" fill="#590907" textAnchor="middle">BB</text>
            {/* Jacket hem */}
            <rect x="-24" y="48" width="48" height="6" rx="3" fill="#490705" />

            {/* ── DELIVERY BAG (back) ── */}
            <g className="bag" transform="translate(28, -20)">
              {/* Bag body */}
              <rect x="0" y="0" width="48" height="56" rx="8" fill="url(#bagGrad)" />
              {/* Bag top flap */}
              <rect x="-2" y="-6" width="52" height="14" rx="6" fill="#6B0A08" />
              {/* Straps */}
              <rect x="6"  y="0" width="6" height="56" rx="3" fill="#490705" opacity="0.5" />
              <rect x="36" y="0" width="6" height="56" rx="3" fill="#490705" opacity="0.5" />
              {/* Bag clasp */}
              <rect x="17" y="-3" width="14" height="10" rx="3" fill="#E8D2B5" opacity="0.9" />
              <circle cx="24" cy="2" r="3" fill="#A5A79B" />
              {/* BiteBeam icon on bag */}
              <text x="24" y="38" fontFamily="Arial" fontWeight="900" fontSize="13" fill="#E8D2B5" textAnchor="middle" opacity="0.9">🍔</text>
              {/* Reflective stripe */}
              <rect x="0" y="30" width="48" height="5" rx="2" fill="#E8D2B5" opacity="0.25" />
              {/* Bag shadow side */}
              <rect x="40" y="0" width="8"  height="56" rx="4" fill="#350504" opacity="0.4" />
            </g>

            {/* ── ARM LEFT (waving) ── */}
            <g className="arm-wave" transform="translate(-24, 0)">
              {/* Upper arm */}
              <rect x="-12" y="0" width="14" height="30" rx="7" fill="#590907" />
              {/* Forearm */}
              <rect x="-14" y="26" width="14" height="26" rx="7" fill="url(#skinGrad)" transform="rotate(20, -7, 26)" />
              {/* Hand */}
              <ellipse cx="-14" cy="52" rx="8" ry="7" fill="url(#skinGrad)" transform="rotate(20, -7, 26)" />
              {/* Finger wave */}
              <ellipse cx="-6"  cy="56" rx="4" ry="6" fill="#F2C89D" transform="rotate(20, -7, 26)" />
            </g>

            {/* ── ARM RIGHT (holding bag strap) ── */}
            <g transform="translate(24, 4)">
              <rect x="-2" y="0" width="14" height="28" rx="7" fill="#590907" />
              <rect x="0"  y="24" width="12" height="22" rx="6" fill="url(#skinGrad)" />
            </g>

            {/* ── HEAD ── */}
            {/* Neck */}
            <rect x="-8" y="-28" width="16" height="20" rx="8" fill="url(#skinGrad)" />
            {/* Head */}
            <ellipse cx="0" cy="-52" rx="28" ry="30" fill="url(#skinGrad)" />
            {/* Hair */}
            <path d="M-28,-60 Q-20,-90 0,-88 Q20,-90 28,-60 Q22,-50 0,-50 Q-22,-50 -28,-60 Z"
              fill="#2A1A0A" />
            {/* Helmet */}
            <path d="M-28,-60 Q-30,-80 0,-82 Q30,-80 28,-60 L24,-58 Q22,-76 0,-78 Q-22,-76 -24,-58 Z"
              fill="#590907" />
            {/* Helmet visor */}
            <path d="M-24,-58 Q-14,-52 0,-52 Q14,-52 24,-58 L22,-62 Q12,-56 0,-56 Q-12,-56 -22,-62 Z"
              fill="#E8D2B5" opacity="0.9" />
            {/* Visor tint */}
            <path d="M-20,-58 Q-10,-53 0,-53 Q10,-53 20,-58 L18,-61 Q10,-57 0,-57 Q-10,-57 -18,-61 Z"
              fill="#A5A79B" opacity="0.5" />

            {/* Face — eyes */}
            <ellipse cx="-9"  cy="-52" rx="4" ry="4.5" fill="white" />
            <ellipse cx="9"   cy="-52" rx="4" ry="4.5" fill="white" />
            <circle  cx="-8"  cy="-51" r="2.5" fill="#2A1A0A" />
            <circle  cx="10"  cy="-51" r="2.5" fill="#2A1A0A" />
            {/* Eye shine */}
            <circle  cx="-7"  cy="-53" r="1"   fill="white" />
            <circle  cx="11"  cy="-53" r="1"   fill="white" />
            {/* Smile */}
            <path d="M-8,-42 Q0,-36 8,-42" stroke="#C07040" strokeWidth="2" fill="none" strokeLinecap="round" />

            {/* Scarf */}
            <g className="scarf" transform="translate(-8, -32)">
              <path d="M0,0 Q8,4 16,0 L18,8 Q10,12 0,8 Z" fill="#590907" opacity="0.9" />
              <path d="M16,0 L28,16 Q24,20 20,16 L10,4 Z" fill="#6B0A08" />
            </g>

            {/* Speed lines behind rider */}
            <line x1="-80" y1="-10" x2="-50" y2="-10" stroke="#E8D2B5" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            <line x1="-90" y1="10"  x2="-55" y2="10"  stroke="#E8D2B5" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
            <line x1="-75" y1="30"  x2="-48" y2="30"  stroke="#E8D2B5" strokeWidth="1"   strokeLinecap="round" opacity="0.25" />
          </g>

          {/* ══════════════════════════════════════════════
              GROUND SHADOW (soft ellipse under rider)
          ══════════════════════════════════════════════ */}
          <ellipse cx="468" cy="378" rx="55" ry="8" fill="#000" opacity="0.12" />
        </g>
      </svg>
    </>
  );
}
