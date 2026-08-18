import React, { useRef, useEffect } from 'react';

export function ParticleWave() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const w = () => canvas.offsetWidth;
    const h = () => canvas.offsetHeight;

    const draw = () => {
      time += 0.012;
      const width = w();
      const height = h();
      ctx.clearRect(0, 0, width, height);

      const layers = [
        { amp: 28, freq: 0.004, speed: 1.0, color: 'rgba(0,229,255,', density: 3, yBase: 0.72 },
        { amp: 22, freq: 0.006, speed: 1.3, color: 'rgba(0,255,136,', density: 4, yBase: 0.78 },
        { amp: 18, freq: 0.008, speed: 0.8, color: 'rgba(255,159,0,', density: 5, yBase: 0.84 }
      ];

      layers.forEach((layer) => {
        for (let x = 0; x < width; x += layer.density) {
          const wave1 = Math.sin(x * layer.freq + time * layer.speed) * layer.amp;
          const wave2 = Math.sin(x * layer.freq * 1.7 + time * layer.speed * 0.6) * layer.amp * 0.4;
          const y = height * layer.yBase + wave1 + wave2;

          const brightness = 0.3 + Math.sin(x * 0.02 + time * 2) * 0.15;
          const size = 1 + Math.sin(x * 0.05 + time) * 0.6;

          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `${layer.color}${brightness})`;
          ctx.fill();

          if (x % 12 === 0) {
            ctx.beginPath();
            ctx.arc(x, y - 4, size * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = `${layer.color}${brightness * 0.5})`;
            ctx.fill();
          }
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-x-0 bottom-0 h-[42%] w-full pointer-events-none z-[2] opacity-90"
      aria-hidden="true"
    />
  );
}

export default ParticleWave;
