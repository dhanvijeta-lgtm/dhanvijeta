import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaGraduationCap, FaPlay, FaArrowRight } from 'react-icons/fa';
import MarketCanvas from './MarketCanvas';

gsap.registerPlugin(ScrollTrigger);

export function StockMarket3DHero({ fallbackHero }) {
  const containerRef = useRef(null);
  const stickyRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activePhase, setActivePhase] = useState(1);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: stickyRef.current,
        pinSpacing: true,
        scrub: 0.5,
        onUpdate: (self) => {
          const prog = self.progress;
          setScrollProgress(prog);

          if (prog < 0.22) {
            setActivePhase(1);
          } else if (prog < 0.48) {
            setActivePhase(2);
          } else if (prog < 0.72) {
            setActivePhase(3);
          } else if (prog < 0.88) {
            setActivePhase(4);
          } else {
            setActivePhase(5);
          }
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[320vh] bg-transparent">
      {/* Sticky Viewport Container Pinned by GSAP ScrollTrigger */}
      <div ref={stickyRef} className="relative w-full h-screen overflow-hidden flex flex-col justify-between">
        
        {/* 3D Canvas Background */}
        <MarketCanvas progress={scrollProgress} fallback={fallbackHero} />

        {/* Ambient Dark Background Illumination & Subtle Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#040814]/90 via-transparent to-[#040814] pointer-events-none z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(4,8,20,0.85)_100%)] pointer-events-none z-0" />

        {/* TOP EDITORIAL PHASE INDICATOR */}
        <div className="relative z-10 pt-8 px-6 sm:px-12 max-w-7xl mx-auto w-full flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-3 text-xs font-mono text-gray-400 tracking-widest uppercase">
            <span className="text-amber-400 font-bold">0{activePhase}</span>
            <span className="text-gray-600">—</span>
            <span className="text-gray-300 font-sans tracking-wide text-[11px] sm:text-xs">
              {activePhase === 1 && 'MARKET OVERVIEW'}
              {activePhase === 2 && 'PRICE ACTION'}
              {activePhase === 3 && 'TECHNICAL SIGNALS'}
              {activePhase === 4 && 'RISK MANAGEMENT'}
              {activePhase === 5 && 'START JOURNEY'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-gray-500 tracking-widest uppercase">
            <span>DHAN VIJETA ACADEMY</span>
          </div>
        </div>

        {/* CENTER CONTENT STORYTELLING OVERLAYS (Apple-Style Composition) */}
        <div className="relative z-10 flex-1 flex items-center px-6 sm:px-12 max-w-7xl mx-auto w-full">
          
          {/* PHASE 1: MASTER THE MARKET */}
          <div
            className={`w-full max-w-xl text-left transition-all duration-700 space-y-6 transform ${
              activePhase === 1
                ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 scale-95 translate-y-8 pointer-events-none absolute'
            }`}
          >
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-amber-400 font-medium block">
              Financial Education Reimagined
            </span>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
              MASTER THE <br />
              <span className="gradient-gold">MARKET</span>
            </h1>

            <p className="text-base sm:text-xl text-gray-300 font-light max-w-md leading-relaxed">
              Learn. Analyze. Trade.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/courses"
                className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 hover:from-amber-500 hover:to-yellow-300 text-finance-dark font-black px-7 py-3.5 rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.35)] flex items-center gap-2 transition duration-300 transform hover:-translate-y-0.5"
              >
                <span>Start Learning</span>
                <FaArrowRight size={13} />
              </Link>
              <Link
                to="/demo-videos"
                className="bg-white/5 border border-white/15 hover:border-amber-400/60 text-white font-semibold px-6 py-3.5 rounded-xl backdrop-blur-md flex items-center gap-2 transition duration-300 text-sm"
              >
                <FaPlay size={11} className="text-amber-400" />
                <span>Watch Demo</span>
              </Link>
            </div>
          </div>

          {/* PHASE 2: READ PRICE ACTION */}
          <div
            className={`w-full max-w-xl text-left transition-all duration-700 space-y-6 transform ${
              activePhase === 2
                ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 scale-95 translate-y-8 pointer-events-none absolute'
            }`}
          >
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-emerald-400 font-medium block">
              Section 01 — Candlesticks & Structure
            </span>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              READ <span className="text-emerald-400">PRICE ACTION</span>
            </h2>

            <p className="text-base sm:text-lg text-gray-300 font-light max-w-md leading-relaxed">
              Understand candlestick patterns, trends and market structure.
            </p>
          </div>

          {/* PHASE 3: ANALYZE THE SIGNALS */}
          <div
            className={`w-full max-w-xl text-left transition-all duration-700 space-y-6 transform ${
              activePhase === 3
                ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 scale-95 translate-y-8 pointer-events-none absolute'
            }`}
          >
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-amber-400 font-medium block">
              Section 02 — Technical Analysis
            </span>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              ANALYZE THE <span className="text-amber-400">SIGNALS</span>
            </h2>

            <p className="text-base sm:text-lg text-gray-300 font-light max-w-md leading-relaxed">
              Understand volume, moving averages, support and resistance.
            </p>
          </div>

          {/* PHASE 4: TRADE WITH CONFIDENCE */}
          <div
            className={`w-full max-w-xl text-left transition-all duration-700 space-y-6 transform ${
              activePhase === 4
                ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 scale-95 translate-y-8 pointer-events-none absolute'
            }`}
          >
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-rose-400 font-medium block">
              Section 03 — Risk Management
            </span>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              TRADE WITH <span className="text-rose-400">CONFIDENCE</span>
            </h2>

            <p className="text-base sm:text-lg text-gray-300 font-light max-w-md leading-relaxed">
              Build disciplined strategies with proper risk management.
            </p>
          </div>

          {/* PHASE 5: READY TO MASTER THE MARKET */}
          <div
            className={`w-full max-w-xl text-left transition-all duration-700 space-y-6 transform ${
              activePhase === 5
                ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 scale-95 translate-y-8 pointer-events-none absolute'
            }`}
          >
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-amber-400 font-medium block">
              Start Your Journey
            </span>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              READY TO MASTER <br />
              <span className="gradient-gold">THE MARKET?</span>
            </h2>

            <p className="text-base sm:text-lg text-gray-300 font-light max-w-md leading-relaxed">
              Explore the complete learning journey.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/courses"
                className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 hover:from-amber-500 hover:to-yellow-300 text-finance-dark font-black px-8 py-4 rounded-xl shadow-[0_0_30px_rgba(245,158,11,0.4)] flex items-center gap-2 transition duration-300 transform hover:-translate-y-0.5"
              >
                <span>Explore All Courses</span>
                <FaGraduationCap size={18} />
              </Link>
              <Link
                to="/demo-videos"
                className="bg-white/10 border border-white/20 hover:border-amber-400/60 text-white font-bold px-7 py-4 rounded-xl backdrop-blur-md flex items-center gap-2 transition duration-300 text-sm"
              >
                <FaPlay size={13} className="text-amber-400" />
                <span>Watch Demo Lectures</span>
              </Link>
            </div>
          </div>

        </div>

        {/* BOTTOM MINIMAL PROGRESS BAR */}
        <div className="relative z-10 pb-8 px-6 sm:px-12 max-w-7xl mx-auto w-full flex justify-between items-center text-[11px] font-mono text-gray-500 pointer-events-none">
          <span>SCROLL TO EXPLORE</span>
          <div className="flex items-center gap-1.5">
            <span className="text-amber-400 font-semibold">0{activePhase}</span>
            <span>/</span>
            <span>05</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default StockMarket3DHero;
