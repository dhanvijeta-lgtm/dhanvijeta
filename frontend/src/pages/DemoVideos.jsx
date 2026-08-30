import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import client from '../api/client';
import { FaSearch, FaPlay, FaVideo } from 'react-icons/fa';

// Fallback demo list if database is empty
const fallbackDemos = [
  {
    _id: 'd1',
    title: '🔥 FX Pro Indicator – REAL 1 WEEK BACKTEST ON GOLD (XAUUSD)',
    description: 'Real 1 week backtest results of FX Pro indicator on Gold (XAUUSD). Learn how to analyze indicator accuracy for intraday & swing setups.',
    videoUrl: 'https://www.youtube.com/embed/OmMHWD2iL1o',
    category: 'Forex & Indicators',
    thumbnail: 'https://img.youtube.com/vi/OmMHWD2iL1o/hqdefault.jpg'
  },
  {
    _id: 'd2',
    title: 'BOS, CHoCH, IDM Explained on Real Chart 💯 | SMC Hindi Course EP-2',
    description: 'Learn Break of Structure (BOS), Change of Character (CHoCH), and Inducement (IDM) on live charts. Master valid vs invalid swing points.',
    videoUrl: 'https://www.youtube.com/embed/JxMy7Dk9cCw',
    category: 'Smart Money Concepts',
    thumbnail: 'https://img.youtube.com/vi/JxMy7Dk9cCw/hqdefault.jpg'
  },
  {
    _id: 'd3',
    title: 'SMC Lecture EP-1 🚀 Market Structure A to Z Explained for Beginners',
    description: 'Complete A to Z beginner guide on market structure, trend identification, and higher timeframe bias by Dhan Vijeta.',
    videoUrl: 'https://www.youtube.com/embed/rsUKHQeMm64',
    category: 'Smart Money Concepts',
    thumbnail: 'https://img.youtube.com/vi/rsUKHQeMm64/hqdefault.jpg'
  },
  {
    _id: 'd4',
    title: 'Liquidity Ka Complete Knowledge 🔥 90% TRADERS don\'t know !',
    description: 'Understand liquidity pools, buy-side & sell-side liquidity grabs, and ICT + SMC liquidity sweeps before entering high-probability trades.',
    videoUrl: 'https://www.youtube.com/embed/9MjP-4EumQQ',
    category: 'Liquidity & Price Action',
    thumbnail: 'https://img.youtube.com/vi/9MjP-4EumQQ/hqdefault.jpg'
  },
  {
    _id: 'd5',
    title: 'The Funded Room Prop Firm Full Guide 🔥 | Account Kaise Buy Kare?',
    description: 'Complete step-by-step guide to passing funded prop firm evaluation challenges (1 step & 2 step) with real risk management rules.',
    videoUrl: 'https://www.youtube.com/embed/RevtKQMMeAk',
    category: 'Prop Firm Guide',
    thumbnail: 'https://img.youtube.com/vi/RevtKQMMeAk/hqdefault.jpg'
  },
  {
    _id: 'd6',
    title: 'Best Forex Broker 2026 🔥 | Vantage vs Exness vs XM vs Pepperstone',
    description: 'Detailed comparison of top Forex brokers (Vantage, Exness, XM, Pepperstone) analyzing spreads, leverage, deposit/withdrawal speed, and regulations.',
    videoUrl: 'https://www.youtube.com/embed/iaVnDgMORjo',
    category: 'Broker Comparison',
    thumbnail: 'https://img.youtube.com/vi/iaVnDgMORjo/hqdefault.jpg'
  },
  {
    _id: 'd7',
    title: 'XAUUSD & Bitcoin Next Week Bias 🔥 | CRT Candle Analysis',
    description: 'Weekly bias and key price action setups for Gold (XAUUSD) and Bitcoin using Candle Range Theory (CRT).',
    videoUrl: 'https://www.youtube.com/embed/1ltlnK8BEFg',
    category: 'Market Analysis',
    thumbnail: 'https://img.youtube.com/vi/1ltlnK8BEFg/hqdefault.jpg'
  },
  {
    _id: 'd8',
    title: 'HOW TO START TRADING FROM BASIC | TRADING ROAD MAP FOR BEGINNERS',
    description: 'Step-by-step trading roadmap for absolute beginners covering technical analysis, risk management, and psychology.',
    videoUrl: 'https://www.youtube.com/embed/AEWJVOcL_r0',
    category: 'Beginner Roadmap',
    thumbnail: 'https://img.youtube.com/vi/AEWJVOcL_r0/hqdefault.jpg'
  }
];

