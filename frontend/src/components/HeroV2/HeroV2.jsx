import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlay, FaArrowRight } from 'react-icons/fa';

import LiveClock from './LiveClock';
import DigitalGlobe from './DigitalGlobe';
import AuroraWaveTerrain from './AuroraWaveTerrain';
import CandlestickChart from './CandlestickChart';
import TechnicalOverlay from './TechnicalOverlay';
import HudGlassCards from './HudGlassCards';

export function HeroV2() {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setPointer({ x: x * 18, y: y * 18 });
  };

  const handleTouchMove = (event) => {
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      const rect = event.currentTarget.getBoundingClientRect();
      const x = (touch.clientX - rect.left) / rect.width - 0.5;
      const y = (touch.clientY - rect.top) / rect.height - 0.5;
      setPointer({ x: x * 12, y: y * 12 });
    }
  };

  const handlePointerLeave = () => setPointer({ x: 0, y: 0 });

  return (
    <section
      onMouseMove={handlePointerMove}
      onTouchMove={handleTouchMove}
      onMouseLeave={handlePointerLeave}
      onTouchEnd={handlePointerLeave}
      className="relative w-screen left-[50%] right-[50%] -mx-[50vw] min-h-[90vh] lg:min-h-screen bg-[#030810] overflow-hidden select-none flex flex-col justify-between pt-4 pb-8"
    >
      {/* 3D ENVIRONMENT LAYERS */}
      <DigitalGlobe pointer={pointer} />
      <AuroraWaveTerrain pointer={pointer} />
      <CandlestickChart pointer={pointer} />
      <TechnicalOverlay pointer={pointer} />
      <HudGlassCards pointer={pointer} />

      {/* Ambient Radial Illumination */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030710]/90 via-transparent to-[#030710] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(3,7,16,0.88)_100%)] pointer-events-none z-0" />

      {/* TOP STATUS BAR */}
      <div className="relative z-20 px-4 sm:px-12 lg:px-16 max-w-[1500px] mx-auto w-full flex items-center justify-between pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2.5 sm:gap-3 bg-[#090d16]/85 border border-white/10 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] font-mono backdrop-blur-md shadow-2xl pointer-events-auto"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e5a0] opacity-75 motion-reduce:hidden" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00e5a0]" />
          </span>
          <span className="text-[#00e5a0] font-bold tracking-wider">MARKET OPEN</span>
          <span className="text-gray-600">|</span>
          <LiveClock />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-gray-400 tracking-widest uppercase bg-[#090d16]/75 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md"
        >
          <span className="text-amber-400 font-bold">DHAN VIJETA</span>
          <span className="text-gray-600">|</span>
          <span className="text-[#00e5ff] font-semibold border border-cyan-500/40 px-1.5 py-0.5 rounded text-[10px]">
            EDTECH
          </span>
        </motion.div>
      </div>

      {/* HERO MAIN CONTENT & RECOMPOSED MOBILE LAYOUT */}
      <div className="relative z-20 flex-1 flex flex-col justify-center px-4 sm:px-12 lg:px-16 max-w-[1500px] mx-auto w-full py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl text-left space-y-4 sm:space-y-6"
        >
          {/* Eyebrow */}
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] sm:tracking-[0.25em] text-amber-400 font-bold block">
            FINANCIAL INTELLIGENCE & TRADING MASTERY
          </span>

          {/* Headline */}
          <h1 className="text-3xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.08]">
            MASTER THE <br />
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(245,158,11,0.55)]">
              MARKET
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-2xl text-gray-300 font-light leading-relaxed">
            Learn. Analyze. Trade.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
            <Link
              to="/courses"
              className="group bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 hover:from-amber-500 hover:to-yellow-300 text-[#030710] font-black px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl shadow-[0_0_35px_rgba(245,158,11,0.5)] flex items-center gap-2.5 transition duration-300 transform hover:scale-[1.03] text-sm sm:text-base"
            >
              <span>Start Learning</span>
              <FaArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/demo-videos"
              className="bg-[#090d16]/85 border border-white/20 hover:border-amber-400 text-white font-bold px-5 sm:px-7 py-3.5 sm:py-4 rounded-xl backdrop-blur-md flex items-center gap-2.5 transition duration-300 text-sm sm:text-base hover:scale-[1.02]"
            >
              <FaPlay size={12} className="text-amber-400" />
              <span>Watch Demo</span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* FOOTER STRIP */}
      <div className="relative z-20 px-4 sm:px-12 lg:px-16 max-w-[1500px] mx-auto w-full flex justify-between items-center text-[10px] sm:text-[11px] font-mono text-gray-500 pointer-events-none">
        <span>PREMIUM FINTECH EDUCATION</span>
        <div className="flex items-center gap-2 text-[#00e5ff] font-semibold">
          <span>● 60 FPS INTERACTIVE EXPERIENCE</span>
        </div>
      </div>
    </section>
  );
}

export default HeroV2;
