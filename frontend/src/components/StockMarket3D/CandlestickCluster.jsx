import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

// Authentic OHLC stock market price action sequence
const getStockChartDataset = (isMobile = false) => {
  // Pre-calculated OHLC dataset representing market cycles
  const rawOHLC = [
    { open: 100, high: 102.5, low: 99.2, close: 101.8 },
    { open: 101.8, high: 103.0, low: 100.5, close: 101.2 },
    { open: 101.2, high: 102.8, low: 99.8, close: 102.4 },
    { open: 102.4, high: 104.5, low: 101.5, close: 104.0 }, // Consolidation top
    { open: 104.0, high: 104.8, low: 102.0, close: 102.8 }, // Minor dip
    { open: 102.8, high: 109.5, low: 102.5, close: 109.0, breakout: true }, // Bullish Breakout
    { open: 109.0, high: 112.0, low: 108.2, close: 111.5 },
    { open: 111.5, high: 113.8, low: 110.0, close: 112.8 },
    { open: 112.8, high: 113.5, low: 108.5, close: 109.2 }, // Bearish Pullback
    { open: 109.2, high: 110.5, low: 107.8, close: 108.5 }, // Testing Support
    { open: 108.5, high: 115.0, low: 108.0, close: 114.2, breakout: true }, // Strong Rebound
    { open: 114.2, high: 118.0, low: 113.8, close: 117.5 },
    { open: 117.5, high: 119.5, low: 116.0, close: 118.8 },
    { open: 118.8, high: 124.0, low: 118.5, close: 123.5, breakout: true }, // Major Bullish Expansion
    { open: 123.5, high: 125.8, low: 122.0, close: 124.8 },
    { open: 124.8, high: 127.5, low: 123.8, close: 126.9 },
    { open: 126.9, high: 127.2, low: 123.0, close: 123.8 }, // Reversal candle
    { open: 123.8, high: 125.0, low: 121.5, close: 122.2 }, // Pullback to moving average
    { open: 122.2, high: 129.0, low: 122.0, close: 128.5, breakout: true }, // Strong Continuation
    { open: 128.5, high: 132.0, low: 128.0, close: 131.2 },
    { open: 131.2, high: 134.5, low: 130.8, close: 134.0 },
    { open: 134.0, high: 138.5, low: 133.5, close: 138.0, breakout: true }, // All Time High
    { open: 138.0, high: 140.0, low: 136.5, close: 139.2 },
    { open: 139.2, high: 142.5, low: 138.8, close: 142.0 }
  ];

  const dataset = isMobile ? rawOHLC.slice(0, 15) : rawOHLC;
  const count = dataset.length;
  const scaleY = 0.14;
  const spacingX = 0.8;

  return dataset.map((d, i) => {
    const isGreen = d.close >= d.open;
    const bodyHeight = Math.max(0.35, Math.abs(d.close - d.open) * scaleY);
    const bodyCenterY = ((d.open + d.close) / 2 - 115) * scaleY;

    const upperWickHeight = Math.max(0.1, (d.high - Math.max(d.open, d.close)) * scaleY);
    const upperWickCenterY = bodyCenterY + bodyHeight / 2 + upperWickHeight / 2;

    const lowerWickHeight = Math.max(0.1, (Math.min(d.open, d.close) - d.low) * scaleY);
    const lowerWickCenterY = bodyCenterY - bodyHeight / 2 - lowerWickHeight / 2;

    const posX = (i - count / 2) * spacingX;
    const posZ = Math.sin(i * 0.25) * 1.2;

    return {
      id: i,
      x: posX,
      z: posZ,
      bodyCenterY,
      bodyHeight,
      upperWickHeight,
      upperWickCenterY,
      lowerWickHeight,
      lowerWickCenterY,
      isGreen,
      color: isGreen ? '#089981' : '#f43f5e',
      glowColor: isGreen ? '#00E676' : '#FF1744',
      isBreakout: d.breakout
    };
  });
};

export function CandlestickCluster({ isMobile = false }) {
  const groupRef = useRef();
  const candles = useMemo(() => getStockChartDataset(isMobile), [isMobile]);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      groupRef.current.children.forEach((child, i) => {
        // Very subtle organic floating micro-motion
        child.position.y += Math.sin(time * 1.2 + i * 0.4) * 0.0006;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {candles.map((c) => (
        <group key={c.id} position={[c.x, 0, c.z]}>
          {/* Upper Wick */}
          <mesh position={[0, c.upperWickCenterY, 0]}>
            <cylinderGeometry args={[0.02, 0.02, c.upperWickHeight, 6]} />
            <meshBasicMaterial color={c.color} transparent opacity={0.85} />
          </mesh>

          {/* Lower Wick */}
          <mesh position={[0, c.lowerWickCenterY, 0]}>
            <cylinderGeometry args={[0.02, 0.02, c.lowerWickHeight, 6]} />
            <meshBasicMaterial color={c.color} transparent opacity={0.85} />
          </mesh>

          {/* Candle Body */}
          <mesh position={[0, c.bodyCenterY, 0]}>
            <boxGeometry args={[0.42, c.bodyHeight, 0.42]} />
            <meshStandardMaterial
              color={c.color}
              roughness={0.15}
              metalness={0.65}
              emissive={c.isBreakout ? c.glowColor : '#000000'}
              emissiveIntensity={c.isBreakout ? 0.45 : 0.08}
              transparent
              opacity={0.94}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default CandlestickCluster;
