import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import client from '../../api/client';
import { FaRegClock, FaUser, FaRegCalendarAlt } from 'react-icons/fa';

// Fallback blogs if database is empty
const fallbackBlogs = [
  {
    _id: 'b1',
    title: 'Understanding Price Action: The Key to Professional Trading',
    slug: 'understanding-price-action',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=60',
    author: 'Dhan Vijeta Team',
    tags: ['Price Action', 'Technical Analysis'],
    publishedDate: '2026-07-15T08:00:00.000Z',
    seoMeta: { description: 'Master price structures and support/resistance rules.' }
  },
  {
    _id: 'b2',
    title: 'How to Control Your Emotions in Trading | Psychology Hacks',
    slug: 'how-to-control-emotions-trading',
    thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=500&auto=format&fit=crop&q=60',
    author: 'Dhan Vijeta Team',
    tags: ['Psychology', 'Risk Management'],
    publishedDate: '2026-07-10T10:30:00.000Z',
    seoMeta: { description: 'Trading discipline is more important than indicators. Learn rules.' }
  },
  {
    _id: 'b3',
    title: 'Swing Trading vs. Day Trading: Which System Suits You?',
    slug: 'swing-trading-vs-day-trading',
    thumbnail: 'https://images.unsplash.com/photo-1621262740976-903c7e73385d?w=500&auto=format&fit=crop&q=60',
    author: 'Dhan Vijeta Team',
    tags: ['Trading Rules', 'Swing Trading'],
    publishedDate: '2026-07-01T14:15:00.000Z',
    seoMeta: { description: 'Compare trading styles, capital requirements, and timelines.' }
  }
];

export function BlogList() {
  const { data: blogs, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      try {
        const res = await client.get('/blogs');
        return res.data.data;
      } catch (e) {
        return [];
      }
    }
  });

  const activeBlogs = (blogs && blogs.length > 0) ? blogs : fallbackBlogs;

  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  return (
    <div className="space-y-12">
      
      {/* HEADER */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
          Market Insights & <span className="gradient-gold">Blogs</span>
        </h1>
        <p className="text-sm text-gray-400">
          Stay updated with high-value technical articles, psychological guides, and trade setups written by our market specialists.
        </p>
      </div>

      {/* BLOG GRID */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card rounded-2xl border border-white/5 h-[360px] animate-pulse flex flex-col justify-between p-5">
              <div className="w-full h-40 bg-white/5 rounded-xl"></div>
              <div className="space-y-3 flex-1 mt-4">
                <div className="w-1/4 h-3 bg-white/5 rounded"></div>
                <div className="w-full h-5 bg-white/5 rounded"></div>
                <div className="w-2/3 h-3 bg-white/5 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {activeBlogs.map((blog) => (
            <Link
              key={blog._id}
              to={`/blog/${blog.slug}`}
              className="group glass-card rounded-2xl overflow-hidden border border-white/5 hover:border-finance-gold/20 flex flex-col h-full hover:scale-[1.01] transition-all duration-300"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-finance-navy overflow-hidden">
                {blog.thumbnail ? (
                  <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-finance-navy to-finance-slate flex items-center justify-center text-gray-500 font-bold text-sm">
                    {blog.tags[0] || 'Market Insight'}
                  </div>
                )}
                {blog.tags?.[0] && (
                  <span className="absolute top-3 left-3 bg-finance-dark/80 backdrop-blur text-[10px] font-bold text-finance-gold px-2.5 py-1 rounded-lg">
                    {blog.tags[0]}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-[10px] text-gray-500 mb-2 font-medium">
                    <span className="flex items-center gap-1">
                      <FaRegCalendarAlt />
                      <span>{formatDate(blog.publishedDate)}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <FaUser />
                      <span>{blog.author}</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-white leading-snug group-hover:text-finance-gold transition-colors line-clamp-2 mb-2">
                    {blog.title}
                  </h3>

                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {blog.seoMeta?.description}
                  </p>
                </div>

                <span className="text-xs font-bold text-finance-gold group-hover:underline mt-4 block">
                  Read Article →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
}

export default BlogList;
