import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import CandlestickCluster from './CandlestickCluster';
import ChartGrid from './ChartGrid';
import TechnicalIndicators from './TechnicalIndicators';
import FloatingParticles from './FloatingParticles';

export function MarketScene({ progress = 0, isMobile = false }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 4, 12));
  const targetLook = useRef(new THREE.Vector3(0, 1, 0));
  const currentLook = useRef(new THREE.Vector3(0, 1, 0));

  useFrame((state, delta) => {
    // Interpolate camera coordinates based on scroll progress (0.0 to 1.0)
    let px = 0, py = 4, pz = 12;
    let lx = 0, ly = 1, lz = 0;

    if (progress < 0.25) {
      // Phase 1: Wide High Angle
      const t = progress / 0.25;
      px = THREE.MathUtils.lerp(0, -3, t);
      py = THREE.MathUtils.lerp(4, 2, t);
      pz = THREE.MathUtils.lerp(12, 7, t);
      lx = THREE.MathUtils.lerp(0, -1, t);
      ly = THREE.MathUtils.lerp(1, 1.2, t);
      lz = THREE.MathUtils.lerp(0, -1, t);
    } else if (progress < 0.55) {
      // Phase 2: Deep Dive into Candlesticks
      const t = (progress - 0.25) / 0.30;
      px = THREE.MathUtils.lerp(-3, 3, t);
      py = THREE.MathUtils.lerp(2, 2.8, t);
      pz = THREE.MathUtils.lerp(7, 4.5, t);
      lx = THREE.MathUtils.lerp(-1, 1, t);
      ly = THREE.MathUtils.lerp(1.2, 1.5, t);
      lz = THREE.MathUtils.lerp(-1, -2, t);
    } else if (progress < 0.80) {
      // Phase 3: Technical Analysis & Moving Average
      const t = (progress - 0.55) / 0.25;
      px = THREE.MathUtils.lerp(3, 0, t);
      py = THREE.MathUtils.lerp(2.8, 5.5, t);
      pz = THREE.MathUtils.lerp(4.5, 14, t);
      lx = THREE.MathUtils.lerp(1, 0, t);
      ly = THREE.MathUtils.lerp(1.5, 1, t);
      lz = THREE.MathUtils.lerp(-2, 0, t);
    } else {
      // Phase 4 & 5: Panoramic Master View & Final CTA
      const t = (progress - 0.80) / 0.20;
      px = THREE.MathUtils.lerp(0, 0, t);
      py = THREE.MathUtils.lerp(5.5, 3.8, t);
      pz = THREE.MathUtils.lerp(14, 10.5, t);
      lx = 0; ly = 1; lz = 0;
    }

    targetPos.current.set(px, py, pz);
    targetLook.current.set(lx, ly, lz);

    // Smooth lerp camera position
    const lerpSpeed = delta * 3.5;
    camera.position.lerp(targetPos.current, lerpSpeed);
    currentLook.current.lerp(targetLook.current, lerpSpeed);
    camera.lookAt(currentLook.current);
  });

  return (
    <>
      {/* Lighting Setup */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 15, 10]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-10, 8, -5]} intensity={2.0} color="#089981" />
      <pointLight position={[10, 5, 5]} intensity={1.8} color="#FFD700" />
      <pointLight position={[0, -5, 5]} intensity={1.2} color="#2962FF" />

      {/* 3D Scene Components */}
      <CandlestickCluster isMobile={isMobile} />
      <ChartGrid isMobile={isMobile} />
      <TechnicalIndicators progress={progress} isMobile={isMobile} />
      <FloatingParticles isMobile={isMobile} />
    </>
  );
}

export default MarketScene;
