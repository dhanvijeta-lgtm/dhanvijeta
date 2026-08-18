import React from 'react';
import { Grid } from '@react-three/drei';

export function ChartGrid({ isMobile = false }) {
  return (
    <group position={[0, -2.6, 0]}>
      {/* 3D Financial Trading Floor Coordinate Grid */}
      <Grid
        position={[0, 0, 0]}
        args={isMobile ? [25, 25] : [45, 45]}
        cellSize={1.2}
        cellThickness={0.8}
        cellColor="#2962FF"
        sectionSize={4.8}
        sectionThickness={1.4}
        sectionColor="#00E5FF"
        fadeDistance={isMobile ? 18 : 32}
        fadeStrength={1.8}
        infiniteGrid
      />

      {/* Axis Baseline Zero Line */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 0.04]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

export default ChartGrid;
