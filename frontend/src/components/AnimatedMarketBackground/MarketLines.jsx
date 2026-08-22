import React from 'react';

export function MarketLines({ variant = 'home' }) {
  // Determine gradient stroke based on variant
  const getGradientStops = () => {
    switch (variant) {
      case 'courses':
        return (
          <>
            <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
          </>
        );
      case 'demo':
        return (
          <>
            <stop offset="0%" stopColor="#00e5a0" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#00e5ff" stopOpacity="0.2" />
          </>
        );
      case 'about':
        return (
          <>
            <stop offset="0%" stopColor="#00e5a0" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.3" />
          </>
        );
      case 'home':
      default:
        return (
          <>
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#00e5a0" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#00e5ff" stopOpacity="0.3" />
          </>
        );
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-[3] overflow-hidden">
      <svg
        className="w-full h-full opacity-35"
        preserveAspectRatio="none"
        viewBox="0 0 1440 800"
      >
        <defs>
          <linearGradient id={`marketLineGrad_${variant}`} x1="0" y1="0" x2="1" y2="0">
            {getGradientStops()}
          </linearGradient>
        </defs>

        {/* Primary Market Curve */}
        <path
          d="M0 480 Q 360 220, 720 380 T 1440 260"
          fill="none"
          stroke={`url(#marketLineGrad_${variant})`}
          strokeWidth="2.5"
          className="drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]"
        />

        {/* Secondary Oscillating Signal Curve */}
        <path
          d="M0 580 Q 420 380, 840 520 T 1440 380"
          fill="none"
          stroke={`url(#marketLineGrad_${variant})`}
          strokeWidth="1.2"
          strokeDasharray="6 6"
          className="opacity-40"
        />
      </svg>
    </div>
  );
}

export default MarketLines;
