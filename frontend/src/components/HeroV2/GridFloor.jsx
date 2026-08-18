import React from 'react';

export function GridFloor() {
  return (
    <div
      className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none z-[1] overflow-hidden"
      style={{ perspective: '900px', perspectiveOrigin: '50% 20%' }}
    >
      <div
        className="absolute inset-0 origin-bottom"
        style={{ transform: 'rotateX(72deg) translateY(8%)' }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0,229,255,0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0,229,255,0.15) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            maskImage: 'linear-gradient(to top, black 20%, transparent 85%)',
            WebkitMaskImage: 'linear-gradient(to top, black 20%, transparent 85%)'
          }}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,159,0,0.12) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,159,0,0.12) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
            maskImage: 'linear-gradient(to top, black 10%, transparent 75%)',
            WebkitMaskImage: 'linear-gradient(to top, black 10%, transparent 75%)'
          }}
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050A0F] via-[#050A0F]/80 to-transparent" />
    </div>
  );
}

export default GridFloor;
