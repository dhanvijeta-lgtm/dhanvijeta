import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import client from '../../api/client';
import { FaRegCalendarAlt, FaUser, FaArrowLeft } from 'react-icons/fa';

// Fallback details mapping
const fallbackDetails = {
  'understanding-price-action': {
    title: 'Understanding Price Action: The Key to Professional Trading',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    author: 'Dhan Vijeta Team',
    publishedDate: '2026-07-15T08:00:00.000Z',
    tags: ['Price Action', 'Technical Analysis'],
    content: `
      <h2>The Core of Price Action Trading</h2>
      <p>Price action trading is the methodology of making all trading decisions based purely on the movement of prices on a chart, rather than relying on lagging indicators. In its essence, it assumes that all market information, news, and fundamentals are already discounted and reflected inside the price charts.</p>
      
      <h3>1. Candlestick Patterns Speak Volumes</h3>
      <p>Candlestick shapes are visual summaries of the battle between buyers and sellers within a specific timeframe. The length of the wick reveals rejection. A long lower wick means buyers pushed prices back up before the close, suggesting bullish strength. A long upper wick indicates selling pressure at highs.</p>

      <h3>2. Support and Resistance Zones</h3>
      <p>Instead of single lines, professional traders look for zones. Support zones represent areas where demand overcomes supply, halting a down-move. Resistance zones show selling supply overcoming buying demand. Trading near these zones ensures low-risk setups.</p>

      <h3>3. Trend Identification and Structure</h3>
      <p>A bullish structure consists of higher highs and higher lows. A bearish structure consists of lower highs and lower lows. Trading in alignment with the structure gives high probabilities of success.</p>
    `
  },
  'how-to-control-emotions-trading': {
    title: 'How to Control Your Emotions in Trading | Psychology Hacks',
    thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=80',
    author: 'Dhan Vijeta Team',
    publishedDate: '2026-07-10T10:30:00.000Z',
    tags: ['Psychology', 'Risk Management'],
    content: `
      <h2>Why Psychology Dominates Trading</h2>
      <p>It is often said that trading is 10% strategy, 20% risk management, and 70% psychology. A trader with a 40% win-rate but strict emotional control will make money, while a trader with a 90% win-rate but poor discipline will blow their account in a single day.</p>
      
      <h3>1. The Fear of Missing Out (FOMO)</h3>
      <p>FOMO is the force that makes traders jump into a stock after it has already run up 10%. By trading at the peak of the momentum, you risk buying the high. The hack: Always wait for pullbacks to valid support levels before entering.</p>

      <h3>2. Revenge Trading</h3>
      <p>After a loss, the natural reaction is to get your money back. This triggers overtrading and larger, emotional trade sizes. The hack: Define a maximum daily loss limit. If reached, shut down the platform immediately.</p>

      <h3>3. Over-Leveraging</h3>
      <p>Taking positions that are too large creates high stress, forcing you to exit correct setups at the minor pullbacks. Rule of thumb: Never risk more than 1-2% of your account capital on any single setup.</p>
    `
  },
  'swing-trading-vs-day-trading': {
    title: 'Swing Trading vs. Day Trading: Which System Suits You?',
    thumbnail: 'https://images.unsplash.com/photo-1621262740976-903c7e73385d?w=800&auto=format&fit=crop&q=80',
    author: 'Dhan Vijeta Team',
    publishedDate: '2026-07-01T14:15:00.000Z',
    tags: ['Trading Rules', 'Swing Trading'],
    content: `
      <h2>Which Trading Style Fits Your Schedule?</h2>
      <p>Understanding whether you should be a Day Trader or a Swing Trader is critical to aligning your career goals with your lifestyle and time constraints.</p>
      
      <h3>Day Trading (Intraday)</h3>
      <p>Day trading involves opening and closing all positions within the same trading session. There is zero overnight risk. However, it requires constant screen time, rapid decision making, and quick reflexes.</p>

      <h3>Swing Trading</h3>
      <p>Swing trading is holding trades for days or weeks to capture short-to-medium-term price momentum. It requires only 30 minutes of daily analysis and works perfectly for corporate employees. The trades are slower and require wider stop-losses.</p>
    `
  }
};

export function BlogDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Fetch single blog using TanStack Query
  const { data: blog, isLoading } = useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => {
      try {
        const res = await client.get(`/blogs/${slug}`);
        return res.data.data;
      } catch (e) {
        return null;
      }
    }
  });

  const activeBlog = blog || fallbackDetails[slug];

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-finance-gold border-finance-navy rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!activeBlog) {
    return (
      <div className="text-center py-20 max-w-md mx-auto">
        <h3 className="text-xl font-bold text-finance-rose mb-2">Article Not Found</h3>
        <button onClick={() => navigate('/blog')} className="mt-4 bg-finance-navy border border-white/10 px-6 py-2 rounded-xl text-xs">
          Back to Blog
        </button>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Back button */}
      <button 
        onClick={() => navigate('/blog')} 
        className="flex items-center gap-2 text-xs text-gray-400 hover:text-finance-gold transition group mb-2"
      >
        <FaArrowLeft className="group-hover:-translate-x-0.5 transition-transform" />
        <span>Back to Insights</span>
      </button>

      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex gap-2">
          {activeBlog.tags?.map((t, i) => (
            <span key={i} className="bg-finance-gold/10 text-finance-gold border border-finance-gold/20 text-[10px] font-bold px-2 py-0.5 rounded">
              {t}
            </span>
          ))}
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-snug">
          {activeBlog.title}
        </h1>

        <div className="flex items-center gap-6 text-xs text-gray-400 font-medium">
          <span className="flex items-center gap-1.5">
            <FaRegCalendarAlt />
            <span>{formatDate(activeBlog.publishedDate)}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <FaUser />
            <span>{activeBlog.author}</span>
          </span>
        </div>
      </div>

      {/* Image Banner */}
      {activeBlog.thumbnail && (
        <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/5 bg-finance-navy">
          <img 
            src={activeBlog.thumbnail} 
            alt={activeBlog.title} 
            className="w-full h-full object-cover" 
          />
        </div>
      )}

      {/* Article Content container */}
      <div 
        className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed space-y-4 pt-4 border-t border-white/5
          prose-headings:text-white prose-headings:font-bold prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-2 prose-h3:text-lg prose-p:text-sm prose-p:mb-4 font-light"
        dangerouslySetInnerHTML={{ __html: activeBlog.content }}
      ></div>

    </div>
  );
}

export default BlogDetails;
