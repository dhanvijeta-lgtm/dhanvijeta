import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import client from '../api/client';
import CourseCard from '../components/CourseCard/CourseCard';
import { FaSearch, FaFilter } from 'react-icons/fa';

const categories = [
  'All',
  'Beginner',
  'Swing Trading',
  'Intraday',
  'Options Trading',
  'Futures',
  'Mutual Funds',
  'Technical Analysis',
  'Price Action',
  'Psychology',
  'Portfolio Building'
];

export function Courses() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // Fetch courses with filtering keys using TanStack Query
  const { data: courses, isLoading, error } = useQuery({
    queryKey: ['courses', selectedCategory, searchQuery],
    queryFn: async () => {
      const categoryQuery = selectedCategory !== 'All' ? `&category=${encodeURIComponent(selectedCategory)}` : '';
      const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '';
      const res = await client.get(`/courses?publishedOnly=true${categoryQuery}${searchParam}`);
      return res.data.data;
    }
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  return (
    <div className="space-y-10">
      
      {/* HEADER TITLE */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
          Explore Our <span className="gradient-gold">Academy</span>
        </h1>
        <p className="text-sm text-gray-400">
          Structured learning paths created to take you from basic financial concepts to executing complex systematic trading strategies.
        </p>
      </div>

      {/* FILTER & SEARCH ROW */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-finance-navy/40 border border-white/5 p-4 rounded-2xl max-w-6xl mx-auto">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full lg:max-w-md">
          <FaSearch className="absolute left-4 top-3.5 text-gray-500" />
          <input
            type="text"
            placeholder="Search for Price Action, Options..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-white/5 border border-white/10 focus:border-finance-gold rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder-gray-500 outline-none transition"
          />
          <button type="submit" className="absolute right-2 top-1.5 bg-finance-gold hover:bg-yellow-400 text-finance-dark text-xs font-bold px-3 py-1.5 rounded-lg transition">
            Search
          </button>
        </form>

        {/* Categories indicator info */}
        <div className="flex items-center gap-2 text-xs text-gray-400 select-none">
          <FaFilter className="text-finance-gold" />
          <span>Active filter: <b className="text-white">{selectedCategory}</b></span>
        </div>
      </div>

      {/* HORIZONTAL CATEGORY SELECTOR MARQUEE */}
      <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-thin max-w-6xl mx-auto px-1 select-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 text-xs font-bold rounded-xl border transition-all duration-200 ${
              selectedCategory === cat
                ? 'bg-finance-gold border-finance-gold text-finance-dark shadow-gold-glow'
                : 'bg-finance-navy/40 border-white/5 hover:border-white/20 text-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* COURSE CARDS GRID / SKELETON */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass-card rounded-2xl overflow-hidden border border-white/5 h-[400px] animate-pulse flex flex-col justify-between p-5">
              <div className="w-full h-44 bg-white/5 rounded-xl"></div>
              <div className="space-y-3 mt-4 flex-1">
                <div className="w-1/3 h-3 bg-white/5 rounded"></div>
                <div className="w-full h-5 bg-white/5 rounded"></div>
                <div className="w-2/3 h-3 bg-white/5 rounded"></div>
              </div>
              <div className="w-full h-10 bg-white/5 rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-10 max-w-md mx-auto">
          <span className="text-finance-rose text-base font-bold">Failed to load courses. Please check connection.</span>
        </div>
      ) : courses?.length === 0 ? (
        <div className="text-center py-20 bg-finance-navy/20 border border-white/5 rounded-2xl max-w-xl mx-auto p-8">
          <h3 className="text-xl font-bold text-gray-400 mb-2">No Courses Found</h3>
          <p className="text-sm text-gray-500">We couldn't find any courses matching your search tags. Try switching filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}

    </div>
  );
}

export default Courses;
