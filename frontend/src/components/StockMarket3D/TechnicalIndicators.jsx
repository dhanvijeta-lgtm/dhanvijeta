import React, { useMemo } from 'react';
import * as THREE from 'three';

export function TechnicalIndicators({ progress = 0, isMobile = false }) {
  // Thin Luminous Price Trajectory Ribbon following OHLC trend line
  const maCurve = useMemo(() => {
    const points = [];
    const count = isMobile ? 14 : 24;
    const spacingX = 0.85;
    for (let i = 0; i < count; i++) {
      const x = (i - count / 2) * spacingX + Math.sin(i * 0.3) * 0.3;
      const y = (Math.sin(i * 0.28) * 1.5 + (i / count) * 3.2 - 1.2);
      const z = Math.cos(i * 0.35) * 1.4 - (i / count) * 1.5;
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.CatmullRomCurve3(points);
  }, [isMobile]);

  const maGeometry = useMemo(() => {
    return new THREE.TubeGeometry(maCurve, 64, 0.018, 8, false); // Thin elegant trajectory line
  }, [maCurve]);

  // Volume Histogram Bars matching OHLC volume
  const volumeBars = useMemo(() => {
    const count = isMobile ? 14 : 24;
    const spacingX = 0.85;
    const bars = [];
    for (let i = 0; i < count; i++) {
      const isBreakout = i === 5 || i === 10 || i === 13 || i === 18 || i === 21;
      const height = isBreakout ? 1.2 + Math.random() * 0.3 : 0.3 + Math.random() * 0.4;
      const isGreen = i % 3 !== 0;
      const x = (i - count / 2) * spacingX + Math.sin(i * 0.3) * 0.3;
      const z = Math.cos(i * 0.35) * 1.4 - (i / count) * 1.5;
      bars.push({
        id: i,
        x,
        z,
        height,
        color: isGreen ? '#059669' : '#dc2626'
      });
    }
    return bars;
  }, [isMobile]);

  // 3D RSI Oscillator Curve Line
  const rsiCurve = useMemo(() => {
    const points = [];
    const count = isMobile ? 14 : 24;
    const spacingX = 0.85;
    for (let i = 0; i < count; i++) {
      const x = (i - count / 2) * spacingX + Math.sin(i * 0.3) * 0.3;
      const rsiVal = 30 + Math.sin(i * 0.5) * 35 + (i / count) * 15;
      const y = (rsiVal - 50) * 0.03 - 3.2;
      const z = Math.cos(i * 0.35) * 1.4 - (i / count) * 1.5;
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.CatmullRomCurve3(points);
  }, [isMobile]);

  const rsiGeometry = useMemo(() => {
    return new THREE.TubeGeometry(rsiCurve, 48, 0.012, 6, false);
  }, [rsiCurve]);

  // Progressive Fade-in during Phase 3 (progress >= 0.35)
  const opacity = Math.min(1, Math.max(0, (progress - 0.35) * 2.8));

  if (opacity <= 0.01) return null;

  return (
    <group>
      {/* 1. Thin Luminous Trajectory Ribbon */}
      <mesh geometry={maGeometry}>
        <meshBasicMaterial color="#f59e0b" transparent opacity={opacity * 0.85} />
      </mesh>

      {/* 2. Support Level Plane Line */}
      <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[isMobile ? 15 : 22, 0.015]} />
        <meshBasicMaterial color="#059669" transparent opacity={opacity * 0.35} />
      </mesh>

      {/* 3. Resistance Level Plane Line */}
      <mesh position={[0, 3.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[isMobile ? 15 : 22, 0.015]} />
        <meshBasicMaterial color="#dc2626" transparent opacity={opacity * 0.35} />
      </mesh>

      {/* 4. Muted Volume Histogram Bars at Base */}
      <group position={[0, -2.5, 0]}>
        {volumeBars.map((b) => (
          <mesh key={b.id} position={[b.x, b.height / 2, b.z]}>
            <boxGeometry args={[0.26, b.height, 0.26]} />
            <meshStandardMaterial
              color={b.color}
              transparent
              opacity={opacity * 0.35}
              roughness={0.4}
            />
          </mesh>
        ))}
      </group>

      {/* 5. Muted RSI-Style Oscillator */}
      <group>
        <mesh geometry={rsiGeometry}>
          <meshBasicMaterial color="#38bdf8" transparent opacity={opacity * 0.65} />
        </mesh>
        {/* RSI Overbought 70 Level */}
        <mesh position={[0, -2.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[isMobile ? 15 : 22, 0.01]} />
          <meshBasicMaterial color="#dc2626" transparent opacity={opacity * 0.25} />
        </mesh>
        {/* RSI Oversold 30 Level */}
        <mesh position={[0, -3.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[isMobile ? 15 : 22, 0.01]} />
          <meshBasicMaterial color="#059669" transparent opacity={opacity * 0.25} />
        </mesh>
      </group>
    </group>
  );
}

export default TechnicalIndicators;
