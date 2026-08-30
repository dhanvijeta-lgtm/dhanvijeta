import React from 'react';
import { FaYoutube, FaTelegram, FaBookmark, FaAward, FaBuilding } from 'react-icons/fa';

export function About() {
  const achievements = [
    { icon: <FaYoutube className="text-red-500" size={24} />, title: '5.19K+ Subscribers', desc: 'Growing community learning Smart Money Concepts (SMC) & Price Action.' },
    { icon: <FaBookmark className="text-finance-gold" size={24} />, title: '26+ Video Lectures', desc: 'In-depth market structure mapping, BOS, CHoCH, and IDM lessons.' },
    { icon: <FaAward className="text-finance-emerald" size={24} />, title: 'Forex & Gold Specialist', desc: 'Weekly bias, CRT candle analysis, and Gold (XAUUSD) setups.' }
  ];

  const timeline = [
    { year: '2022', title: 'Channel Inception', desc: 'Dhan Vijeta launched on YouTube sharing Smart Money Concepts and price action fundamentals.' },
    { year: '2023-2025', title: 'SMC & Prop Firm Guide', desc: 'Released complete lectures on BOS, CHoCH, IDM, Liquidity Sweeps, and Prop Firm challenges.' },
    { year: '2026', title: 'EdTech Academy Launch', desc: 'Building a dedicated learning platform with video lessons, backtest drills, and community access.' }
  ];

  return (
    <div className="space-y-16 max-w-5xl mx-auto">
      
      {/* HEADER SECTION */}
      <section className="text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
          About <span className="gradient-gold">Dhan Vijeta</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-light">
          We empower retail traders with Smart Money Concepts (SMC), Market Structure mapping, Order Blocks, Liquidity, and Risk Management to trade Forex (XAUUSD) and Crypto with confidence.
        </p>
      </section>

      {/* CORE VISION & MISSION */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card rounded-2xl p-8 border border-white/5 space-y-4">
          <span className="text-[10px] text-finance-gold uppercase font-bold tracking-widest block">Our Mission</span>
          <h3 className="text-xl font-bold text-white">Simplifying Smart Money Concepts</h3>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-light">
            Our mission is to replace confusing indicators with logical market structure (BOS, CHoCH, Inducement) and strict risk management, enabling retail traders to spot institutional footprints.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-8 border border-white/5 space-y-4">
          <span className="text-[10px] text-finance-emerald uppercase font-bold tracking-widest block">Our Vision</span>
          <h3 className="text-xl font-bold text-white">Disciplined & Consistent Traders</h3>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-light">
            We envision building a global community of disciplined Forex & stock market traders who follow rule-based entry models, protect trading capital, and pass prop firm evaluations.
          </p>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="space-y-8">
        <h2 className="text-2xl font-bold text-center">Our Learning Journey</h2>
        <div className="relative border-l border-white/10 pl-6 ml-4 space-y-8">
          {timeline.map((item, idx) => (
            <div key={idx} className="relative group">
              <span className="absolute -left-[31px] top-1 w-4.5 h-4.5 bg-finance-gold rounded-full border border-finance-dark flex items-center justify-center text-[8px] font-bold text-finance-dark shadow-gold-glow group-hover:scale-110 transition">
              </span>
              <div className="space-y-1">
                <span className="text-xs font-bold text-finance-gold">{item.year}</span>
                <h4 className="text-base font-bold text-white">{item.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* METRICS ROW */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {achievements.map((ach, idx) => (
          <div key={idx} className="glass-card rounded-2xl p-6 border border-white/5 flex gap-4 items-start">
            <div className="bg-white/5 p-3 rounded-xl shrink-0">
              {ach.icon}
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">{ach.title}</h4>
              <p className="text-xs text-gray-400 leading-relaxed">{ach.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* INSTRUCTOR CARD */}
      <section className="glass-card rounded-3xl p-8 border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-8 items-center shadow-emerald-glow">
        <div className="md:col-span-1 flex justify-center">
          <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-finance-gold to-finance-slate flex items-center justify-center text-finance-dark text-4xl font-black shadow-lg">
            DV
          </div>
        </div>
        <div className="md:col-span-2 space-y-4">
          <span className="bg-finance-gold/10 text-finance-gold border border-finance-gold/20 px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
            Lead Instructor & Founder
          </span>
          <h3 className="text-2xl font-bold text-white">Dhan Vijeta</h3>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-light">
            Founder of Dhan Vijeta. Creator of in-depth lessons on Smart Money Concepts (SMC), Price Action, Market Structure, Order Blocks, Liquidity, Supply & Demand, and XAUUSD (Gold) & Bitcoin weekly analysis.
          </p>
          <div className="flex gap-4">
            <a href="https://www.youtube.com/@DhanVijeta" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-3.5 py-1.5 rounded-lg font-bold hover:bg-red-500/20 transition">
              <FaYoutube />
              <span>YouTube Channel</span>
            </a>
            <a href="https://t.me/dhanvijeta" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs bg-sky-500/10 text-sky-400 border border-sky-500/20 px-3.5 py-1.5 rounded-lg font-bold hover:bg-sky-500/20 transition">
              <FaTelegram />
              <span>Telegram Channel</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}

export default About;
