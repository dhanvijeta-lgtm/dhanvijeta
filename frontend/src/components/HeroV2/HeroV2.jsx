import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlay, FaArrowRight } from 'react-icons/fa';

import LiveClock from './LiveClock';
import DigitalGlobe from './DigitalGlobe';
import GridFloor from './GridFloor';
import ParticleWave from './ParticleWave';
import AuroraWaveTerrain from './AuroraWaveTerrain';
import CandlestickChart from './CandlestickChart';
import TechnicalOverlay from './TechnicalOverlay';
import HudGlassCards from './HudGlassCards';

export function HeroV2() {
  return (
    <section className="relative w-screen left-[50%] right-[50%] -mx-[50vw] min-h-screen bg-[#050A0F] overflow-hidden select-none flex flex-col justify-between pt-24 pb-10">

      {/* LAYER 0: Rotating Wireframe Globe */}
      <DigitalGlobe />

      {/* LAYER 1: 3D Perspective Grid Floor */}
      <GridFloor />

      {/* LAYER 2: Aurora Wave + Particle Hills */}
      <AuroraWaveTerrain />
      <ParticleWave />

      {/* LAYER 3: 3D Candlestick Chart (staggered reveal) */}
      <CandlestickChart />

      {/* LAYER 4: Trend Lines + Moving Light Particles */}
      <TechnicalOverlay />

      {/* LAYER 5: Floating HUD Glass Cards */}
      <HudGlassCards />

      {/* Ambient vignette — lighter on globe area */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050A0F]/50 via-transparent to-[#050A0F] pointer-events-none z-[5]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_55%_35%,transparent_20%,rgba(5,10,15,0.75)_100%)] pointer-events-none z-[5]" />

      {/* Market status pill + live clock */}
      <div className="relative z-20 px-6 sm:px-12 lg:px-16 max-w-[1500px] mx-auto w-full flex items-center justify-between pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 bg-black/50 border border-white/10 px-4 py-2 rounded-full text-xs font-mono backdrop-blur-md shadow-2xl pointer-events-auto"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 motion-reduce:hidden" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_#10b981]" />
          </span>
          <span className="text-emerald-400 font-bold tracking-wider">MARKET OPEN</span>
          <span className="text-gray-600">|</span>
          <LiveClock />
        </motion.div>
      </div>

      {/* Hero left content */}
      <div className="relative z-20 flex-1 flex items-center px-6 sm:px-12 lg:px-16 max-w-[1500px] mx-auto w-full py-12">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl text-left space-y-6"
        >
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#FF9F00] font-bold block">
            FINANCIAL INTELLIGENCE & TRADING MASTERY
          </span>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
            MASTER THE <br />
            <span className="bg-gradient-to-r from-[#FF9F00] via-amber-300 to-[#FFB800] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,159,0,0.5)]">
              MARKET
            </span>
          </h1>

          <p className="text-lg sm:text-2xl text-gray-300 font-light leading-relaxed">
            Learn. Analyze. Trade.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/courses"
              className="group relative bg-gradient-to-r from-[#FF9F00] via-amber-500 to-[#FFB800] hover:from-amber-500 hover:to-yellow-300 text-[#050A0F] font-black px-8 py-4 rounded-xl shadow-[0_0_35px_rgba(255,159,0,0.5)] flex items-center gap-2.5 transition duration-300 transform hover:scale-[1.03] text-base overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer motion-reduce:hidden" />
              <span className="relative">Start Learning</span>
              <FaArrowRight size={14} className="relative transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/demo-videos"
              className="bg-black/50 border border-white/20 hover:border-[#FF9F00] text-white font-bold px-7 py-4 rounded-xl backdrop-blur-md flex items-center gap-2.5 transition duration-300 text-base hover:scale-[1.02]"
            >
              <FaPlay size={12} className="text-[#FF9F00]" />
              <span>Watch Demo</span>
            </Link>
          </div>
        </motion.div>
      </div>

    </section>
  );
}

export default HeroV2;
