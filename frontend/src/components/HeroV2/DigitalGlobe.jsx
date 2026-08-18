import React from 'react';

export function DigitalGlobe() {
  return (
    <div className="absolute -top-12 -left-12 w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] pointer-events-none z-0 opacity-25">
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full animate-[spin_60s_linear_infinite] motion-reduce:animate-none"
        style={{ transformOrigin: 'center center' }}
      >
        <defs>
          <radialGradient id="globeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#22d3ee" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Glow */}
        <circle cx="200" cy="200" r="180" fill="url(#globeGlow)" />

        {/* Latitude Circles */}
        <circle cx="200" cy="200" r="170" fill="none" stroke="#22d3ee" strokeWidth="1" strokeDasharray="3 4" opacity="0.6" />
        <ellipse cx="200" cy="200" rx="170" ry="120" fill="none" stroke="#22d3ee" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
        <ellipse cx="200" cy="200" rx="170" ry="70" fill="none" stroke="#22d3ee" strokeWidth="1" strokeDasharray="4 6" opacity="0.4" />
        <ellipse cx="200" cy="200" rx="170" ry="20" fill="none" stroke="#22d3ee" strokeWidth="1" opacity="0.3" />

        {/* Longitude Meridians */}
        <ellipse cx="200" cy="200" rx="120" ry="170" fill="none" stroke="#22d3ee" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
        <ellipse cx="200" cy="200" rx="70" ry="170" fill="none" stroke="#22d3ee" strokeWidth="1" strokeDasharray="4 6" opacity="0.4" />
        <line x1="200" y1="30" x2="200" y2="370" stroke="#22d3ee" strokeWidth="1.5" opacity="0.5" />
        <line x1="30" y1="200" x2="370" y2="200" stroke="#22d3ee" strokeWidth="1.5" opacity="0.5" />

        {/* Dotted Nodes */}
        <circle cx="120" cy="140" r="2.5" fill="#22d3ee" />
        <circle cx="280" cy="160" r="3" fill="#22d3ee" />
        <circle cx="210" cy="90" r="2" fill="#fbbf24" />
        <circle cx="160" cy="260" r="2.5" fill="#22c55e" />
        <circle cx="250" cy="270" r="2" fill="#22d3ee" />
      </svg>
    </div>
  );
}

export default DigitalGlobe;
