import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import CandlestickCluster from './CandlestickCluster';
import ChartGrid from './ChartGrid';
import TechnicalIndicators from './TechnicalIndicators';
import FloatingParticles from './FloatingParticles';

export function MarketScene({ progress = 0, isMobile = false }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(2.5, 3.2, 10.5));
  const targetLook = useRef(new THREE.Vector3(1.2, 0.8, 0));
  const currentLook = useRef(new THREE.Vector3(1.2, 0.8, 0));
  const mouseRef = useRef({ x: 0, y: 0 });

  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check reduced motion OS preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handleChange = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    // Desktop Subtle Mouse Parallax
    const handleMouseMove = (e) => {
      if (isMobile) return;
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 0.35,
        y: (e.clientY / window.innerHeight - 0.5) * 0.35
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobile]);

  useFrame((state, delta) => {
    let px = 2.5, py = 3.2, pz = 10.5;
    let lx = 1.2, ly = 0.8, lz = 0;

    if (reducedMotion) {
      // Gentle stationary Apple-style composition
      px = isMobile ? 0 : 2.2;
      py = 2.8; pz = 9.5;
      lx = isMobile ? 0 : 1.0;
      ly = 0.5; lz = 0;
    } else {
      // 5-Phase Cinematic Camera Choreography
      if (progress < 0.22) {
        // Phase 1: Establishing Wide Cinematic Composition (~60% Chart framing right)
        const t = progress / 0.22;
        px = THREE.MathUtils.lerp(isMobile ? 0 : 2.5, isMobile ? -1 : 0.8, t);
        py = THREE.MathUtils.lerp(3.2, 2.0, t);
        pz = THREE.MathUtils.lerp(10.5, 7.8, t);
        lx = THREE.MathUtils.lerp(isMobile ? 0 : 1.2, -0.5, t);
        ly = THREE.MathUtils.lerp(0.8, 1.0, t);
        lz = THREE.MathUtils.lerp(0, -0.8, t);
      } else if (progress < 0.52) {
        // Phase 2: Price Action Fly-Through into Candlestick Corridor
        const t = (progress - 0.22) / 0.30;
        px = THREE.MathUtils.lerp(isMobile ? -1 : 0.8, 2.8, t);
        py = THREE.MathUtils.lerp(2.0, 2.2, t);
        pz = THREE.MathUtils.lerp(7.8, 4.5, t);
        lx = THREE.MathUtils.lerp(-0.5, 1.0, t);
        ly = THREE.MathUtils.lerp(1.0, 1.2, t);
        lz = THREE.MathUtils.lerp(-0.8, -1.5, t);
      } else if (progress < 0.78) {
        // Phase 3: Analysis Focus on MA, Support/Resistance & Volume Lines
        const t = (progress - 0.52) / 0.26;
        px = THREE.MathUtils.lerp(2.8, isMobile ? 0 : 1.5, t);
        py = THREE.MathUtils.lerp(2.2, 4.8, t);
        pz = THREE.MathUtils.lerp(4.5, 12.5, t);
        lx = THREE.MathUtils.lerp(1.0, 0.5, t);
        ly = THREE.MathUtils.lerp(1.2, 0.6, t);
        lz = THREE.MathUtils.lerp(-1.5, 0, t);
      } else {
        // Phase 4 & 5: Panoramic Master Pullback & Final CTA Frame
        const t = (progress - 0.78) / 0.22;
        px = THREE.MathUtils.lerp(isMobile ? 0 : 1.5, isMobile ? 0 : 2.0, t);
        py = THREE.MathUtils.lerp(4.8, 3.2, t);
        pz = THREE.MathUtils.lerp(12.5, 9.8, t);
        lx = isMobile ? 0 : 1.0;
        ly = 0.6; lz = 0;
      }
    }

    // Apply Subtle Mouse Move Parallax (Desktop only)
    if (!isMobile && !reducedMotion) {
      px += mouseRef.current.x * 0.6;
      py += -mouseRef.current.y * 0.6;
      lx += mouseRef.current.x * 0.25;
      ly += -mouseRef.current.y * 0.25;
    }

    targetPos.current.set(px, py, pz);
    targetLook.current.set(lx, ly, lz);

    // Frame-rate independent smooth lerp
    const lerpSpeed = Math.min(1, delta * 3.6);
    camera.position.lerp(targetPos.current, lerpSpeed);
    currentLook.current.lerp(targetLook.current, lerpSpeed);
    camera.lookAt(currentLook.current);
  });

  return (
    <>
      {/* Dark Ambient Atmosphere & Soft Depth Fog */}
      <fogExp2 attach="fog" color="#040814" density={0.038} />

      {/* Cinematic Studio Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 16, 10]} intensity={1.4} color="#ffffff" />
      <pointLight position={[-10, 8, -5]} intensity={1.8} color="#059669" />
      <pointLight position={[10, 6, 6]} intensity={1.6} color="#f59e0b" />
      <pointLight position={[0, -4, 6]} intensity={1.0} color="#0284c7" />

      {/* 3D Scene Components */}
      <CandlestickCluster isMobile={isMobile} />
      <ChartGrid isMobile={isMobile} />
      <TechnicalIndicators progress={progress} isMobile={isMobile} />
      <FloatingParticles isMobile={isMobile} />
    </>
  );
}

export default MarketScene;
