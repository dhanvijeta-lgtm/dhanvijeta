import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import CandlestickCluster from './CandlestickCluster';
import ChartGrid from './ChartGrid';
import TechnicalIndicators from './TechnicalIndicators';
import FloatingParticles from './FloatingParticles';

export function MarketScene({ progress = 0, isMobile = false }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(2.2, 3.0, 10.0));
  const targetLook = useRef(new THREE.Vector3(1.0, 0.6, 0));
  const currentLook = useRef(new THREE.Vector3(1.0, 0.6, 0));
  const mouseRef = useRef({ x: 0, y: 0 });

  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check OS reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handleChange = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    // Desktop 3-Layer Cursor Mouse Parallax Listener
    const handleMouseMove = (e) => {
      if (isMobile) return;
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 0.45,
        y: (e.clientY / window.innerHeight - 0.5) * 0.45
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobile]);

  useFrame((state, delta) => {
    let px = 2.2, py = 3.0, pz = 10.0;
    let lx = 1.0, ly = 0.6, lz = 0;

    if (reducedMotion) {
      // Gentle stationary Apple-style composition
      px = isMobile ? 0 : 2.0;
      py = 2.6; pz = 9.2;
      lx = isMobile ? 0 : 0.8;
      ly = 0.5; lz = 0;
    } else {
      // 5-Phase Cinematic Camera Path
      if (progress < 0.22) {
        // Phase 1: Establishing Wide Cinematic Framing (~65% Chart framing right)
        const t = progress / 0.22;
        px = THREE.MathUtils.lerp(isMobile ? 0 : 2.2, isMobile ? -0.8 : 0.6, t);
        py = THREE.MathUtils.lerp(3.0, 1.8, t);
        pz = THREE.MathUtils.lerp(10.0, 7.5, t);
        lx = THREE.MathUtils.lerp(isMobile ? 0 : 1.0, -0.4, t);
        ly = THREE.MathUtils.lerp(0.6, 0.9, t);
        lz = THREE.MathUtils.lerp(0, -0.8, t);
      } else if (progress < 0.52) {
        // Phase 2: Price Action Fly-Through into Candlestick Corridor
        const t = (progress - 0.22) / 0.30;
        px = THREE.MathUtils.lerp(isMobile ? -0.8 : 0.6, 2.5, t);
        py = THREE.MathUtils.lerp(1.8, 2.0, t);
        pz = THREE.MathUtils.lerp(7.5, 4.2, t);
        lx = THREE.MathUtils.lerp(-0.4, 0.8, t);
        ly = THREE.MathUtils.lerp(0.9, 1.1, t);
        lz = THREE.MathUtils.lerp(-0.8, -1.4, t);
      } else if (progress < 0.78) {
        // Phase 3: Analysis Focus on Technical Indicators & Volume
        const t = (progress - 0.52) / 0.26;
        px = THREE.MathUtils.lerp(2.5, isMobile ? 0 : 1.2, t);
        py = THREE.MathUtils.lerp(2.0, 4.5, t);
        pz = THREE.MathUtils.lerp(4.2, 12.0, t);
        lx = THREE.MathUtils.lerp(0.8, 0.4, t);
        ly = THREE.MathUtils.lerp(1.1, 0.5, t);
        lz = THREE.MathUtils.lerp(-1.4, 0, t);
      } else {
        // Phase 4 & 5: Panoramic Master Pullback & Final CTA Frame
        const t = (progress - 0.78) / 0.22;
        px = THREE.MathUtils.lerp(isMobile ? 0 : 1.2, isMobile ? 0 : 1.8, t);
        py = THREE.MathUtils.lerp(4.5, 3.0, t);
        pz = THREE.MathUtils.lerp(12.0, 9.5, t);
        lx = isMobile ? 0 : 0.8;
        ly = 0.5; lz = 0;
      }
    }

    // Apply Layer 2 Cursor Parallax (2x speed on 3D objects)
    if (!isMobile && !reducedMotion) {
      px += mouseRef.current.x * 0.7;
      py += -mouseRef.current.y * 0.7;
      lx += mouseRef.current.x * 0.3;
      ly += -mouseRef.current.y * 0.3;
    }

    targetPos.current.set(px, py, pz);
    targetLook.current.set(lx, ly, lz);

    // Smooth lerp camera position
    const lerpSpeed = Math.min(1, delta * 3.8);
    camera.position.lerp(targetPos.current, lerpSpeed);
    currentLook.current.lerp(targetLook.current, lerpSpeed);
    camera.lookAt(currentLook.current);
  });

  return (
    <>
      {/* Dark Ambient Atmosphere & Soft Depth Fog */}
      <fogExp2 attach="fog" color="#040814" density={0.035} />

      {/* Cinematic Studio Lighting */}
      <ambientLight intensity={0.65} />
      <directionalLight position={[10, 16, 10]} intensity={1.5} color="#ffffff" />
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
