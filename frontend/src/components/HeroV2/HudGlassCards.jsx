import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaChartBar, FaClock, FaChartPie } from 'react-icons/fa';

export function HudGlassCards() {
  // Live flickering ticker prices state
  const [nifty, setNifty] = useState({ val: 24320.15, change: '+1.24%', flash: false, isUp: true });
  const [bankNifty, setBankNifty] = useState({ val: 52140.80, change: '+0.87%', flash: false, isUp: true });
  const [volume, setVolume] = useState({ val: '84.2M', change: '+12.65%', flash: false });

  useEffect(() => {
    // Random live price flicker every 3.5 seconds
    const interval = setInterval(() => {
      const isNiftyUp = Math.random() > 0.45;
      const niftyDelta = (Math.random() * 0.85 * (isNiftyUp ? 1 : -1)).toFixed(2);
      setNifty((prev) => ({
        val: (parseFloat(prev.val) + parseFloat(niftyDelta)).toFixed(2),
        change: `${isNiftyUp ? '+' : ''}${(1.24 + parseFloat(niftyDelta) * 0.02).toFixed(2)}%`,
        flash: true,
        isUp: isNiftyUp
      }));

      const isBankUp = Math.random() > 0.4;
      const bankDelta = (Math.random() * 1.2 * (isBankUp ? 1 : -1)).toFixed(2);
      setBankNifty((prev) => ({
        val: (parseFloat(prev.val) + parseFloat(bankDelta)).toFixed(2),
        change: `${isBankUp ? '+' : ''}${(0.87 + parseFloat(bankDelta) * 0.01).toFixed(2)}%`,
        flash: true,
        isUp: isBankUp
      }));

      // Reset flash highlight after 600ms
      setTimeout(() => {
        setNifty((p) => ({ ...p, flash: false }));
        setBankNifty((p) => ({ ...p, flash: false }));
      }, 600);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 hidden lg:block overflow-hidden">
      
      {/* TOP-RIGHT CARD 1: NIFTY 50 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="absolute top-[14%] right-[22%]"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className={`bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-[0_15px_35px_rgba(0,0,0,0.6)] w-52 transition-colors duration-300 ${
            nifty.flash ? (nifty.isUp ? 'border-emerald-500/60 bg-emerald-950/30' : 'border-rose-500/60 bg-rose-950/30') : ''
          }`}
        >
          <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono mb-1">
            <span className="flex items-center gap-1.5"><FaChartLine className="text-emerald-400" /> NIFTY 50</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-bold text-white tracking-tight font-mono">{nifty.val}</span>
            <span className={`text-xs font-semibold font-mono ${nifty.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
              {nifty.change}
            </span>
          </div>
          {/* Animated Mini Sparkline */}
          <svg className="w-full h-5 mt-1" viewBox="0 0 100 25">
            <path d="M0 20 Q 25 5, 50 15 T 100 2" fill="none" stroke="#22c55e" strokeWidth="2" />
          </svg>
        </motion.div>
      </motion.div>

      {/* TOP-RIGHT CARD 2: BANK NIFTY */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.55 }}
        className="absolute top-[14%] right-[5%]"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className={`bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-[0_15px_35px_rgba(0,0,0,0.6)] w-52 transition-colors duration-300 ${
            bankNifty.flash ? (bankNifty.isUp ? 'border-emerald-500/60 bg-emerald-950/30' : 'border-rose-500/60 bg-rose-950/30') : ''
          }`}
        >
          <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono mb-1">
            <span className="flex items-center gap-1.5"><FaChartBar className="text-emerald-400" /> BANK NIFTY</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-bold text-white tracking-tight font-mono">{bankNifty.val}</span>
            <span className={`text-xs font-semibold font-mono ${bankNifty.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
              {bankNifty.change}
            </span>
          </div>
          {/* Animated Mini Sparkline */}
          <svg className="w-full h-5 mt-1" viewBox="0 0 100 25">
            <path d="M0 18 Q 30 22, 60 8 T 100 3" fill="none" stroke="#22c55e" strokeWidth="2" />
          </svg>
        </motion.div>
      </motion.div>

      {/* TOP-RIGHT CARD 3: MARKET SENTIMENT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="absolute top-[34%] right-[7%]"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-[0_15px_35px_rgba(0,0,0,0.6)] w-56"
        >
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block mb-1">MARKET SENTIMENT</span>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🐂</span>
            <div>
              <span className="text-sm font-extrabold text-emerald-400 tracking-wide block">BULLISH</span>
              <span className="text-[10px] text-gray-400 font-mono block">EXPANSION PHASE</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* BOTTOM-LEFT CARD 1: VOLUME */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="absolute bottom-[9%] left-[6%]"
      >
        <motion.div
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-3.5 shadow-[0_15px_35px_rgba(0,0,0,0.6)] w-48 flex items-center gap-3"
        >
          <div className="p-2.5 bg-amber-500/10 rounded-lg border border-amber-500/20 text-amber-400">
            <FaChartBar size={16} />
          </div>
          <div>
            <span className="text-[10px] font-mono text-gray-400 uppercase block">VOLUME</span>
            <span className="text-base font-extrabold text-white font-mono">{volume.val}</span>
            <span className="text-[10px] text-emerald-400 font-mono block">{volume.change}</span>
          </div>
        </motion.div>
      </motion.div>

      {/* BOTTOM-LEFT CARD 2: 52W HIGH */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.95 }}
        className="absolute bottom-[9%] left-[21%]"
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-3.5 shadow-[0_15px_35px_rgba(0,0,0,0.6)] w-48 flex items-center gap-3"
        >
          <div className="p-2.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-400">
            <FaClock size={16} />
          </div>
          <div>
            <span className="text-[10px] font-mono text-gray-400 uppercase block">52W HIGH</span>
            <span className="text-base font-extrabold text-white font-mono">25,148.30</span>
            <span className="text-[10px] text-emerald-400 font-mono block">+2.18%</span>
          </div>
        </motion.div>
      </motion.div>

      {/* BOTTOM-LEFT CARD 3: ADVANCES (CIRCULAR PROGRESS RING) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.1 }}
        className="absolute bottom-[9%] left-[36%]"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 6.8, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
          className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-3.5 shadow-[0_15px_35px_rgba(0,0,0,0.6)] w-48 flex items-center gap-3"
        >
          {/* Animated Circular Progress Ring */}
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#1e293b"
                strokeWidth="3"
              />
              <motion.path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#22d3ee"
                strokeWidth="3"
                strokeDasharray="100, 100"
                initial={{ strokeDashoffset: 100 }}
                animate={{ strokeDashoffset: 22 }}
                transition={{ duration: 1.8, delay: 1.2, ease: 'easeOut' }}
              />
            </svg>
            <span className="absolute text-[10px] font-bold text-teal-400 font-mono">78%</span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-gray-400 uppercase block">ADVANCES</span>
            <span className="text-sm font-extrabold text-emerald-400 font-mono">78%</span>
            <span className="text-[10px] text-gray-400 font-mono block">MARKET DEPTH</span>
          </div>
        </motion.div>
      </motion.div>

    </div>
  );
}

export default HudGlassCards;
