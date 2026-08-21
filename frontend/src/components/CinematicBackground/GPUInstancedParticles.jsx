import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMotion } from '../../store/MotionContext';

export function GPUInstancedParticles({ count = 1000, theme = 'gold' }) {
  const meshRef = useRef();
  const { pointerRef, scrollRef } = useMotion();

  // Create initial random positions, scales, and phase shifts for count particles
  const particleData = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        x: (Math.random() - 0.5) * 30,
        y: (Math.random() - 0.5) * 30,
        z: (Math.random() - 0.5) * 20,
        speedX: (Math.random() - 0.5) * 0.02,
        speedY: (Math.random() - 0.5) * 0.02 + 0.01,
        speedZ: (Math.random() - 0.5) * 0.01,
        scale: Math.random() * 0.08 + 0.02,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 2 + 1,
      });
    }
    return data;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Set particle color based on theme energy
  const particleColor = useMemo(() => {
    switch (theme) {
      case 'emerald':
        return new THREE.Color('#00e5a0');
      case 'cyan':
        return new THREE.Color('#00e5ff');
      case 'auth':
        return new THREE.Color('#fbbf24');
      case 'gold':
      default:
        return new THREE.Color('#f59e0b');
    }
  }, [theme]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    const pointer = pointerRef.current;
    const scroll = scrollRef.current;

    const mouseOffsetX = pointer.x * 2.5;
    const mouseOffsetY = pointer.y * 2.5;
    const scrollAccel = scroll.velocity * 0.05;

    for (let i = 0; i < count; i++) {
      const p = particleData[i];

      // Update positions with subtle drift and scroll acceleration
      p.y += (p.speedY + scrollAccel) * delta * 10;
      p.x += p.speedX * delta * 10;
      p.z += p.speedZ * delta * 10;

      // Wrap around bounds
      if (p.y > 15) p.y = -15;
      if (p.y < -15) p.y = 15;
      if (p.x > 15) p.x = -15;
      if (p.x < -15) p.x = 15;

      // Pulsing scale
      const currentScale = p.scale * (1 + 0.25 * Math.sin(time * p.pulseSpeed + p.pulsePhase));

      // Apply mouse/touch depth parallax
      const depthFactor = (p.z + 10) / 20; // 0 to 1
      const finalX = p.x + mouseOffsetX * depthFactor;
      const finalY = p.y + mouseOffsetY * depthFactor;

      dummy.position.set(finalX, finalY, p.z);
      dummy.scale.set(currentScale, currentScale, currentScale);
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]} frustumCulled={false}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color={particleColor} transparent opacity={0.55} depthWrite={false} />
    </instancedMesh>
  );
}

export default GPUInstancedParticles;
