import React, { Component, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import MarketScene from './MarketScene';

class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('WebGL Context Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export function MarketCanvas({ progress = 0, fallback, onHoverCandle, hoveredCandleId, isClicked = false }) {
  const [isMobile, setIsMobile] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    // Check mobile viewport
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Check WebGL context support
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
    return fallback;
  }

  return (
    <WebGLErrorBoundary fallback={fallback}>
      <div className="absolute inset-0 w-full h-full pointer-events-auto z-0">
        <Canvas
          camera={{ position: [0, 0.5, 11.5], fov: isMobile ? 55 : 45 }}
          dpr={Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2)}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <MarketScene
            progress={progress}
            isMobile={isMobile}
            onHoverCandle={onHoverCandle}
            hoveredCandleId={hoveredCandleId}
            isClicked={isClicked}
          />
        </Canvas>
      </div>
    </WebGLErrorBoundary>
  );
}

export default MarketCanvas;
