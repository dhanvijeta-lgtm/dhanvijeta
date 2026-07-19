import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaGraduationCap, FaChartLine, FaShieldAlt, FaUsers, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { motion } from 'framer-motion';

export function Home() {
  const [openFaq, setOpenFaq] = useState(null);

  const stats = [
    { label: 'YouTube Subscribers', value: '500K+' },
    { label: 'Students Trained', value: '15,000+' },
    { label: 'Success Rate', value: '94.8%' },
    { label: 'Courses Offered', value: '8+' }
  ];

  const features = [
    {
      icon: <FaChartLine className="text-finance-gold" size={24} />,
      title: 'Advanced Technical Analysis',
      desc: 'Learn high-probability price action patterns, advanced indicators, and structural market cycles.'
    },
    {
      icon: <FaGraduationCap className="text-finance-emerald" size={24} />,
      title: 'Structured Curriculum',
      desc: 'From absolute beginner modules to professional futures and options strategies compiled logically.'
    },
    {
      icon: <FaShieldAlt className="text-finance-rose" size={24} />,
      title: 'Risk Management',
      desc: 'Master trade sizing, stop-loss placement, and emotional control to protect trading capital.'
    },
    {
      icon: <FaUsers className="text-sky-400" size={24} />,
      title: 'Live Trade Reviews',
      desc: 'Step-by-step breakdowns of real market setups, backtesting drills, and batch community support.'
    }
  ];

  const faqs = [
    { q: 'Is this platform suitable for complete beginners?', a: 'Yes! We have structured pathways that start from basic concepts like candlesticks and order types, moving incrementally up to advanced trading systems.' },
    { q: 'Will I get access to the materials immediately after payment?', a: 'Absolutely. As soon as the transaction is confirmed, your course in My Batch is instantly unlocked, granting access to video lectures, PDF notes, and downloadable templates.' },
    { q: 'How do I download the certificate?', a: 'Once you mark all lessons within a course section as completed, your completion percentage reaches 100%. The system will automatically generate a digital certificate downloadable in your Dashboard.' },
    { q: 'Can I study at my own pace?', a: 'Yes, all course videos, notes, and worksheets are pre-recorded and fully accessible 24/7. There is no expiry on learning materials, allowing you to study whenever you have time.' }
  ];

  const stockTicker = [
    { name: 'NIFTY 50', value: '24,320.15', change: '+1.45%', up: true },
    { name: 'SENSEX', value: '79,480.60', change: '+1.32%', up: true },
    { name: 'RELIANCE', value: '2,910.40', change: '-0.35%', up: false },
    { name: 'HDFCBANK', value: '1,640.25', change: '+2.10%', up: true },
    { name: 'TCS', value: '3,845.00', change: '+0.85%', up: true },
    { name: 'INFY', value: '1,560.10', change: '-1.20%', up: false }
  ];

  return (
    <div className="space-y-20 relative">
      
      {/* 1. STOCK TICKER */}
      <div className="ticker-wrap w-screen relative left-[50%] right-[50%] -mx-[50vw] select-none py-3 border-y border-white/5 bg-finance-navy/40">
        <div className="ticker flex gap-12 animate-float-slow items-center whitespace-nowrap pl-6">
          {stockTicker.concat(stockTicker).map((stock, i) => (
            <div key={i} className="flex items-center gap-2 text-sm font-semibold">
              <span className="text-gray-400">{stock.name}</span>
              <span className="text-white">{stock.value}</span>
              <span className={`flex items-center gap-0.5 text-xs ${stock.up ? 'text-finance-emerald' : 'text-finance-rose'}`}>
                {stock.up ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
                {stock.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. HERO SECTION */}
      <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto pt-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <span className="bg-[#2962FF]/15 text-[#3b82f6] border border-[#2962FF]/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(41,98,255,0.25)]">
            Premium Stock Market Academy
          </span>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
            Master the Stock Market with{' '}
            <span className="gradient-gold">Dhan Vijeta</span>
          </h1>

          <p className="text-base sm:text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            Gain the edge in trading and investing. Learn price action rules, trading psychology hacks, and futures & options systems directly from industry practitioners.
          </p>
        </motion.div>

        {/* Hero CTAs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 mt-8 w-full justify-center px-6"
        >
          <Link
            to="/courses"
            className="bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-finance-dark font-black px-8 py-4 rounded-xl shadow-gold-glow flex items-center justify-center gap-2 transition duration-300"
          >
            <span>Explore Courses</span>
            <FaGraduationCap size={18} />
          </Link>
          <Link
            to="/demo-videos"
            className="bg-finance-navy border border-white/10 hover:border-finance-gold text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition duration-300"
          >
            <FaPlay size={14} className="text-finance-gold" />
            <span>Watch Demo Lectures</span>
          </Link>
        </motion.div>
      </section>

      {/* 3. METRIC STATISTICS TICKER */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card rounded-2xl p-6 text-center border border-white/5 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-finance-gold/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            <span className="block text-3xl sm:text-4xl font-extrabold text-finance-gold tracking-tight mb-1">
              {stat.value}
            </span>
            <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
              {stat.label}
            </span>
          </div>
        ))}
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold tracking-tight">
            Why Learn With <span className="text-finance-gold">Dhan Vijeta</span>?
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm">
            We bypass generic theories and focus exclusively on high-performing trading methodologies backed by risk management protocols.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 border border-white/5 space-y-4 hover:-translate-y-1 transition duration-300">
              <div className="bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center">
                {feat.icon}
              </div>
              <h3 className="text-base font-bold text-white tracking-wide">
                {feat.title}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FAQs ACCORDION */}
      <section className="max-w-3xl mx-auto space-y-8">
        <h2 className="text-3xl font-bold tracking-tight text-center">
          Frequently Asked <span className="text-finance-gold">Questions</span>
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-card rounded-xl border border-white/5 overflow-hidden transition-all duration-300">
              <button
                className="w-full flex items-center justify-between p-5 font-bold text-left hover:text-finance-gold transition"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="text-sm sm:text-base">{faq.q}</span>
                <span className="text-finance-gold font-bold text-lg">{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-400 border-t border-white/5 leading-relaxed bg-white/[0.01]">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default Home;
