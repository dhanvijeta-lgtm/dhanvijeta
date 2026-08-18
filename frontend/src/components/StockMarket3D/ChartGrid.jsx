import React from 'react';
import { Grid } from '@react-three/drei';

export function ChartGrid({ isMobile = false }) {
  return (
    <group position={[0, -2.8, 0]}>
      {/* Minimal & Subtle Financial Floor Grid */}
      <Grid
        position={[0, 0, 0]}
        args={isMobile ? [20, 20] : [35, 35]}
        cellSize={1.5}
        cellThickness={0.5}
        cellColor="#1e293b"
        sectionSize={6}
        sectionThickness={0.8}
        sectionColor="#334155"
        fadeDistance={isMobile ? 14 : 24}
        fadeStrength={2.5}
        infiniteGrid
      />

      {/* Extremely Subtle Zero-Axis Baseline */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 0.02]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

export default ChartGrid;
