import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { useMotion } from '../../store/MotionContext';
import GPUInstancedParticles from './GPUInstancedParticles';
import CanvasFallback from './CanvasFallback';

// ----------------------------------------------------
// THREE.JS SCENE ELEMENTS PER PAGE MODE
// ----------------------------------------------------

// 1. HOME SCENE: Floating Trading Candlesticks & Market Waves
function HomeScene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#f59e0b" />
      <pointLight position={[-10, -10, -10]} intensity={1.2} color="#00e5a0" />
      {/* Dynamic 3D Candlestick indicators */}
      <mesh position={[-5, 2, -4]}>
        <boxGeometry args={[0.3, 1.8, 0.3]} />
        <meshStandardMaterial color="#00e5a0" roughness={0.2} metalness={0.6} transparent opacity={0.8} />
      </mesh>
      <mesh position={[5, -2, -5]}>
        <boxGeometry args={[0.3, 1.4, 0.3]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.2} metalness={0.6} transparent opacity={0.8} />
      </mesh>
      <mesh position={[-3, -3, -6]}>
        <boxGeometry args={[0.25, 2.2, 0.25]} />
        <meshStandardMaterial color="#00e5ff" roughness={0.2} metalness={0.6} transparent opacity={0.7} />
      </mesh>
    </>
  );
}

// 2. COURSES SCENE: Connected 3D Neural Knowledge Grid Nodes
function CoursesScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 5, 5]} intensity={2.0} color="#00e5ff" />
      <pointLight position={[-5, -5, -5]} intensity={1.0} color="#f59e0b" />
      <mesh position={[0, 0, -4]}>
        <octahedronGeometry args={[2, 2]} />
        <meshStandardMaterial color="#00e5ff" wireframe transparent opacity={0.35} />
      </mesh>
    </>
  );
}

// 3. DEMO VIDEOS SCENE: Audio Waveform & Media Pulses
function DemoVideosScene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[0, 0, 5]} intensity={1.8} color="#00e5a0" />
      <mesh position={[0, 0, -5]}>
        <torusGeometry args={[3, 0.08, 16, 100]} />
        <meshStandardMaterial color="#00e5a0" wireframe transparent opacity={0.4} />
      </mesh>
    </>
  );
}

// 4. BLOG SCENE: Data Feeds & Signal Nodes
function BlogScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[8, -5, 5]} intensity={1.6} color="#f59e0b" />
      <mesh position={[4, 2, -5]}>
        <icosahedronGeometry args={[1.8, 1]} />
        <meshStandardMaterial color="#f59e0b" wireframe transparent opacity={0.3} />
      </mesh>
    </>
  );
}

// 5. ABOUT SCENE: Global Wireframe Financial Globe Network
function AboutScene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[-5, 5, 5]} intensity={2.2} color="#00e5a0" />
      <mesh position={[-3, 1, -4]}>
        <sphereGeometry args={[2.5, 24, 24]} />
        <meshStandardMaterial color="#00e5a0" wireframe transparent opacity={0.25} />
      </mesh>
    </>
  );
}

// 6. CONTACT SCENE: Communication Signal Pulses & Radar Beacons
function ContactScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 8]} intensity={1.5} color="#00e5ff" />
      <mesh position={[0, 0, -4]}>
        <ringGeometry args={[1.5, 1.55, 64]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.5} side={2} />
      </mesh>
    </>
  );
}

// 7. AUTH SCENE: Minimal Futuristic Matrix Security Environment
function AuthScene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 5]} intensity={1.2} color="#f59e0b" />
    </>
  );
}

