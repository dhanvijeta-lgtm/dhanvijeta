import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const GLOBE_RADIUS = 4.2;

const LAND_REGIONS = [
  { lat: [25, 70], lon: [-130, -65], count: 900 },
  { lat: [50, 72], lon: [-168, -128], count: 220 },
  { lat: [8, 25], lon: [-105, -77], count: 160 },
  { lat: [-55, 12], lon: [-82, -34], count: 650 },
  { lat: [36, 71], lon: [-12, 42], count: 520 },
  { lat: [-35, 37], lon: [-18, 52], count: 580 },
  { lat: [12, 42], lon: [25, 62], count: 220 },
  { lat: [5, 55], lon: [60, 145], count: 950 },
  { lat: [8, 35], lon: [68, 92], count: 280 },
  { lat: [-10, 25], lon: [95, 130], count: 320 },
  { lat: [30, 46], lon: [128, 146], count: 130 },
  { lat: [-44, -10], lon: [113, 154], count: 260 },
  { lat: [60, 84], lon: [-55, -20], count: 90 },
  { lat: [-10, 6], lon: [95, 140], count: 210 },
  { lat: [62, 72], lon: [15, 35], count: 80 }
];

function latLonToXYZ(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function generateLandParticles(radius) {
  const positions = [];
  const colors = [];

  LAND_REGIONS.forEach((region) => {
    for (let i = 0; i < region.count; i++) {
      const lat = region.lat[0] + Math.random() * (region.lat[1] - region.lat[0]);
      const lon = region.lon[0] + Math.random() * (region.lon[1] - region.lon[0]);
      const v = latLonToXYZ(lat, lon, radius + (Math.random() - 0.5) * 0.06);
      positions.push(v.x, v.y, v.z);

      const warmth = 0.75 + Math.random() * 0.25;
      colors.push(1.0 * warmth, 0.72 * warmth, 0.15 * warmth);
    }
  });

  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors)
  };
}

function generateOceanParticles(radius, count = 400) {
  const positions = [];
  for (let i = 0; i < count; i++) {
    const phi = Math.acos(-1 + (2 * i) / count);
    const theta = Math.sqrt(count * Math.PI) * phi;
    positions.push(
      radius * Math.cos(theta) * Math.sin(phi),
      radius * Math.sin(theta) * Math.sin(phi),
      radius * Math.cos(phi)
    );
  }
  return new Float32Array(positions);
}

function GoldenLandParticles({ radius, isMobile }) {
  const ref = useRef();
  const { positions, colors } = useMemo(() => generateLandParticles(radius), [radius]);
  const scale = isMobile ? 0.85 : 1;

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.material.opacity = 0.9 + Math.sin(t * 1.2) * 0.08;
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.09 * scale}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.95}
      />
    </Points>
  );
}

function AtmosphereParticles({ radius, isMobile }) {
  const ref = useRef();
  const positions = useMemo(() => generateOceanParticles(radius, isMobile ? 180 : 350), [radius, isMobile]);

  useFrame((state, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.015;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00E5FF"
        size={isMobile ? 0.03 : 0.04}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.35}
      />
    </Points>
  );
}

function OrbitArc({ radius, rotation, speed, color, opacity = 0.4 }) {
  const groupRef = useRef();
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 120; i++) {
      const t = (i / 120) * Math.PI * 1.85;
      pts.push(
        new THREE.Vector3(
          Math.cos(t) * radius,
          Math.sin(t) * radius * 0.12,
          Math.sin(t) * radius * 0.92
        )
      );
    }
    return pts;
  }, [radius]);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * speed;
  });

  return (
    <group ref={groupRef} rotation={rotation}>
      <Line points={points} color={color} lineWidth={1} transparent opacity={opacity} />
    </group>
  );
}

function GlobeScene({ isMobile }) {
  const globeRef = useRef();
  const radius = isMobile ? GLOBE_RADIUS * 0.85 : GLOBE_RADIUS;

  useFrame((state, delta) => {
    if (!globeRef.current) return;
    globeRef.current.rotation.y += delta * 0.06;
    globeRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.15) * 0.06 - 0.12;
  });

  return (
    <group ref={globeRef}>
      {/* Dark sphere body */}
      <mesh>
        <sphereGeometry args={[radius * 0.992, 48, 48]} />
        <meshBasicMaterial color="#04070d" transparent opacity={1} />
      </mesh>

      {/* Subtle wireframe mesh */}
      <mesh>
        <sphereGeometry args={[radius * 1.002, 36, 36]} />
        <meshBasicMaterial color="#1a2840" wireframe transparent opacity={0.08} />
      </mesh>

      {/* Golden city-light landmass particles */}
      <GoldenLandParticles radius={radius} isMobile={isMobile} />

      {/* Sparse cyan atmosphere dots */}
      <AtmosphereParticles radius={radius * 1.01} isMobile={isMobile} />

      {/* Cyan orbit arcs */}
      <OrbitArc
        radius={radius * 1.35}
        rotation={[0.4, 0.2, 0.15]}
        speed={0.08}
        color="#00E5FF"
        opacity={0.35}
      />
      <OrbitArc
        radius={radius * 1.48}
        rotation={[0.8, -0.3, 0.5]}
        speed={-0.05}
        color="#00FFC2"
        opacity={0.22}
      />
      <OrbitArc
        radius={radius * 1.22}
        rotation={[-0.5, 0.6, -0.2]}
        speed={0.06}
        color="#00E5FF"
        opacity={0.18}
      />
    </group>
  );
}

function GlobeCanvas({ isMobile }) {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 13], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      dpr={isMobile ? 1 : Math.min(window.devicePixelRatio, 2)}
    >
      <ambientLight intensity={0.15} />
      <pointLight position={[8, 6, 10]} intensity={0.6} color="#FFB800" />
      <pointLight position={[-6, -4, 8]} intensity={0.25} color="#00E5FF" />
      <Suspense fallback={null}>
        <GlobeScene isMobile={isMobile} />
      </Suspense>
    </Canvas>
  );
}

export function DigitalGlobe({ pointer = { x: 0, y: 0 } }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
      {/* Golden ambient glow behind globe */}
      <div
        className="absolute top-[0%] left-[10%] sm:left-[18%] w-[90vw] sm:w-[75vw] h-[70vh] motion-reduce:opacity-80"
        style={{
          background: 'radial-gradient(ellipse at 45% 40%, rgba(255,184,0,0.28) 0%, rgba(255,159,0,0.08) 35%, transparent 68%)',
          transform: `translate(${pointer.x * 0.6}px, ${pointer.y * 0.6}px)`
        }}
      />

      {/* Secondary teal rim glow */}
      <div
        className="absolute top-[5%] left-[15%] sm:left-[22%] w-[80vw] sm:w-[65vw] h-[60vh] opacity-60"
        style={{
          background: 'radial-gradient(ellipse at 50% 45%, rgba(0,229,255,0.06) 0%, transparent 55%)',
          transform: `translate(${pointer.x * 0.8}px, ${pointer.y * 0.8}px)`
        }}
      />

      {/* Three.js globe canvas */}
      <div
        className="absolute top-[-2%] left-[5%] sm:left-[12%] w-[95vw] sm:w-[78vw] lg:w-[68vw] h-[68vh] sm:h-[72vh]"
        style={{
          transform: `translate(${pointer.x * 1.2}px, ${pointer.y * 1.2}px) rotateX(${pointer.y * -0.2}deg) rotateY(${pointer.x * 0.4}deg)`
        }}
      >
        <GlobeCanvas isMobile={isMobile} />
      </div>
    </div>
  );
}

export default DigitalGlobe;
