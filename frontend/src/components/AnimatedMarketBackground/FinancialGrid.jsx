import React, { useRef, useEffect } from 'react';
import { perfManager } from './PerformanceManager';

export function FinancialGrid({ variant = 'home', scrollY = 0 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    let gridOffset = 0;

    const render = () => {
      if (!perfManager.isTabVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Grid Opacity based on page variant
      let opacity = 0.06;
      if (variant === 'home') opacity = 0.09;
      if (variant === 'about' || variant === 'contact') opacity = 0.07;
      if (perfManager.isMobile) opacity = 0.04;

      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.lineWidth = 1;

      const gridSize = perfManager.isMobile ? 40 : 50;
      gridOffset = (gridOffset + 0.15) % gridSize;

      const parallaxOffset = scrollY * 0.05;

      // Draw Vertical Lines
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw Horizontal Lines with Parallax & Motion
      for (let y = (gridOffset + parallaxOffset) % gridSize; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Occasional Glowing Intersection Dots
      if (!perfManager.isMobile) {
        const time = Date.now() * 0.001;
        ctx.fillStyle = 'rgba(245, 158, 11, 0.25)';
        for (let x = gridSize; x < width; x += gridSize * 3) {
          for (let y = gridSize; y < height; y += gridSize * 3) {
            const glow = Math.sin(time + x + y) * 0.5 + 0.5;
            if (glow > 0.6) {
              ctx.beginPath();
              ctx.arc(x, y, 1.5, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [variant, scrollY]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-[1]"
    />
  );
}

export default FinancialGrid;
