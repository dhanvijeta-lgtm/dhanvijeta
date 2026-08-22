import React, { useRef, useEffect } from 'react';
import { perfManager } from './PerformanceManager';

export function MarketLines({ variant = 'home', intensity = 1.0 }) {
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

    let phase = 0;

    // Define 4 distinct glowing market curves
    const curves = [
      { color: '#f59e0b', strokeWidth: 2.8, speed: 0.008, amplitude: 90, baseHeight: 0.40 },
      { color: '#00e5a0', strokeWidth: 2.2, speed: 0.012, amplitude: 110, baseHeight: 0.55 },
      { color: '#00e5ff', strokeWidth: 2.0, speed: 0.006, amplitude: 70, baseHeight: 0.70 },
      { color: '#ffb000', strokeWidth: 1.5, speed: 0.015, amplitude: 80, baseHeight: 0.30 }
    ];

    const render = () => {
      if (!perfManager.isTabVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      phase += 0.012;

      curves.forEach((curve) => {
        ctx.beginPath();
        const baseOpacity = Math.min(0.35, 0.22 * intensity);
        ctx.strokeStyle = curve.color;
        ctx.globalAlpha = baseOpacity;
        ctx.lineWidth = curve.strokeWidth;
        ctx.shadowColor = curve.color;
        ctx.shadowBlur = 12;

        const points = 120;
        const step = width / points;
        const startY = height * curve.baseHeight;

        ctx.moveTo(0, startY);

        for (let i = 0; i <= points; i++) {
          const x = i * step;
          const y =
            startY +
            Math.sin(i * 0.05 + phase * curve.speed * 100) * curve.amplitude +
            Math.cos(i * 0.02 + phase * 0.5) * (curve.amplitude * 0.4);

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [variant, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-[3]"
    />
  );
}

export default MarketLines;
