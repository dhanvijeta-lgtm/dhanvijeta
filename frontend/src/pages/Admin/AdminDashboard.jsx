import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import client from '../../api/client';
import {
  FaWallet,
  FaUsers,
  FaBook,
  FaTags,
  FaBullhorn,
  FaPlus,
  FaTrash,
  FaCheck,
  FaVideo,
  FaEye,
  FaEyeSlash,
  FaFilePdf,
  FaTasks,
  FaCloudUploadAlt,
  FaEdit,
  FaImage,
  FaSpinner,
  FaPlayCircle,
  FaTimes,
  FaLayerGroup
} from 'react-icons/fa';
import toast from 'react-hot-toast';

export function AdminDashboard() {
  const queryClient = useQueryClient();
  const [activePanel, setActivePanel] = useState('overview'); // overview | courses | coupons | announcements | students

  // Course Creation State
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCoursePrice, setNewCoursePrice] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('Beginner');
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [newCourseThumbnail, setNewCourseThumbnail] = useState('');
  const [newCourseThumbnailPublicId, setNewCourseThumbnailPublicId] = useState('');
  const [uploadingCourseThumb, setUploadingCourseThumb] = useState(false);
  const [courseThumbProgress, setCourseThumbProgress] = useState(0);

  // Course Edit State
  const [editingCourse, setEditingCourse] = useState(null); // course object
  const [editCourseTitle, setEditCourseTitle] = useState('');
  const [editCoursePrice, setEditCoursePrice] = useState('');
  const [editCourseDiscount, setEditCourseDiscount] = useState(0);
  const [editCourseCategory, setEditCourseCategory] = useState('Beginner');
  const [editCourseInstructor, setEditCourseInstructor] = useState('Dhan Vijeta Team');
  const [editCourseDuration, setEditCourseDuration] = useState('0 hours');
  const [editCourseDesc, setEditCourseDesc] = useState('');
  const [editCourseThumbnail, setEditCourseThumbnail] = useState('');
  const [editCourseThumbnailPublicId, setEditCourseThumbnailPublicId] = useState('');
  const [uploadingEditCourseThumb, setUploadingEditCourseThumb] = useState(false);
  const [editCourseThumbProgress, setEditCourseThumbProgress] = useState(0);

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
  const [newLessonVideoPublicId, setNewLessonVideoPublicId] = useState('');
  const [newLessonVideoDuration, setNewLessonVideoDuration] = useState('600');
  const [newLessonVideoSize, setNewLessonVideoSize] = useState(0);
  const [newLessonVideoFormat, setNewLessonVideoFormat] = useState('');
  const [newLessonThumbnail, setNewLessonThumbnail] = useState('');
  const [newLessonThumbnailPublicId, setNewLessonThumbnailPublicId] = useState('');
  const [newLessonPdfUrl, setNewLessonPdfUrl] = useState('');
  const [newLessonAssignment, setNewLessonAssignment] = useState('');

  // Upload States for New Lesson
  const [uploadingLessonVideo, setUploadingLessonVideo] = useState(false);
  const [lessonVideoProgress, setLessonVideoProgress] = useState(0);
  const [uploadingLessonThumb, setUploadingLessonThumb] = useState(false);
  const [lessonThumbProgress, setLessonThumbProgress] = useState(0);

  // Lesson Edit State
  const [editingLesson, setEditingLesson] = useState(null); // { courseId, sectionId, lesson }
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editVideoUrl, setEditVideoUrl] = useState('');
  const [editVideoPublicId, setEditVideoPublicId] = useState('');
  const [editVideoDuration, setEditVideoDuration] = useState(0);
  const [editVideoSize, setEditVideoSize] = useState(0);
  const [editVideoFormat, setEditVideoFormat] = useState('');
  const [editThumbnail, setEditThumbnail] = useState('');
  const [editThumbnailPublicId, setEditThumbnailPublicId] = useState('');
  const [editPdfUrl, setEditPdfUrl] = useState('');
  const [editAssignment, setEditAssignment] = useState('');

  // Upload States for Edit Lesson
  const [uploadingEditVideo, setUploadingEditVideo] = useState(false);
  const [editVideoProgress, setEditVideoProgress] = useState(0);
  const [uploadingEditThumb, setUploadingEditThumb] = useState(false);
  const [editThumbProgress, setEditThumbProgress] = useState(0);

  // Fetch admin dashboard analytics
  const { data: analytics } = useQuery({
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

  // UPLOAD HANDLERS
  const handleUploadCourseThumbnail = async (e, isEdit = false) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    if (isEdit) {
      setUploadingEditCourseThumb(true);
      setEditCourseThumbProgress(0);
    } else {
      setUploadingCourseThumb(true);
      setCourseThumbProgress(0);
    }

    try {
      const res = await client.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) => {
          const percent = Math.round((evt.loaded * 100) / evt.total);
          if (isEdit) setEditCourseThumbProgress(percent);
          else setCourseThumbProgress(percent);
        }
      });

      if (isEdit) {
        setEditCourseThumbnail(res.data.data.url);
        setEditCourseThumbnailPublicId(res.data.data.public_id);
      } else {
        setNewCourseThumbnail(res.data.data.url);
        setNewCourseThumbnailPublicId(res.data.data.public_id);
      }
      toast.success('Course thumbnail uploaded to Cloudinary!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Course thumbnail upload failed');
    } finally {
      if (isEdit) setUploadingEditCourseThumb(false);
      else setUploadingCourseThumb(false);
    }
  };

  const handleUploadModuleThumbnail = async (e, isEdit = false) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    if (isEdit) {
      setUploadingEditThumb(true);
      setEditThumbProgress(0);
    } else {
      setUploadingLessonThumb(true);
      setLessonThumbProgress(0);
    }

    try {
      const res = await client.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) => {
          const percent = Math.round((evt.loaded * 100) / evt.total);
          if (isEdit) setEditThumbProgress(percent);
          else setLessonThumbProgress(percent);
        }
      });

      if (isEdit) {
        setEditThumbnail(res.data.data.url);
        setEditThumbnailPublicId(res.data.data.public_id);
      } else {
        setNewLessonThumbnail(res.data.data.url);
        setNewLessonThumbnailPublicId(res.data.data.public_id);
      }
      toast.success('Module thumbnail uploaded successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Module thumbnail upload failed');
    } finally {
      if (isEdit) setUploadingEditThumb(false);
      else setUploadingLessonThumb(false);
    }
  };

  const handleUploadVideoFile = async (e, isEdit = false) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('video', file);

    if (isEdit) {
      setUploadingEditVideo(true);
      setEditVideoProgress(0);
    } else {
      setUploadingLessonVideo(true);
      setLessonVideoProgress(0);
    }

    try {
      const res = await client.post('/upload/video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) => {
          const percent = Math.round((evt.loaded * 100) / evt.total);
          if (isEdit) setEditVideoProgress(percent);
          else setLessonVideoProgress(percent);
        }
      });

      const { videoUrl, videoPublicId, videoDuration, videoSize, videoFormat, thumbnail } = res.data.data;

      if (isEdit) {
        setEditVideoUrl(videoUrl);
        setEditVideoPublicId(videoPublicId);
        setEditVideoDuration(videoDuration);
        setEditVideoSize(videoSize);
        setEditVideoFormat(videoFormat);
        if (thumbnail && !editThumbnail) setEditThumbnail(thumbnail);
      } else {
        setNewLessonVideoUrl(videoUrl);
        setNewLessonVideoPublicId(videoPublicId);
        setNewLessonVideoDuration(videoDuration || 600);
        setNewLessonVideoSize(videoSize);
        setNewLessonVideoFormat(videoFormat);
        if (thumbnail && !newLessonThumbnail) setNewLessonThumbnail(thumbnail);
      }

      toast.success('Video uploaded to Cloudinary successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Video upload failed');
    } finally {
      if (isEdit) setUploadingEditVideo(false);
      else setUploadingLessonVideo(false);
    }
  };

  // MUTATIONS
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
      setNewCourseThumbnail('');
      setNewCourseThumbnailPublicId('');
    }
  });

  const updateCourseMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      await client.put(`/courses/${id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course details updated successfully!');
      setEditingCourse(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Failed to update course details');
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
      toast.success('Course and media assets deleted!');
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
      toast.success('Module lesson attached with Cloudinary video!');
      setNewLessonTitle('');
      setNewLessonDesc('');
      setNewLessonVideoUrl('');
      setNewLessonVideoPublicId('');
      setNewLessonVideoDuration('600');
      setNewLessonVideoSize(0);
      setNewLessonVideoFormat('');
      setNewLessonThumbnail('');
      setNewLessonThumbnailPublicId('');
      setNewLessonPdfUrl('');
      setNewLessonAssignment('');
    }
  });

  const updateLessonMutation = useMutation({
    mutationFn: async ({ courseId, sectionId, lessonId, payload }) => {
      await client.put(`/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      toast.success('Module lesson updated successfully!');
      setEditingLesson(null);
    }
  });

  const deleteLessonMutation = useMutation({
    mutationFn: async ({ courseId, sectionId, lessonId }) => {
      await client.delete(`/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      toast.success('Module lesson and video deleted!');
    }
  });

  // SUBMIT HANDLERS
  const handleCreateCourse = (e) => {
    e.preventDefault();
    if (!newCourseTitle || !newCoursePrice) return;
    createCourseMutation.mutate({
      title: newCourseTitle,
      price: Number(newCoursePrice),
      category: newCourseCategory,
      description: newCourseDesc,
      instructor: 'Dhan Vijeta Team',
      thumbnail: newCourseThumbnail,
      thumbnailPublicId: newCourseThumbnailPublicId,
      isPublished: true
    });
  };

  const openEditCourseModal = (course) => {
    setEditingCourse(course);
    setEditCourseTitle(course.title || '');
    setEditCoursePrice(course.price !== undefined ? course.price : '');
    setEditCourseDiscount(course.discount || 0);
    setEditCourseCategory(course.category || 'Beginner');
    setEditCourseInstructor(course.instructor || 'Dhan Vijeta Team');
    setEditCourseDuration(course.duration || '0 hours');
    setEditCourseDesc(course.description || '');
    setEditCourseThumbnail(course.thumbnail || '');
    setEditCourseThumbnailPublicId(course.thumbnailPublicId || '');
  };

  const handleSaveEditCourse = (e) => {
    e.preventDefault();
    if (!editingCourse) return;

    if (!editCourseTitle || !editCourseTitle.trim()) {
      toast.error('Course title is required');
      return;
    }

    if (editCoursePrice === '' || editCoursePrice === null || editCoursePrice === undefined || isNaN(Number(editCoursePrice))) {
      toast.error('Please enter a valid course price (0 for Free)');
      return;
    }

    updateCourseMutation.mutate({
      id: editingCourse._id,
      payload: {
        title: editCourseTitle.trim(),
        price: Number(editCoursePrice),
        discount: Number(editCourseDiscount) || 0,
        category: editCourseCategory,
        instructor: editCourseInstructor,
        duration: editCourseDuration,
        description: editCourseDesc,
        thumbnail: editCourseThumbnail,
        thumbnailPublicId: editCourseThumbnailPublicId
      }
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
        videoUrl: newLessonVideoUrl,
        videoPublicId: newLessonVideoPublicId,
        videoDuration: Number(newLessonVideoDuration),
        videoSize: newLessonVideoSize,
        videoFormat: newLessonVideoFormat,
        thumbnail: newLessonThumbnail,
        thumbnailPublicId: newLessonThumbnailPublicId,
        pdfUrl: newLessonPdfUrl,
        assignment: newLessonAssignment
      }
    });
  };

  const openEditLessonModal = (courseId, sectionId, lesson) => {
    setEditingLesson({ courseId, sectionId, lessonId: lesson._id });
    setEditTitle(lesson.title || '');
    setEditDesc(lesson.description || '');
    setEditVideoUrl(lesson.videoUrl || '');
    setEditVideoPublicId(lesson.videoPublicId || '');
    setEditVideoDuration(lesson.videoDuration || 0);
    setEditVideoSize(lesson.videoSize || 0);
    setEditVideoFormat(lesson.videoFormat || '');
    setEditThumbnail(lesson.thumbnail || '');
    setEditThumbnailPublicId(lesson.thumbnailPublicId || '');
    setEditPdfUrl(lesson.pdfUrl || '');
    setEditAssignment(lesson.assignment || '');
  };

  const handleSaveEditLesson = (e) => {
    e.preventDefault();
    if (!editingLesson) return;

    updateLessonMutation.mutate({
      courseId: editingLesson.courseId,
      sectionId: editingLesson.sectionId,
      lessonId: editingLesson.lessonId,
      payload: {
        title: editTitle,
        description: editDesc,
        videoUrl: editVideoUrl,
        videoPublicId: editVideoPublicId,
        videoDuration: Number(editVideoDuration),
        videoSize: Number(editVideoSize),
        videoFormat: editVideoFormat,
        thumbnail: editThumbnail,
        thumbnailPublicId: editThumbnailPublicId,
        pdfUrl: editPdfUrl,
        assignment: editAssignment
      }
    });
  };

  const activeCourseObj = courses?.find((c) => c._id === selectedCourseForLesson);

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
                    {analytics?.recentPurchases?.map((p) => (
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
                        {['Beginner', 'Swing Trading', 'Intraday', 'Options Trading', 'Futures', 'Mutual Funds', 'Technical Analysis', 'Price Action', 'Psychology', 'Portfolio Building'].map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* DUAL OPTION COURSE THUMBNAIL (Upload File or Enter URL) */}
                  <div className="p-3.5 bg-white/[0.02] border border-white/10 rounded-xl space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-amber-300 font-bold flex items-center gap-1.5">
                        <FaImage /> Course Thumbnail (Upload File or Enter URL)
                      </label>
                      {newCourseThumbnail && (
                        <button
                          type="button"
                          onClick={() => {
                            setNewCourseThumbnail('');
                            setNewCourseThumbnailPublicId('');
                          }}
                          className="text-red-400 hover:text-red-300 text-[11px] font-bold underline"
                        >
                          Clear Thumbnail
                        </button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleUploadCourseThumbnail(e, false)}
                        disabled={uploadingCourseThumb}
                        className="hidden"
                        id="course-thumb-file"
                      />
                      <label
                        htmlFor="course-thumb-file"
                        className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 flex items-center justify-center gap-2 text-gray-300 font-semibold transition"
                      >
                        {uploadingCourseThumb ? (
                          <FaSpinner className="animate-spin text-finance-gold" />
                        ) : (
                          <FaCloudUploadAlt className="text-finance-gold text-lg" />
                        )}
                        <span>{uploadingCourseThumb ? `Uploading Image... ${courseThumbProgress}%` : 'Upload Thumbnail File to Cloudinary'}</span>
                      </label>

                      {uploadingCourseThumb && (
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-finance-gold h-full transition-all duration-300" style={{ width: `${courseThumbProgress}%` }}></div>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-400 font-semibold shrink-0">OR PASTE URL:</span>
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/... or paste image URL"
                          value={newCourseThumbnail}
                          onChange={(e) => setNewCourseThumbnail(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-white outline-none text-xs font-mono"
                        />
                      </div>
                    </div>

                    {newCourseThumbnail && (
                      <div className="relative rounded-xl overflow-hidden border border-white/10 mt-2">
                        <img src={newCourseThumbnail} alt="Course Thumbnail Preview" className="w-full h-32 object-cover" />
                      </div>
                    )}
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

                  <button
                    type="submit"
                    disabled={uploadingCourseThumb}
                    className="w-full bg-finance-gold text-finance-dark py-2.5 rounded-xl font-bold disabled:opacity-50"
                  >
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
                    {courses?.map((c) => (
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

                {/* Add Lesson with Video & Thumbnail Upload */}
                {selectedCourseForLesson && activeCourseObj?.sections?.length > 0 && (
                  <form onSubmit={handleAddLesson} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-3 text-xs font-semibold text-gray-400">
                    <h4 className="font-bold text-white flex items-center gap-2">
                      <FaVideo className="text-finance-gold" /> Add Module Lesson
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
                        {activeCourseObj.sections.map((s) => (
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

                    {/* DIRECT CLOUDINARY VIDEO UPLOAD & PREVIEW */}
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-3">
                      <label className="text-amber-300 font-bold flex items-center gap-1.5">
                        <FaVideo /> Video File Upload (MP4, MOV, AVI, MKV, WEBM)
                      </label>
                      
                      <div className="flex flex-col gap-2">
                        <input
                          type="file"
                          accept="video/mp4,video/quicktime,video/x-msvideo,video/x-matroska,video/webm"
                          onChange={(e) => handleUploadVideoFile(e, false)}
                          disabled={uploadingLessonVideo}
                          className="hidden"
                          id="new-lesson-video-file"
                        />
                        <label
                          htmlFor="new-lesson-video-file"
                          className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-center gap-2 text-amber-300 font-bold transition"
                        >
                          {uploadingLessonVideo ? <FaSpinner className="animate-spin" /> : <FaCloudUploadAlt size={18} />}
                          <span>{uploadingLessonVideo ? `Uploading Video... ${lessonVideoProgress}%` : 'Upload Video File to Cloudinary'}</span>
                        </label>

                        {/* Upload Progress Bar */}
                        {uploadingLessonVideo && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-amber-400 font-bold">
                              <span>Uploading...</span>
                              <span>{lessonVideoProgress}%</span>
                            </div>
                            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full transition-all duration-300"
                                style={{ width: `${lessonVideoProgress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Video URL fallback input */}
                      <input
                        type="url"
                        placeholder="Or enter direct video URL / YouTube link..."
                        value={newLessonVideoUrl}
                        onChange={(e) => setNewLessonVideoUrl(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none text-xs font-mono"
                      />

                      {/* VIDEO PREVIEW PLAYER */}
                      {newLessonVideoUrl && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] uppercase font-bold text-amber-400 block">Uploaded Video Preview</span>
                          <video
                            src={newLessonVideoUrl}
                            controls
                            poster={newLessonThumbnail}
                            className="w-full max-h-48 rounded-xl bg-black border border-white/10"
                          />
                        </div>
                      )}
                    </div>

                    {/* DUAL OPTION MODULE THUMBNAIL (Upload File or Enter URL) */}
                    <div className="p-3.5 bg-white/[0.02] border border-white/10 rounded-xl space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-gray-300 font-bold flex items-center gap-1.5">
                          <FaImage /> Module Thumbnail (Upload File or Enter URL)
                        </label>
                        {newLessonThumbnail && (
                          <button
                            type="button"
                            onClick={() => {
                              setNewLessonThumbnail('');
                              setNewLessonThumbnailPublicId('');
                            }}
                            className="text-red-400 hover:text-red-300 text-[11px] font-bold underline"
                          >
                            Clear Thumbnail
                          </button>
                        )}
                      </div>

                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleUploadModuleThumbnail(e, false)}
                          disabled={uploadingLessonThumb}
                          className="hidden"
                          id="new-module-thumb-file"
                        />
                        <label
                          htmlFor="new-module-thumb-file"
                          className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 flex items-center justify-center gap-2 text-gray-300 text-xs font-semibold transition"
                        >
                          {uploadingLessonThumb ? <FaSpinner className="animate-spin text-finance-gold" /> : <FaCloudUploadAlt className="text-finance-gold" />}
                          <span>{uploadingLessonThumb ? `Uploading ${lessonThumbProgress}%` : 'Upload Module Thumbnail File'}</span>
                        </label>

                        {uploadingLessonThumb && (
                          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-finance-gold h-full transition-all duration-300" style={{ width: `${lessonThumbProgress}%` }}></div>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400 font-semibold shrink-0">OR PASTE URL:</span>
                          <input
                            type="url"
                            placeholder="https://images.unsplash.com/... or paste image URL"
                            value={newLessonThumbnail}
                            onChange={(e) => setNewLessonThumbnail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-white outline-none text-xs font-mono"
                          />
                        </div>
                      </div>

                      {newLessonThumbnail && (
                        <div className="relative rounded-xl overflow-hidden border border-white/10 mt-2">
                          <img src={newLessonThumbnail} alt="Module Thumbnail Preview" className="w-full h-28 object-cover" />
                        </div>
                      )}
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
                          value={newLessonVideoDuration}
                          onChange={(e) => setNewLessonVideoDuration(e.target.value)}
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

                    <button
                      type="submit"
                      disabled={uploadingLessonVideo || uploadingLessonThumb}
                      className="w-full bg-finance-gold text-finance-dark py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <FaPlus /> Attach Lesson to Syllabus
                    </button>
                  </form>
                )}
              </div>

            </div>

            {/* Courses & Syllabus Directory with Course & Module Editor */}
            <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
              <h3 className="text-base font-bold text-white mb-2">Active Courses & Syllabus Inspector</h3>
              <div className="divide-y divide-white/5">
                {courses?.map((c) => (
                  <div key={c._id} className="py-4 space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        {c.thumbnail ? (
                          <img src={c.thumbnail} alt={c.title} className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0" />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 shrink-0">
                            <FaBook size={20} />
                          </div>
                        )}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white text-base">{c.title}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${c.isPublished !== false ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                              {c.isPublished !== false ? 'Published' : 'Draft / Unpublished'}
                            </span>
                          </div>
                          <p className="text-gray-400 font-mono">
                            Price: <span className="font-bold text-amber-400">₹{c.price?.toLocaleString('en-IN')}</span> {c.discount > 0 && <span className="text-emerald-400 text-[10px]">({c.discount}% OFF)</span>} | Category: {c.category} | Instructor: {c.instructor}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* EDIT COURSE BUTTON */}
                        <button
                          onClick={() => openEditCourseModal(c)}
                          className="flex items-center gap-1.5 bg-finance-gold/10 hover:bg-finance-gold/20 text-finance-gold border border-finance-gold/20 px-3 py-1.5 rounded-xl font-bold text-xs transition"
                          title="Edit Course Details & Thumbnail"
                        >
                          <FaEdit /> Edit Course
                        </button>

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

                    {/* Syllabus Sections & Modules Listing */}
                    {c.sections?.length > 0 && (
                      <div className="pl-4 border-l-2 border-finance-gold/20 space-y-2 mt-2">
                        {c.sections.map((sec) => (
                          <div key={sec._id} className="p-3 bg-white/[0.01] border border-white/5 rounded-xl space-y-2">
                            <h5 className="font-bold text-amber-400 text-xs">{sec.title}</h5>
                            <div className="divide-y divide-white/5">
                              {sec.lessons?.map((les) => (
                                <div key={les._id} className="py-2 flex items-center justify-between gap-3 text-gray-300">
                                  <div className="flex items-center gap-2.5 truncate">
                                    {les.thumbnail ? (
                                      <img src={les.thumbnail} alt="" className="w-8 h-8 rounded-lg object-cover border border-white/10 shrink-0" />
                                    ) : (
                                      <FaVideo className="text-finance-gold shrink-0" />
                                    )}
                                    <div className="truncate">
                                      <span className="font-semibold text-white block truncate">{les.title}</span>
                                      <span className="text-[10px] text-gray-500 font-mono">
                                        {Math.round(les.videoDuration / 60)}m | {les.videoFormat || 'mp4'}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    <button
                                      onClick={() => openEditLessonModal(c._id, sec._id, les)}
                                      className="flex items-center gap-1 bg-finance-gold/10 hover:bg-finance-gold/20 text-finance-gold border border-finance-gold/20 px-2.5 py-1 rounded-lg font-bold text-[11px] transition"
                                    >
                                      <FaEdit /> Edit Module
                                    </button>
                                    <button
                                      onClick={() => deleteLessonMutation.mutate({ courseId: c._id, sectionId: sec._id, lessonId: les._id })}
                                      className="text-red-400 hover:text-red-300 p-1"
                                      title="Delete Module Lesson"
                                    >
                                      <FaTrash size={12} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
                    {coupons?.map((c) => (
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
                  {courses?.map((c) => (
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
                  {students?.map((s) => (
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

      {/* EDIT COURSE MODAL */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B132B] border border-white/10 rounded-2xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-4 text-xs font-semibold text-gray-300">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FaEdit className="text-finance-gold" /> Edit Course Details & Thumbnail
              </h3>
              <button onClick={() => setEditingCourse(null)} className="text-gray-400 hover:text-white p-1">
                <FaTimes size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveEditCourse} className="space-y-4">
              <div>
                <label className="block mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={editCourseTitle}
                  onChange={(e) => setEditCourseTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-finance-gold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block mb-1">Price (INR)</label>
                  <input
                    type="number"
                    required
                    value={editCoursePrice}
                    onChange={(e) => setEditCoursePrice(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-finance-gold"
                  />
                </div>
                <div>
                  <label className="block mb-1">Discount (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editCourseDiscount}
                    onChange={(e) => setEditCourseDiscount(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-finance-gold"
                  />
                </div>
                <div>
                  <label className="block mb-1">Category</label>
                  <select
                    value={editCourseCategory}
                    onChange={(e) => setEditCourseCategory(e.target.value)}
                    className="w-full bg-[#0B132B] border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                  >
                    {['Beginner', 'Swing Trading', 'Intraday', 'Options Trading', 'Futures', 'Mutual Funds', 'Technical Analysis', 'Price Action', 'Psychology', 'Portfolio Building'].map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Instructor Name</label>
                  <input
                    type="text"
                    value={editCourseInstructor}
                    onChange={(e) => setEditCourseInstructor(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1">Duration (e.g. 12 hours)</label>
                  <input
                    type="text"
                    value={editCourseDuration}
                    onChange={(e) => setEditCourseDuration(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              {/* DUAL OPTION EDIT COURSE THUMBNAIL (Upload File or Enter URL) */}
              <div className="p-3.5 bg-white/[0.02] border border-white/10 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-amber-300 font-bold flex items-center gap-1.5">
                    <FaImage /> Course Thumbnail (Upload File or Enter URL)
                  </label>
                  {editCourseThumbnail && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditCourseThumbnail('');
                        setEditCourseThumbnailPublicId('');
                      }}
                      className="text-red-400 hover:text-red-300 text-[11px] font-bold underline"
                    >
                      Delete Thumbnail
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleUploadCourseThumbnail(e, true)}
                    disabled={uploadingEditCourseThumb}
                    className="hidden"
                    id="edit-course-thumb-file"
                  />
                  <label
                    htmlFor="edit-course-thumb-file"
                    className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 flex items-center justify-center gap-2 text-gray-300 font-semibold transition"
                  >
                    {uploadingEditCourseThumb ? (
                      <FaSpinner className="animate-spin text-finance-gold" />
                    ) : (
                      <FaCloudUploadAlt className="text-finance-gold text-lg" />
                    )}
                    <span>{uploadingEditCourseThumb ? `Uploading Image... ${editCourseThumbProgress}%` : 'Upload / Replace Thumbnail File'}</span>
                  </label>

                  {uploadingEditCourseThumb && (
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-finance-gold h-full transition-all duration-300" style={{ width: `${editCourseThumbProgress}%` }}></div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 font-semibold shrink-0">OR PASTE URL:</span>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/... or paste image URL"
                      value={editCourseThumbnail}
                      onChange={(e) => setEditCourseThumbnail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-white outline-none text-xs font-mono"
                    />
                  </div>
                </div>

                {editCourseThumbnail && (
                  <div className="relative rounded-xl overflow-hidden border border-white/10 mt-2">
                    <img src={editCourseThumbnail} alt="Course Thumbnail Preview" className="w-full h-36 object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block mb-1">Course Overview Description</label>
                <textarea
                  rows="3"
                  value={editCourseDesc}
                  onChange={(e) => setEditCourseDesc(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-finance-gold resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingEditCourseThumb || updateCourseMutation.isPending}
                  className="px-6 py-2 rounded-xl bg-finance-gold text-finance-dark font-bold hover:bg-yellow-400 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {updateCourseMutation.isPending ? (
                    <>
                      <FaSpinner className="animate-spin" /> Saving Changes...
                    </>
                  ) : (
                    'Save Course Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT LESSON MODAL */}
      {editingLesson && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B132B] border border-white/10 rounded-2xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-4 text-xs font-semibold text-gray-300">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FaEdit className="text-finance-gold" /> Edit Module Lesson
              </h3>
              <button onClick={() => setEditingLesson(null)} className="text-gray-400 hover:text-white p-1">
                <FaTimes size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveEditLesson} className="space-y-4">
              <div>
                <label className="block mb-1">Lesson Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block mb-1">Lesson Description</label>
                <textarea
                  rows="2"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none resize-none"
                ></textarea>
              </div>

              {/* VIDEO MANAGEMENT & PREVIEW */}
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-amber-300 font-bold flex items-center gap-1.5">
                    <FaVideo /> Video File & Cloudinary Stream
                  </label>
                  {editVideoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditVideoUrl('');
                        setEditVideoPublicId('');
                        setEditVideoDuration(0);
                        setEditVideoFormat('');
                        setEditVideoSize(0);
                      }}
                      className="text-red-400 hover:text-red-300 text-[11px] font-bold underline"
                    >
                      Delete Video
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    accept="video/mp4,video/quicktime,video/x-msvideo,video/x-matroska,video/webm"
                    onChange={(e) => handleUploadVideoFile(e, true)}
                    disabled={uploadingEditVideo}
                    className="hidden"
                    id="edit-lesson-video-file"
                  />
                  <label
                    htmlFor="edit-lesson-video-file"
                    className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-center gap-2 text-amber-300 font-bold transition"
                  >
                    {uploadingEditVideo ? <FaSpinner className="animate-spin" /> : <FaCloudUploadAlt size={18} />}
                    <span>{uploadingEditVideo ? `Uploading Replace Video... ${editVideoProgress}%` : 'Replace Video (Upload File)'}</span>
                  </label>

                  {uploadingEditVideo && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-amber-400 font-bold">
                        <span>Uploading Video...</span>
                        <span>{editVideoProgress}%</span>
                      </div>
                      <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full transition-all duration-300"
                          style={{ width: `${editVideoProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <input
                  type="url"
                  placeholder="Or paste video URL..."
                  value={editVideoUrl}
                  onChange={(e) => setEditVideoUrl(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none font-mono text-xs"
                />

                {editVideoUrl && (
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-amber-400 block">Video Preview</span>
                    <video
                      src={editVideoUrl}
                      controls
                      poster={editThumbnail}
                      className="w-full max-h-48 rounded-xl bg-black border border-white/10"
                    />
                  </div>
                )}
              </div>

              {/* DUAL OPTION EDIT MODULE THUMBNAIL (Upload File or Enter URL) */}
              <div className="p-3.5 bg-white/[0.02] border border-white/10 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-gray-300 font-bold flex items-center gap-1.5">
                    <FaImage /> Module Thumbnail (Upload File or Enter URL)
                  </label>
                  {editThumbnail && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditThumbnail('');
                        setEditThumbnailPublicId('');
                      }}
                      className="text-red-400 hover:text-red-300 text-[11px] font-bold underline"
                    >
                      Delete Thumbnail
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleUploadModuleThumbnail(e, true)}
                    disabled={uploadingEditThumb}
                    className="hidden"
                    id="edit-module-thumb-file"
                  />
                  <label
                    htmlFor="edit-module-thumb-file"
                    className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 flex items-center justify-center gap-2 text-gray-300 text-xs font-semibold transition"
                  >
                    {uploadingEditThumb ? <FaSpinner className="animate-spin text-finance-gold" /> : <FaCloudUploadAlt className="text-finance-gold" />}
                    <span>{uploadingEditThumb ? `Uploading ${editThumbProgress}%` : 'Upload / Replace Thumbnail File'}</span>
                  </label>

                  {uploadingEditThumb && (
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-finance-gold h-full transition-all duration-300" style={{ width: `${editThumbProgress}%` }}></div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 font-semibold shrink-0">OR PASTE URL:</span>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/... or paste image URL"
                      value={editThumbnail}
                      onChange={(e) => setEditThumbnail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-white outline-none text-xs font-mono"
                    />
                  </div>
                </div>

                {editThumbnail && (
                  <div className="relative rounded-xl overflow-hidden border border-white/10 mt-2">
                    <img src={editThumbnail} alt="Module Thumbnail Preview" className="w-full h-32 object-cover" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">PDF Notes URL</label>
                  <input
                    type="url"
                    value={editPdfUrl}
                    onChange={(e) => setEditPdfUrl(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1">Duration (seconds)</label>
                  <input
                    type="number"
                    value={editVideoDuration}
                    onChange={(e) => setEditVideoDuration(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Assignment Details</label>
                <textarea
                  rows="2"
                  value={editAssignment}
                  onChange={(e) => setEditAssignment(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingLesson(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingEditVideo || uploadingEditThumb}
                  className="px-6 py-2 rounded-xl bg-finance-gold text-finance-dark font-bold hover:bg-yellow-400 transition disabled:opacity-50"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminDashboard;
