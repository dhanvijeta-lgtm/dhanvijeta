import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaPlay, FaArrowRight } from 'react-icons/fa';

import LiveClock from './LiveClock';
import DigitalGlobe from './DigitalGlobe';
import AuroraWaveTerrain from './AuroraWaveTerrain';
import CandlestickChart from './CandlestickChart';
import TechnicalOverlay from './TechnicalOverlay';
import HudGlassCards from './HudGlassCards';

export function HeroV2() {
  return (
    <section className="relative w-full min-h-screen bg-[#050b10] overflow-hidden select-none flex flex-col justify-between pt-24 pb-10">
      
      {/* LAYER 0: Rotating Wireframe Dotted Globe (Top-Left) */}
      <DigitalGlobe />

      {/* LAYER 1: Aurora Wave Terrain Drift (Bottom Third) */}
      <AuroraWaveTerrain />

      {/* LAYER 2: Animated SVG Candlestick Chart (Staggered Load Reveal) */}
      <CandlestickChart />

      {/* LAYER 3: Glowing Teal Price Line + Gold Sweeping Particles + Grid Axes */}
      <TechnicalOverlay />

      {/* LAYER 4: Floating Glassmorphic Stat Cards (Isolated Flicker State) */}
      <HudGlassCards />

      {/* Ambient Dark Background Illumination & Soft Radial Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050b10]/80 via-transparent to-[#050b10] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(5,11,16,0.85)_100%)] pointer-events-none z-0" />

      {/* TOP STATUS BAR: Market Status Pill & Live IST Clock */}
      <div className="relative z-20 px-6 sm:px-12 max-w-7xl mx-auto w-full flex items-center justify-between pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 bg-black/50 border border-white/10 px-4 py-2 rounded-full text-xs font-mono backdrop-blur-md shadow-2xl pointer-events-auto"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 motion-reduce:hidden" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-emerald-400 font-bold tracking-wider">MARKET OPEN</span>
          <span className="text-gray-600">|</span>
          <LiveClock />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-gray-400 tracking-widest uppercase bg-black/40 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md"
        >
          <span className="text-amber-400 font-bold">DHAN VIJETA</span>
          <span className="text-gray-600">|</span>
          <span className="text-teal-400 font-semibold border border-teal-500/40 px-1.5 py-0.5 rounded text-[10px]">EDTECH</span>
        </motion.div>
      </div>

      {/* HERO LEFT CONTENT OVERLAYS */}
      <div className="relative z-20 flex-1 flex items-center px-6 sm:px-12 max-w-7xl mx-auto w-full py-12">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl text-left space-y-6"
        >
          {/* Eyebrow Label */}
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-amber-400 font-bold block">
            FINANCIAL INTELLIGENCE & TRADING MASTERY
          </span>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
            MASTER THE <br />
            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(245,158,11,0.45)]">
              MARKET
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-2xl text-gray-300 font-light leading-relaxed">
            Learn. Analyze. Trade.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/courses"
              className="group bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 hover:from-amber-500 hover:to-yellow-300 text-finance-dark font-black px-8 py-4 rounded-xl shadow-[0_0_30px_rgba(245,158,11,0.45)] flex items-center gap-2.5 transition duration-300 transform hover:scale-[1.03] text-base"
            >
              <span>Start Learning</span>
              <FaArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/demo-videos"
              className="bg-black/50 border border-white/20 hover:border-amber-400 text-white font-bold px-7 py-4 rounded-xl backdrop-blur-md flex items-center gap-2.5 transition duration-300 text-base hover:scale-[1.02]"
            >
              <FaPlay size={12} className="text-amber-400" />
              <span>Watch Demo</span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* FOOTER STRIP */}
      <div className="relative z-20 px-6 sm:px-12 max-w-7xl mx-auto w-full flex justify-between items-center text-[11px] font-mono text-gray-500 pointer-events-none">
        <span>PREMIUM FINTECH EDUCATION</span>
        <div className="flex items-center gap-2 text-teal-400 font-semibold">
          <span>● 60 FPS SVG ANIMATED EXPERIENCE</span>
        </div>
      </div>

    </section>
  );
}

export default HeroV2;
