import React, { useRef, useEffect } from 'react';
import { perfManager } from './PerformanceManager';

export function FloatingCandles({ variant = 'home', intensity = 1.0 }) {
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

    // Generate 16 floating candlesticks
    const candleCount = perfManager.isMobile ? 6 : Math.round(16 * intensity);
    const candles = Array.from({ length: candleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vy: (Math.random() - 0.5) * 0.35,
      vx: (Math.random() - 0.5) * 0.15,
      width: Math.random() * 8 + 12,
      bodyHeight: Math.random() * 40 + 35,
      wickHeight: Math.random() * 70 + 60,
      isBullish: Math.random() > 0.4,
      alpha: Math.random() * 0.2 + 0.15
    }));

    const render = () => {
      if (!perfManager.isTabVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      candles.forEach((c) => {
        c.y += c.vy;
        c.x += c.vx;

        if (c.y < -100) c.y = height + 50;
        if (c.y > height + 100) c.y = -50;
        if (c.x < -50) c.x = width + 50;
        if (c.x > width + 50) c.x = -50;

        const opacity = Math.min(0.35, c.alpha * intensity);
        const mainColor = c.isBullish ? '#00d084' : '#ef4444';

        // Draw Wick
        ctx.beginPath();
        ctx.moveTo(c.x, c.y - c.wickHeight / 2);
        ctx.lineTo(c.x, c.y + c.wickHeight / 2);
        ctx.strokeStyle = mainColor;
        ctx.globalAlpha = opacity * 0.8;
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Draw Candle Body
        ctx.beginPath();
        ctx.rect(c.x - c.width / 2, c.y - c.bodyHeight / 2, c.width, c.bodyHeight);
        ctx.fillStyle = mainColor;
        ctx.globalAlpha = opacity;
        ctx.shadowColor = mainColor;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.strokeStyle = mainColor;
        ctx.lineWidth = 1;
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
      className="absolute inset-0 pointer-events-none z-[2]"
    />
  );
}

export default FloatingCandles;
