import React, { useRef, useEffect } from 'react';
import { perfManager } from './PerformanceManager';

export function FinancialGrid({ variant = 'home', intensity = 1.0, scrollY = 0 }) {
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

      // Grid Opacity target: 0.10 - 0.18
      const opacity = Math.min(0.18, 0.12 * intensity);

      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.lineWidth = 1;

      const gridSize = perfManager.isMobile ? 45 : 55;
      gridOffset = (gridOffset + 0.3) % gridSize;

      const parallaxOffset = scrollY * 0.08;

      // Draw Vertical Lines
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw Horizontal Moving Grid Lines
      for (let y = (gridOffset + parallaxOffset) % gridSize; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Glowing Intersection Dots
      const time = Date.now() * 0.0015;
      ctx.fillStyle = 'rgba(245, 158, 11, 0.5)';
      for (let x = gridSize; x < width; x += gridSize * 2) {
        for (let y = gridSize; y < height; y += gridSize * 2) {
          const glow = Math.sin(time + x * 0.01 + y * 0.01) * 0.5 + 0.5;
          if (glow > 0.45) {
            ctx.beginPath();
            ctx.arc(x, y, 2.0, 0, Math.PI * 2);
            ctx.fill();
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
  }, [variant, intensity, scrollY]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-[1]"
    />
  );
}

export default FinancialGrid;
