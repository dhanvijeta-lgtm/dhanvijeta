import React, { useMemo } from 'react';
import * as THREE from 'three';

export function TechnicalIndicators({ progress = 0, isMobile = false }) {
  // Generate smooth 3D curve for Moving Average line
  const maCurve = useMemo(() => {
    const points = [];
    const count = isMobile ? 12 : 20;
    for (let i = 0; i < count; i++) {
      const x = (i - count / 2) * 0.9;
      const y = Math.sin(i * 0.35) * 1.8 + 1.2;
      const z = Math.sin(i * 0.25) * 1.2;
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.CatmullRomCurve3(points);
  }, [isMobile]);

  const maGeometry = useMemo(() => {
    return new THREE.TubeGeometry(maCurve, 64, 0.04, 8, false);
  }, [maCurve]);

  // Generate 3D Volume Histogram Bars
  const volumeBars = useMemo(() => {
    const bars = [];
    const count = isMobile ? 12 : 20;
    for (let i = 0; i < count; i++) {
      const height = Math.random() * 1.2 + 0.3;
      const isGreen = Math.random() > 0.45;
      const x = (i - count / 2) * 0.9;
      const z = Math.sin(i * 0.3) * 1.5;
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

  // Visibility progresses with scroll progress
  const opacity = Math.min(1, Math.max(0, (progress - 0.2) * 2.5));

  if (opacity <= 0.01) return null;

  return (
    <group>
      {/* 3D Moving Average Line Ribbon */}
      <mesh geometry={maGeometry}>
        <meshBasicMaterial
          color="#FFD700"
          transparent
          opacity={opacity * 0.9}
        />
      </mesh>

      {/* 3D Resistance Plane Line (Top level) */}
      <mesh position={[0, 3.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[isMobile ? 15 : 25, 0.03]} />
        <meshBasicMaterial color="#f43f5e" transparent opacity={opacity * 0.6} />
      </mesh>

      {/* 3D Support Plane Line (Bottom level) */}
      <mesh position={[0, -0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[isMobile ? 15 : 25, 0.03]} />
        <meshBasicMaterial color="#089981" transparent opacity={opacity * 0.6} />
      </mesh>

      {/* 3D Volume Histogram Bars at Base */}
      <group position={[0, -1.8, 0]}>
        {volumeBars.map((b) => (
          <mesh key={b.id} position={[b.x, b.height / 2, b.z]}>
            <boxGeometry args={[0.25, b.height, 0.25]} />
            <meshStandardMaterial
              color={b.color}
              transparent
              opacity={opacity * 0.5}
              roughness={0.4}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default TechnicalIndicators;
