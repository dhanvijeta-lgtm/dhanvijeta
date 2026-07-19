import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

function Particles() {
  const ref = useRef();
  const [positions] = useState(() => {
    const pos = new Float32Array(400);
    for (let i = 0; i < 400; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  });

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.03;
      ref.current.rotation.x += delta * 0.01;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#2962FF"
        size={0.07}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.4}
      />
    </Points>
  );
}

function Candlestick({ position, color, height }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      groupRef.current.position.y = position[1] + Math.sin(time * 0.8 + position[0]) * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Wick */}
      <mesh>
        <cylinderGeometry args={[0.015, 0.015, height * 1.6, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} />
      </mesh>
      {/* Body */}
      <mesh>
        <boxGeometry args={[0.18, height, 0.18]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.5} transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.8} color="#2962FF" />
      <pointLight position={[-10, -10, -10]} intensity={1.2} color="#089981" />
      <Particles />

      {/* Floating TradingView Candlesticks */}
      <Candlestick position={[-6, 2, -4]} color="#089981" height={0.9} />
      <Candlestick position={[-4, -1, -3]} color="#f43f5e" height={0.7} />
      <Candlestick position={[5, 2.5, -4]} color="#089981" height={0.8} />
      <Candlestick position={[7, -2, -5]} color="#2962FF" height={1.1} />
      <Candlestick position={[-2, 3, -5]} color="#089981" height={0.6} />
      <Candlestick position={[3, -3, -4]} color="#f43f5e" height={0.8} />
    </>
  );
}

export function AnimatedBackground() {
  return (
    <div id="three-background-canvas" className="pointer-events-none fixed inset-0 z-[-10] overflow-hidden">
      {/* 1. TradingView Signature Dark Grid Base */}
      <div className="absolute inset-0 bg-[#090d16]" />

      {/* 2. TradingView Ambient Radial Glow Spotlights */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(41,98,255,0.22),transparent_70%)]" />
      <div className="absolute top-1/4 left-1/10 w-[500px] h-[500px] bg-[#2962FF]/10 rounded-full blur-[140px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/3 right-1/10 w-[550px] h-[550px] bg-[#089981]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-2/3 left-1/3 w-[450px] h-[450px] bg-[#7C3AED]/8 rounded-full blur-[150px] pointer-events-none" />

      {/* 3. TradingView Precision Financial Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.07) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />

      {/* 4. TradingView Micro Sub-Grid Dots & Crosshairs */}
      <div 
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* 5. Animated Financial SVG Wave Line (TradingView Stock Chart Trend) */}
      <svg 
        className="absolute w-full h-[600px] top-[10%] left-0 opacity-25 pointer-events-none" 
        preserveAspectRatio="none" 
        viewBox="0 0 1440 600"
      >
        <defs>
          <linearGradient id="tvChartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2962FF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#2962FF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="tvStrokeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2962FF" />
            <stop offset="50%" stopColor="#089981" />
            <stop offset="100%" stopColor="#00E5FF" />
          </linearGradient>
        </defs>

        {/* Chart Area Fill */}
        <path 
          d="M0 450 Q 240 300, 480 380 T 960 220 T 1440 180 L 1440 600 L 0 600 Z" 
          fill="url(#tvChartGrad)"
        />

        {/* Glowing Stock Wave Line */}
        <path 
          d="M0 450 Q 240 300, 480 380 T 960 220 T 1440 180" 
          fill="none" 
          stroke="url(#tvStrokeGrad)" 
          strokeWidth="3.5" 
          className="drop-shadow-[0_0_12px_rgba(41,98,255,0.8)]"
        />

        {/* Floating Indicator Ticks along the Chart */}
        <circle cx="480" cy="380" r="5" fill="#089981" className="animate-ping" />
        <circle cx="480" cy="380" r="4" fill="#089981" />
        <circle cx="960" cy="220" r="5" fill="#2962FF" className="animate-ping" />
        <circle cx="960" cy="220" r="4" fill="#2962FF" />
      </svg>

      {/* 6. ThreeJS 3D Particles & Floating Candlestick Canvas Layer */}
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <Scene />
      </Canvas>
    </div>
  );
}

export default AnimatedBackground;
