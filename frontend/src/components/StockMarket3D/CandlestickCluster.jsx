import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

// 34-Candle dataset forming a wide steep rising trajectory spanning full edge-to-edge
const getStockChartDataset = (isMobile = false) => {
  const count = isMobile ? 18 : 34;
  const spacingX = isMobile ? 1.0 : 0.88; // Wider candlestick spacing across widescreen
  const candles = [];

  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    
    // Wave profile: starts low at left, slight dip, then steep exponential climb to top right
    let yBase = -3.2 + Math.pow(t, 1.7) * 7.8;
    if (i < 6) {
      yBase = -2.8 + (i * 0.05) - (Math.sin(i * 0.8) * 0.25);
    }

    const isGreen = (i % 5 !== 1) && (i % 7 !== 2);
    const bodyHeight = (Math.sin(i * 0.7) * 0.25 + 0.6);
    const bodyCenterY = yBase;

    const upperWickHeight = 0.28 + Math.random() * 0.35;
    const lowerWickHeight = 0.28 + Math.random() * 0.35;

    const upperWickCenterY = bodyCenterY + bodyHeight / 2 + upperWickHeight / 2;
    const lowerWickCenterY = bodyCenterY - bodyHeight / 2 - lowerWickHeight / 2;

    const posX = (i - count / 2) * spacingX;
    const posZ = Math.sin(i * 0.2) * 0.8 - t * 1.5;

    const isBreakout = i === 12 || i === 20 || i === 27 || i === 32;

    candles.push({
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
      isBreakout
    });
  }

  return candles;
};

export function CandlestickCluster({ isMobile = false }) {
  const groupRef = useRef();
  const candles = useMemo(() => getStockChartDataset(isMobile), [isMobile]);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      groupRef.current.children.forEach((child, i) => {
        child.position.y += Math.sin(time * 0.9 + i * 0.35) * 0.0005;
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
            <meshBasicMaterial color={c.color} transparent opacity={0.85} />
          </mesh>

          {/* Lower Wick */}
          <mesh position={[0, c.lowerWickCenterY, 0]}>
            <cylinderGeometry args={[0.018, 0.018, c.lowerWickHeight, 8]} />
            <meshBasicMaterial color={c.color} transparent opacity={0.85} />
          </mesh>

          {/* Candle Body */}
          <mesh position={[0, c.bodyCenterY, 0]}>
            <boxGeometry args={[0.42, c.bodyHeight, 0.42]} />
            <meshStandardMaterial
              color={c.color}
              roughness={0.15}
              metalness={0.55}
              emissive={c.isBreakout ? c.glowColor : '#000000'}
              emissiveIntensity={c.isBreakout ? 0.45 : 0.05}
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
