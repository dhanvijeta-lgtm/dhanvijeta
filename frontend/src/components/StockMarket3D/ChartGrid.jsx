import React from 'react';
import { Grid, Text } from '@react-three/drei';

export function ChartGrid({ isMobile = false }) {
  const priceLevels = [
    { label: '25,200', y: 3.2 },
    { label: '25,000', y: 1.8 },
    { label: '24,800', y: 0.4 },
    { label: '24,500', y: -1.0 }
  ];

  return (
    <group position={[0, -2.6, 0]}>
      {/* Ghosted Financial Floor Grid */}
      <Grid
        position={[0, 0, 0]}
        args={isMobile ? [24, 24] : [40, 40]}
        cellSize={1.2}
        cellThickness={0.5}
        cellColor="#1e293b"
        sectionSize={4.8}
        sectionThickness={0.7}
        sectionColor="#334155"
        fadeDistance={isMobile ? 16 : 28}
        fadeStrength={2.2}
        infiniteGrid
      />

      {/* Faint Horizontal Price Grid Lines & Level Labels */}
      {priceLevels.map((lvl, idx) => (
        <group key={idx} position={[0, lvl.y, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[35, 0.012]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.12} />
          </mesh>
          {!isMobile && (
            <Text
              position={[14, 0.1, 0]}
              fontSize={0.24}
              color="#64748b"
              anchorX="left"
              anchorY="middle"
            >
              {lvl.label}
            </Text>
          )}
        </group>
      ))}
    </group>
  );
}

export default ChartGrid;
