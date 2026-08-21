import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { detectPerformanceTier } from '../utils/PerformanceManager';

const MotionContext = createContext(null);

export function MotionProvider({ children }) {
  const [perfConfig, setPerfConfig] = useState(() => detectPerformanceTier());
  const [ripples, setRipples] = useState([]);

  // Mouse & Touch position refs (for 60fps frame loop reading without React state lag)
  const pointerRef = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    vx: 0,
    vy: 0,
    isTouching: false,
  });

  const scrollRef = useRef({
    y: 0,
    targetY: 0,
    velocity: 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setPerfConfig(detectPerformanceTier());
    };

    let lastMouseX = 0;
    let lastMouseY = 0;
    let lastMouseTime = performance.now();

    const handleMouseMove = (e) => {
      const now = performance.now();
      const dt = Math.max(1, now - lastMouseTime);
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;

      pointerRef.current.targetX = nx;
      pointerRef.current.targetY = ny;
      pointerRef.current.vx = (nx - lastMouseX) / (dt / 1000);
      pointerRef.current.vy = (ny - lastMouseY) / (dt / 1000);
      pointerRef.current.isTouching = false;

      lastMouseX = nx;
      lastMouseY = ny;
      lastMouseTime = now;
    };

    const handleTouchStart = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const nx = (touch.clientX / window.innerWidth) * 2 - 1;
        const ny = -(touch.clientY / window.innerHeight) * 2 + 1;

        pointerRef.current.targetX = nx;
        pointerRef.current.targetY = ny;
        pointerRef.current.isTouching = true;

        // Trigger subtle touch ripple
        addTouchRipple(touch.clientX, touch.clientY);
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const nx = (touch.clientX / window.innerWidth) * 2 - 1;
        const ny = -(touch.clientY / window.innerHeight) * 2 + 1;

        pointerRef.current.targetX = nx;
        pointerRef.current.targetY = ny;
      }
    };

    const handleTouchEnd = () => {
      pointerRef.current.isTouching = false;
    };

    let lastScrollY = window.scrollY;
    let scrollTimeout = null;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY;
      scrollRef.current.targetY = currentScrollY;
      scrollRef.current.velocity = diff * 0.1;

      lastScrollY = currentScrollY;

      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        scrollRef.current.velocity = 0;
      }, 100);
    };

    // Smooth Lerp loop for pointerRef & scrollRef
    let animationFrameId;
    const updateMotion = () => {
      const lerp = 0.08;
      pointerRef.current.x += (pointerRef.current.targetX - pointerRef.current.x) * lerp;
      pointerRef.current.y += (pointerRef.current.targetY - pointerRef.current.y) * lerp;
      scrollRef.current.y += (scrollRef.current.targetY - scrollRef.current.y) * lerp;

      animationFrameId = requestAnimationFrame(updateMotion);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    animationFrameId = requestAnimationFrame(updateMotion);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const addTouchRipple = (x, y) => {
    const id = Date.now() + Math.random();
    setRipples((prev) => [...prev.slice(-4), { id, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 800);
  };

  return (
    <MotionContext.Provider
      value={{
        perfConfig,
        pointerRef,
        scrollRef,
        ripples,
        addTouchRipple,
      }}
    >
      {children}
      {/* Touch Ripples Overlay for mobile interaction feedback */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {ripples.map((ripple) => (
          <div
            key={ripple.id}
            className="absolute rounded-full border border-amber-400/60 bg-amber-400/10 animate-ping pointer-events-none"
            style={{
              left: ripple.x - 25,
              top: ripple.y - 25,
              width: 50,
              height: 50,
            }}
          />
        ))}
      </div>
    </MotionContext.Provider>
  );
}

export function useMotion() {
  const context = useContext(MotionContext);
  if (!context) {
    throw new Error('useMotion must be used within a MotionProvider');
  }
  return context;
}

export default MotionContext;
