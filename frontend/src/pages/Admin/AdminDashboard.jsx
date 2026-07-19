import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import client from '../../api/client';
import { FaWallet, FaUsers, FaBook, FaTags, FaBullhorn, FaPlus, FaTrash, FaCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';

export function AdminDashboard() {
  const queryClient = useQueryClient();
  const [activePanel, setActivePanel] = useState('overview'); // overview | courses | coupons | announcements | students

  // Courses Creation State
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCoursePrice, setNewCoursePrice] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('Beginner');
  const [newCourseDesc, setNewCourseDesc] = useState('');

  // Coupon Creation State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState('Percentage');
  const [newCouponValue, setNewCouponValue] = useState('');
  const [newCouponExpiry, setNewCouponExpiry] = useState('');

  // Announcement State
  const [announceCourseId, setAnnounceCourseId] = useState('');
  const [announceTitle, setAnnounceTitle] = useState('');
  const [announceContent, setAnnounceContent] = useState('');

  // Lesson Creation State
  const [selectedCourseForLesson, setSelectedCourseForLesson] = useState('');
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [selectedSectionForLesson, setSelectedSectionForLesson] = useState('');
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonDesc, setNewLessonDesc] = useState('');
  const [newLessonVideo, setNewLessonVideo] = useState('');
  const [newLessonDuration, setNewLessonDuration] = useState('600');

  // Fetch admin dashboard analytics
  const { data: analytics, isLoading: loadingAnalytics } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const res = await client.get('/admin/analytics');
      return res.data.data;
    }
  });

  // Fetch courses list
  const { data: courses } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: async () => {
      const res = await client.get('/courses?publishedOnly=false');
      return res.data.data;
    }
  });

  // Fetch coupons list
  const { data: coupons } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: async () => {
      const res = await client.get('/coupons');
      return res.data.data;
    }
  });

  // Fetch students list
  const { data: students } = useQuery({
    queryKey: ['admin-students'],
    queryFn: async () => {
      const res = await client.get('/admin/students');
      return res.data.data;
    }
  });

  // Mutations
  const createCourseMutation = useMutation({
    mutationFn: async (payload) => {
      await client.post('/courses', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      toast.success('Course created successfully');
      setNewCourseTitle('');
      setNewCoursePrice('');
      setNewCourseDesc('');
    }
  });

  const createCouponMutation = useMutation({
    mutationFn: async (payload) => {
      await client.post('/coupons', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
      toast.success('Coupon created successfully');
      setNewCouponCode('');
      setNewCouponValue('');
      setNewCouponExpiry('');
    }
  });

  const createAnnouncementMutation = useMutation({
    mutationFn: async (payload) => {
      await client.post('/admin/announcements', payload);
    },
    onSuccess: () => {
      toast.success('Announcement broadcasted and notifications pushed!');
      setAnnounceTitle('');
      setAnnounceContent('');
    }
  });

  const deleteCourseMutation = useMutation({
    mutationFn: async (id) => {
      await client.delete(`/courses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      toast.success('Course deleted');
    }
  });

  const deleteCouponMutation = useMutation({
    mutationFn: async (id) => {
      await client.delete(`/coupons/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
      toast.success('Coupon deleted');
    }
  });

  const addSectionMutation = useMutation({
    mutationFn: async ({ id, title }) => {
      await client.post(`/courses/${id}/sections`, { title });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      toast.success('Section added to syllabus!');
      setNewSectionTitle('');
    }
  });

  const addLessonMutation = useMutation({
    mutationFn: async ({ id, sectionId, payload }) => {
      await client.post(`/courses/${id}/sections/${sectionId}/lessons`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      toast.success('Lesson attached successfully!');
      setNewLessonTitle('');
      setNewLessonDesc('');
      setNewLessonVideo('');
    }
  });

  const handleCreateCourse = (e) => {
    e.preventDefault();
    if (!newCourseTitle || !newCoursePrice) return;
    createCourseMutation.mutate({
      title: newCourseTitle,
      price: Number(newCoursePrice),
      category: newCourseCategory,
      description: newCourseDesc,
      instructor: 'Dhan Vijeta'
    });
  };

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!newCouponCode || !newCouponValue || !newCouponExpiry) return;
    createCouponMutation.mutate({
      couponCode: newCouponCode.toUpperCase(),
      discountType: newCouponType,
      discountValue: Number(newCouponValue),
      expiryDate: new Date(newCouponExpiry),
      maximumUses: 100,
      activeStatus: true
    });
  };

  const handleCreateAnnouncement = (e) => {
    e.preventDefault();
    if (!announceCourseId || !announceTitle || !announceContent) return;
    createAnnouncementMutation.mutate({
      courseId: announceCourseId,
      title: announceTitle,
      content: announceContent
    });
  };

  const handleAddSection = (e) => {
    e.preventDefault();
    if (!selectedCourseForLesson || !newSectionTitle) return;
    addSectionMutation.mutate({
      id: selectedCourseForLesson,
      title: newSectionTitle
    });
  };

  const handleAddLesson = (e) => {
    e.preventDefault();
    if (!selectedCourseForLesson || !selectedSectionForLesson || !newLessonTitle) return;
    addLessonMutation.mutate({
      id: selectedCourseForLesson,
      sectionId: selectedSectionForLesson,
      payload: {
        title: newLessonTitle,
        description: newLessonDesc,
        videoPublicId: newLessonVideo,
        videoDuration: Number(newLessonDuration),
        pdfUrl: '',
        assignment: ''
      }
    });
  };

  const activeCourseObj = courses?.find(c => c._id === selectedCourseForLesson);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      {/* SIDEBAR TABS PANEL */}
      <div className="lg:col-span-1 glass-card rounded-2xl p-6 border border-white/5 space-y-4 self-start">
        <h2 className="text-lg font-bold text-finance-gold tracking-wider uppercase mb-2">Admin Console</h2>
        <div className="flex flex-col gap-2 text-xs font-bold select-none">
          {[
            { id: 'overview', label: 'Overview Metrics', icon: <FaWallet /> },
            { id: 'courses', label: 'Manage Syllabus', icon: <FaBook /> },
            { id: 'coupons', label: 'Manage Coupons', icon: <FaTags /> },
            { id: 'announcements', label: 'Broadcaster Board', icon: <FaBullhorn /> },
            { id: 'students', label: 'Students List', icon: <FaUsers /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActivePanel(tab.id)}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl transition ${
                activePanel === tab.id
                  ? 'bg-finance-gold text-finance-dark shadow-gold-glow'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT MAIN CONSOLE DISPLAY */}
      <div className="lg:col-span-3 space-y-8">
        
        {/* OVERVIEW PANEL */}
        {activePanel === 'overview' && (
          <div className="space-y-8">
            {loadingAnalytics ? (
              <div className="h-40 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-t-finance-gold border-finance-navy rounded-full animate-spin"></div>
              </div>
            ) : !analytics ? (
              <p className="text-gray-500 text-xs">Error generating analytics.</p>
            ) : (
              <div className="space-y-8">
                {/* Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="glass-card rounded-2xl p-6 border border-white/5 text-center">
                    <span className="block text-2xl font-black text-white">₹{analytics.metrics.totalRevenue.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest block mt-1">Total Revenue</span>
                  </div>
                  <div className="glass-card rounded-2xl p-6 border border-white/5 text-center">
                    <span className="block text-2xl font-black text-finance-emerald">₹{analytics.metrics.monthlyRevenue.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest block mt-1">Monthly Revenue</span>
                  </div>
                  <div className="glass-card rounded-2xl p-6 border border-white/5 text-center">
                    <span className="block text-2xl font-black text-finance-gold">{analytics.metrics.totalStudents}</span>
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest block mt-1">Active Students</span>
                  </div>
                </div>

                {/* SVG Custom Sales Trend Chart */}
                <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Revenue Trend Curve</h3>
                  
                  {/* Decorative chart vector */}
                  <div className="w-full h-40 bg-finance-navy/40 rounded-xl relative overflow-hidden flex items-end">
                    <svg viewBox="0 0 100 30" className="w-full h-32 text-finance-gold" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#ffd700" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#ffd700" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M 0 25 Q 15 10 30 18 T 60 5 T 90 12 T 100 8 L 100 30 L 0 30 Z" fill="url(#grad)" />
                      <path d="M 0 25 Q 15 10 30 18 T 60 5 T 90 12 T 100 8" fill="none" stroke="#ffd700" strokeWidth="0.8" />
                    </svg>
                    <span className="absolute bottom-2 left-4 text-[9px] text-gray-500 uppercase font-mono">Simulated Sales Momentum</span>
                  </div>
                </div>

                {/* Recent Purchases List */}
                <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Transactions</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-white/5 text-gray-500 pb-2">
                          <th className="pb-2">User</th>
                          <th className="pb-2">Course</th>
                          <th className="pb-2">Price</th>
                          <th className="pb-2 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {analytics.recentPayments?.map((pay) => (
                          <tr key={pay._id} className="text-gray-300">
                            <td className="py-2.5">{pay.userId?.name || 'Student'}</td>
                            <td className="py-2.5">{pay.courseId?.title || 'Course'}</td>
                            <td className="py-2.5">₹{pay.amount.toLocaleString('en-IN')}</td>
                            <td className="py-2.5 text-right font-semibold text-finance-emerald">{pay.status.toUpperCase()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MANAGE COURSES PANEL */}
        {activePanel === 'courses' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            
            {/* Create course */}
            <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
              <h3 className="text-base font-bold text-white mb-2">Create New Course</h3>
              <form onSubmit={handleCreateCourse} className="space-y-4 text-xs font-semibold text-gray-400">
                <div>
                  <label className="block mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={newCourseTitle}
                    onChange={(e) => setNewCourseTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-finance-gold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1">Price (INR)</label>
                    <input
                      type="number"
                      required
                      value={newCoursePrice}
                      onChange={(e) => setNewCoursePrice(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-finance-gold"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Category</label>
                    <select
                      value={newCourseCategory}
                      onChange={(e) => setNewCourseCategory(e.target.value)}
                      className="w-full bg-[#0B132B] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-finance-gold"
                    >
                      {['Beginner', 'Swing Trading', 'Intraday', 'Options Trading', 'Futures', 'Mutual Funds', 'Technical Analysis', 'Price Action', 'Psychology', 'Portfolio Building'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block mb-1">Description</label>
                  <textarea
                    rows="3"
                    value={newCourseDesc}
                    onChange={(e) => setNewCourseDesc(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-finance-gold resize-none"
                  ></textarea>
                </div>
                <button type="submit" className="w-full bg-finance-gold text-finance-dark py-2.5 rounded-xl font-bold">
                  Create Course
                </button>
              </form>
            </div>

            {/* Syllabus Builder */}
            <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-6">
              <h3 className="text-base font-bold text-white mb-2">Build Syllabus Contents</h3>
              
              {/* Select course */}
              <div className="text-xs font-semibold text-gray-400 space-y-1">
                <label>Select Target Course</label>
                <select
                  value={selectedCourseForLesson}
                  onChange={(e) => {
                    setSelectedCourseForLesson(e.target.value);
                    setSelectedSectionForLesson('');
                  }}
                  className="w-full bg-[#0B132B] border border-white/10 rounded-xl px-3 py-2.5 text-white outline-none"
                >
                  <option value="">-- Choose Course --</option>
                  {courses?.map(c => (
                    <option key={c._id} value={c._id}>{c.title}</option>
                  ))}
                </select>
              </div>

              {/* Add Section */}
              {selectedCourseForLesson && (
                <form onSubmit={handleAddSection} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-3 text-xs font-semibold text-gray-400">
                  <h4 className="font-bold text-white">Add Module Section</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="E.g. Module 1: Price Action Core"
                      value={newSectionTitle}
                      onChange={(e) => setNewSectionTitle(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                    />
                    <button type="submit" className="bg-finance-gold text-finance-dark px-4 py-2 rounded-xl font-bold">
                      Add
                    </button>
                  </div>
                </form>
              )}

              {/* Add Lesson */}
              {selectedCourseForLesson && activeCourseObj?.sections?.length > 0 && (
                <form onSubmit={handleAddLesson} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-3 text-xs font-semibold text-gray-400">
                  <h4 className="font-bold text-white">Add Lesson Material</h4>
                  <div className="space-y-2">
                    <label>Select Section Module</label>
                    <select
                      required
                      value={selectedSectionForLesson}
                      onChange={(e) => setSelectedSectionForLesson(e.target.value)}
                      className="w-full bg-[#0B132B] border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                    >
                      <option value="">-- Choose Section --</option>
                      {activeCourseObj.sections.map(s => (
                        <option key={s._id} value={s._id}>{s.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label>Lesson Title</label>
                    <input
                      type="text"
                      required
                      value={newLessonTitle}
                      onChange={(e) => setNewLessonTitle(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label>Video Identifier</label>
                      <input
                        type="text"
                        placeholder="E.g. sample_video"
                        value={newLessonVideo}
                        onChange={(e) => setNewLessonVideo(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label>Duration (secs)</label>
                      <input
                        type="number"
                        value={newLessonDuration}
                        onChange={(e) => setNewLessonDuration(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-finance-gold text-finance-dark py-2 rounded-xl font-bold">
                    Attach Lesson
                  </button>
                </form>
              )}
            </div>

            {/* Courses List */}
            <div className="xl:col-span-2 glass-card rounded-2xl p-6 border border-white/5 space-y-4">
              <h3 className="text-base font-bold text-white mb-2">Active Courses Catalog</h3>
              <div className="divide-y divide-white/5">
                {courses?.map(c => (
                  <div key={c._id} className="py-3 flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-bold text-white text-sm">{c.title}</h4>
                      <p className="text-gray-500 font-mono mt-0.5">Price: ₹{c.price.toLocaleString('en-IN')} | Category: {c.category}</p>
                    </div>
                    <button 
                      onClick={() => deleteCourseMutation.mutate(c._id)}
                      className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 p-2 rounded-xl"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* MANAGE COUPONS PANEL */}
        {activePanel === 'coupons' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            
            {/* Create Coupon form */}
            <div className="md:col-span-1 glass-card rounded-2xl p-6 border border-white/5 space-y-4">
              <h3 className="text-base font-bold text-white mb-2">Create Coupon</h3>
              <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs font-semibold text-gray-400">
                <div>
                  <label className="block mb-1">Coupon Code</label>
                  <input
                    type="text"
                    required
                    placeholder="PRO50"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white uppercase outline-none focus:border-finance-gold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1">Discount Type</label>
                    <select
                      value={newCouponType}
                      onChange={(e) => setNewCouponType(e.target.value)}
                      className="w-full bg-[#0B132B] border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                    >
                      <option value="Percentage">Percentage</option>
                      <option value="Flat">Flat (INR)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1">Value</label>
                    <input
                      type="number"
                      required
                      value={newCouponValue}
                      onChange={(e) => setNewCouponValue(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={newCouponExpiry}
                    onChange={(e) => setNewCouponExpiry(e.target.value)}
                    className="w-full bg-[#0B132B] border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
                <button type="submit" className="w-full bg-finance-gold text-finance-dark py-2.5 rounded-xl font-bold">
                  Create Coupon
                </button>
              </form>
            </div>

            {/* List Coupons */}
            <div className="md:col-span-2 glass-card rounded-2xl p-6 border border-white/5 space-y-4">
              <h3 className="text-base font-bold text-white mb-2">Coupons Directory</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/5 text-gray-500 pb-2">
                      <th className="pb-2">Code</th>
                      <th className="pb-2">Discount</th>
                      <th className="pb-2">Uses</th>
                      <th className="pb-2">Expiry</th>
                      <th className="pb-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-gray-300">
                    {coupons?.map(c => (
                      <tr key={c._id}>
                        <td className="py-3 font-bold text-white">{c.couponCode}</td>
                        <td className="py-3">{c.discountValue}{c.discountType === 'Percentage' ? '%' : ' INR'}</td>
                        <td className="py-3">{c.usesCount} / {c.maximumUses}</td>
                        <td className="py-3">{new Date(c.expiryDate).toLocaleDateString('en-IN')}</td>
                        <td className="py-3 text-right">
                          <button 
                            onClick={() => deleteCouponMutation.mutate(c._id)}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* BROADCASTER PANEL */}
        {activePanel === 'announcements' && (
          <div className="glass-card rounded-2xl p-8 border border-white/5 max-w-lg mx-auto space-y-4">
            <h3 className="text-base font-bold text-white mb-2">Broadcast Batch Update</h3>
            <form onSubmit={handleCreateAnnouncement} className="space-y-4 text-xs font-semibold text-gray-400">
              <div>
                <label className="block mb-1">Select Target Batch</label>
                <select
                  required
                  value={announceCourseId}
                  onChange={(e) => setAnnounceCourseId(e.target.value)}
                  className="w-full bg-[#0B132B] border border-white/10 rounded-xl px-3 py-2.5 text-white outline-none"
                >
                  <option value="">-- Choose Course Batch --</option>
                  {courses?.map(c => (
                    <option key={c._id} value={c._id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1">Announcement Title</label>
                <input
                  type="text"
                  required
                  placeholder="Live Class Scheduled"
                  value={announceTitle}
                  onChange={(e) => setAnnounceTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-finance-gold"
                />
              </div>

              <div>
                <label className="block mb-1">Content Details</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Provide schedule details, meeting links, or pdf release alerts..."
                  value={announceContent}
                  onChange={(e) => setAnnounceContent(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-finance-gold resize-none"
                ></textarea>
              </div>

              <button type="submit" className="w-full bg-finance-gold text-finance-dark py-2.5 rounded-xl font-bold flex items-center justify-center gap-2">
                <FaBullhorn />
                <span>Publish & Notify Students</span>
              </button>
            </form>
          </div>
        )}

        {/* STUDENTS LIST */}
        {activePanel === 'students' && (
          <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
            <h3 className="text-base font-bold text-white mb-2">Registered Students Registry</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-gray-500 pb-2">
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Email</th>
                    <th className="pb-2">Streak</th>
                    <th className="pb-2">Unlocked Batches</th>
                    <th className="pb-2 text-right">Verified</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {students?.map(s => (
                    <tr key={s._id}>
                      <td className="py-3 font-semibold text-white">{s.name}</td>
                      <td className="py-3">{s.email}</td>
                      <td className="py-3">🔥 {s.streakCount}</td>
                      <td className="py-3 max-w-[200px] truncate">{s.purchasedCourses?.join(', ') || 'None'}</td>
                      <td className="py-3 text-right">
                        {s.isVerified ? (
                          <span className="text-finance-emerald font-semibold uppercase text-[9px] bg-finance-emerald/10 px-2 py-0.5 rounded border border-finance-emerald/20">YES</span>
                        ) : (
                          <span className="text-gray-500 font-semibold uppercase text-[9px] bg-white/5 px-2 py-0.5 rounded border border-white/10">NO</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

export default AdminDashboard;
