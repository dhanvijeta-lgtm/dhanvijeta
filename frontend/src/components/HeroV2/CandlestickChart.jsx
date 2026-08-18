import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

// Generate 32 realistic stock market OHLC candles
const generateCandleSeries = () => {
  const candles = [];
  const total = 32;
  const width = 1200;
  const height = 500;
  const stepX = width / total;

  let price = 100;
  for (let i = 0; i < total; i++) {
    // Trend upwards from bottom-left to top-right
    const trendFactor = (i / total) * 160;
    const noise = Math.sin(i * 0.7) * 14 + (Math.random() - 0.45) * 18;
    const close = price + noise;
    const isGreen = close >= price || i % 4 !== 1;
    
    const bodyHeight = Math.max(8, Math.abs(close - price) + 6);
    const wickHigh = bodyHeight + Math.random() * 16 + 4;
    const wickLow = bodyHeight + Math.random() * 16 + 4;

    // Y position (0 at top, 500 at bottom)
    const yCenter = height - (100 + trendFactor + Math.sin(i * 0.4) * 30);

    candles.push({
      id: i,
      x: i * stepX + stepX / 2,
      yCenter,
      bodyHeight,
      wickHigh,
      wickLow,
      isGreen,
      color: isGreen ? '#22c55e' : '#ef4444',
      glowColor: isGreen ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)',
      isBreakout: i === 8 || i === 16 || i === 24 || i === 30
    });

    price = close;
  }

  return candles;
};

export function CandlestickChart() {
  const candles = useMemo(() => generateCandleSeries(), []);

  return (
    <div className="absolute inset-0 pointer-events-none z-1 flex items-center justify-center">
      <svg className="w-full h-full max-w-7xl px-4 overflow-visible" viewBox="0 0 1200 500" preserveAspectRatio="none">
        {candles.map((c, i) => (
          <motion.g
            key={c.id}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.1 + i * 0.035,
              ease: [0.16, 1, 0.3, 1]
            }}
            style={{ transformOrigin: `${c.x}px ${c.yCenter}px` }}
          >
            {/* Upper Wick */}
            <line
              x1={c.x}
              y1={c.yCenter - c.bodyHeight / 2 - c.wickHigh}
              x2={c.x}
              y2={c.yCenter - c.bodyHeight / 2}
              stroke={c.color}
              strokeWidth="1.5"
              opacity="0.85"
            />

            {/* Lower Wick */}
            <line
              x1={c.x}
              y1={c.yCenter + c.bodyHeight / 2}
              x2={c.x}
              y2={c.yCenter + c.bodyHeight / 2 + c.wickLow}
              stroke={c.color}
              strokeWidth="1.5"
              opacity="0.85"
            />

            {/* Candle Body */}
            <rect
              x={c.x - 7}
              y={c.yCenter - c.bodyHeight / 2}
              width="14"
              height={c.bodyHeight}
              rx="2"
              fill={c.color}
              opacity="0.9"
              className={c.isBreakout ? 'drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]' : ''}
            />
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

export default CandlestickChart;