export function DemoVideos() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState(null);

  // Fetch demo videos from backend
  const { data: demoVideos, isLoading } = useQuery({
    queryKey: ['demo-videos'],
    queryFn: async () => {
      try {
        const res = await client.get('/admin/demo-videos');
        return res.data.data;
      } catch (e) {
        return [];
      }
    }
  });

  const videos = (demoVideos && demoVideos.length > 0) ? demoVideos : fallbackDemos;

  const categories = ['All', ...new Set(videos.map(v => v.category))];

  const filteredVideos = videos.filter(video => {
    const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory;
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          video.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-10">
      
      {/* HEADER */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
          Free Demo <span className="gradient-gold">Lectures</span>
        </h1>
        <p className="text-sm text-gray-400">
          Get a sneak peek into our premium teaching methodology. Watch these free video tutorials on technical analysis and trading psychology.
        </p>
      </div>

      {/* FILTER & SEARCH */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-finance-navy/40 border border-white/5 p-4 rounded-2xl max-w-5xl mx-auto">
        <div className="relative w-full md:max-w-xs">
          <FaSearch className="absolute left-3.5 top-3 text-gray-500" />
          <input
            type="text"
            placeholder="Search lectures..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 focus:border-finance-gold rounded-xl py-2 pl-10 pr-4 text-sm text-white outline-none transition"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none select-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 text-xs font-bold rounded-xl border transition ${
                selectedCategory === cat
                  ? 'bg-finance-gold border-finance-gold text-finance-dark'
                  : 'bg-finance-navy/40 border-white/5 text-gray-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ACTIVE VIDEO PLAYER PANEL */}
      {activeVideo && (
        <div className="max-w-4xl mx-auto bg-finance-navy border border-white/10 rounded-2xl overflow-hidden shadow-emerald-glow p-4 space-y-4">
          <div className="aspect-video w-full">
            <iframe
              src={activeVideo.videoUrl}
              title={activeVideo.title}
              className="w-full h-full rounded-xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-start gap-4">
              <h2 className="text-xl font-bold text-white leading-snug">{activeVideo.title}</h2>
              <button 
                onClick={() => setActiveVideo(null)}
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-xs px-3 py-1.5 rounded-lg text-gray-400 hover:text-white"
              >
                Close Player
              </button>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">{activeVideo.description}</p>
          </div>
        </div>
      )}

      {/* VIDEOS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {filteredVideos.map((video) => (
          <div 
            key={video._id} 
            onClick={() => setActiveVideo(video)}
            className="group glass-card rounded-2xl overflow-hidden border border-white/5 hover:border-finance-gold/30 cursor-pointer flex flex-col h-full hover:scale-[1.01] transition-all duration-300"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              {video.thumbnail ? (
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              ) : (
                <FaVideo size={24} className="text-gray-700" />
              )}
              
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="bg-finance-gold/90 hover:bg-finance-gold rounded-full p-4 shadow-lg text-finance-dark transition-transform group-hover:scale-110">
                  <FaPlay size={14} className="translate-x-0.5" />
                </div>
              </div>
              <span className="absolute bottom-2.5 right-2.5 bg-black/75 backdrop-blur text-[10px] font-bold text-gray-300 px-2 py-0.5 rounded">
                {video.category}
              </span>
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <h3 className="font-bold text-sm text-white group-hover:text-finance-gold transition line-clamp-2 mb-2 leading-snug">
                {video.title}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-2">
                {video.description}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default DemoVideos;
