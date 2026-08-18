import React, { useMemo } from 'react';
import * as THREE from 'three';

export function TechnicalIndicators({ progress = 0, isMobile = false }) {
  // Thin Luminous Price Trajectory Ribbon (#00e5ff cyan matching reference image)
  const maCurve = useMemo(() => {
    const points = [];
    const count = isMobile ? 18 : 34;
    const spacingX = isMobile ? 0.95 : 0.86;
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      let y = -3.2 + Math.pow(t, 1.75) * 7.8;
      if (i < 6) {
        y = -2.8 + (i * 0.05) - (Math.sin(i * 0.8) * 0.28);
      }
      const x = (i - count / 2) * spacingX;
      const z = Math.sin(i * 0.2) * 0.8 - t * 1.5;
      points.push(new THREE.Vector3(x, y + 0.35, z));
    }
    return new THREE.CatmullRomCurve3(points);
  }, [isMobile]);

  const maGeometry = useMemo(() => {
    return new THREE.TubeGeometry(maCurve, 96, 0.02, 8, false); // Thin glowing price line
  }, [maCurve]);

  // Volume Histogram Bars matching OHLC dataset
  const volumeBars = useMemo(() => {
    const count = isMobile ? 18 : 34;
    const spacingX = isMobile ? 0.95 : 0.86;
    const bars = [];
    for (let i = 0; i < count; i++) {
      const isBreakout = i === 12 || i === 20 || i === 27 || i === 32;
      const height = isBreakout ? 1.5 + Math.random() * 0.35 : 0.38 + Math.random() * 0.4;
      const isGreen = i % 3 !== 0;
      const x = (i - count / 2) * spacingX;
      const z = Math.sin(i * 0.2) * 0.8 - (i / count) * 1.5;
      bars.push({
        id: i,
        x,
        z,
        height,
        color: isGreen ? '#00e5a0' : '#f43f5e'
      });
    }
    return bars;
  }, [isMobile]);

  // 3D RSI Oscillator Curve Line (#38bdf8)
  const rsiCurve = useMemo(() => {
    const points = [];
    const count = isMobile ? 18 : 34;
    const spacingX = isMobile ? 0.95 : 0.86;
    for (let i = 0; i < count; i++) {
      const x = (i - count / 2) * spacingX;
      const rsiVal = 30 + Math.sin(i * 0.45) * 35 + (i / count) * 15;
      const y = (rsiVal - 50) * 0.03 - 3.4;
      const z = Math.sin(i * 0.2) * 0.8 - (i / count) * 1.5;
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.CatmullRomCurve3(points);
  }, [isMobile]);

  const rsiGeometry = useMemo(() => {
    return new THREE.TubeGeometry(rsiCurve, 72, 0.012, 6, false);
  }, [rsiCurve]);

  const opacity = Math.min(1, Math.max(0, (progress - 0.35) * 2.8));

  return (
    <group>
      {/* 1. Thin Luminous Cyan Price Trajectory Ribbon */}
      <mesh geometry={maGeometry}>
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.9} />
      </mesh>

      {/* 2. Support Level Plane Line */}
      <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[isMobile ? 20 : 34, 0.015]} />
        <meshBasicMaterial color="#00e5a0" transparent opacity={0.35 * (opacity || 0.8)} />
      </mesh>

      {/* 3. Resistance Level Plane Line */}
      <mesh position={[0, 4.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[isMobile ? 20 : 34, 0.015]} />
        <meshBasicMaterial color="#f43f5e" transparent opacity={0.35 * (opacity || 0.8)} />
      </mesh>

      {/* 4. Muted Volume Histogram Bars at Base */}
      <group position={[0, -2.8, 0]}>
        {volumeBars.map((b) => (
          <mesh key={b.id} position={[b.x, b.height / 2, b.z]}>
            <boxGeometry args={[0.26, b.height, 0.26]} />
            <meshStandardMaterial
              color={b.color}
              transparent
              opacity={0.38}
              roughness={0.4}
            />
          </mesh>
        ))}
      </group>

      {/* 5. Muted RSI Oscillator */}
      <group>
        <mesh geometry={rsiGeometry}>
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.65} />
        </mesh>
      </group>
    </group>
  );
}

export default TechnicalIndicators;
