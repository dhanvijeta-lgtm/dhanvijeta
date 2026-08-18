import React from 'react';
import { Grid, Text } from '@react-three/drei';

export function ChartGrid({ isMobile = false }) {
  const priceLevels = [
    { label: '24,400', y: 4.2 },
    { label: '24,200', y: 2.8 },
    { label: '24,000', y: 1.4 },
    { label: '23,800', y: 0.0 },
    { label: '23,600', y: -1.4 },
    { label: '23,400', y: -2.8 }
  ];

  const timeStamps = [
    { label: '10:00', x: -9.0 },
    { label: '11:00', x: -5.4 },
    { label: '12:00', x: -1.8 },
    { label: '12:30', x: 1.8 },
    { label: '13:00', x: 5.4 },
    { label: '13:30', x: 9.0 }
  ];

  return (
    <group position={[0, -0.5, 0]}>
      {/* 3D Financial Floor Grid */}
      <Grid
        position={[0, -3.2, 0]}
        args={isMobile ? [24, 24] : [42, 42]}
        cellSize={1.2}
        cellThickness={0.5}
        cellColor="#1e293b"
        sectionSize={4.8}
        sectionThickness={0.7}
        sectionColor="#334155"
        fadeDistance={isMobile ? 18 : 30}
        fadeStrength={2.0}
        infiniteGrid
      />

      {/* Embedded Y-Axis Price Labels (Right Margin) */}
      {!isMobile &&
        priceLevels.map((lvl, idx) => (
          <group key={idx} position={[12.2, lvl.y, -1]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[26, 0.012]} />
              <meshBasicMaterial color="#38bdf8" transparent opacity={0.12} />
            </mesh>
            <Text
              position={[0.2, 0, 0]}
              fontSize={0.22}
              color="#64748b"
              anchorX="left"
              anchorY="middle"
            >
              {lvl.label}
            </Text>
          </group>
        ))}

      {/* Embedded X-Axis Time Labels (Bottom Axis) */}
      {!isMobile &&
        timeStamps.map((ts, idx) => (
          <Text
            key={idx}
            position={[ts.x, -3.0, 0]}
            fontSize={0.22}
            color="#64748b"
            anchorX="center"
            anchorY="top"
          >
            {ts.label}
          </Text>
        ))}
    </group>
  );
}

export default ChartGrid;
