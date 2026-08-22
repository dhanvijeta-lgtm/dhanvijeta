import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import client from '../api/client';
import { useAuth } from '../store/authContext';
import VideoPlayer from '../components/VideoPlayer/VideoPlayer';
import CheckoutModal from '../components/CheckoutModal/CheckoutModal';
import formatDuration from '../utils/formatDuration';
import {
  FaRegClock,
  FaStar,
  FaUser,
  FaCheck,
  FaTags,
  FaLock,
  FaPlayCircle,
  FaTimes,
  FaShieldAlt
} from 'react-icons/fa';
import toast from 'react-hot-toast';

export function CourseDetails({ onOpenLogin }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isLoggedIn } = useAuth();

  const [couponInput, setCouponInput] = useState('');
  const [activeCoupon, setActiveCoupon] = useState(null);
  const [openSection, setOpenSection] = useState(0);
  const [previewLesson, setPreviewLesson] = useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // Fetch course details using TanStack Query
  const { data: course, isLoading, error } = useQuery({
    queryKey: ['course', slug],
    queryFn: async () => {
      const res = await client.get(`/courses/${slug}`);
      return res.data.data;
    }
  });

  // Fetch student purchases if logged in to check enrollment status
  const { data: myPurchases } = useQuery({
    queryKey: ['my-purchases'],
    queryFn: async () => {
      if (!isLoggedIn) return [];
      const res = await client.get('/my-batch');
      return res.data.data;
    },
    enabled: !!isLoggedIn
  });

  // Query authorized preview video metadata if preview modal is open
  const { data: previewVideoData, isLoading: isPreviewLoading } = useQuery({
    queryKey: ['preview-video', course?._id, previewLesson?._id],
    queryFn: async () => {
      if (!course?._id || !previewLesson?._id) return null;
      const res = await client.get(`/courses/${course._id}/lessons/${previewLesson._id}/video`);
      return res.data.data;
    },
    enabled: !!course?._id && !!previewLesson?._id
  });

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-amber-400 border-[#090d16] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="text-center py-20 max-w-md mx-auto">
        <h3 className="text-2xl font-bold text-red-400 mb-2">Course Not Found</h3>
        <p className="text-sm text-gray-400">We couldn't retrieve details for this course. Try going back to courses page.</p>
        <button onClick={() => navigate('/courses')} className="mt-4 bg-white/10 border border-white/10 px-6 py-2 rounded-xl text-xs font-bold">
          Back to Courses
        </button>
      </div>
    );
  }

  const basePrice = course.price;
  const initialDiscountPrice = course.discount > 0
    ? Math.round(basePrice - (basePrice * (course.discount / 100)))
    : basePrice;

  const currentPrice = activeCoupon 
    ? activeCoupon.finalPrice 
    : initialDiscountPrice;

  const isFree = currentPrice <= 0 || basePrice === 0;
  const isEnrolled = myPurchases?.some(p => p.courseId?._id === course?._id || p.courseId === course?._id);
  const isUnlocked = isFree || isEnrolled;

  // Coupon verification
  const handleApplyCoupon = async () => {
    if (!couponInput) return;
    try {
      const res = await client.get(`/coupons/validate?code=${couponInput.trim()}&courseId=${course._id}`);
      setActiveCoupon(res.data.data);
      toast.success(`Coupon "${couponInput.toUpperCase()}" applied successfully!`);
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Invalid coupon code');
      setActiveCoupon(null);
    }
  };

  // Trigger Checkout Modal
  const handleStartCheckout = () => {
    if (!isLoggedIn) {
      toast.error('Please sign in to enroll in the course.');
      onOpenLogin();
      return;
    }
    setShowCheckoutModal(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative pb-20 sm:pb-0">
      
      {/* PREMIUM CHECKOUT MODAL OVERLAY */}
      {showCheckoutModal && (
        <CheckoutModal
          course={course}
          initialCoupon={activeCoupon}
          onClose={() => setShowCheckoutModal(false)}
          onPaymentSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['my-purchases'] });
          }}
        />
      )}

      {/* FREE PREVIEW VIDEO MODAL PLAYER */}
      {previewLesson && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#090d16] border border-white/15 rounded-3xl p-6 max-w-3xl w-full space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#00e5a0] tracking-wider block">
                  FREE PREVIEW LESSON
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white">{previewLesson.title}</h3>
              </div>
              <button
                onClick={() => setPreviewLesson(null)}
                className="text-gray-400 hover:text-white p-2 rounded-xl bg-white/5 border border-white/10 transition"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {isPreviewLoading ? (
              <div className="aspect-video bg-black rounded-2xl flex items-center justify-center text-amber-400 text-xs font-mono">
                Loading Free Preview Video...
              </div>
            ) : (
              <VideoPlayer
                src={previewVideoData?.embedUrl || previewVideoData?.videoUrl || previewLesson.videoUrl}
                provider={previewVideoData?.provider || previewLesson.videoProvider}
                fileId={previewVideoData?.fileId || previewLesson.googleDriveFileId}
                poster={previewLesson.thumbnail}
              />
            )}

            {previewLesson.description && (
              <p className="text-xs text-gray-300 font-light leading-relaxed">{previewLesson.description}</p>
            )}
          </div>
        </div>
      )}

      {/* LEFT: DETAILS VIEW */}
      <div className="lg:col-span-2 space-y-8">
        {/* Title */}
        <div className="space-y-4">
          <span className="bg-amber-400/10 text-amber-400 border border-amber-400/20 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
            {course.category}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {course.title}
          </h1>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            {course.description}
          </p>

          <div className="flex items-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <FaUser className="text-amber-400" />
              <span>By {course.instructor}</span>
            </span>
            <span className="flex items-center gap-2">
              <FaRegClock className="text-[#00e5a0]" />
              <span>{course.duration}</span>
            </span>
            <span className="flex items-center gap-1.5 text-amber-400 font-bold">
              <FaStar />
              <span>{course.rating.toFixed(1)}</span>
            </span>
          </div>
        </div>

        {/* Benefits Checkpoints */}
        <div className="glass-card rounded-2xl p-6 space-y-4 border border-white/10">
          <h3 className="text-lg font-bold text-white tracking-wide">What you will learn</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-gray-300">
            {course.benefits?.map((item, i) => (
              <div key={i} className="flex gap-2.5 items-start">
                <FaCheck className="text-[#00e5a0] mt-0.5 shrink-0" size={12} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Curriculum Syllabus list */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold tracking-tight">Course Syllabus</h3>
          <div className="space-y-3">
            {course.sections?.map((section, idx) => (
              <div key={section._id} className="glass-card rounded-xl border border-white/10 overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-5 text-left font-bold"
                  onClick={() => setOpenSection(openSection === idx ? null : idx)}
                >
                  <span className="text-sm sm:text-base">{section.title}</span>
                  <span className="text-amber-400">{openSection === idx ? '−' : '+'}</span>
                </button>
                {openSection === idx && (
                  <div className="border-t border-white/10 divide-y divide-white/5 bg-white/[0.01]">
                    {section.lessons.map((lesson) => {
                      const canPlay = isUnlocked || lesson.isPreview;

                      return (
                        <div
                          key={lesson._id}
                          onClick={() => {
                            if (lesson.isPreview) {
                              setPreviewLesson(lesson);
                            } else if (isUnlocked) {
                              if (!isLoggedIn) {
                                toast.error('Please sign in to watch full course lessons.');
                                onOpenLogin();
                              } else {
                                navigate(`/my-batch/${course._id}?lessonId=${lesson._id}`);
                              }
                            } else {
                              toast.error('This lesson is locked. Please enroll to watch.');
                            }
                          }}
                          className={`p-4 pl-6 flex items-center justify-between text-xs sm:text-sm transition ${
                            canPlay ? 'cursor-pointer hover:bg-white/5 text-white' : 'text-gray-400'
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            {canPlay ? (
                              <FaPlayCircle className="text-[#00e5a0] shrink-0" size={16} />
                            ) : (
                              <FaLock className="text-gray-500 shrink-0" size={12} />
                            )}
                            <span className={canPlay ? 'text-white font-semibold' : 'text-gray-400'}>
                              {lesson.title}
                            </span>
                          </span>

                          <div className="flex items-center gap-3">
                            {lesson.isPreview && (
                              <span className="text-[10px] bg-[#00e5a0]/15 text-[#00e5a0] border border-[#00e5a0]/30 px-2.5 py-0.5 rounded font-black uppercase tracking-wider">
                                ▶ FREE PREVIEW
                              </span>
                            )}
                            {!canPlay && (
                              <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-bold uppercase">
                                🔒 LOCKED
                              </span>
                            )}
                            {isUnlocked && !lesson.isPreview && (
                              <span className="text-[10px] bg-amber-400/15 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded font-bold uppercase">
                                UNLOCKED
                              </span>
                            )}
                            {formatDuration(lesson.videoDuration) && (
                              <span className="text-gray-500 font-mono text-xs">
                                {formatDuration(lesson.videoDuration)}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* FAQS Accordion */}
        {course.faqs?.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold tracking-tight">Frequently Asked Questions</h3>
            <div className="space-y-3">
              {course.faqs.map((faq, i) => (
                <div key={i} className="glass-card rounded-xl border border-white/10 p-5 space-y-2">
                  <h4 className="font-bold text-sm sm:text-base text-amber-400">{faq.question}</h4>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: PRICING CARD (Desktop Sticky & Mobile Bar) */}
      <div className="lg:col-span-1">
        <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-2xl space-y-6 sticky top-24">
          <div className="text-center pb-4 border-b border-white/10">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-black block mb-1">
              {isFree ? 'Free Enrollment Path' : 'Guaranteed Learning Path'}
            </span>
            <div className="flex items-baseline justify-center gap-2">
              {isFree ? (
                <span className="text-4xl font-black text-[#00e5a0] font-mono tracking-wider">FREE</span>
              ) : (
                <>
                  <span className="text-3xl font-black text-white">₹{currentPrice.toLocaleString('en-IN')}</span>
                  {course.discount > 0 && (
                    <span className="text-sm text-gray-500 line-through">₹{basePrice.toLocaleString('en-IN')}</span>
                  )}
                </>
              )}
            </div>
            {isFree ? (
              <span className="inline-block mt-2 text-[10px] font-extrabold text-[#00e5a0] bg-[#00e5a0]/10 border border-[#00e5a0]/20 px-2.5 py-0.5 rounded uppercase tracking-wider">
                100% Free Access
              </span>
            ) : course.discount > 0 && (
              <span className="inline-block mt-2 text-[10px] font-bold text-[#00e5a0] bg-[#00e5a0]/10 border border-[#00e5a0]/20 px-2 py-0.5 rounded">
                Discount Active: {course.discount}% OFF
              </span>
            )}
          </div>

          <button
            onClick={isEnrolled ? () => navigate(`/my-batch/${course._id}`) : handleStartCheckout}
            className={`w-full font-extrabold text-center py-4 rounded-xl transition flex items-center justify-center gap-2 ${
              isUnlocked
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-[#030710] shadow-[0_0_20px_rgba(0,229,160,0.4)]'
                : 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 hover:from-amber-500 hover:to-yellow-300 text-[#030710] shadow-[0_0_20px_rgba(245,158,11,0.4)]'
            }`}
          >
            {isEnrolled ? (
              <>
                <FaPlayCircle size={18} /> Go to My Batch / Watch Course
              </>
            ) : isFree ? (
              <>
                <FaPlayCircle size={18} /> Enroll & Watch for Free
              </>
            ) : (
              <>
                <FaShieldAlt size={16} /> Enroll / Buy Now
              </>
            )}
          </button>

          <div className="space-y-2 pt-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Apply Coupon Code</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="PROTRADER"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 text-sm text-white uppercase placeholder-gray-600 outline-none focus:border-amber-400 transition"
              />
              <button
                onClick={handleApplyCoupon}
                className="bg-[#090d16] border border-white/10 hover:border-amber-400 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition"
              >
                Apply
              </button>
            </div>
            {activeCoupon && (
              <div className="flex items-center gap-1.5 text-xs text-[#00e5a0] font-semibold mt-2">
                <FaTags />
                <span>Coupon "{activeCoupon.couponCode}" applied (-₹{Math.round(activeCoupon.originalPrice - activeCoupon.finalPrice)})</span>
              </div>
            )}
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5 space-y-2.5 text-[11px] text-gray-300 leading-relaxed">
            <p className="flex gap-2 items-start">
              <FaCheck className="text-[#00e5a0] mt-0.5 shrink-0" />
              <span>Full lifetime access to video tutorials</span>
            </p>
            <p className="flex gap-2 items-start">
              <FaCheck className="text-[#00e5a0] mt-0.5 shrink-0" />
              <span>Downloadable PDF note files & checklists</span>
            </p>
            <p className="flex gap-2 items-start">
              <FaCheck className="text-[#00e5a0] mt-0.5 shrink-0" />
              <span>Autogenerated verifiable Completion Certificate</span>
            </p>
          </div>
        </div>
      </div>

      {/* MOBILE STICKY BOTTOM BAR FOR MOBILE PHONES */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090d16]/95 backdrop-blur-xl border-t border-white/10 p-3 flex items-center justify-between gap-4 shadow-2xl">
        <div>
          <span className="text-[10px] text-gray-400 uppercase font-bold block">Course Price</span>
          <span className="text-xl font-black text-amber-400 font-mono">
            {isFree ? 'FREE' : `₹${currentPrice.toLocaleString('en-IN')}`}
          </span>
        </div>
        <button
          onClick={isEnrolled ? () => navigate(`/my-batch/${course._id}`) : handleStartCheckout}
          className="flex-1 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 text-[#030710] font-black py-3 rounded-xl shadow-lg text-xs flex items-center justify-center gap-2"
        >
          {isEnrolled ? 'Go to My Batch' : isFree ? 'Enroll Free' : 'Enroll / Buy Now'}
        </button>
      </div>

    </div>
  );
}

export default CourseDetails;
