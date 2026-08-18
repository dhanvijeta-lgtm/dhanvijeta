import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaGraduationCap, FaPlay, FaArrowRight, FaChartLine, FaChartBar, FaClock, FaChartPie } from 'react-icons/fa';
import MarketCanvas from './MarketCanvas';

gsap.registerPlugin(ScrollTrigger);

export function StockMarket3DHero({ fallbackHero }) {
  const containerRef = useRef(null);
  const stickyRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activePhase, setActivePhase] = useState(1);

  // Live IST Clock
  const [currentTime, setCurrentTime] = useState('');

  // Mouse Parallax for Layer 3 (Foreground HUD Elements)
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const istTime = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setCurrentTime(`${istTime} IST`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (window.innerWidth < 768) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 18;
      const y = (e.clientY / window.innerHeight - 0.5) * 18;
      setMouseOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
    /* Full Viewport Width Breakout: w-screen relative left-[50%] right-[50%] -mx-[50vw] */
    <div ref={containerRef} className="relative w-screen left-[50%] right-[50%] -mx-[50vw] h-[320vh] bg-transparent select-none">
      {/* Sticky Viewport Container Pinned by GSAP ScrollTrigger */}
      <div ref={stickyRef} className="relative w-full h-screen overflow-hidden flex flex-col justify-between">
        
        {/* 3D Canvas Background (Layer 1 & Layer 2) */}
        <MarketCanvas progress={scrollProgress} fallback={fallbackHero} />

        {/* Layer 1: Dark Background Illumination & Soft Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#040814]/90 via-transparent to-[#040814] pointer-events-none z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(4,8,20,0.85)_100%)] pointer-events-none z-0" />

        {/* TOP STATUS BAR: Live IST Clock Pill & Editorial Phase Indicator */}
        <div className="relative z-20 pt-6 px-6 sm:px-12 lg:px-16 max-w-[1500px] mx-auto w-full flex items-center justify-between pointer-events-none">
          {/* Status Pill */}
          <div className="flex items-center gap-3 bg-[#090d16]/80 border border-white/10 px-4 py-2 rounded-full text-xs font-mono backdrop-blur-md shadow-2xl pointer-events-auto">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-emerald-400 font-bold tracking-wider">MARKET OPEN</span>
            <span className="text-gray-600">|</span>
            <span className="text-gray-300 font-sans text-xs">{currentTime || '09:45:32 AM IST'}</span>
          </div>

          {/* Minimal Editorial Phase Badge */}
          <div className="flex items-center gap-3 text-xs font-mono text-gray-400 tracking-widest uppercase bg-[#090d16]/70 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
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
        </div>

        {/* LAYER 3: FLOATING FINANCIAL HUD DATA CARDS (Top Right & Bottom) */}
        <div
          className="absolute inset-0 pointer-events-none z-10 hidden lg:block"
          style={{
            transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0px)`,
            transition: 'transform 0.2s cubic-bezier(0.1, 1, 0.1, 1)'
          }}
        >
          {/* TOP RIGHT CARD 1: NIFTY 50 */}
          <div className={`absolute top-[14%] right-[18%] bg-[#090d16]/80 border border-white/10 rounded-2xl p-4 backdrop-blur-md shadow-[0_15px_35px_rgba(0,0,0,0.6)] transition-all duration-700 w-52 ${activePhase <= 2 ? 'opacity-95 scale-100' : 'opacity-25 scale-95'}`}>
            <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono mb-1">
              <span className="flex items-center gap-1.5"><FaChartLine className="text-emerald-400" /> NIFTY 50</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-bold text-white tracking-tight">24,320.15</span>
              <span className="text-xs font-semibold text-emerald-400">+1.24%</span>
            </div>
            <svg className="w-full h-6 mt-1" viewBox="0 0 100 25">
              <path d="M0 20 Q 25 5, 50 15 T 100 2" fill="none" stroke="#10b981" strokeWidth="2" />
            </svg>
          </div>

          {/* TOP RIGHT CARD 2: BANK NIFTY */}
          <div className={`absolute top-[14%] right-[3%] bg-[#090d16]/80 border border-white/10 rounded-2xl p-4 backdrop-blur-md shadow-[0_15px_35px_rgba(0,0,0,0.6)] transition-all duration-700 w-52 ${activePhase <= 3 ? 'opacity-95 scale-100' : 'opacity-25 scale-95'}`}>
            <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono mb-1">
              <span className="flex items-center gap-1.5"><FaChartBar className="text-emerald-400" /> BANK NIFTY</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-bold text-white tracking-tight">52,140.80</span>
              <span className="text-xs font-semibold text-emerald-400">+0.87%</span>
            </div>
            <svg className="w-full h-6 mt-1" viewBox="0 0 100 25">
              <path d="M0 18 Q 30 22, 60 8 T 100 3" fill="none" stroke="#10b981" strokeWidth="2" />
            </svg>
          </div>

          {/* TOP RIGHT CARD 3: MARKET SENTIMENT */}
          <div className={`absolute top-[34%] right-[4%] bg-[#090d16]/80 border border-white/10 rounded-2xl p-4 backdrop-blur-md shadow-[0_15px_35px_rgba(0,0,0,0.6)] transition-all duration-700 w-56 ${activePhase >= 2 && activePhase <= 4 ? 'opacity-95 scale-100' : 'opacity-25 scale-95'}`}>
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block mb-1">MARKET SENTIMENT</span>
            <div className="flex items-center gap-2">
              <span className="text-xl">🐂</span>
              <div>
                <span className="text-sm font-extrabold text-emerald-400 tracking-wide block">BULLISH</span>
                <span className="text-[10px] text-gray-400 font-mono">EXPANSION PHASE</span>
              </div>
            </div>
          </div>

          {/* BOTTOM CARD 1: VOLUME */}
          <div className={`absolute bottom-[10%] left-[3%] bg-[#090d16]/80 border border-white/10 rounded-2xl p-4 backdrop-blur-md shadow-[0_15px_35px_rgba(0,0,0,0.6)] transition-all duration-700 w-48 ${activePhase >= 1 ? 'opacity-95 scale-100' : 'opacity-30 scale-95'}`}>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
                <FaChartBar size={16} />
              </div>
              <div>
                <span className="text-[10px] font-mono text-gray-400 uppercase block">VOLUME</span>
                <span className="text-base font-extrabold text-white">84.2M</span>
                <span className="text-[10px] text-emerald-400 font-mono block">+12.65%</span>
              </div>
            </div>
          </div>

          {/* BOTTOM CARD 2: 52W HIGH */}
          <div className={`absolute bottom-[10%] left-[17%] bg-[#090d16]/80 border border-white/10 rounded-2xl p-4 backdrop-blur-md shadow-[0_15px_35px_rgba(0,0,0,0.6)] transition-all duration-700 w-48 ${activePhase >= 1 ? 'opacity-95 scale-100' : 'opacity-30 scale-95'}`}>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
                <FaClock size={16} />
              </div>
              <div>
                <span className="text-[10px] font-mono text-gray-400 uppercase block">52W HIGH</span>
                <span className="text-base font-extrabold text-white">25,148.30</span>
                <span className="text-[10px] text-emerald-400 font-mono block">+2.18%</span>
              </div>
            </div>
          </div>

          {/* BOTTOM CARD 3: ADVANCES / MARKET DEPTH */}
          <div className={`absolute bottom-[10%] left-[31%] bg-[#090d16]/80 border border-white/10 rounded-2xl p-4 backdrop-blur-md shadow-[0_15px_35px_rgba(0,0,0,0.6)] transition-all duration-700 w-48 ${activePhase >= 1 ? 'opacity-95 scale-100' : 'opacity-30 scale-95'}`}>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-sky-500/10 rounded-xl border border-sky-500/20 text-sky-400">
                <FaChartPie size={16} />
              </div>
              <div>
                <span className="text-[10px] font-mono text-gray-400 uppercase block">ADVANCES</span>
                <span className="text-base font-extrabold text-emerald-400">78%</span>
                <span className="text-[10px] text-gray-400 font-mono block">MARKET DEPTH</span>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER CONTENT STORYTELLING OVERLAYS */}
        <div className="relative z-20 flex-1 flex items-center px-6 sm:px-12 lg:px-16 max-w-[1500px] mx-auto w-full">
          
          {/* PHASE 1: MASTER THE MARKET */}
          <div
            className={`w-full max-w-2xl text-left transition-all duration-700 space-y-6 transform ${
              activePhase === 1
                ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 scale-95 translate-y-8 pointer-events-none absolute'
            }`}
          >
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-amber-400 font-bold block">
              FINANCIAL INTELLIGENCE & TRADING MASTERY
            </span>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
              MASTER THE <br />
              <span className="gradient-gold">MARKET</span>
            </h1>

            <p className="text-base sm:text-2xl text-gray-300 font-light leading-relaxed">
              Learn. Analyze. Trade.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/courses"
                className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 hover:from-amber-500 hover:to-yellow-300 text-finance-dark font-black px-8 py-4 rounded-xl shadow-[0_0_30px_rgba(245,158,11,0.45)] flex items-center gap-2.5 transition duration-300 transform hover:-translate-y-0.5 text-base"
              >
                <span>Start Learning</span>
                <FaArrowRight size={14} />
              </Link>
              <Link
                to="/demo-videos"
                className="bg-[#090d16]/80 border border-white/20 hover:border-amber-400 text-white font-bold px-7 py-4 rounded-xl backdrop-blur-md flex items-center gap-2.5 transition duration-300 text-base"
              >
                <FaPlay size={12} className="text-amber-400" />
                <span>Watch Demo</span>
              </Link>
            </div>
          </div>

          {/* PHASE 2: READ PRICE ACTION */}
          <div
            className={`w-full max-w-2xl text-left transition-all duration-700 space-y-6 transform ${
              activePhase === 2
                ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 scale-95 translate-y-8 pointer-events-none absolute'
            }`}
          >
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-emerald-400 font-bold block">
              Section 01 — Candlesticks & Structure
            </span>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
              READ <span className="text-emerald-400">PRICE ACTION</span>
            </h2>

            <p className="text-base sm:text-xl text-gray-300 font-light leading-relaxed">
              Understand candlestick patterns, trends and market structure.
            </p>
          </div>

          {/* PHASE 3: ANALYZE THE SIGNALS */}
          <div
            className={`w-full max-w-2xl text-left transition-all duration-700 space-y-6 transform ${
              activePhase === 3
                ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 scale-95 translate-y-8 pointer-events-none absolute'
            }`}
          >
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-amber-400 font-bold block">
              Section 02 — Technical Analysis
            </span>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
              ANALYZE THE <span className="text-amber-400">SIGNALS</span>
            </h2>

            <p className="text-base sm:text-xl text-gray-300 font-light leading-relaxed">
              Understand volume, moving averages, support and resistance.
            </p>
          </div>

          {/* PHASE 4: TRADE WITH CONFIDENCE */}
          <div
            className={`w-full max-w-2xl text-left transition-all duration-700 space-y-6 transform ${
              activePhase === 4
                ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 scale-95 translate-y-8 pointer-events-none absolute'
            }`}
          >
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-rose-400 font-bold block">
              Section 03 — Risk Management
            </span>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
              TRADE WITH <span className="text-rose-400">CONFIDENCE</span>
            </h2>

            <p className="text-base sm:text-xl text-gray-300 font-light leading-relaxed">
              Build disciplined strategies with proper risk management.
            </p>
          </div>

          {/* PHASE 5: READY TO MASTER THE MARKET */}
          <div
            className={`w-full max-w-2xl text-left transition-all duration-700 space-y-6 transform ${
              activePhase === 5
                ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 scale-95 translate-y-8 pointer-events-none absolute'
            }`}
          >
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-amber-400 font-bold block">
              Start Your Journey
            </span>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
              READY TO MASTER <br />
              <span className="gradient-gold">THE MARKET?</span>
            </h2>

            <p className="text-base sm:text-xl text-gray-300 font-light leading-relaxed">
              Explore the complete learning journey.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/courses"
                className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 hover:from-amber-500 hover:to-yellow-300 text-finance-dark font-black px-8 py-4 rounded-xl shadow-[0_0_30px_rgba(245,158,11,0.5)] flex items-center gap-2.5 transition duration-300 transform hover:-translate-y-0.5 text-base"
              >
                <span>Explore All Courses</span>
                <FaGraduationCap size={18} />
              </Link>
              <Link
                to="/demo-videos"
                className="bg-[#090d16]/80 border border-white/20 hover:border-amber-400 text-white font-bold px-7 py-4 rounded-xl backdrop-blur-md flex items-center gap-2.5 transition duration-300 text-base"
              >
                <FaPlay size={13} className="text-amber-400" />
                <span>Watch Demo Lectures</span>
              </Link>
            </div>
          </div>

        </div>

        {/* BOTTOM MINIMAL PROGRESS BAR */}
        <div className="relative z-20 pb-6 px-6 sm:px-12 lg:px-16 max-w-[1500px] mx-auto w-full flex justify-between items-center text-[11px] font-mono text-gray-500 pointer-events-none">
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
