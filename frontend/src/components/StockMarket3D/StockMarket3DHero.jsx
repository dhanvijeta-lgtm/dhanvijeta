import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaGraduationCap, FaPlay, FaArrowRight, FaChartLine, FaShieldAlt, FaLightbulb, FaRocket } from 'react-icons/fa';
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

        {/* Ambient Dark Gradient Overlays for Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#090d16]/80 via-transparent to-[#090d16] pointer-events-none z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(4,8,20,0.85)_100%)] pointer-events-none z-0" />

        {/* TOP STATUS BAR OVERLAY */}
        <div className="relative z-10 pt-6 px-6 max-w-7xl mx-auto w-full flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-xs text-amber-400 font-mono backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Phase {activePhase} / 5</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-300 font-sans">
              {activePhase === 1 && 'Market Overview'}
              {activePhase === 2 && 'Price Action Breakdown'}
              {activePhase === 3 && 'Technical Signals'}
              {activePhase === 4 && 'Strategy Execution'}
              {activePhase === 5 && 'Get Started'}
            </span>
          </div>

          {/* Mini Scroll Progress Indicator */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400 font-mono bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
            <span>SCROLL STORY</span>
            <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-150"
                style={{ width: `${Math.round(scrollProgress * 100)}%` }}
              />
            </div>
            <span>{Math.round(scrollProgress * 100)}%</span>
          </div>
        </div>

        {/* CENTER CONTENT STORYTELLING OVERLAYS */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-4 max-w-4xl mx-auto w-full text-center">
          
          {/* PHASE 1: MASTER THE MARKET */}
          <div
            className={`transition-all duration-700 space-y-6 transform ${
              activePhase === 1
                ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 scale-95 translate-y-8 pointer-events-none absolute'
            }`}
          >
            <span className="inline-flex items-center gap-2 bg-[#2962FF]/15 text-[#3b82f6] border border-[#2962FF]/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(41,98,255,0.3)] backdrop-blur-md">
              <FaChartLine size={12} />
              Interactive 3D Stock Market Experience
            </span>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-white">
              MASTER THE <span className="gradient-gold">MARKET</span>
            </h1>

            <p className="text-lg sm:text-2xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
              Learn. Analyze. Trade.
            </p>

            <p className="text-xs sm:text-sm text-amber-300/80 font-mono uppercase tracking-widest pt-2 flex items-center justify-center gap-2">
              <span>Scroll Down To Explore The Market</span>
              <span className="animate-bounce">↓</span>
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                to="/courses"
                className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 hover:from-amber-500 hover:to-yellow-300 text-finance-dark font-black px-8 py-3.5 rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.4)] flex items-center gap-2 transition duration-300 transform hover:-translate-y-0.5"
              >
                <span>Start Learning</span>
                <FaArrowRight size={14} />
              </Link>
              <Link
                to="/demo-videos"
                className="bg-white/5 border border-white/15 hover:border-amber-400 text-white font-bold px-7 py-3.5 rounded-xl backdrop-blur-md flex items-center gap-2 transition duration-300"
              >
                <FaPlay size={12} className="text-amber-400" />
                <span>Watch Demo</span>
              </Link>
            </div>
          </div>

          {/* PHASE 2: READ PRICE ACTION */}
          <div
            className={`transition-all duration-700 space-y-6 transform ${
              activePhase === 2
                ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 scale-95 translate-y-8 pointer-events-none absolute'
            }`}
          >
            <span className="inline-flex items-center gap-2 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.25)] backdrop-blur-md">
              <FaLightbulb size={12} />
              Section 1: Price Action Decoding
            </span>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Understand <span className="text-emerald-400">Price Action</span> & Candlesticks
            </h2>

            <p className="text-sm sm:text-lg text-gray-300 max-w-xl mx-auto font-light leading-relaxed">
              Decode institutional buying and selling pressure. Master bullish breakouts, candlestick wicks, market momentum, and structural liquidity.
            </p>
          </div>

          {/* PHASE 3: ANALYZE THE SIGNALS */}
          <div
            className={`transition-all duration-700 space-y-6 transform ${
              activePhase === 3
                ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 scale-95 translate-y-8 pointer-events-none absolute'
            }`}
          >
            <span className="inline-flex items-center gap-2 bg-amber-500/15 text-amber-400 border border-amber-500/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.25)] backdrop-blur-md">
              <FaChartLine size={12} />
              Section 2: Technical Indicators
            </span>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Analyze <span className="text-amber-400">Signals</span> & Moving Averages
            </h2>

            <p className="text-sm sm:text-lg text-gray-300 max-w-xl mx-auto font-light leading-relaxed">
              Overlay 3D moving averages, support & resistance horizontal levels, volume histogram spikes, and high-probability trend indicators.
            </p>
          </div>

          {/* PHASE 4: TRADE WITH CONFIDENCE */}
          <div
            className={`transition-all duration-700 space-y-6 transform ${
              activePhase === 4
                ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 scale-95 translate-y-8 pointer-events-none absolute'
            }`}
          >
            <span className="inline-flex items-center gap-2 bg-rose-500/15 text-rose-400 border border-rose-500/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(244,63,94,0.25)] backdrop-blur-md">
              <FaShieldAlt size={12} />
              Section 3: Risk Management Protocols
            </span>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Trade With <span className="text-rose-400">Absolute Confidence</span>
            </h2>

            <p className="text-sm sm:text-lg text-gray-300 max-w-xl mx-auto font-light leading-relaxed">
              Combine technical precision with strict position sizing and emotional control to protect capital and construct consistent wealth.
            </p>
          </div>

          {/* PHASE 5: START YOUR JOURNEY */}
          <div
            className={`transition-all duration-700 space-y-6 transform ${
              activePhase === 5
                ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 scale-95 translate-y-8 pointer-events-none absolute'
            }`}
          >
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-emerald-500/20 text-amber-300 border border-amber-500/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.3)] backdrop-blur-md">
              <FaRocket size={12} />
              Ready To Become A Dhan Vijeta?
            </span>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Start Your <span className="gradient-gold">Trading Journey</span> Today
            </h2>

            <p className="text-sm sm:text-lg text-gray-300 max-w-xl mx-auto font-light leading-relaxed">
              Join 15,000+ traders mastering stock market trading through structured curriculum, live trade reviews, and practitioner strategies.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                to="/courses"
                className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 hover:from-amber-500 hover:to-yellow-300 text-finance-dark font-black px-9 py-4 rounded-xl shadow-[0_0_30px_rgba(245,158,11,0.5)] flex items-center gap-2 transition duration-300 transform hover:-translate-y-0.5"
              >
                <span>Explore All Courses</span>
                <FaGraduationCap size={18} />
              </Link>
              <Link
                to="/demo-videos"
                className="bg-white/10 border border-white/20 hover:border-amber-400 text-white font-bold px-8 py-4 rounded-xl backdrop-blur-md flex items-center gap-2 transition duration-300"
              >
                <FaPlay size={14} className="text-amber-400" />
                <span>Watch Free Lectures</span>
              </Link>
            </div>
          </div>

        </div>

        {/* BOTTOM SCROLL PROGRESS BAR */}
        <div className="relative z-10 pb-6 px-6 max-w-7xl mx-auto w-full flex justify-between items-center text-xs text-gray-400 pointer-events-none">
          <span className="font-mono text-gray-500">DHAN VIJETA 3D ENGINE</span>
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-mono">0{activePhase}</span>
            <span className="text-gray-600">/</span>
            <span className="text-gray-500 font-mono">05</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default StockMarket3DHero;
