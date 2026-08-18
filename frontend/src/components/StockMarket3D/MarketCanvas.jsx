import React, { Component, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import MarketScene from './MarketScene';

// WebGL Error Boundary Fallback
class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('WebGL 3D Hero rendering error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}

export function MarketCanvas({ progress = 0, fallback }) {
  const [isMobile, setIsMobile] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    // Mobile viewport detection
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Test WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setWebglSupported(false);
    } catch (e) {
      setWebglSupported(false);
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!webglSupported) {
    return fallback || null;
  }

  return (
    <WebGLErrorBoundary fallback={fallback}>
      <div className="absolute inset-0 pointer-events-none z-0">
        <Canvas
          camera={{ position: [0, 4, 12], fov: isMobile ? 65 : 55 }}
          dpr={isMobile ? [1, 1.2] : [1, 1.8]}
          performance={{ min: 0.5 }}
          gl={{
            powerPreference: 'high-performance',
            antialias: !isMobile,
            alpha: true
          }}
        >
          <MarketScene progress={progress} isMobile={isMobile} />
        </Canvas>
      </div>
    </WebGLErrorBoundary>
  );
}

export default MarketCanvas;
