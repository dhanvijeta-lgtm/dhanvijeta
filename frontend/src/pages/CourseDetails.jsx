import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import client from '../api/client';
import { useAuth } from '../store/authContext';
import { FaRegClock, FaStar, FaUser, FaCheck, FaTags, FaLock, FaPlayCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

export function CourseDetails({ onOpenLogin }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  const [couponInput, setCouponInput] = useState('');
  const [activeCoupon, setActiveCoupon] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [openSection, setOpenSection] = useState(0);

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

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-finance-gold border-finance-navy rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="text-center py-20 max-w-md mx-auto">
        <h3 className="text-2xl font-bold text-finance-rose mb-2">Course Not Found</h3>
        <p className="text-sm text-gray-500">We couldn't retrieve details for this course. Try going back to courses page.</p>
        <button onClick={() => navigate('/courses')} className="mt-4 bg-finance-navy border border-white/10 px-6 py-2 rounded-xl">
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

  // Buy Now Flow
  const handleBuyNow = async () => {
    if (!isLoggedIn) {
      toast.error('Please sign in to enroll in the course.');
      onOpenLogin();
      return;
    }

    setCheckoutLoading(true);
    try {
      // 1. Create order on backend
      const checkoutRes = await client.post('/payments/checkout', {
        courseId: course._id,
        couponCode: activeCoupon ? activeCoupon.couponCode : null
      });

      const orderData = checkoutRes.data.data;

      // Handle Free Course instant enrollment
      if (orderData.isFree) {
        toast.success('Enrolled in free course successfully! Welcome to your Batch.');
        navigate(`/my-batch/${course._id}`);
        return;
      }

      // 2. Handle payment signature verification
      if (orderData.isMock) {
        // Instant unlock mock verify
        const verifyRes = await client.post('/payments/verify', {
          orderId: orderData.orderId,
          paymentId: `mock_pay_${Math.random().toString(36).slice(-8)}`,
          signature: `mock_sig_${Math.random().toString(36).slice(-12)}`
        });

        toast.success('Mock checkout successful! Access granted.');
        navigate(`/my-batch/${course._id}`);
      } else {
        // Open Razorpay Standard Checkout overlay
        const options = {
          key: orderData.razorpayKeyId,
          amount: Math.round(orderData.amount * 100),
          currency: 'INR',
          name: 'Dhan Vijeta EdTech',
          description: `Enrollment fee for ${course.title}`,
          order_id: orderData.orderId,
          handler: async function (response) {
            try {
              await client.post('/payments/verify', {
                orderId: orderData.orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature
              });
              toast.success('Payment verified successfully! Welcome to your Batch.');
              navigate(`/my-batch/${course._id}`);
            } catch (err) {
              toast.error('Signature verification failed.');
            }
          },
          prefill: {
            name: user.name,
            email: user.email
          },
          theme: {
            color: '#ffd700'
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Checkout order generation failed.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      
      {/* LEFT: DETAILS VIEW */}
      <div className="lg:col-span-2 space-y-8">
        {/* Title */}
        <div className="space-y-4">
          <span className="bg-finance-gold/10 text-finance-gold border border-finance-gold/20 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
            {course.category}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {course.title}
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            {course.description}
          </p>

          <div className="flex items-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <FaUser className="text-finance-gold" />
              <span>By {course.instructor}</span>
            </span>
            <span className="flex items-center gap-2">
              <FaRegClock className="text-finance-emerald" />
              <span>{course.duration}</span>
            </span>
            <span className="flex items-center gap-1.5 text-finance-gold font-bold">
              <FaStar />
              <span>{course.rating.toFixed(1)}</span>
            </span>
          </div>
        </div>

        {/* Benefits Checkpoints */}
        <div className="glass-card rounded-2xl p-6 space-y-4 border border-white/5">
          <h3 className="text-lg font-bold text-white tracking-wide">What you will learn</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-gray-300">
            {course.benefits?.map((item, i) => (
              <div key={i} className="flex gap-2.5 items-start">
                <FaCheck className="text-finance-emerald mt-0.5 shrink-0" size={12} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Curriculum list */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold tracking-tight">Course Syllabus</h3>
          <div className="space-y-3">
            {course.sections?.map((section, idx) => (
              <div key={section._id} className="glass-card rounded-xl border border-white/5 overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-5 text-left font-bold"
                  onClick={() => setOpenSection(openSection === idx ? null : idx)}
                >
                  <span className="text-sm sm:text-base">{section.title}</span>
                  <span className="text-finance-gold">{openSection === idx ? '−' : '+'}</span>
                </button>
                {openSection === idx && (
                  <div className="border-t border-white/5 divide-y divide-white/5 bg-white/[0.01]">
                    {section.lessons.map((lesson) => (
                      <div
                        key={lesson._id}
                        onClick={() => {
                          if (isUnlocked) {
                            if (!isLoggedIn) {
                              toast.error('Please sign in to watch free course lessons.');
                              onOpenLogin();
                            } else {
                              navigate(`/my-batch/${course._id}?lessonId=${lesson._id}`);
                            }
                          }
                        }}
                        className={`p-4 pl-6 flex items-center justify-between text-xs sm:text-sm transition ${
                          isUnlocked ? 'cursor-pointer hover:bg-white/5 text-white' : ''
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {isUnlocked ? (
                            <FaPlayCircle className="text-emerald-400 shrink-0" size={14} />
                          ) : (
                            <FaLock className="text-gray-500 shrink-0" size={10} />
                          )}
                          <span className={isUnlocked ? 'text-emerald-300 font-semibold' : 'text-gray-300'}>{lesson.title}</span>
                        </span>
                        <div className="flex items-center gap-3">
                          {isUnlocked && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold uppercase">
                              Play Lesson
                            </span>
                          )}
                          <span className="text-gray-500 font-mono text-xs">{Math.round(lesson.videoDuration / 60)}m</span>
                        </div>
                      </div>
                    ))}
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
                <div key={i} className="glass-card rounded-xl border border-white/5 p-5 space-y-2">
                  <h4 className="font-bold text-sm sm:text-base text-finance-gold">{faq.question}</h4>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* RIGHT: PRICING CARD */}
      <div className="lg:col-span-1">
        <div className="glass-card rounded-3xl p-6 border border-white/5 shadow-emerald-glow space-y-6 sticky top-24">
          
          {/* Card header */}
          <div className="text-center pb-4 border-b border-white/5">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black block mb-1">
              {isFree ? 'Free Enrollment Path' : 'Guaranteed Learning Path'}
            </span>
            <div className="flex items-baseline justify-center gap-2">
              {isFree ? (
                <span className="text-4xl font-black text-emerald-400 font-mono tracking-wider">FREE</span>
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
              <span className="inline-block mt-2 text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded uppercase tracking-wider">
                100% Free Access
              </span>
            ) : course.discount > 0 && (
              <span className="inline-block mt-2 text-[10px] font-bold text-finance-emerald bg-finance-emerald/10 border border-finance-emerald/20 px-2 py-0.5 rounded">
                Discount Active: {course.discount}% OFF
              </span>
            )}
          </div>

          {/* Checkout CTA */}
          <button
            onClick={isEnrolled ? () => navigate(`/my-batch/${course._id}`) : handleBuyNow}
            disabled={checkoutLoading}
            className={`w-full font-extrabold text-center py-4 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2 ${
              isUnlocked
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-finance-dark shadow-emerald-glow'
                : 'bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-finance-dark shadow-gold-glow'
            }`}
          >
            {checkoutLoading ? (
              isFree ? 'Enrolling...' : 'Redirecting to checkout...'
            ) : isEnrolled ? (
              <>
                <FaPlayCircle size={18} /> Go to My Batch / Watch Course
              </>
            ) : isFree ? (
              <>
                <FaPlayCircle size={18} /> Enroll & Watch for Free
              </>
            ) : (
              'Enroll / Buy Now'
            )}
          </button>

          {/* Coupon inputs */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Apply Coupon Code</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="PROTRADER"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 text-sm text-white uppercase placeholder-gray-600 outline-none focus:border-finance-gold transition"
              />
              <button
                onClick={handleApplyCoupon}
                className="bg-finance-navy border border-white/10 hover:border-finance-gold text-white text-xs font-bold px-4 py-2.5 rounded-xl transition"
              >
                Apply
              </button>
            </div>
            {activeCoupon && (
              <div className="flex items-center gap-1.5 text-xs text-finance-emerald font-semibold mt-2">
                <FaTags />
                <span>Coupon "{activeCoupon.couponCode}" applied (-₹{Math.round(activeCoupon.originalPrice - activeCoupon.finalPrice)})</span>
              </div>
            )}
          </div>

          {/* Safeguard text */}
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5 space-y-2.5 text-[11px] text-gray-400 leading-relaxed">
            <p className="flex gap-2 items-start">
              <FaCheck className="text-finance-emerald mt-0.5 shrink-0" />
              <span>Full lifetime access to video tutorials</span>
            </p>
            <p className="flex gap-2 items-start">
              <FaCheck className="text-finance-emerald mt-0.5 shrink-0" />
              <span>Downloadable PDF note files & checklists</span>
            </p>
            <p className="flex gap-2 items-start">
              <FaCheck className="text-finance-emerald mt-0.5 shrink-0" />
              <span>Autogenerated verifiable Completion Certificate</span>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}

export default CourseDetails;
