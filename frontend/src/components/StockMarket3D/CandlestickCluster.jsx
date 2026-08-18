import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

// Generate realistic stock price action data points
const generateCandleData = (count = 24) => {
  const candles = [];
  let price = 100;

  for (let i = 0; i < count; i++) {
    const change = (Math.sin(i * 0.4) * 4 + (Math.random() - 0.45) * 6);
    const open = price;
    const close = open + change;
    const isGreen = close >= open;
    const high = Math.max(open, close) + Math.random() * 2.5 + 0.5;
    const low = Math.min(open, close) - Math.random() * 2.5 - 0.5;
    const height = Math.max(0.3, Math.abs(close - open));
    const centerY = (open + close) / 2;
    const wickHeight = high - low;

    // Scale down values for 3D coordinates
    const scaleY = 0.18;
    const posX = (i - count / 2) * 0.75;
    const posZ = Math.sin(i * 0.3) * 1.5;

    candles.push({
      id: i,
      x: posX,
      y: centerY * scaleY,
      z: posZ,
      bodyHeight: height * scaleY,
      wickHeight: wickHeight * scaleY,
      isGreen,
      color: isGreen ? '#089981' : '#f43f5e',
      glowColor: isGreen ? '#00E676' : '#FF1744',
      isBreakout: i === 7 || i === 15 || i === 21
    });

    price = close;
  }

  return candles;
};

export function CandlestickCluster({ isMobile = false }) {
  const groupRef = useRef();
  const count = isMobile ? 14 : 24;
  const candles = useMemo(() => generateCandleData(count), [count]);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      groupRef.current.children.forEach((child, i) => {
        // Micro floating animation for realistic feel
        child.position.y += Math.sin(t * 1.5 + i * 0.5) * 0.0008;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {candles.map((c) => (
        <group key={c.id} position={[c.x, c.y, c.z]}>
          {/* Wick */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, c.wickHeight, 6]} />
            <meshBasicMaterial color={c.color} transparent opacity={0.8} />
          </mesh>

          {/* Body */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.36, c.bodyHeight, 0.36]} />
            <meshStandardMaterial
              color={c.color}
              roughness={0.2}
              metalness={0.6}
              emissive={c.isBreakout ? c.glowColor : '#000000'}
              emissiveIntensity={c.isBreakout ? 0.4 : 0.05}
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