// ----------------------------------------------------
// MAIN CINEMATIC BACKGROUND COMPONENT
// ----------------------------------------------------
export function CinematicBackground({ forceAuthMode = false }) {
  const location = useLocation();
  const { perfConfig } = useMotion();

  // Determine current page mode & theme energy
  const pageMode = useMemo(() => {
    if (forceAuthMode) return 'AUTH';
    const path = location.pathname;

    if (path === '/') return 'HOME';
    if (path.startsWith('/courses')) return 'COURSES';
    if (path.startsWith('/demo-videos')) return 'DEMO_VIDEOS';
    if (path.startsWith('/blog')) return 'BLOG';
    if (path === '/about') return 'ABOUT';
    if (path === '/contact') return 'CONTACT';
    if (path === '/verify-email' || path === '/reset-password') return 'AUTH';
    if (path.startsWith('/dashboard') || path.startsWith('/my-batch') || path.startsWith('/admin')) return 'DASHBOARD';

    return 'HOME';
  }, [location.pathname, forceAuthMode]);

  // Dynamic Theme Colors based on spec
  const theme = useMemo(() => {
    switch (pageMode) {
      case 'HOME':
        return 'gold'; // Gold + Emerald + Cyan
      case 'COURSES':
        return 'cyan'; // Gold + Cyan
      case 'DEMO_VIDEOS':
        return 'emerald'; // Cyan + Emerald
      case 'BLOG':
        return 'gold'; // Gold + Cyan
      case 'ABOUT':
        return 'emerald'; // Emerald + Cyan
      case 'CONTACT':
        return 'cyan'; // Gold + Cyan
      case 'AUTH':
        return 'auth'; // Gold + Emerald
      case 'DASHBOARD':
      default:
        return 'gold';
    }
  }, [pageMode]);

  // Fallback to pure Canvas 2D if WebGL is disabled or tier is LOW
  if (!perfConfig.enableWebGL) {
    return <CanvasFallback theme={theme} />;
  }

  return (
    <div id="three-background-canvas" className="pointer-events-none fixed inset-0 z-[-10] overflow-hidden">
      {/* LAYER 1: Deep Black & Navy Background Gradient */}
      <div className="absolute inset-0 bg-[#030710]" />

      {/* Dynamic Ambient Spotlights according to theme */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(245,158,11,0.15),transparent_70%)]" />
      <div className="absolute top-1/4 left-1/10 w-[500px] h-[500px] bg-[#f59e0b]/8 rounded-full blur-[140px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/3 right-1/10 w-[550px] h-[550px] bg-[#00e5a0]/8 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-2/3 left-1/3 w-[450px] h-[450px] bg-[#00e5ff]/6 rounded-full blur-[150px] pointer-events-none" />

      {/* LAYER 3: Financial Grid & SVG Data Stream Overlay */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* PAGE MODE SVG DATA STREAM ACCENTS */}
      <svg
        className="absolute w-full h-[500px] top-[15%] left-0 opacity-20 pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 1440 500"
      >
        <defs>
          <linearGradient id="cinematicGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#00e5a0" />
            <stop offset="100%" stopColor="#00e5ff" />
          </linearGradient>
        </defs>
        <path
          d="M0 350 Q 360 150, 720 280 T 1440 180"
          fill="none"
          stroke="url(#cinematicGrad)"
          strokeWidth="2.5"
          className="drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]"
        />
      </svg>

      {/* LAYER 2 & 4: ThreeJS Canvas Scene & GPU Instanced Particles */}
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 2]}>
        <GPUInstancedParticles count={perfConfig.particleCount} theme={theme} />

        {pageMode === 'HOME' && <HomeScene />}
        {pageMode === 'COURSES' && <CoursesScene />}
        {pageMode === 'DEMO_VIDEOS' && <DemoVideosScene />}
        {pageMode === 'BLOG' && <BlogScene />}
        {pageMode === 'ABOUT' && <AboutScene />}
        {pageMode === 'CONTACT' && <ContactScene />}
        {pageMode === 'AUTH' && <AuthScene />}
      </Canvas>

      {/* LAYER 5: Dark Vignette & Readability Safeguard */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030710]/80 via-transparent to-[#030710]/90 pointer-events-none" />
    </div>
  );
}

export default CinematicBackground;
