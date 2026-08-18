import React from 'react';

export function MarketTooltip({ hoveredCandle, position }) {
  if (!hoveredCandle || !position) return null;

  return (
    <div
      className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 transition-transform duration-75"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
    >
      <div className="bg-[#090d16]/90 border border-white/15 rounded-xl p-3.5 backdrop-blur-md shadow-[0_15px_35px_rgba(0,0,0,0.7)] text-xs font-mono w-56 text-left space-y-1.5 border-l-4" style={{ borderLeftColor: hoveredCandle.color }}>
        <div className="flex items-center justify-between border-b border-white/10 pb-1">
          <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">CANDLE INSPECTOR</span>
          <span className="text-gray-300 text-[10px]">{hoveredCandle.date}</span>
        </div>
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-0.5">
          <div>
            <span className="text-gray-400 text-[10px] block">OPEN</span>
            <span className="text-white font-bold">{hoveredCandle.open}</span>
          </div>
          <div>
            <span className="text-gray-400 text-[10px] block">HIGH</span>
            <span className="text-emerald-400 font-bold">{hoveredCandle.high}</span>
          </div>
          <div>
            <span className="text-gray-400 text-[10px] block">LOW</span>
            <span className="text-rose-400 font-bold">{hoveredCandle.low}</span>
          </div>
          <div>
            <span className="text-gray-400 text-[10px] block">CLOSE</span>
            <span className="text-white font-bold">{hoveredCandle.close}</span>
          </div>
        </div>
        <div className="border-t border-white/10 pt-1 flex items-center justify-between text-[11px]">
          <span className="text-gray-400">VOLUME</span>
          <span className="text-amber-400 font-bold">{hoveredCandle.volume}</span>
        </div>
      </div>
    </div>
  );
}

export default MarketTooltip;
