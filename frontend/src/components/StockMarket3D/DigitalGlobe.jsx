import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export function DigitalGlobe({ isMobile = false }) {
  const globeRef = useRef();
  const radius = isMobile ? 3.5 : 5.0;
  const count = isMobile ? 350 : 800;

  // Generate 3D sphere point cloud for digital financial globe
  const [positions] = useState(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;

      pos[i * 3] = radius * Math.cos(theta) * Math.sin(phi);
      pos[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }
    return pos;
  });

  useFrame((state, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.04;
      globeRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return (
    <group position={[-7.5, 4.2, -7]}>
      {/* Outer Wireframe Sphere */}
      <mesh>
        <sphereGeometry args={[radius, 24, 24]} />
        <meshBasicMaterial color="#00E5FF" wireframe transparent opacity={0.06} />
      </mesh>

      {/* Glowing Particle Globe Cloud */}
      <Points ref={globeRef} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#00E5FF"
          size={isMobile ? 0.06 : 0.08}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.35}
        />
      </Points>
    </group>
  );
}

export default DigitalGlobe;
