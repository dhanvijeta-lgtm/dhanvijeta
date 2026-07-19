import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import client from '../api/client';
import { FaSearch, FaPlay, FaVideo } from 'react-icons/fa';

// Fallback demo list if database is empty
const fallbackDemos = [
  {
    _id: 'd1',
    title: 'Price Action Trading Masterclass | Complete Course',
    description: 'Learn support/resistance, candlestick anatomy, trend lines, and how to spot breakout trades with high risk-to-reward ratios.',
    videoUrl: 'https://www.youtube.com/embed/nOHs2t4-a8E',
    category: 'Price Action',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=60'
  },
  {
    _id: 'd2',
    title: 'Options Trading Beginner Course | Call & Put Explained',
    description: 'An introductory class explaining options contracts, strike prices, premiums, call options, and put options for complete beginners.',
    videoUrl: 'https://www.youtube.com/embed/L1c9-Q2W174',
    category: 'Options Trading',
    thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=500&auto=format&fit=crop&q=60'
  },
  {
    _id: 'd3',
    title: 'Risk Management Strategy: How to Size Your Trades',
    description: 'Stop losing your trading account. Understand position sizing, risk per trade limits, win rates, and how to calculate risk metrics.',
    videoUrl: 'https://www.youtube.com/embed/L3A19rTj42k',
    category: 'Psychology',
    thumbnail: 'https://images.unsplash.com/photo-1621262740976-903c7e73385d?w=500&auto=format&fit=crop&q=60'
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
