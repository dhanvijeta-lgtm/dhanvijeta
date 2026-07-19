import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import client from '../../api/client';
import { FaGraduationCap, FaAward, FaPlay } from 'react-icons/fa';

export function CourseDashboard() {
  const navigate = useNavigate();

  // Fetch enrolled courses
  const { data: purchases, isLoading, error } = useQuery({
    queryKey: ['my-batch-purchases'],
    queryFn: async () => {
      const res = await client.get('/my-batch');
      return res.data.data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-finance-gold border-finance-navy rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !purchases || purchases.length === 0) {
    return (
      <div className="text-center py-20 max-w-lg mx-auto bg-finance-navy/20 border border-white/5 rounded-3xl p-8 space-y-6">
        <FaGraduationCap size={48} className="text-gray-600 mx-auto" />
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">No Active Batches</h2>
          <p className="text-xs text-gray-500 max-w-xs mx-auto">You have not purchased any premium courses yet. Complete a checkout order to unlock your first batch.</p>
        </div>
        <button 
          onClick={() => navigate('/courses')} 
          className="bg-finance-gold hover:bg-yellow-400 text-finance-dark font-bold text-sm px-6 py-3 rounded-xl shadow-gold-glow transition"
        >
          Explore Courses
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="space-y-2">
        <span className="text-[10px] text-finance-gold uppercase font-bold tracking-widest block">
          Protected Workspace
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
          My <span className="gradient-gold">Batch</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 max-w-md">
          Access your premium learning material, downloadable note resources, and assignments.
        </p>
      </div>

      {/* Grid of purchased items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {purchases.map((purchase) => {
          const course = purchase.courseId;
          if (!course) return null;
          return (
            <div 
              key={purchase._id}
              onClick={() => navigate(`/my-batch/${course._id}`)}
              className="glass-card rounded-2xl p-6 border border-white/5 hover:border-finance-gold/20 flex flex-col justify-between space-y-6 cursor-pointer group hover:scale-[1.01] transition-all duration-300"
            >
              <div className="flex gap-4">
                <div className="w-24 aspect-video rounded-xl bg-finance-navy overflow-hidden shrink-0">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-[10px] text-gray-500 font-bold uppercase">{course.category}</div>
                  )}
                </div>
                
                <div className="space-y-1 flex-1">
                  <span className="text-[9px] uppercase font-bold text-finance-gold bg-finance-gold/10 border border-finance-gold/20 px-2 py-0.5 rounded">
                    {course.category}
                  </span>
                  <h3 className="font-extrabold text-base text-white group-hover:text-finance-gold transition leading-snug line-clamp-1 mt-1">
                    {course.title}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>
              </div>

              {/* Progress Slider */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold">
                  <span>Syllabus Completed</span>
                  <span className="text-finance-gold">{purchase.completionPercentage}%</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${purchase.completionPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Action row */}
              <div className="flex justify-between items-center border-t border-white/5 pt-4">
                <span className="text-[10px] text-gray-500">Duration: {course.duration}</span>
                <button className="flex items-center gap-1.5 bg-finance-gold/10 group-hover:bg-finance-gold text-finance-gold group-hover:text-finance-dark font-black text-xs px-4 py-2.5 rounded-xl transition-all duration-300">
                  <FaPlay size={10} />
                  <span>Resume Learning</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}

export default CourseDashboard;
