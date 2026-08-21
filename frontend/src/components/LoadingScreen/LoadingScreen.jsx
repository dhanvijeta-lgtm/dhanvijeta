import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth progress simulation finishing in ~1.2 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 200);
          return 100;
        }
        return prev + 12;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#030710] text-white select-none"
        >
          {/* Ambient Glow */}
          <div className="absolute w-72 h-72 bg-amber-500/15 rounded-full blur-[100px] animate-pulse-slow pointer-events-none" />

          {/* Logo & Brand Title */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-4 relative z-10"
          >
            <div className="relative p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_0_30px_rgba(245,158,11,0.2)]">
              <img src="/logo.png" alt="Dhan Vijeta" className="h-14 w-auto object-contain" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
              DHAN VIJETA
            </h1>
            <p className="text-xs font-mono text-gray-400 tracking-[0.25em] uppercase">
              INITIALIZING MARKET INTELLIGENCE...
            </p>
          </motion.div>

          {/* Progress Bar Container */}
          <div className="w-64 h-1.5 bg-white/10 rounded-full mt-8 overflow-hidden relative border border-white/5">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 shadow-[0_0_12px_rgba(245,158,11,0.8)]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>

          {/* Status Percentage Ticker */}
          <span className="text-[11px] font-mono text-gray-500 mt-2 tracking-wider">
            {progress}% READY
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LoadingScreen;
