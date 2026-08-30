import React, { useEffect, useRef, useState, useMemo } from 'react';
import Globe from 'globe.gl';
import * as THREE from 'three';

// Financial Hub Cities (Lat, Lng, Name)
const FINANCIAL_HUBS = [
  { name: 'Mumbai', lat: 19.076, lng: 72.8777, color: '#00e5a0' },
  { name: 'New York', lat: 40.7128, lng: -74.006, color: '#00e5ff' },
  { name: 'London', lat: 51.5074, lng: -0.1278, color: '#00e5a0' },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503, color: '#f59e0b' },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198, color: '#00e5ff' },
  { name: 'Frankfurt', lat: 50.1109, lng: 8.6821, color: '#00e5a0' },
  { name: 'Hong Kong', lat: 22.3193, lng: 114.1694, color: '#f59e0b' },
  { name: 'Dubai', lat: 25.2048, lng: 55.2708, color: '#00e5ff' },
  { name: 'Sydney', lat: -33.8688, lng: 151.2093, color: '#00e5a0' },
  { name: 'São Paulo', lat: -23.5505, lng: -46.6333, color: '#00e5ff' }
];

// Generate Satellites & Orbital Arcs Data
function generateOrbitalData() {
  const arcs = [];
  const satellites = [];

  // Generate interconnecting financial data stream arcs
  for (let i = 0; i < FINANCIAL_HUBS.length; i++) {
    const start = FINANCIAL_HUBS[i];
    const end = FINANCIAL_HUBS[(i + 1) % FINANCIAL_HUBS.length];
    const alt = 0.15 + (i % 3) * 0.1;

    arcs.push({
      startLat: start.lat,
      startLng: start.lng,
      endLat: end.lat,
      endLng: end.lng,
      color: [start.color, end.color],
      arcAlt: alt
    });

    // Cross-regional data streams
    if (i % 2 === 0) {
      const target = FINANCIAL_HUBS[(i + 4) % FINANCIAL_HUBS.length];
      arcs.push({
        startLat: start.lat,
        startLng: start.lng,
        endLat: target.lat,
        endLng: target.lng,
        color: ['#00e5a0', '#f59e0b'],
        arcAlt: 0.35
      });
    }
  }

  // Generate 40 Orbiting Satellites around Earth
  for (let i = 0; i < 40; i++) {
    const lat = (Math.random() - 0.5) * 160;
    const lng = (Math.random() - 0.5) * 360;
    const alt = 0.12 + Math.random() * 0.35;
    const radius = 0.4 + Math.random() * 0.5;
    const color = i % 3 === 0 ? '#00e5a0' : i % 3 === 1 ? '#00e5ff' : '#f59e0b';

    satellites.push({
      lat,
      lng,
      alt,
      radius,
      color
    });
  }

  return { arcs, satellites };
}

// Procedural Canvas Night Map texture fallback if CDN texture fails
function createProceduralNightTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#030814';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'rgba(0, 229, 160, 0.4)';
  for (let i = 0; i < 1800; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = Math.random() * 1.5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas.toDataURL();
}

