import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import CandlestickCluster from './CandlestickCluster';
import ChartGrid from './ChartGrid';
import TechnicalIndicators from './TechnicalIndicators';
import FloatingParticles from './FloatingParticles';

export function MarketScene({ progress = 0, isMobile = false }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 4, 13));
  const targetLook = useRef(new THREE.Vector3(0, 1, 0));
  const currentLook = useRef(new THREE.Vector3(0, 1, 0));
  const mouseRef = useRef({ x: 0, y: 0 });

  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check user preference for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handleChange = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    // Desktop Mouse Parallax Listener
    const handleMouseMove = (e) => {
      if (isMobile) return;
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 0.4,
        y: (e.clientY / window.innerHeight - 0.5) * 0.4
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobile]);

  useFrame((state, delta) => {
    let px = 0, py = 4, pz = 13;
    let lx = 0, ly = 1, lz = 0;

    if (reducedMotion) {
      // Reduced motion: gentle stationary composition
      px = 0; py = 3.5; pz = 11;
      lx = 0; ly = 0.5; lz = 0;
    } else {
      // 5-Phase Camera Path
      if (progress < 0.22) {
        // Phase 1: Establishing Wide Elevated Shot
        const t = progress / 0.22;
        px = THREE.MathUtils.lerp(0, -2.5, t);
        py = THREE.MathUtils.lerp(4, 2.2, t);
        pz = THREE.MathUtils.lerp(13, 8.5, t);
        lx = THREE.MathUtils.lerp(0, -0.8, t);
        ly = THREE.MathUtils.lerp(1, 1.2, t);
        lz = THREE.MathUtils.lerp(0, -1, t);
      } else if (progress < 0.52) {
        // Phase 2: Price Action Fly-Through into Candlesticks
        const t = (progress - 0.22) / 0.30;
        px = THREE.MathUtils.lerp(-2.5, 3.2, t);
        py = THREE.MathUtils.lerp(2.2, 2.5, t);
        pz = THREE.MathUtils.lerp(8.5, 5.0, t);
        lx = THREE.MathUtils.lerp(-0.8, 1.2, t);
        ly = THREE.MathUtils.lerp(1.2, 1.4, t);
        lz = THREE.MathUtils.lerp(-1, -1.8, t);
      } else if (progress < 0.78) {
        // Phase 3: Analysis Focus on MA, Support/Resistance & Volume
        const t = (progress - 0.52) / 0.26;
        px = THREE.MathUtils.lerp(3.2, 0, t);
        py = THREE.MathUtils.lerp(2.5, 5.8, t);
        pz = THREE.MathUtils.lerp(5.0, 14.5, t);
        lx = THREE.MathUtils.lerp(1.2, 0, t);
        ly = THREE.MathUtils.lerp(1.4, 0.8, t);
        lz = THREE.MathUtils.lerp(-1.8, 0, t);
      } else {
        // Phase 4 & 5: Panoramic Pullback & Final CTA Frame
        const t = (progress - 0.78) / 0.22;
        px = THREE.MathUtils.lerp(0, 0, t);
        py = THREE.MathUtils.lerp(5.8, 3.6, t);
        pz = THREE.MathUtils.lerp(14.5, 11.0, t);
        lx = 0; ly = 0.8; lz = 0;
      }
    }

    // Apply Desktop Mouse Parallax Offsets (subtle & non-disruptive)
    if (!isMobile && !reducedMotion) {
      px += mouseRef.current.x * 0.8;
      py += -mouseRef.current.y * 0.8;
      lx += mouseRef.current.x * 0.3;
      ly += -mouseRef.current.y * 0.3;
    }

    targetPos.current.set(px, py, pz);
    targetLook.current.set(lx, ly, lz);

    // Frame-rate independent lerp for smooth scroll response
    const lerpSpeed = Math.min(1, delta * 3.8);
    camera.position.lerp(targetPos.current, lerpSpeed);
    currentLook.current.lerp(targetLook.targetLook || targetLook.current, lerpSpeed);
    camera.lookAt(currentLook.current);
  });

  return (
    <>
      {/* Atmospheric Fog for Depth */}
      <fogExp2 attach="fog" color="#040814" density={0.035} />

      {/* Controlled Studio Lighting */}
      <ambientLight intensity={0.65} />
      <directionalLight position={[12, 18, 12]} intensity={1.6} color="#ffffff" />
      <pointLight position={[-12, 10, -6]} intensity={2.2} color="#089981" />
      <pointLight position={[12, 6, 6]} intensity={2.0} color="#FFD700" />
      <pointLight position={[0, -4, 6]} intensity={1.4} color="#2962FF" />

      {/* 3D Scene Components */}
      <CandlestickCluster isMobile={isMobile} />
      <ChartGrid isMobile={isMobile} />
      <TechnicalIndicators progress={progress} isMobile={isMobile} />
      <FloatingParticles isMobile={isMobile} />
    </>
  );
}

export default MarketScene;
