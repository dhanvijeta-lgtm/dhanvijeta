import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

function Particles() {
  const ref = useRef();
  const [positions] = useState(() => {
    const pos = new Float32Array(300);
    for (let i = 0; i < 300; i++) {
      pos[i] = (Math.random() - 0.5) * 20;
    }
    return pos;
  });

  useFrame((state, delta) => {
    ref.current.rotation.y += delta * 0.05;
    ref.current.rotation.x += delta * 0.02;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.06}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.3}
      />
    </Points>
  );
}

function FloatingCoin({ position, speed }) {
  const coinRef = useRef();

  useFrame((state, delta) => {
    if (coinRef.current) {
      coinRef.current.rotation.y += delta * speed;
      coinRef.current.rotation.x += delta * 0.2;
      coinRef.current.position.y += Math.sin(state.clock.getElapsedTime() + position[0]) * 0.003;
    }
  });

  return (
    <mesh ref={coinRef} position={position}>
      <cylinderGeometry args={[0.3, 0.3, 0.05, 32]} />
      <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.1} />
    </mesh>
  );
}

function Candlestick({ position, color, height }) {
  const wickRef = useRef();
  const bodyRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const drift = Math.sin(time + position[0]) * 0.05;
    if (wickRef.current) wickRef.current.position.y = position[1] + drift;
    if (bodyRef.current) bodyRef.current.position.y = position[1] + drift;
  });

  return (
    <group>
      {/* Wick */}
      <mesh ref={wickRef} position={[position[0], position[1], position[2]]}>
        <cylinderGeometry args={[0.02, 0.02, height * 1.5, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Body */}
      <mesh ref={bodyRef} position={[position[0], position[1], position[2]]}>
        <boxGeometry args={[0.2, height, 0.2]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#10b981" />
      <Particles />
      {/* Floating Gold Coins */}
      <FloatingCoin position={[-4, 2, -3]} speed={0.5} />
      <FloatingCoin position={[5, -3, -4]} speed={0.8} />
      <FloatingCoin position={[-6, -2, -5]} speed={0.4} />
      <FloatingCoin position={[3, 3, -3]} speed={0.6} />

      {/* Floating Candlesticks */}
      <Candlestick position={[-2, 1, -2]} color="#10b981" height={0.6} />
      <Candlestick position={[1, -1.5, -3]} color="#f43f5e" height={0.8} />
      <Candlestick position={[4, 1.8, -2.5]} color="#10b981" height={0.5} />
      <Candlestick position={[-5, -1, -3]} color="#f43f5e" height={0.7} />
    </>
  );
}

export function AnimatedBackground() {
  return (
    <div id="three-background-canvas">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <Scene />
      </Canvas>
    </div>
  );
}

export default AnimatedBackground;
