import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

    const openPrice = (price * 24.5).toFixed(2);
    const closePrice = (close * 24.5).toFixed(2);
    const highPrice = (Math.max(price, close) * 24.8).toFixed(2);
    const lowPrice = (Math.min(price, close) * 24.1).toFixed(2);

    candles.push({
      id: i,
      x: i * stepX + stepX / 2,
      yCenter,
      bodyHeight,
      wickHigh,
      wickLow,
      isGreen,
      openPrice,
      closePrice,
      highPrice,
      lowPrice,
      color: isGreen ? '#00FF88' : '#FF4D4D',
      glowColor: isGreen ? 'rgba(0,255,136,0.55)' : 'rgba(255,77,77,0.45)',
      isBreakout: i === 7 || i === 15 || i === 23 || i === 31,
    });

    price = close;
  }

  return candles;
};

export function CandlestickChart({ pointer = { x: 0, y: 0 } }) {
  const candles = useMemo(() => generateCandleSeries(), []);
  const [selectedCandle, setSelectedCandle] = useState(null);

  return (
    <div
      className="absolute inset-0 pointer-events-none z-[15] flex items-end justify-end pr-0 pb-[8%]"
      style={{ perspective: '1200px', perspectiveOrigin: '60% 50%' }}
    >
      <div
        className="w-[92%] sm:w-[78%] lg:w-[72%] h-[60%] sm:h-[70%] origin-bottom-right relative pointer-events-auto"
        style={{
          transform: `translate(${pointer.x * 1.1}px, ${pointer.y * 1.1}px) rotateX(${18 - pointer.y * 0.4}deg) rotateY(${(-12 + pointer.x * 0.5).toFixed(2)}deg) rotateZ(1deg)`,
        }}
      >
        {/* Selected Candle OHLC Tooltip */}
        <AnimatePresence>
          {selectedCandle && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="absolute top-2 left-4 z-30 bg-[#090d16]/90 border border-amber-400/50 p-3 rounded-xl backdrop-blur-md text-[11px] font-mono shadow-2xl flex gap-3 text-white pointer-events-none"
            >
              <div>
                <span className="text-gray-400 block text-[9px] uppercase">Open</span>
                <span className="font-bold text-amber-300">₹{selectedCandle.openPrice}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[9px] uppercase">High</span>
                <span className="font-bold text-[#00e5a0]">₹{selectedCandle.highPrice}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[9px] uppercase">Low</span>
                <span className="font-bold text-red-400">₹{selectedCandle.lowPrice}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[9px] uppercase">Close</span>
                <span className="font-bold text-[#00e5ff]">₹{selectedCandle.closePrice}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
            {candles.map((c, i) => {
              const isSelected = selectedCandle?.id === c.id;

              return (
                <motion.g
                  key={c.id}
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: isSelected ? 1.15 : 1 }}
                  transition={{
                    duration: 0.45,
                    delay: 0.15 + i * 0.02,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{ transformOrigin: `${c.x}px ${c.yCenter + c.bodyHeight / 2}px`, cursor: 'pointer' }}
                  filter="url(#candleGlow)"
                  onClick={() => setSelectedCandle(isSelected ? null : c)}
                  onTouchStart={() => setSelectedCandle(c)}
                  onMouseEnter={() => setSelectedCandle(c)}
                  onMouseLeave={() => setSelectedCandle(null)}
                >
                  <line
                    x1={c.x}
                    y1={c.yCenter - c.bodyHeight / 2 - c.wickHigh}
                    x2={c.x}
                    y2={c.yCenter - c.bodyHeight / 2}
                    stroke={isSelected ? '#ffffff' : c.color}
                    strokeWidth={isSelected ? '2.5' : '1.5'}
                    opacity="0.9"
                  />
                  <line
                    x1={c.x}
                    y1={c.yCenter + c.bodyHeight / 2}
                    x2={c.x}
                    y2={c.yCenter + c.bodyHeight / 2 + c.wickLow}
                    stroke={isSelected ? '#ffffff' : c.color}
                    strokeWidth={isSelected ? '2.5' : '1.5'}
                    opacity="0.9"
                  />
                  <rect
                    x={c.x - (isSelected ? 10 : 8)}
                    y={c.yCenter - c.bodyHeight / 2}
                    width={isSelected ? '20' : '16'}
                    height={c.bodyHeight}
                    rx="2"
                    fill={isSelected ? '#ffffff' : c.color}
                    opacity="0.95"
                    style={{
                      filter: isSelected
                        ? 'drop-shadow(0 0 15px rgba(255,255,255,0.9))'
                        : c.isBreakout
                        ? `drop-shadow(0 0 10px ${c.glowColor})`
                        : undefined,
                    }}
                  />
                </motion.g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}

export default CandlestickChart;
