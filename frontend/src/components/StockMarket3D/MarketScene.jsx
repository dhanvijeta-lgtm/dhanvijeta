import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import CandlestickCluster from './CandlestickCluster';
import ChartGrid from './ChartGrid';
import TechnicalIndicators from './TechnicalIndicators';
import FloatingParticles from './FloatingParticles';
import DigitalGlobe from './DigitalGlobe';

export function MarketScene({ progress = 0, isMobile = false }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0.5, 11.5));
  const targetLook = useRef(new THREE.Vector3(0, 0.2, 0));
  const currentLook = useRef(new THREE.Vector3(0, 0.2, 0));
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
    let px = 0, py = 0.5, pz = 11.5;
    let lx = 0, ly = 0.2, lz = 0;

    if (reducedMotion) {
      // Gentle stationary composition
      px = 0; py = 0.4; pz = 10.8;
      lx = 0; ly = 0.2; lz = 0;
    } else {
      // 5-Phase Camera Path framing the steep chart trajectory
      if (progress < 0.22) {
        // Phase 1: Wide View framing full steep chart matching attached image
        const t = progress / 0.22;
        px = THREE.MathUtils.lerp(0, -1.8, t);
        py = THREE.MathUtils.lerp(0.5, 0.2, t);
        pz = THREE.MathUtils.lerp(11.5, 8.8, t);
        lx = THREE.MathUtils.lerp(0, -0.4, t);
        ly = THREE.MathUtils.lerp(0.2, 0.5, t);
        lz = THREE.MathUtils.lerp(0, -0.8, t);
      } else if (progress < 0.52) {
        // Phase 2: Fly-Through into Steep Candlestick Trail
        const t = (progress - 0.22) / 0.30;
        px = THREE.MathUtils.lerp(-1.8, 2.2, t);
        py = THREE.MathUtils.lerp(0.2, 1.2, t);
        pz = THREE.MathUtils.lerp(8.8, 5.2, t);
        lx = THREE.MathUtils.lerp(-0.4, 0.6, t);
        ly = THREE.MathUtils.lerp(0.5, 0.8, t);
        lz = THREE.MathUtils.lerp(-0.8, -1.2, t);
      } else if (progress < 0.78) {
        // Phase 3: Analysis Focus on MA, Support/Resistance & Volume
        const t = (progress - 0.52) / 0.26;
        px = THREE.MathUtils.lerp(2.2, 0, t);
        py = THREE.MathUtils.lerp(1.2, 3.5, t);
        pz = THREE.MathUtils.lerp(5.2, 13.0, t);
        lx = THREE.MathUtils.lerp(0.6, 0, t);
        ly = THREE.MathUtils.lerp(0.8, 0.3, t);
        lz = THREE.MathUtils.lerp(-1.2, 0, t);
      } else {
        // Phase 4 & 5: Panoramic Master Pullback & Final CTA Frame
        const t = (progress - 0.78) / 0.22;
        px = THREE.MathUtils.lerp(0, 0, t);
        py = THREE.MathUtils.lerp(3.5, 0.6, t);
        pz = THREE.MathUtils.lerp(13.0, 11.2, t);
        lx = 0; ly = 0.2; lz = 0;
      }
    }

    // Apply Desktop Mouse Move Parallax
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
      <fogExp2 attach="fog" color="#040814" density={0.032} />

      {/* Studio Lighting */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 16, 10]} intensity={1.6} color="#ffffff" />
      <pointLight position={[-10, 8, -5]} intensity={2.0} color="#059669" />
      <pointLight position={[10, 6, 6]} intensity={1.8} color="#f59e0b" />
      <pointLight position={[0, -4, 6]} intensity={1.2} color="#00E5FF" />

      {/* 3D Digital Globe in Top-Left Background */}
      <DigitalGlobe isMobile={isMobile} />

      {/* 3D Scene Components */}
      <CandlestickCluster isMobile={isMobile} />
      <ChartGrid isMobile={isMobile} />
      <TechnicalIndicators progress={progress} isMobile={isMobile} />
      <FloatingParticles isMobile={isMobile} />
    </>
  );
}

export default MarketScene;
