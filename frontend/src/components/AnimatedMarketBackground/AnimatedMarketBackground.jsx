import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import FinancialGrid from './FinancialGrid';
import MarketParticles from './MarketParticles';
import MarketLines from './MarketLines';
import FloatingCandles from './FloatingCandles';
import DataStreams from './DataStreams';
import { perfManager } from './PerformanceManager';

export function AnimatedMarketBackground({ variant: customVariant, forceAuthMode = false }) {
  const location = useLocation();
  const [scrollY, setScrollY] = useState(0);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  // Determine current page variant & intensity multiplier
  const { variant, intensity } = useMemo(() => {
    if (customVariant) return { variant: customVariant, intensity: 1.0 };
    if (forceAuthMode) return { variant: 'auth', intensity: 0.5 };

    const path = location.pathname;
    if (path === '/') return { variant: 'home', intensity: 1.0 };
    if (path.startsWith('/courses')) return { variant: 'courses', intensity: 0.85 };
    if (path.startsWith('/demo-videos')) return { variant: 'demo', intensity: 0.75 };
    if (path.startsWith('/blog')) return { variant: 'blog', intensity: 0.60 };
    if (path === '/about') return { variant: 'about', intensity: 0.55 };
    if (path === '/contact') return { variant: 'contact', intensity: 0.50 };
    if (path === '/verify-email' || path === '/reset-password') return { variant: 'auth', intensity: 0.5 };
    if (path.startsWith('/dashboard') || path.startsWith('/my-batch') || path.startsWith('/admin')) {
      return { variant: 'batch', intensity: 0.70 };
    }

    return { variant: 'home', intensity: 1.0 };
  }, [location.pathname, customVariant, forceAuthMode]);

  // Track Scroll & Pointer Position
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let requestTick = false;
    const handleScroll = () => {
      if (!requestTick) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          requestTick = false;
        });
        requestTick = true;
      }
    };

    const handleMouseMove = (e) => {
      if (perfManager.shouldEnableMouseParallax()) {
        setPointer({ x: e.clientX, y: e.clientY });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    if (perfManager.isDesktop) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      id="global-animated-market-background"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      style={{
        transform: `translate3d(0, ${scrollY * -0.02}px, 0)`
      }}
    >
      {/* LAYER 1: Deep Black & Navy Base Tones */}
      <div className="absolute inset-0 bg-[#020611]" />

      {/* Vibrant Ambient Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(245,158,11,0.22),transparent_70%)]" />
      <div className="absolute top-1/4 left-1/10 w-[550px] h-[550px] bg-[#f59e0b]/12 rounded-full blur-[140px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/3 right-1/10 w-[600px] h-[600px] bg-[#00e5a0]/12 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-2/3 left-1/3 w-[500px] h-[500px] bg-[#00e5ff]/10 rounded-full blur-[150px] pointer-events-none" />

      {/* LAYER 2: Perspective Financial Grid */}
      <FinancialGrid variant={variant} intensity={intensity} scrollY={scrollY} />

      {/* LAYER 3: Live Market Particle Network */}
      <MarketParticles variant={variant} intensity={intensity} pointer={pointer} />

      {/* LAYER 4: Atmospheric Floating Candlestick Silhouettes */}
      <FloatingCandles variant={variant} intensity={intensity} />

      {/* LAYER 5: Animated Glowing Market Lines & Waveforms */}
      <MarketLines variant={variant} intensity={intensity} />

      {/* LAYER 6: Subtle Data Ticker Streams */}
      <DataStreams variant={variant} intensity={intensity} />

      {/* LAYER 7: Readability Safeguard Gradient Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020611]/60 via-transparent to-[#020611]/75 pointer-events-none" />
    </div>
  );
}

export default AnimatedMarketBackground;
