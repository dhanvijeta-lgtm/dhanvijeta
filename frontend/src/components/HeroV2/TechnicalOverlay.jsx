import React from 'react';
import { motion } from 'framer-motion';

export function TechnicalOverlay() {
  const priceLabels = ['25,400', '24,800', '24,200', '23,800', '23,400'];
  const timeLabels = ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30'];

  return (
    <div
      className="absolute inset-0 pointer-events-none z-[4] flex items-end justify-end pr-0 pb-[8%]"
      style={{ perspective: '1200px', perspectiveOrigin: '60% 50%' }}
    >
      <div
        className="w-[85%] sm:w-[78%] lg:w-[72%] h-[70%] origin-bottom-right"
        style={{ transform: 'rotateX(18deg) rotateY(-12deg) rotateZ(1deg)' }}
      >
        <svg className="w-full h-full overflow-visible" viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="tealGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="orangeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="goldParticleGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FF9F00" stopOpacity="0" />
              <stop offset="50%" stopColor="#FF9F00" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FFB800" stopOpacity="1" />
            </linearGradient>
          </defs>

          {priceLabels.map((price, idx) => {
            const y = 60 + idx * 95;
            return (
              <g key={price}>
                <line x1="0" y1={y} x2="1200" y2={y} stroke="#ffffff" strokeWidth="1" strokeDasharray="3 6" opacity="0.06" />
                <text x="1190" y={y - 6} fill="#64748b" fontSize="11" fontFamily="monospace" textAnchor="end" opacity="0.5">
                  {price}
                </text>
              </g>
            );
          })}

          {timeLabels.map((time, idx) => {
            const x = (idx / (timeLabels.length - 1)) * 1150 + 25;
            return (
              <g key={time}>
                <line x1={x} y1="0" x2={x} y2="460" stroke="#ffffff" strokeWidth="1" strokeDasharray="3 6" opacity="0.04" />
                <text x={x} y="485" fill="#64748b" fontSize="11" fontFamily="monospace" textAnchor="middle" opacity="0.5">
                  {time}
                </text>
              </g>
            );
          })}

          {/* Primary teal trend line — draw on load */}
          <motion.path
            d="M 10 420 Q 200 360, 400 320 T 750 190 T 1180 80"
            fill="none"
            stroke="#00E5FF"
            strokeWidth="3"
            filter="url(#tealGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.2, delay: 0.6, ease: 'easeInOut' }}
          />

          {/* Secondary orange trend line */}
          <motion.path
            d="M 10 400 Q 180 350, 380 290 T 700 220 T 1100 120"
            fill="none"
            stroke="#FF9F00"
            strokeWidth="2"
            filter="url(#orangeGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.85 }}
            transition={{ duration: 2.5, delay: 0.9, ease: 'easeInOut' }}
          />

          {/* Flowing dashed energy trail */}
          <motion.path
            d="M 10 440 Q 250 380, 450 330 T 800 210 T 1190 60"
            fill="none"
            stroke="url(#goldParticleGrad)"
            strokeWidth="2"
            strokeDasharray="6 14"
            opacity="0.8"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1, strokeDashoffset: [0, -40] }}
            transition={{
              pathLength: { duration: 2.5, delay: 1.0, ease: 'easeInOut' },
              strokeDashoffset: { duration: 2, repeat: Infinity, ease: 'linear', delay: 2.5 }
            }}
          />

          {/* Moving light particles along trend lines */}
          <motion.circle
            r="5"
            fill="#00E5FF"
            className="drop-shadow-[0_0_12px_#00E5FF] motion-reduce:hidden"
            animate={{
              cx: [20, 380, 750, 1170],
              cy: [415, 325, 195, 85],
              opacity: [0, 1, 1, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
          <motion.circle
            r="4"
            fill="#FF9F00"
            className="drop-shadow-[0_0_10px_#FF9F00] motion-reduce:hidden"
            animate={{
              cx: [50, 420, 820, 1150],
              cy: [395, 280, 160, 75],
              opacity: [0, 0.9, 0.9, 0]
            }}
            transition={{ duration: 3.5, repeat: Infinity, delay: 0.8, ease: 'linear' }}
          />
          <motion.circle
            r="3"
            fill="#00FF88"
            className="drop-shadow-[0_0_8px_#00FF88] motion-reduce:hidden"
            animate={{
              cx: [100, 520, 920, 1180],
              cy: [430, 310, 180, 65],
              opacity: [0, 0.85, 0.85, 0]
            }}
            transition={{ duration: 4.5, repeat: Infinity, delay: 1.5, ease: 'linear' }}
          />
        </svg>
      </div>
    </div>
  );
}

export default TechnicalOverlay;
