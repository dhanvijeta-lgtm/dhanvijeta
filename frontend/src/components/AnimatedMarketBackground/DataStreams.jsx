import React from 'react';
import { perfManager } from './PerformanceManager';

export function DataStreams({ variant = 'home' }) {
  if (perfManager.isMobile) return null;

  const dataNodes = [
    { text: 'NIFTY 50 • MARKET OPEN', top: '18%', left: '8%' },
    { text: 'VOLUME • RSI • MACD', top: '42%', left: '85%' },
    { text: 'BANK NIFTY • SENTIMENT', top: '78%', left: '15%' },
    { text: 'ADVANCE / DECLINE • INDEX', top: '85%', left: '72%' }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-[2] overflow-hidden select-none">
      {dataNodes.map((node, i) => (
        <div
          key={i}
          className="absolute text-[10px] font-mono font-bold tracking-widest text-amber-400/20 uppercase animate-pulse-slow"
          style={{
            top: node.top,
            left: node.left,
            animationDelay: `${i * 1.5}s`
          }}
        >
          {node.text}
        </div>
      ))}
    </div>
  );
}

export default DataStreams;
