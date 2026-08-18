import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import MarketEngine from './MarketEngine';

export function CandlestickCluster({ isMobile = false, onHoverCandle, hoveredCandleId }) {
  const groupRef = useRef();
  const { camera, size } = useThree();
  const engine = useMemo(() => new MarketEngine(), []);
  const candles = useMemo(() => engine.candles, [engine]);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      groupRef.current.children.forEach((child, i) => {
        child.position.y += Math.sin(time * 0.9 + i * 0.35) * 0.0005;
      });
    }
  });

  const handlePointerOver = (e, c) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';

    // Calculate screen pixel coordinates for tooltip positioning
    const vector = new THREE.Vector3(c.x, c.bodyCenterY, c.z);
    vector.project(camera);
    const x = (vector.x * 0.5 + 0.5) * size.width;
    const y = (-(vector.y * 0.5) + 0.5) * size.height;

    if (onHoverCandle) {
      onHoverCandle(c, { x, y });
    }
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    document.body.style.cursor = 'auto';
    if (onHoverCandle) {
      onHoverCandle(null, null);
    }
  };

  const activeCandle = candles.find((c) => c.id === hoveredCandleId);

  return (
    <group ref={groupRef}>
      {/* 3D Vertical Guide Line for Hovered Candle */}
      {activeCandle && (
        <mesh position={[activeCandle.x, 0, activeCandle.z]}>
          <cylinderGeometry args={[0.012, 0.012, 14, 8]} />
          <meshBasicMaterial color="#00e5ff" transparent opacity={0.65} />
        </mesh>
      )}

      {/* 34 3D Candlesticks */}
      {candles.map((c) => {
        const isHovered = c.id === hoveredCandleId;
        return (
          <group
            key={c.id}
            position={[c.x, 0, c.z]}
            onPointerOver={(e) => handlePointerOver(e, c)}
            onPointerOut={handlePointerOut}
          >
            {/* Upper Wick */}
            <mesh position={[0, c.upperWickCenterY, 0]}>
              <cylinderGeometry args={[0.018, 0.018, c.upperWickHeight, 8]} />
              <meshBasicMaterial color={isHovered ? '#ffffff' : c.color} transparent opacity={0.9} />
            </mesh>

            {/* Lower Wick */}
            <mesh position={[0, c.lowerWickCenterY, 0]}>
              <cylinderGeometry args={[0.018, 0.018, c.lowerWickHeight, 8]} />
              <meshBasicMaterial color={isHovered ? '#ffffff' : c.color} transparent opacity={0.9} />
            </mesh>

            {/* Candle Body */}
            <mesh position={[0, c.bodyCenterY, 0]}>
              <boxGeometry args={[isHovered ? 0.52 : 0.42, c.bodyHeight, isHovered ? 0.52 : 0.42]} />
              <meshStandardMaterial
                color={isHovered ? '#ffffff' : c.color}
                roughness={0.12}
                metalness={0.6}
                emissive={isHovered ? '#00e5ff' : c.isBreakout ? c.glowColor : '#000000'}
                emissiveIntensity={isHovered ? 0.8 : c.isBreakout ? 0.48 : 0.06}
                transparent
                opacity={0.96}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export default CandlestickCluster;