export function DigitalGlobe({ pointer = { x: 0, y: 0 } }) {
  const containerRef = useRef(null);
  const globeInstanceRef = useRef(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const { arcs, satellites } = useMemo(() => generateOrbitalData(), []);

  useEffect(() => {
    if (!containerRef.current) return;

    // WebGL Availability Check
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    let globeInstance = null;

    try {
      const width = containerRef.current.clientWidth || 800;
      const height = containerRef.current.clientHeight || 700;

      // Primary Texture URLs + Fallback
      const nightTexture = '//unpkg.com/three-globe/example/img/earth-night.jpg';
      const bumpTexture = '//unpkg.com/three-globe/example/img/earth-topology.png';

      // Instantiate Globe.GL
      globeInstance = Globe()(containerRef.current)
        .width(width)
        .height(height)
        .backgroundColor('rgba(0,0,0,0)')
        .showAtmosphere(true)
        .atmosphereColor('#00e5a0')
        .atmosphereAltitude(isMobile ? 0.18 : 0.26)
        .globeImageUrl(nightTexture)
        .bumpImageUrl(bumpTexture);

      // DPR Limit ~ 1.5 for maximum 60FPS smoothness
      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
      if (globeInstance.pixelRatio) {
        globeInstance.pixelRatio(dpr);
      }

      // Configure Point Markers (Financial Hub Cities)
      globeInstance
        .pointsData(FINANCIAL_HUBS)
        .pointLat('lat')
        .pointLng('lng')
        .pointColor('color')
        .pointAltitude(0.04)
        .pointRadius(isMobile ? 0.35 : 0.5)
        .pointsMerge(false);

      // Configure Orbital Data Arcs
      const activeArcs = isMobile ? arcs.slice(0, 6) : arcs;
      globeInstance
        .arcsData(activeArcs)
        .arcStartLat('startLat')
        .arcStartLng('startLng')
        .arcEndLat('endLat')
        .arcEndLng('endLng')
        .arcColor('color')
        .arcAltitude('arcAlt')
        .arcStroke(isMobile ? 1.0 : 1.4)
        .arcDashLength(0.4)
        .arcDashGap(0.2)
        .arcDashInitialGap(() => Math.random())
        .arcDashAnimateTime(2200);

      // Configure Orbiting Satellites / Data Objects
      const activeSatellites = isMobile ? satellites.slice(0, 18) : satellites;
      globeInstance
        .ringsData(activeSatellites)
        .ringLat('lat')
        .ringLng('lng')
        .ringAltitude('alt')
        .ringColor(() => (t) => `rgba(0,229,160,${1 - t})`)
        .ringMaxRadius('radius')
        .ringPropagationSpeed(1.8)
        .ringRepeatPeriod(1400);

      // Add 3D Candlestick horizon objects to Three.js Globe Scene
      const scene = globeInstance.scene();
      if (scene) {
        const candlesGroup = new THREE.Group();
        const candleCount = isMobile ? 8 : 14;
        const radius = 100 * 1.08;

        for (let i = 0; i < candleCount; i++) {
          const angle = (i / candleCount) * Math.PI * 1.4 - Math.PI * 0.7;
          const isGreen = i % 4 !== 1;
          const height = 4 + Math.sin(i * 1.2) * 3 + Math.random() * 2;
          const x = Math.cos(angle) * radius;
          const y = (i - candleCount / 2) * 2.8 + Math.sin(i * 0.8) * 4;
          const z = Math.sin(angle) * radius * 0.85;

          const candleMesh = new THREE.Mesh(
            new THREE.BoxGeometry(1.4, height, 1.4),
            new THREE.MeshStandardMaterial({
              color: isGreen ? 0x00e5a0 : 0xff4d4d,
              emissive: isGreen ? 0x00e5a0 : 0xff4d4d,
              emissiveIntensity: 0.7,
              roughness: 0.2,
              metalness: 0.8,
              transparent: true,
              opacity: 0.85
            })
          );
          candleMesh.position.set(x, y, z);
          candlesGroup.add(candleMesh);
        }
        scene.add(candlesGroup);
      }

      // Configure Authoritative OrbitControls Camera & Controls
      const controls = globeInstance.controls();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.8;
        controls.enableZoom = false; // Prevents page wheel interception
        controls.enablePan = false;
        controls.rotateSpeed = 0.8;
      }

      // Set Initial Camera Angle facing Asia/India/Europe on Frame 0
      globeInstance.pointOfView({ lat: 20, lng: 78, altitude: 2.2 }, 0);

      globeInstanceRef.current = globeInstance;

      // Handle Image Texture Error Fallback
      const img = new Image();
      img.src = nightTexture;
      img.onerror = () => {
        console.warn('Globe.GL night texture failed to load, applying procedural fallback texture.');
        const fallbackUrl = createProceduralNightTexture();
        if (globeInstanceRef.current) {
          globeInstanceRef.current.globeImageUrl(fallbackUrl);
        }
      };

    } catch (err) {
      console.error('Globe.GL initialization error:', err);
      setHasWebGL(false);
    }

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !globeInstanceRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      globeInstanceRef.current.width(w).height(h);
    };
    window.addEventListener('resize', handleResize);

    // Tab Visibility Pause (Saves GPU Resources)
    const handleVisibilityChange = () => {
      if (!globeInstanceRef.current) return;
      const controls = globeInstanceRef.current.controls();
      if (controls) {
        controls.autoRotate = document.visibilityState === 'visible';
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Memory Disposal & Cleanup on Unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (globeInstanceRef.current) {
        try {
          const scene = globeInstanceRef.current.scene();
          if (scene) {
            scene.traverse((obj) => {
              if (obj.geometry) obj.geometry.dispose();
              if (obj.material) {
                if (Array.isArray(obj.material)) {
                  obj.material.forEach((m) => m.dispose());
                } else {
                  obj.material.dispose();
                }
              }
            });
          }
          if (globeInstanceRef.current._destructor) {
            globeInstanceRef.current._destructor();
          }
        } catch (cleanupErr) {
          console.warn('Globe.GL cleanup notice:', cleanupErr);
        }
        globeInstanceRef.current = null;
      }
    };
  }, [arcs, satellites, isMobile]);

  // Hover Response: Accelerate rotation on hover
  useEffect(() => {
    if (!globeInstanceRef.current) return;
    const controls = globeInstanceRef.current.controls();
    if (controls) {
      controls.autoRotateSpeed = isHovered ? 1.6 : 0.8;
    }
  }, [isHovered]);

  return (
    <div
      className="absolute inset-0 z-[1] pointer-events-auto overflow-hidden select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. INTENSE EMERALD GREEN AMBIENT RADIAL GLOW & VOLUMETRIC ATMOSPHERE BEHIND GLOBE */}
      <div
        className="absolute top-[-10%] left-[4%] sm:left-[10%] w-[105vw] sm:w-[90vw] h-[90vh] pointer-events-none transition-opacity duration-500"
        style={{
          background:
            'radial-gradient(circle at 48% 42%, rgba(0, 229, 160, 0.52) 0%, rgba(0, 229, 255, 0.28) 28%, rgba(245, 158, 11, 0.14) 52%, transparent 75%)',
          filter: `blur(35px) drop-shadow(0 0 ${isHovered ? '130px' : '95px'} rgba(0, 229, 160, 0.85))`,
          transform: `translate(${pointer.x * 0.6}px, ${pointer.y * 0.6}px)`
        }}
      />

      {/* 2. SECONDARY INTENSE CYAN & GOLD RIM GLOW AURA */}
      <div
        className="absolute top-[-4%] left-[8%] sm:left-[14%] w-[96vw] sm:w-[80vw] h-[80vh] pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 52% 46%, rgba(0, 229, 255, 0.40) 0%, rgba(0, 229, 160, 0.20) 36%, transparent 68%)',
          filter: 'blur(40px)',
          transform: `translate(${pointer.x * 0.8}px, ${pointer.y * 0.8}px)`
        }}
      />

      {/* 3. DYNAMIC PULSING EMERALD HALO CORE RINGS */}
      <div
        className="absolute top-[4%] left-[20%] sm:left-[26%] w-[60vw] sm:w-[46vw] h-[60vh] sm:h-[55vh] rounded-full pointer-events-none animate-pulse-slow"
        style={{
          background: 'radial-gradient(circle, rgba(0, 229, 160, 0.48) 0%, rgba(0, 229, 255, 0.24) 45%, transparent 80%)',
          filter: 'blur(45px)'
        }}
      />

      {/* WEBGL GLOBE CONTAINER OR PREMIUM STATIC FALLBACK */}
      {hasWebGL ? (
        <div
          ref={containerRef}
          className="absolute top-[-2%] left-[5%] sm:left-[12%] w-[95vw] sm:w-[78vw] lg:w-[68vw] h-[68vh] sm:h-[72vh]"
          style={{
            transform: `translate(${pointer.x * 1.2}px, ${pointer.y * 1.2}px) rotateX(${pointer.y * -0.2}deg) rotateY(${pointer.x * 0.4}deg)`
          }}
        />
      ) : (
        /* Static Premium Fallback if WebGL context is unavailable */
        <div
          className="absolute top-[5%] left-[20%] w-[60vw] h-[60vh] rounded-full border border-[#00e5a0]/40 bg-[#030814]/90 flex items-center justify-center shadow-[0_0_80px_rgba(0,229,160,0.5)]"
          style={{ transform: `translate(${pointer.x * 1.2}px, ${pointer.y * 1.2}px)` }}
        >
          <div className="text-center font-mono space-y-2">
            <div className="w-48 h-48 rounded-full border-2 border-dashed border-[#00e5a0]/60 animate-spin-slow mx-auto flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border border-[#00e5ff]/50 bg-gradient-to-tr from-[#00e5a0]/20 to-[#00e5ff]/20" />
            </div>
            <span className="text-[#00e5a0] text-xs font-bold block tracking-widest uppercase">
              GLOBAL FINANCIAL NETWORK
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default DigitalGlobe;





