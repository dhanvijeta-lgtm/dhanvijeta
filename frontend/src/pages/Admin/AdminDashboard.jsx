import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import client from '../../api/client';
import { FaWallet, FaUsers, FaBook, FaTags, FaBullhorn, FaPlus, FaTrash, FaCheck, FaVideo, FaEye, FaEyeSlash, FaFilePdf, FaTasks } from 'react-icons/fa';
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
  const [newLessonVideoUrl, setNewLessonVideoUrl] = useState('');
  const [newLessonVideo, setNewLessonVideo] = useState('');
  const [newLessonPdfUrl, setNewLessonPdfUrl] = useState('');
  const [newLessonAssignment, setNewLessonAssignment] = useState('');
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
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course created and published successfully!');
      setNewCourseTitle('');
      setNewCoursePrice('');
      setNewCourseDesc('');
    }
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, isPublished }) => {
      await client.put(`/courses/${id}`, { isPublished });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course visibility status updated!');
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
      queryClient.invalidateQueries({ queryKey: ['courses'] });
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
      toast.success('Lesson with video attached successfully!');
      setNewLessonTitle('');
      setNewLessonDesc('');
      setNewLessonVideoUrl('');
      setNewLessonVideo('');
      setNewLessonPdfUrl('');
      setNewLessonAssignment('');
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
      instructor: 'Dhan Vijeta Team',
      isPublished: true
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
        videoUrl: newLessonVideoUrl || newLessonVideo,
        videoPublicId: newLessonVideo,
        videoDuration: Number(newLessonDuration),
        pdfUrl: newLessonPdfUrl,
        assignment: newLessonAssignment
      }
    });
  };

  const activeCourseObj = courses?.find(c => c._id === selectedCourseForLesson);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      {/* SIDEBAR NAVIGATION */}
      <div className="lg:col-span-1 space-y-2">
        <div className="glass-card rounded-2xl p-4 border border-white/5 space-y-1">
          <button
            onClick={() => setActivePanel('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-xs transition ${activePanel === 'overview' ? 'bg-finance-gold text-finance-dark font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <FaWallet /> Business Intelligence
          </button>
          <button
            onClick={() => setActivePanel('courses')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-xs transition ${activePanel === 'courses' ? 'bg-finance-gold text-finance-dark font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <FaBook /> Courses & Syllabus Builder
          </button>
          <button
            onClick={() => setActivePanel('coupons')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-xs transition ${activePanel === 'coupons' ? 'bg-finance-gold text-finance-dark font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <FaTags /> Coupon Management
          </button>
          <button
            onClick={() => setActivePanel('announcements')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-xs transition ${activePanel === 'announcements' ? 'bg-finance-gold text-finance-dark font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <FaBullhorn /> Broadcaster & Alerts
          </button>
          <button
            onClick={() => setActivePanel('students')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-xs transition ${activePanel === 'students' ? 'bg-finance-gold text-finance-dark font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <FaUsers /> Student Directory
          </button>
        </div>
      </div>

      {/* MAIN ADMIN WORKSPACE */}
      <div className="lg:col-span-3 space-y-6">

        {/* OVERVIEW PANEL */}
        {activePanel === 'overview' && (
          <div className="space-y-6">
            
            {/* KPI STAT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-2">
                <span className="text-gray-400 text-xs font-semibold uppercase">Total Revenue</span>
                <h3 className="text-2xl font-black text-amber-400 font-mono">
                  ₹{analytics?.totalRevenue ? analytics.totalRevenue.toLocaleString('en-IN') : '0'}
                </h3>
              </div>
              <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-2">
                <span className="text-gray-400 text-xs font-semibold uppercase">Total Purchases</span>
                <h3 className="text-2xl font-black text-white font-mono">
                  {analytics?.totalPurchases || 0}
                </h3>
              </div>
              <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-2">
                <span className="text-gray-400 text-xs font-semibold uppercase">Registered Students</span>
                <h3 className="text-2xl font-black text-emerald-400 font-mono">
                  {analytics?.totalStudents || 0}
                </h3>
              </div>
            </div>

            {/* RECENT SALES TRANSACTIONS */}
            <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
              <h3 className="text-base font-bold text-white">Recent Sales Log</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/5 text-gray-500 pb-2">
                      <th className="pb-2">Student</th>
                      <th className="pb-2">Course</th>
                      <th className="pb-2">Amount</th>
                      <th className="pb-2">Payment ID</th>
                      <th className="pb-2">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-gray-300">
                    {analytics?.recentPurchases?.map(p => (
                      <tr key={p._id}>
                        <td className="py-3 font-semibold text-white">{p.userId?.name || 'Student'}</td>
                        <td className="py-3">{p.courseId?.title || 'Batch Access'}</td>
                        <td className="py-3 font-mono font-bold text-amber-400">₹{p.amountPaid?.toLocaleString('en-IN')}</td>
                        <td className="py-3 font-mono text-gray-400">{p.razorpayPaymentId || p._id}</td>
                        <td className="py-3 text-gray-400">{new Date(p.purchaseDate).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* MANAGE COURSES & SYLLABUS PANEL */}
        {activePanel === 'courses' && (
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
              
              {/* Create Course Form */}
              <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
                <h3 className="text-base font-bold text-white mb-2">Create New Course</h3>
                <form onSubmit={handleCreateCourse} className="space-y-4 text-xs font-semibold text-gray-400">
                  <div>
                    <label className="block mb-1">Course Title</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g. Options Trading Masterclass"
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
                        placeholder="2999"
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
                        className="w-full bg-[#0B132B] border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                      >
                        {['Beginner', 'Swing Trading', 'Intraday', 'Options Trading', 'Futures', 'Mutual Funds', 'Technical Analysis', 'Price Action', 'Psychology', 'Portfolio Building'].map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1">Course Overview Description</label>
                    <textarea
                      rows="3"
                      required
                      placeholder="Comprehensive roadmap for learning price action strategies..."
                      value={newCourseDesc}
                      onChange={(e) => setNewCourseDesc(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-finance-gold resize-none"
                    ></textarea>
                  </div>
                  <button type="submit" className="w-full bg-finance-gold text-finance-dark py-2.5 rounded-xl font-bold">
                    Create & Publish Course
                  </button>
                </form>
              </div>

              {/* Syllabus Builder */}
              <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-6">
                <h3 className="text-base font-bold text-white mb-2">Build Syllabus & Video Content</h3>
                
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

                {/* Add Lesson with Video Link */}
                {selectedCourseForLesson && activeCourseObj?.sections?.length > 0 && (
                  <form onSubmit={handleAddLesson} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-3 text-xs font-semibold text-gray-400">
                    <h4 className="font-bold text-white flex items-center gap-2">
                      <FaVideo className="text-finance-gold" /> Add Lesson & Video Link
                    </h4>
                    
                    <div className="space-y-1">
                      <label>Select Module Section</label>
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
                        placeholder="E.g. Understanding Support and Resistance"
                        value={newLessonTitle}
                        onChange={(e) => setNewLessonTitle(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                      />
                    </div>

                    {/* DEDICATED VIDEO LINK SECTION */}
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-2">
                      <label className="text-amber-300 font-bold flex items-center gap-1.5">
                        <FaVideo /> Video URL / Link (YouTube, Vimeo, MP4, Drive)
                      </label>
                      <input
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/... or MP4 Link"
                        value={newLessonVideoUrl}
                        onChange={(e) => setNewLessonVideoUrl(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-500 outline-none focus:border-amber-400 text-xs font-mono"
                      />
                      <p className="text-[10px] text-gray-400">Supports YouTube links, Vimeo links, Google Drive video links, or direct MP4 video URLs.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="flex items-center gap-1"><FaFilePdf /> PDF Notes URL (Optional)</label>
                        <input
                          type="url"
                          placeholder="https://.../notes.pdf"
                          value={newLessonPdfUrl}
                          onChange={(e) => setNewLessonPdfUrl(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none text-xs"
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

                    <div>
                      <label className="flex items-center gap-1"><FaTasks /> Assignment Details (Optional)</label>
                      <textarea
                        rows="2"
                        placeholder="Practice identifying support levels on Nifty 50 chart..."
                        value={newLessonAssignment}
                        onChange={(e) => setNewLessonAssignment(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none resize-none"
                      ></textarea>
                    </div>

                    <button type="submit" className="w-full bg-finance-gold text-finance-dark py-2.5 rounded-xl font-bold flex items-center justify-center gap-2">
                      <FaPlus /> Attach Lesson to Syllabus
                    </button>
                  </form>
                )}
              </div>

            </div>

            {/* Courses Catalog Directory */}
            <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
              <h3 className="text-base font-bold text-white mb-2">Active Courses Directory</h3>
              <div className="divide-y divide-white/5">
                {courses?.map(c => (
                  <div key={c._id} className="py-4 flex justify-between items-center text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-base">{c.title}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${c.isPublished !== false ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                          {c.isPublished !== false ? 'Published' : 'Draft / Unpublished'}
                        </span>
                      </div>
                      <p className="text-gray-400 font-mono">
                        Price: ₹{c.price.toLocaleString('en-IN')} | Category: {c.category} | Sections: {c.sections?.length || 0}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => togglePublishMutation.mutate({ id: c._id, isPublished: c.isPublished === false })}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold border transition ${c.isPublished !== false ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20'}`}
                      >
                        {c.isPublished !== false ? <><FaEyeSlash /> Unpublish</> : <><FaEye /> Publish</>}
                      </button>

                      <button 
                        onClick={() => deleteCourseMutation.mutate(c._id)}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 p-2 rounded-xl"
                        title="Delete Course"
                      >
                        <FaTrash />
                      </button>
                    </div>
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
                <FaBullhorn /> Broadcast Announcement
              </button>
            </form>
          </div>
        )}

        {/* STUDENT DIRECTORY PANEL */}
        {activePanel === 'students' && (
          <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
            <h3 className="text-base font-bold text-white mb-2">Student Enrolments & Directory</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-gray-500 pb-2">
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Email</th>
                    <th className="pb-2">Role</th>
                    <th className="pb-2">Provider</th>
                    <th className="pb-2">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {students?.map(s => (
                    <tr key={s._id}>
                      <td className="py-3 font-bold text-white">{s.name}</td>
                      <td className="py-3 font-mono">{s.email}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${s.role === 'admin' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
                          {s.role}
                        </span>
                      </td>
                      <td className="py-3 capitalize">{s.provider || 'email'}</td>
                      <td className="py-3 text-gray-400">{new Date(s.createdAt).toLocaleDateString('en-IN')}</td>
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
