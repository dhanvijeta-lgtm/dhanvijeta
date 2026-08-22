import React, { useRef, useEffect } from 'react';
import { perfManager } from './PerformanceManager';

export function DataStreams({ variant = 'home', intensity = 1.0 }) {
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

    const labels = [
      'NIFTY 50 • MARKET DATA',
      'BANK NIFTY • VOLUME',
      'RSI • MACD • SIGNAL',
      'MARKET OPEN • SENTIMENT',
      'ADVANCE / DECLINE • INDEX',
      'PRICE ACTION • FLOW'
    ];

    const streams = labels.map((text, i) => ({
      text,
      x: (i * (width / labels.length)) + 40,
      y: (Math.random() * height * 0.7) + (height * 0.15),
      vy: (Math.random() - 0.5) * 0.2,
      phase: i * 1.2
    }));

    const render = () => {
      if (!perfManager.isTabVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      const time = Date.now() * 0.001;

      streams.forEach((s) => {
        s.y += s.vy;
        if (s.y < 50) s.y = height - 50;
        if (s.y > height - 50) s.y = 50;

        const alpha = (Math.sin(time + s.phase) * 0.5 + 0.5) * 0.12 * intensity;

        ctx.font = '700 11px monospace';
        ctx.fillStyle = '#f59e0b';
        ctx.globalAlpha = Math.max(0.04, alpha);
        ctx.fillText(s.text, s.x, s.y);
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

export default DataStreams;
