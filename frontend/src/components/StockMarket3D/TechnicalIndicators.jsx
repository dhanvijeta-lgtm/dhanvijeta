import React, { useMemo } from 'react';
import * as THREE from 'three';

export function TechnicalIndicators({ progress = 0, isMobile = false }) {
  // Smooth 3D Catmull-Rom curve for Moving Average Ribbon following price trend
  const maCurve = useMemo(() => {
    const points = [];
    const count = isMobile ? 15 : 24;
    const spacingX = 0.8;
    for (let i = 0; i < count; i++) {
      const x = (i - count / 2) * spacingX;
      // Moving average smoothed curve equation matching price trajectory
      const y = (Math.sin(i * 0.28) * 1.6 + (i / count) * 3.5 - 1.2);
      const z = Math.sin(i * 0.25) * 1.2;
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.CatmullRomCurve3(points);
  }, [isMobile]);

  const maGeometry = useMemo(() => {
    return new THREE.TubeGeometry(maCurve, 64, 0.04, 8, false);
  }, [maCurve]);

  // Generate 3D Volume Histogram Bars matching OHLC volume
  const volumeBars = useMemo(() => {
    const count = isMobile ? 15 : 24;
    const spacingX = 0.8;
    const bars = [];
    for (let i = 0; i < count; i++) {
      const isBreakout = i === 5 || i === 10 || i === 13 || i === 18 || i === 21;
      const height = isBreakout ? 1.6 + Math.random() * 0.4 : 0.4 + Math.random() * 0.6;
      const isGreen = i % 3 !== 0;
      const x = (i - count / 2) * spacingX;
      const z = Math.sin(i * 0.25) * 1.2;
      bars.push({
        id: i,
        x,
        z,
        height,
        color: isGreen ? '#089981' : '#f43f5e'
      });
    }
    return bars;
  }, [isMobile]);

  // Generate 3D RSI Oscillator Curve Line
  const rsiCurve = useMemo(() => {
    const points = [];
    const count = isMobile ? 15 : 24;
    const spacingX = 0.8;
    for (let i = 0; i < count; i++) {
      const x = (i - count / 2) * spacingX;
      const rsiVal = 30 + Math.sin(i * 0.5) * 35 + (i / count) * 15; // 30 to 80 RSI range
      const y = (rsiVal - 50) * 0.035 - 3.2; // Positioned below main chart
      const z = Math.sin(i * 0.25) * 1.2;
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.CatmullRomCurve3(points);
  }, [isMobile]);

  const rsiGeometry = useMemo(() => {
    return new THREE.TubeGeometry(rsiCurve, 48, 0.02, 6, false);
  }, [rsiCurve]);

  // Fade-in starting in Phase 3 (progress >= 0.35)
  const opacity = Math.min(1, Math.max(0, (progress - 0.35) * 2.8));

  if (opacity <= 0.01) return null;

  return (
    <group>
      {/* 1. 3D Moving Average Ribbon */}
      <mesh geometry={maGeometry}>
        <meshBasicMaterial color="#FFD700" transparent opacity={opacity * 0.85} />
      </mesh>

      {/* 2. Support Level Plane Line */}
      <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[isMobile ? 16 : 24, 0.025]} />
        <meshBasicMaterial color="#089981" transparent opacity={opacity * 0.55} />
      </mesh>

      {/* 3. Resistance Level Plane Line */}
      <mesh position={[0, 3.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[isMobile ? 16 : 24, 0.025]} />
        <meshBasicMaterial color="#f43f5e" transparent opacity={opacity * 0.55} />
      </mesh>

      {/* 4. 3D Volume Histogram Bars at Base */}
      <group position={[0, -2.4, 0]}>
        {volumeBars.map((b) => (
          <mesh key={b.id} position={[b.x, b.height / 2, b.z]}>
            <boxGeometry args={[0.3, b.height, 0.3]} />
            <meshStandardMaterial
              color={b.color}
              transparent
              opacity={opacity * 0.45}
              roughness={0.3}
            />
          </mesh>
        ))}
      </group>

      {/* 5. 3D RSI-Style Oscillator */}
      <group>
        <mesh geometry={rsiGeometry}>
          <meshBasicMaterial color="#00E5FF" transparent opacity={opacity * 0.75} />
        </mesh>
        {/* RSI Overbought 70 Level Line */}
        <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[isMobile ? 16 : 24, 0.015]} />
          <meshBasicMaterial color="#f43f5e" transparent opacity={opacity * 0.35} />
        </mesh>
        {/* RSI Oversold 30 Level Line */}
        <mesh position={[0, -3.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[isMobile ? 16 : 24, 0.015]} />
          <meshBasicMaterial color="#089981" transparent opacity={opacity * 0.35} />
        </mesh>
      </group>
    </group>
  );
}

export default TechnicalIndicators;
