import React from 'react';
import { motion } from 'framer-motion';

export function TechnicalOverlay() {
  const priceLabels = ['25,400', '24,800', '24,200', '23,800', '23,400'];
  const timeLabels = ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30'];

  return (
    <div className="absolute inset-0 pointer-events-none z-2 flex items-center justify-center">
      <svg className="w-full h-full max-w-7xl px-4 overflow-visible" viewBox="0 0 1200 500" preserveAspectRatio="none">
        <defs>
          <filter id="tealGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="goldParticleGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0" />
            <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Faint Horizontal Price Grid Lines */}
        {priceLabels.map((price, idx) => {
          const y = 60 + idx * 95;
          return (
            <g key={price}>
              <line x1="0" y1={y} x2="1200" y2={y} stroke="#ffffff" strokeWidth="1" strokeDasharray="3 6" opacity="0.08" />
              <text x="1190" y={y - 6} fill="#64748b" fontSize="11" fontFamily="monospace" textAnchor="end" opacity="0.6">
                {price}
              </text>
            </g>
          );
        })}

        {/* Faint Vertical Time Grid Lines */}
        {timeLabels.map((time, idx) => {
          const x = (idx / (timeLabels.length - 1)) * 1150 + 25;
          return (
            <g key={time}>
              <line x1={x} y1="0" x2={x} y2="460" stroke="#ffffff" strokeWidth="1" strokeDasharray="3 6" opacity="0.06" />
              <text x={x} y="485" fill="#64748b" fontSize="11" fontFamily="monospace" textAnchor="middle" opacity="0.6">
                {time}
              </text>
            </g>
          );
        })}

        {/* Glowing Teal Price Spline Line */}
        <motion.path
          d="M 10 420 Q 200 360, 400 320 T 750 190 T 1180 80"
          fill="none"
          stroke="#22d3ee"
          strokeWidth="3"
          filter="url(#tealGlow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.2, delay: 0.5, ease: 'easeInOut' }}
        />

        {/* Gold/Amber Sweeping Particle Trail */}
        <motion.path
          d="M 10 440 Q 250 380, 450 330 T 800 210 T 1190 60"
          fill="none"
          stroke="url(#goldParticleGrad)"
          strokeWidth="2"
          strokeDasharray="6 12"
          opacity="0.75"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, delay: 0.8, ease: 'easeInOut' }}
        />

        {/* 4 Sweeping Gold Particle Dots along Trail */}
        <motion.circle
          r="4"
          fill="#fbbf24"
          className="drop-shadow-[0_0_10px_#fbbf24] motion-reduce:hidden"
          animate={{
            cx: [20, 380, 750, 1170],
            cy: [435, 340, 195, 70],
            opacity: [0, 1, 1, 0]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
        <motion.circle
          r="3"
          fill="#22d3ee"
          className="drop-shadow-[0_0_8px_#22d3ee] motion-reduce:hidden"
          animate={{
            cx: [100, 520, 920, 1180],
            cy: [400, 290, 140, 60],
            opacity: [0, 0.9, 0.9, 0]
          }}
          transition={{ duration: 4.5, repeat: Infinity, delay: 1.2, ease: 'linear' }}
        />
      </svg>
    </div>
  );
}

export default TechnicalOverlay;
