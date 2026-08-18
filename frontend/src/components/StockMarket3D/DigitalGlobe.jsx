import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

export function DigitalGlobe({ isMobile = false }) {
  const globeRef = useRef();
  const radius = isMobile ? 3.8 : 5.8;
  const count = isMobile ? 400 : 950;

  // Generate 3D sphere point cloud with gold and cyan financial node points
  const [positions, colors] = useState(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;

      pos[i * 3] = radius * Math.cos(theta) * Math.sin(phi);
      pos[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      // Mix of cyan (#00e5ff) and gold (#fbbf24) particles matching reference image
      const isGold = i % 3 === 0;
      col[i * 3] = isGold ? 0.98 : 0.0;     // R
      col[i * 3 + 1] = isGold ? 0.75 : 0.9; // G
      col[i * 3 + 2] = isGold ? 0.14 : 1.0; // B
    }
    return [pos, col];
  });

  useFrame((state, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.035;
      globeRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.15) * 0.08;
    }
  });

  return (
    <group position={[-8.5, 4.5, -7.5]}>
      {/* Outer Wireframe Sphere */}
      <mesh>
        <sphereGeometry args={[radius, 28, 28]} />
        <meshBasicMaterial color="#00e5ff" wireframe transparent opacity={0.07} />
      </mesh>

      {/* Particle Globe Cloud */}
      <Points ref={globeRef} positions={positions} colors={colors} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          vertexColors
          size={isMobile ? 0.07 : 0.09}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.45}
        />
      </Points>
    </group>
  );
}

export default DigitalGlobe;
