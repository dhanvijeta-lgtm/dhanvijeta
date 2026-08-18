import React from 'react';
import { motion } from 'framer-motion';

export function AuroraWaveTerrain() {
  return (
    <div className="absolute inset-x-0 bottom-0 h-[48%] pointer-events-none z-[1] overflow-hidden">
      <svg
        className="w-[200%] h-full absolute bottom-0 left-0 animate-drift motion-reduce:animate-none"
        preserveAspectRatio="none"
        viewBox="0 0 2880 400"
      >
        <defs>
          <linearGradient id="auroraGrad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00FF88" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#00E5FF" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#050A0F" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="auroraGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#050A0F" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="strokeGrad1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00FF88" />
            <stop offset="50%" stopColor="#00E5FF" />
            <stop offset="100%" stopColor="#FF9F00" />
          </linearGradient>
          <linearGradient id="strokeGrad2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FF9F00" />
            <stop offset="50%" stopColor="#00E5FF" />
            <stop offset="100%" stopColor="#00FF88" />
          </linearGradient>
        </defs>

        <path
          d="M0,280 Q360,180 720,240 T1440,210 T2160,260 T2880,220 L2880,400 L0,400 Z"
          fill="url(#auroraGrad1)"
        />
        <motion.path
          d="M0,280 Q360,180 720,240 T1440,210 T2160,260 T2880,220"
          fill="none"
          stroke="url(#strokeGrad1)"
          strokeWidth="2.5"
          opacity="0.9"
          strokeDasharray="8 16"
          animate={{ strokeDashoffset: [0, -48] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />

        <path
          d="M0,320 Q480,220 960,270 T1920,240 T2880,290 L2880,400 L0,400 Z"
          fill="url(#auroraGrad2)"
        />
        <motion.path
          d="M0,320 Q480,220 960,270 T1920,240 T2880,290"
          fill="none"
          stroke="#00E5FF"
          strokeWidth="1.8"
          opacity="0.65"
          strokeDasharray="6 12"
          animate={{ strokeDashoffset: [0, -36] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
        />

        <motion.path
          d="M0,350 Q600,280 1200,310 T2400,270 T2880,300"
          fill="none"
          stroke="url(#strokeGrad2)"
          strokeWidth="1.5"
          opacity="0.5"
          strokeDasharray="4 10"
          animate={{ strokeDashoffset: [0, -28] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
      </svg>
    </div>
  );
}

export default AuroraWaveTerrain;
