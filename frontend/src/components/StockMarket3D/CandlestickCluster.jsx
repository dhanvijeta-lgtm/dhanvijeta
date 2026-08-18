import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

// Authentic OHLC dataset with refined 3D market trajectory
const getStockChartDataset = (isMobile = false) => {
  const rawOHLC = [
    { open: 100, high: 102.0, low: 99.5, close: 101.5 },
    { open: 101.5, high: 103.2, low: 100.8, close: 101.0 },
    { open: 101.0, high: 102.5, low: 99.8, close: 102.2 },
    { open: 102.2, high: 104.2, low: 101.8, close: 103.8 },
    { open: 103.8, high: 104.5, low: 102.2, close: 102.9 },
    { open: 102.9, high: 108.5, low: 102.7, close: 108.2, breakout: true }, // Bullish Breakout
    { open: 108.2, high: 111.0, low: 107.5, close: 110.8 },
    { open: 110.8, high: 112.5, low: 109.5, close: 111.9 },
    { open: 111.9, high: 112.8, low: 108.2, close: 108.8 }, // Bearish Pullback
    { open: 108.8, high: 110.0, low: 107.4, close: 108.1 },
    { open: 108.1, high: 114.5, low: 107.8, close: 113.8, breakout: true }, // Strong Rebound
    { open: 113.8, high: 117.2, low: 113.2, close: 116.8 },
    { open: 116.8, high: 118.8, low: 115.5, close: 118.0 },
    { open: 118.0, high: 123.2, low: 117.8, close: 122.8, breakout: true }, // Major Bullish Expansion
    { open: 122.8, high: 124.5, low: 121.2, close: 123.9 },
    { open: 123.9, high: 126.2, low: 122.8, close: 125.8 },
    { open: 125.8, high: 126.5, low: 122.0, close: 122.8 }, // Reversal test
    { open: 122.8, high: 124.2, low: 120.8, close: 121.5 },
    { open: 121.5, high: 128.2, low: 121.2, close: 127.8, breakout: true }, // Strong Continuation
    { open: 127.8, high: 131.0, low: 127.2, close: 130.5 },
    { open: 130.5, high: 133.8, low: 130.0, close: 133.2 },
    { open: 133.2, high: 137.8, low: 132.8, close: 137.2, breakout: true }, // All-Time High Breakout
    { open: 137.2, high: 139.2, low: 135.8, close: 138.5 },
    { open: 138.5, high: 141.5, low: 137.9, close: 141.0 }
  ];

  const dataset = isMobile ? rawOHLC.slice(0, 14) : rawOHLC;
  const count = dataset.length;
  const scaleY = 0.13;
  const spacingX = 0.85;

  return dataset.map((d, i) => {
    const isGreen = d.close >= d.open;
    const bodyHeight = Math.max(0.3, Math.abs(d.close - d.open) * scaleY);
    const bodyCenterY = ((d.open + d.close) / 2 - 116) * scaleY;

    const upperWickHeight = Math.max(0.08, (d.high - Math.max(d.open, d.close)) * scaleY);
    const upperWickCenterY = bodyCenterY + bodyHeight / 2 + upperWickHeight / 2;

    const lowerWickHeight = Math.max(0.08, (Math.min(d.open, d.close) - d.low) * scaleY);
    const lowerWickCenterY = bodyCenterY - bodyHeight / 2 - lowerWickHeight / 2;

    // Organic 3D spatial positioning curve (X, Y, Z)
    const posX = (i - count / 2) * spacingX + Math.sin(i * 0.3) * 0.3;
    const posZ = Math.cos(i * 0.35) * 1.4 - (i / count) * 1.5;

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
      // Refined Apple-style dark fintech palette (Emerald & Crimson)
      color: isGreen ? '#059669' : '#dc2626',
      glowColor: isGreen ? '#10b981' : '#f43f5e',
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
        // Subtle micro motion for depth
        child.position.y += Math.sin(time * 0.9 + i * 0.35) * 0.0004;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {candles.map((c) => (
        <group key={c.id} position={[c.x, 0, c.z]}>
          {/* Upper Wick */}
          <mesh position={[0, c.upperWickCenterY, 0]}>
            <cylinderGeometry args={[0.018, 0.018, c.upperWickHeight, 8]} />
            <meshBasicMaterial color={c.color} transparent opacity={0.7} />
          </mesh>

          {/* Lower Wick */}
          <mesh position={[0, c.lowerWickCenterY, 0]}>
            <cylinderGeometry args={[0.018, 0.018, c.lowerWickHeight, 8]} />
            <meshBasicMaterial color={c.color} transparent opacity={0.7} />
          </mesh>

          {/* Refined Candle Body */}
          <mesh position={[0, c.bodyCenterY, 0]}>
            <boxGeometry args={[0.38, c.bodyHeight, 0.38]} />
            <meshStandardMaterial
              color={c.color}
              roughness={0.25}
              metalness={0.45}
              emissive={c.isBreakout ? c.glowColor : '#000000'}
              emissiveIntensity={c.isBreakout ? 0.25 : 0.03}
              transparent
              opacity={0.92}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default CandlestickCluster;
