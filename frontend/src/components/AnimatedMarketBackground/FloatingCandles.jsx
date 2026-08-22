import React from 'react';
import { perfManager } from './PerformanceManager';

export function FloatingCandles({ variant = 'home' }) {
  // Mobile check to skip candle silhouettes for performance
  if (perfManager.isMobile) return null;

  const candles = [
    { type: 'bullish', x: '12%', y: '25%', height: '70px', wick: '110px', delay: '0s' },
    { type: 'bearish', x: '82%', y: '35%', height: '60px', wick: '95px', delay: '2s' },
    { type: 'bullish', x: '22%', y: '65%', height: '85px', wick: '130px', delay: '4s' },
    { type: 'bearish', x: '75%', y: '70%', height: '55px', wick: '85px', delay: '1s' },
    { type: 'bullish', x: '48%', y: '15%', height: '65px', wick: '100px', delay: '3s' }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-[2] overflow-hidden opacity-25">
      {candles.map((c, i) => {
        const isBullish = c.type === 'bullish';
        const colorClass = isBullish
          ? 'bg-[#00e5a0]/40 border-[#00e5a0]/60 shadow-[0_0_15px_rgba(0,229,160,0.3)]'
          : 'bg-[#ff4d4d]/30 border-[#ff4d4d]/50 shadow-[0_0_15px_rgba(255,77,77,0.3)]';
        const wickColor = isBullish ? 'bg-[#00e5a0]/60' : 'bg-[#ff4d4d]/50';

        return (
          <div
            key={i}
            className="absolute flex items-center justify-center animate-pulse-slow"
            style={{
              left: c.x,
              top: c.y,
              animationDelay: c.delay
            }}
          >
            {/* Wick */}
            <div
              className={`w-[2px] ${wickColor} rounded-full absolute`}
              style={{ height: c.wick }}
            />
            {/* Candle Body */}
            <div
              className={`w-3.5 rounded-sm border backdrop-blur-xs relative z-10 ${colorClass}`}
              style={{ height: c.height }}
            />
          </div>
        );
      })}
    </div>
  );
}

export default FloatingCandles;
