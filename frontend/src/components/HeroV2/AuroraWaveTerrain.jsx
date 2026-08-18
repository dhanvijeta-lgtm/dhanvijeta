import React from 'react';

export function AuroraWaveTerrain() {
  return (
    <div className="absolute inset-x-0 bottom-0 h-[45%] pointer-events-none z-0 overflow-hidden opacity-80">
      <svg
        className="w-[200%] h-full absolute bottom-0 left-0 animate-[drift_25s_linear_infinite] motion-reduce:animate-none"
        preserveAspectRatio="none"
        viewBox="0 0 2880 400"
      >
        <defs>
          <linearGradient id="auroraGrad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#089981" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#050b10" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="auroraGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#050b10" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="strokeGrad1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>

        {/* Wave Layer 1 (Deep Base Wave) */}
        <path
          d="M0,280 Q360,180 720,240 T1440,210 T2160,260 T2880,220 L2880,400 L0,400 Z"
          fill="url(#auroraGrad1)"
        />
        <path
          d="M0,280 Q360,180 720,240 T1440,210 T2160,260 T2880,220"
          fill="none"
          stroke="url(#strokeGrad1)"
          strokeWidth="2.5"
          opacity="0.85"
        />

        {/* Wave Layer 2 (Mid Overlay Wave) */}
        <path
          d="M0,320 Q480,220 960,270 T1920,240 T2880,290 L2880,400 L0,400 Z"
          fill="url(#auroraGrad2)"
        />
        <path
          d="M0,320 Q480,220 960,270 T1920,240 T2880,290"
          fill="none"
          stroke="#22d3ee"
          strokeWidth="1.8"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}

export default AuroraWaveTerrain;
