import React from 'react';
import { Grid } from '@react-three/drei';

export function ChartGrid({ isMobile = false }) {
  return (
    <group position={[0, -2, 0]}>
      {/* Illuminated 3D Financial Trading Floor Grid */}
      <Grid
        position={[0, 0, 0]}
        args={isMobile ? [30, 30] : [50, 50]}
        cellSize={1}
        cellThickness={1}
        cellColor="#2962FF"
        sectionSize={5}
        sectionThickness={1.5}
        sectionColor="#00E5FF"
        fadeDistance={isMobile ? 20 : 35}
        fadeStrength={1.5}
        infiniteGrid
      />

      {/* Baseline Zero-Axis Line */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 0.05]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

export default ChartGrid;
