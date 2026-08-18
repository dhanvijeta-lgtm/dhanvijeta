import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

// Expanded 32-Candle OHLC dataset representing a realistic market cycle
const getStockChartDataset = (isMobile = false) => {
  const rawOHLC = [
    // Phase 1: Accumulation & Consolidation
    { open: 100.0, high: 101.8, low: 99.2, close: 101.2 },
    { open: 101.2, high: 102.5, low: 100.2, close: 100.8 },
    { open: 100.8, high: 102.2, low: 99.5, close: 101.9 },
    { open: 101.9, high: 103.5, low: 101.0, close: 103.1 },
    { open: 103.1, high: 104.2, low: 102.1, close: 102.5 },
    { open: 102.5, high: 104.8, low: 102.0, close: 104.2 },
    { open: 104.2, high: 105.5, low: 103.5, close: 104.9 },
    
    // Phase 2: Initial Upward Breakout
    { open: 104.9, high: 111.0, low: 104.5, close: 110.5, breakout: true },
    { open: 110.5, high: 113.8, low: 109.8, close: 113.2 },
    { open: 113.2, high: 115.0, low: 112.1, close: 114.5 },
    { open: 114.5, high: 116.8, low: 113.9, close: 116.0 },
    { open: 116.0, high: 121.5, low: 115.8, close: 120.8, breakout: true },

    // Phase 3: Healthy Market Pullback / Support Test
    { open: 120.8, high: 121.8, low: 117.2, close: 117.8 },
    { open: 117.8, high: 119.0, low: 115.5, close: 116.2 },
    { open: 116.2, high: 118.5, low: 115.8, close: 118.0 },
    { open: 118.0, high: 119.5, low: 116.8, close: 117.2 },
    { open: 117.2, high: 120.5, low: 116.5, close: 119.8 },

    // Phase 4: Bullish Momentum & Volatile Push
    { open: 119.8, high: 127.2, low: 119.5, close: 126.5, breakout: true },
    { open: 126.5, high: 129.8, low: 125.8, close: 129.0 },
    { open: 129.0, high: 131.5, low: 128.0, close: 130.8 },
    { open: 130.8, high: 132.0, low: 127.5, close: 128.2 },
    { open: 128.2, high: 136.0, low: 128.0, close: 135.2, breakout: true },

    // Phase 5: All-Time High Expansion & Continuation
    { open: 135.2, high: 138.5, low: 134.5, close: 137.8 },
    { open: 137.8, high: 140.2, low: 136.8, close: 139.5 },
    { open: 139.5, high: 141.0, low: 137.0, close: 137.5 },
    { open: 137.5, high: 145.8, low: 137.2, close: 145.0, breakout: true },
    { open: 145.0, high: 148.2, low: 144.1, close: 147.6 },
    { open: 147.6, high: 150.5, low: 146.5, close: 149.8 },
    { open: 149.8, high: 151.2, low: 147.8, close: 148.5 },
    { open: 148.5, high: 155.0, low: 148.2, close: 154.2, breakout: true },
    { open: 154.2, high: 157.5, low: 153.5, close: 156.8 }
  ];

  const dataset = isMobile ? rawOHLC.slice(0, 18) : rawOHLC;
  const count = dataset.length;
  const scaleY = 0.11;
  const spacingX = 0.72;

  return dataset.map((d, i) => {
    const isGreen = d.close >= d.open;
    const bodyHeight = Math.max(0.28, Math.abs(d.close - d.open) * scaleY);
    const bodyCenterY = ((d.open + d.close) / 2 - 124) * scaleY;

    const upperWickHeight = Math.max(0.08, (d.high - Math.max(d.open, d.close)) * scaleY);
    const upperWickCenterY = bodyCenterY + bodyHeight / 2 + upperWickHeight / 2;

    const lowerWickHeight = Math.max(0.08, (Math.min(d.open, d.close) - d.low) * scaleY);
    const lowerWickCenterY = bodyCenterY - bodyHeight / 2 - lowerWickHeight / 2;

    // Organic 3D spatial curve: arcs behind center-right, framing hero content
    const posX = (i - count / 2) * spacingX + Math.sin(i * 0.25) * 0.4;
    const posZ = Math.cos(i * 0.3) * 1.6 - (i / count) * 2.2;

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
        // Micro organic floating motion for depth
        child.position.y += Math.sin(time * 0.8 + i * 0.3) * 0.0005;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {candles.map((c) => (
        <group key={c.id} position={[c.x, 0, c.z]}>
          {/* Upper Wick */}
          <mesh position={[0, c.upperWickCenterY, 0]}>
            <cylinderGeometry args={[0.016, 0.016, c.upperWickHeight, 8]} />
            <meshBasicMaterial color={c.color} transparent opacity={0.75} />
          </mesh>

          {/* Lower Wick */}
          <mesh position={[0, c.lowerWickCenterY, 0]}>
            <cylinderGeometry args={[0.016, 0.016, c.lowerWickHeight, 8]} />
            <meshBasicMaterial color={c.color} transparent opacity={0.75} />
          </mesh>

          {/* Refined Candle Body */}
          <mesh position={[0, c.bodyCenterY, 0]}>
            <boxGeometry args={[0.36, c.bodyHeight, 0.36]} />
            <meshStandardMaterial
              color={c.color}
              roughness={0.2}
              metalness={0.5}
              emissive={c.isBreakout ? c.glowColor : '#000000'}
              emissiveIntensity={c.isBreakout ? 0.35 : 0.04}
              transparent
              opacity={0.93}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default CandlestickCluster;
