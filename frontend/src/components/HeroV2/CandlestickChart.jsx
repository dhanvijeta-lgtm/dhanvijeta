import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const generateCandleSeries = () => {
  const candles = [];
  const total = 36;
  const width = 1200;
  const height = 500;
  const stepX = width / total;

  let price = 100;
  for (let i = 0; i < total; i++) {
    const trendFactor = (i / total) * 180;
    const noise = Math.sin(i * 0.65) * 16 + (Math.random() - 0.42) * 20;
    const close = price + noise;
    const isGreen = close >= price || i % 5 !== 2;

    const bodyHeight = Math.max(10, Math.abs(close - price) + 8);
    const wickHigh = bodyHeight + Math.random() * 18 + 6;
    const wickLow = bodyHeight + Math.random() * 18 + 6;
    const yCenter = height - (90 + trendFactor + Math.sin(i * 0.35) * 35);

    candles.push({
      id: i,
      x: i * stepX + stepX / 2,
      yCenter,
      bodyHeight,
      wickHigh,
      wickLow,
      isGreen,
      color: isGreen ? '#00FF88' : '#FF4D4D',
      glowColor: isGreen ? 'rgba(0,255,136,0.55)' : 'rgba(255,77,77,0.45)',
      isBreakout: i === 7 || i === 15 || i === 23 || i === 31
    });

    price = close;
  }

  return candles;
};

export function CandlestickChart({ pointer = { x: 0, y: 0 } }) {
  const candles = useMemo(() => generateCandleSeries(), []);

  return (
    <div
      className="absolute inset-0 pointer-events-none z-[3] flex items-end justify-end pr-0 pb-[8%]"
      style={{ perspective: '1200px', perspectiveOrigin: '60% 50%' }}
    >
      <div
        className="w-[85%] sm:w-[78%] lg:w-[72%] h-[70%] origin-bottom-right"
        style={{
          transform: `translate(${pointer.x * 1.1}px, ${pointer.y * 1.1}px) rotateX(${18 - pointer.y * 0.4}deg) rotateY(${(-12 + pointer.x * 0.5).toFixed(2)}deg) rotateZ(1deg)`
        }}
      >
        <svg className="w-full h-full overflow-visible" viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="candleGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="chartFade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="white" stopOpacity="0.3" />
              <stop offset="30%" stopColor="white" stopOpacity="0.85" />
              <stop offset="100%" stopColor="white" stopOpacity="1" />
            </linearGradient>
            <mask id="chartMask">
              <rect width="1200" height="500" fill="url(#chartFade)" />
            </mask>
          </defs>

          <g mask="url(#chartMask)">
            {candles.map((c, i) => (
              <motion.g
                key={c.id}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{
                  duration: 0.45,
                  delay: 0.15 + i * 0.03,
                  ease: [0.16, 1, 0.3, 1]
                }}
                style={{ transformOrigin: `${c.x}px ${c.yCenter + c.bodyHeight / 2}px` }}
                filter="url(#candleGlow)"
              >
                <line
                  x1={c.x}
                  y1={c.yCenter - c.bodyHeight / 2 - c.wickHigh}
                  x2={c.x}
                  y2={c.yCenter - c.bodyHeight / 2}
                  stroke={c.color}
                  strokeWidth="1.5"
                  opacity="0.9"
                />
                <line
                  x1={c.x}
                  y1={c.yCenter + c.bodyHeight / 2}
                  x2={c.x}
                  y2={c.yCenter + c.bodyHeight / 2 + c.wickLow}
                  stroke={c.color}
                  strokeWidth="1.5"
                  opacity="0.9"
                />
                <rect
                  x={c.x - 8}
                  y={c.yCenter - c.bodyHeight / 2}
                  width="16"
                  height={c.bodyHeight}
                  rx="2"
                  fill={c.color}
                  opacity="0.95"
                  style={{
                    filter: c.isBreakout ? `drop-shadow(0 0 10px ${c.glowColor})` : undefined
                  }}
                />
                {c.isBreakout && (
                  <motion.rect
                    x={c.x - 8}
                    y={c.yCenter - c.bodyHeight / 2}
                    width="16"
                    height={c.bodyHeight}
                    rx="2"
                    fill={c.color}
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: [0.8, 0.2, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
              </motion.g>
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}

export default CandlestickChart;
