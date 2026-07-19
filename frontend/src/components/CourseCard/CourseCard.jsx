import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaHeart, FaRegHeart, FaRegClock } from 'react-icons/fa';
import { useAuth } from '../../store/authContext';

export function CourseCard({ course }) {
  const { wishlist, toggleWishlist, isLoggedIn } = useAuth();
  
  const isWishlisted = wishlist.includes(course._id);

  // Calculate discount price
  const basePrice = course.price;
  const discountedPrice = course.discount > 0 
    ? Math.round(basePrice - (basePrice * (course.discount / 100)))
    : basePrice;

  return (
    <div className="relative group glass-card rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300 flex flex-col h-full border border-white/5 shadow-lg">
      
      {/* THUMBNAIL */}
      <div className="relative aspect-video w-full overflow-hidden bg-finance-navy">
        {course.thumbnail ? (
          <img 
            src={course.thumbnail} 
            alt={course.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-finance-navy to-finance-slate flex items-center justify-center text-gray-600 font-bold text-lg select-none">
            {course.category}
          </div>
        )}

        {/* Category tag */}
        <span className="absolute top-3 left-3 bg-finance-dark/70 backdrop-blur-md text-finance-gold border border-finance-gold/20 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg">
          {course.category}
        </span>

        {/* Wishlist Heart Icon */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(course._id);
          }}
          className="absolute top-3 right-3 bg-finance-dark/70 backdrop-blur-md border border-white/10 hover:border-finance-gold rounded-full p-2.5 text-gray-300 hover:text-red-500 transition-colors"
        >
          {isWishlisted ? <FaHeart className="text-red-500" size={14} /> : <FaRegHeart size={14} />}
        </button>
      </div>

      {/* METADATA CONTENT */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating Row */}
          <div className="flex items-center gap-1.5 text-xs text-finance-gold mb-2 font-semibold">
            <FaStar />
            <span>{course.rating.toFixed(1)}</span>
            <span className="text-gray-500 font-normal">(Verified reviews)</span>
          </div>

          <h3 className="text-lg font-bold text-white leading-snug group-hover:text-finance-gold transition-colors line-clamp-2 mb-2">
            {course.title}
          </h3>

          <p className="text-xs text-gray-400 mb-4 line-clamp-2">
            {course.description}
          </p>
        </div>

        <div>
          {/* Duration Row */}
          {course.duration && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
              <FaRegClock />
              <span>{course.duration}</span>
            </div>
          )}

          {/* Pricing Details */}
          <div className="flex items-baseline justify-between border-t border-white/5 pt-4 mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-white">₹{discountedPrice.toLocaleString('en-IN')}</span>
              {course.discount > 0 && (
                <span className="text-xs text-gray-500 line-through">₹{basePrice.toLocaleString('en-IN')}</span>
              )}
            </div>
            {course.discount > 0 && (
              <span className="text-[10px] font-bold text-finance-emerald bg-finance-emerald/10 border border-finance-emerald/20 px-2 py-0.5 rounded-md">
                {course.discount}% OFF
              </span>
            )}
          </div>

          {/* Action Row */}
          <Link
            to={`/courses/${course.slug}`}
            className="w-full flex items-center justify-center bg-finance-navy border border-white/10 group-hover:border-finance-gold text-white hover:text-finance-dark hover:bg-finance-gold font-bold text-sm py-2.5 rounded-xl transition-all mt-4"
          >
            Explore Course
          </Link>
        </div>
      </div>

    </div>
  );
}

export default CourseCard;
