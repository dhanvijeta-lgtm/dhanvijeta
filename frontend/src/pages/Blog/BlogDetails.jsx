import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import client from '../../api/client';
import { FaRegCalendarAlt, FaUser, FaArrowLeft } from 'react-icons/fa';

// Fallback details mapping
const fallbackDetails = {
  'smc-structure-mapping-bos-choch-idm': {
    title: 'SMC Structure Mapping: BOS, CHoCH & Inducement Explained',
    thumbnail: 'https://img.youtube.com/vi/JxMy7Dk9cCw/hqdefault.jpg',
    author: 'Dhan Vijeta',
    publishedDate: '2026-08-01T08:00:00.000Z',
    tags: ['Smart Money Concepts', 'Price Action'],
    content: `
      <h2>Smart Money Concepts (SMC) Structure Mapping</h2>
      <p>Structure mapping is the foundation of Smart Money Concepts (SMC). Before placing any trade, you must identify whether the market is making true higher highs or inducing retail traders into early entries.</p>
      
      <h3>1. Inducement (IDM) – The Retail Trap</h3>
      <p>Inducement is the internal pullback high or low that entices retail traders to enter prematurely. Smart money takes out the inducement liquidity before initiating the real trend move.</p>

      <h3>2. Break of Structure (BOS) vs Change of Character (CHoCH)</h3>
      <p><b>BOS (Break of Structure):</b> Occurs when the trend continues in its primary direction by closing body candle past the recent structural swing high/low.</p>
      <p><b>CHoCH (Change of Character):</b> The first sign of a potential trend reversal when price breaks the major pullback swing point.</p>

      <h3>3. Valid vs Invalid Swings</h3>
      <p>A swing high or low is only valid if it takes out the preceding inducement (IDM). Never mark a BOS without confirming IDM grab first.</p>
    `
  },
  'liquidity-sweeps-ict-smc-guide': {
    title: 'Liquidity Sweeps & Order Blocks: ICT + SMC Complete Guide',
    thumbnail: 'https://img.youtube.com/vi/9MjP-4EumQQ/hqdefault.jpg',
    author: 'Dhan Vijeta',
    publishedDate: '2026-07-20T10:30:00.000Z',
    tags: ['Liquidity', 'ICT & SMC'],
    content: `
      <h2>Understanding Institutional Liquidity</h2>
      <p>Smart money institutions require massive volume to execute their multi-million dollar positions. They create artificial resistance and support levels to accumulate retail stop-losses.</p>
      
      <h3>1. Buy-Side & Sell-Side Liquidity</h3>
      <p><b>BSL (Buy-Side Liquidity):</b> Resting buy-stop orders sitting above equal highs or swing highs.</p>
      <p><b>SSL (Sell-Side Liquidity):</b> Resting sell-stop orders placed under equal lows or key support levels.</p>

      <h3>2. Order Block Selection</h3>
      <p>An Order Block (OB) is the last opposite-colored candle before an aggressive expansion move that creates Imbalance (Fair Value Gap / FVG) and sweeps liquidity.</p>
    `
  },
  'funded-room-prop-firm-evaluation-guide': {
    title: 'Prop Firm Evaluation Guide: Passing 1-Step & 2-Step Challenges',
    thumbnail: 'https://img.youtube.com/vi/RevtKQMMeAk/hqdefault.jpg',
    author: 'Dhan Vijeta',
    publishedDate: '2026-07-05T14:15:00.000Z',
    tags: ['Prop Firm', 'Risk Management'],
    content: `
      <h2>Passing Prop Firm Accounts with Strict Risk Rules</h2>
      <p>Prop firms like The Funded Room give traders access to virtual capital up to $200,000. However, 95% of traders fail evaluations due to over-leveraging and emotional trade management.</p>
      
      <h3>1. The 1% Risk Rule</h3>
      <p>Never risk more than 0.5% to 1% of the total account balance per trade. If your daily loss limit is 5%, losing 10 trades back-to-back at 0.5% will still keep your account safe.</p>

      <h3>2. High Probability Setup Selection</h3>
      <p>Only enter when higher timeframe bias (SMC structure), Order Block, and Liquidity Sweep align seamlessly.</p>
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
