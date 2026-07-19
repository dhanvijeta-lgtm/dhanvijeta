import React from 'react';
import { FaYoutube, FaTelegram, FaBookmark, FaAward, FaBuilding } from 'react-icons/fa';

export function About() {
  const achievements = [
    { icon: <FaYoutube className="text-red-500" size={24} />, title: '500K+ Sub Subscribers', desc: 'Active community learning market analysis weekly.' },
    { icon: <FaBookmark className="text-finance-gold" size={24} />, title: '15,000+ Enrolled Students', desc: 'Trading and investing in standard structured programs.' },
    { icon: <FaAward className="text-finance-emerald" size={24} />, title: 'Premium Content Rating', desc: 'Consistently rated 4.8+ stars across active courses.' }
  ];

  const timeline = [
    { year: '2023', title: 'Channel Inception', desc: 'Dhan Vijeta started on YouTube sharing basic price action candlestick rules.' },
    { year: '2024', title: '100K Subscriber Milestone', desc: 'Expanded into structured stock market analyses, derivatives training, and live reviews.' },
    { year: '2025', title: 'Launching EdTech Platform', desc: 'Created unified workspace with video streaming, PDF worksheets, checklists, and certifications.' }
  ];

  return (
    <div className="space-y-16 max-w-5xl mx-auto">
      
      {/* HEADER SECTION */}
      <section className="text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
          About <span className="gradient-gold">Dhan Vijeta</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-light">
          We bridge the gap between financial theory and successful market execution by delivering premium, logical, and structured stock market trading courses.
        </p>
      </section>

      {/* CORE VISION & MISSION */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card rounded-2xl p-8 border border-white/5 space-y-4">
          <span className="text-[10px] text-finance-gold uppercase font-bold tracking-widest block">Our Mission</span>
          <h3 className="text-xl font-bold text-white">Democratizing Trading Education</h3>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-light">
            We aim to simplify the stock market, ensuring that retail traders and investors learn professional price action analysis, derivatives management, and psychological control, making consistent performance achievable.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-8 border border-white/5 space-y-4">
          <span className="text-[10px] text-finance-emerald uppercase font-bold tracking-widest block">Our Vision</span>
          <h3 className="text-xl font-bold text-white">Creating Financially Wise Traders</h3>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-light">
            We envision building India's most practical financial EdTech environment, helping retail traders transition from randomized trading guesses to rule-based execution patterns supported by strict risk parameters.
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
            With over 6+ years of active experience in stock trading, technical price action systems, and derivative analysis, Dhan Vijeta's mission is to offer highly simplified, systematic, and logical tutorials that decode index charts and stock patterns.
          </p>
          <div className="flex gap-4">
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-3.5 py-1.5 rounded-lg font-bold hover:bg-red-500/20 transition">
              <FaYoutube />
              <span>YouTube Channel</span>
            </a>
            <a href="https://telegram.org" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs bg-sky-500/10 text-sky-400 border border-sky-500/20 px-3.5 py-1.5 rounded-lg font-bold hover:bg-sky-500/20 transition">
              <FaTelegram />
              <span>Telegram Group</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}

export default About;
