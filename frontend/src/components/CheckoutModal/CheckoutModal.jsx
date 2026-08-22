import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';
import { useAuth } from '../../store/authContext';
import {
  FaTimes,
  FaShieldAlt,
  FaLock,
  FaCheck,
  FaStar,
  FaUser,
  FaRegClock,
  FaTags,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
  FaArrowRight,
  FaUndo
} from 'react-icons/fa';
import toast from 'react-hot-toast';

export function CheckoutModal({ course, initialCoupon = null, onClose, onPaymentSuccess }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  // STAGES: 'SUMMARY' | 'CREATING_ORDER' | 'VERIFYING' | 'SUCCESS' | 'FAILED' | 'PENDING'
  const [stage, setStage] = useState('SUMMARY');
  const [creatingStepText, setCreatingStepText] = useState('Preparing secure checkout...');

  // Coupon state
  const [couponInput, setCouponInput] = useState(initialCoupon?.couponCode || '');
  const [activeCoupon, setActiveCoupon] = useState(initialCoupon);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  // Result state
  const [transactionData, setTransactionData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Calculations
  const basePrice = course.price;
  const initialDiscountPrice =
    course.discount > 0
      ? Math.round(basePrice - basePrice * (course.discount / 100))
      : basePrice;

  const finalPrice = activeCoupon
    ? activeCoupon.finalPrice
    : initialDiscountPrice;

  const isFree = finalPrice <= 0 || basePrice === 0;

  // Handle coupon application
  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setApplyingCoupon(true);
    try {
      const res = await client.get(`/coupons/validate?code=${couponInput.trim()}&courseId=${course._id}`);
      setActiveCoupon(res.data.data);
      toast.success(`Coupon "${couponInput.toUpperCase()}" applied!`);
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Invalid coupon code');
      setActiveCoupon(null);
    } finally {
      setApplyingCoupon(false);
    }
  };

  // Handle Proceed to Secure Payment
  const handleProceedToPayment = async () => {
    setStage('CREATING_ORDER');
    setCreatingStepText('Preparing secure checkout...');

    try {
      await new Promise((r) => setTimeout(r, 400));
      setCreatingStepText('Creating secure order...');

      // 1. Create order on backend
      const checkoutRes = await client.post('/payments/checkout', {
        courseId: course._id,
        couponCode: activeCoupon ? activeCoupon.couponCode : null
      });

      const orderData = checkoutRes.data.data;

      // Handle Free Course instant enrollment
      if (orderData.isFree) {
        setStage('VERIFYING');
        await new Promise((r) => setTimeout(r, 600));
        setTransactionData({
          orderId: orderData.orderId,
          paymentId: 'free_enrollment',
          amount: 0
        });
        setStage('SUCCESS');
        if (onPaymentSuccess) onPaymentSuccess();
        return;
      }

      setCreatingStepText('Opening payment gateway...');
      await new Promise((r) => setTimeout(r, 300));

      // Handle Mock Payments
      if (orderData.isMock) {
        setStage('VERIFYING');
        const mockPayId = `mock_pay_${Math.random().toString(36).slice(-8)}`;
        const mockSig = `mock_sig_${Math.random().toString(36).slice(-12)}`;

        const verifyRes = await client.post('/payments/verify', {
          orderId: orderData.orderId,
          paymentId: mockPayId,
          signature: mockSig
        });

        setTransactionData({
          orderId: orderData.orderId,
          paymentId: mockPayId,
          amount: orderData.amount
        });
        setStage('SUCCESS');
        if (onPaymentSuccess) onPaymentSuccess();
      } else {
        // Open Razorpay Standard Checkout
        const options = {
          key: orderData.razorpayKeyId,
          amount: Math.round(orderData.amount * 100),
          currency: 'INR',
          name: 'Dhan Vijeta EdTech',
          description: `Enrollment fee for ${course.title}`,
          order_id: orderData.orderId,
          handler: async function (response) {
            setStage('VERIFYING');
            try {
              const verifyRes = await client.post('/payments/verify', {
                orderId: orderData.orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature
              });

              setTransactionData({
                orderId: orderData.orderId,
                paymentId: response.razorpay_payment_id,
                amount: orderData.amount
              });
              setStage('SUCCESS');
              if (onPaymentSuccess) onPaymentSuccess();
            } catch (err) {
              setErrorMessage(err.response?.data?.message || 'Signature verification failed.');
              setStage('FAILED');
            }
          },
          modal: {
            ondismiss: async function () {
              try {
                await client.post('/payments/cancel', { orderId: orderData.orderId });
              } catch (e) {
                // Silent catch
              }
              setErrorMessage('Payment window was closed before completion.');
              setStage('FAILED');
            }
          },
          prefill: {
            name: user?.name || '',
            email: user?.email || ''
          },
          theme: {
            color: '#ffd700'
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          setErrorMessage(response.error?.description || 'Transaction unsuccessful');
          setStage('FAILED');
        });
        rzp.open();
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.error || err.response?.data?.message || 'Checkout order generation failed.');
      setStage('FAILED');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      
      {/* CREATING ORDER LOADER */}
      {stage === 'CREATING_ORDER' && (
        <div className="bg-[#090d16] border border-amber-500/30 rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl m-4">
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 border-t-amber-400 animate-spin"></div>
            <FaShieldAlt size={32} className="text-amber-400 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-black text-white">{creatingStepText}</h3>
            <p className="text-xs text-gray-400">Please do not refresh or close this window.</p>
          </div>
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-yellow-300 h-full w-2/3 animate-pulse rounded-full"></div>
          </div>
        </div>
      )}

      {/* VERIFYING OVERLAY */}
      {stage === 'VERIFYING' && (
        <div className="bg-[#090d16] border border-[#00e5a0]/30 rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl m-4">
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-[#00e5a0]/20 border-t-[#00e5a0] animate-spin"></div>
            <FaLock size={32} className="text-[#00e5a0] animate-bounce" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-black text-white">Verifying Payment with Server...</h3>
            <p className="text-xs text-gray-400">Validating HMAC signature and updating course enrollment status.</p>
          </div>
        </div>
      )}

      {/* SUCCESS SCREEN */}
      {stage === 'SUCCESS' && (
        <div className="bg-[#090d16] border border-[#00e5a0]/40 rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-[0_0_50px_rgba(0,229,160,0.2)] m-4 relative overflow-hidden">
          <div className="w-20 h-20 bg-[#00e5a0]/15 border border-[#00e5a0]/40 rounded-full flex items-center justify-center mx-auto text-[#00e5a0]">
            <FaCheckCircle size={44} className="animate-bounce" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#00e5a0] bg-[#00e5a0]/10 border border-[#00e5a0]/20 px-3 py-1 rounded-full">
              ENROLLMENT VERIFIED ✓
            </span>
            <h2 className="text-2xl font-black text-white">PAYMENT SUCCESSFUL</h2>
            <p className="text-xs text-gray-300">You are officially enrolled in this batch.</p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-left space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-gray-500">Course</span>
              <span className="text-white font-bold max-w-[180px] truncate">{course.title}</span>
            </div>
            {transactionData?.paymentId && (
              <div className="flex justify-between">
                <span className="text-gray-500">Transaction ID</span>
                <span className="text-[#00e5a0] font-bold truncate max-w-[150px]">{transactionData.paymentId}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-white/5 font-sans font-bold">
              <span className="text-gray-400">Amount Paid</span>
              <span className="text-white text-base">₹{(transactionData?.amount || finalPrice).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            onClick={() => navigate(`/my-batch/${course._id}`)}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-[#030710] font-black py-4 rounded-xl transition shadow-[0_0_25px_rgba(0,229,160,0.4)] flex items-center justify-center gap-2"
          >
            <span>Start Learning Now</span>
            <FaArrowRight size={14} />
          </button>
        </div>
      )}

      {/* FAILED SCREEN */}
      {stage === 'FAILED' && (
        <div className="bg-[#090d16] border border-red-500/30 rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl m-4">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto text-red-400">
            <FaExclamationCircle size={36} />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-black text-white">Payment Wasn't Completed</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              {errorMessage || "Don't worry — your account has not been charged unless verified by Razorpay."}
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={() => setStage('SUMMARY')}
              className="w-full bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-[#030710] font-black py-3.5 rounded-xl transition flex items-center justify-center gap-2"
            >
              <FaUndo size={14} />
              <span>Try Again</span>
            </button>
            <button
              onClick={onClose}
              className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 font-bold py-3 rounded-xl transition text-xs"
            >
              Back to Course Details
            </button>
          </div>
        </div>
      )}

      {/* PRE-CHECKOUT SUMMARY STAGE */}
      {stage === 'SUMMARY' && (
        <div className="bg-[#090d16] border border-white/15 rounded-t-3xl sm:rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl max-h-[90vh] sm:max-h-[85vh] flex flex-col relative">
          {/* Header Bar */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-amber-400" size={16} />
              <span className="text-xs font-black uppercase tracking-wider text-white">Secure Checkout</span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-2 rounded-xl bg-white/5 border border-white/10 transition"
            >
              <FaTimes size={16} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start flex-1">
            {/* LEFT COLUMN: COURSE METADATA SUMMARY (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-24 aspect-video rounded-xl bg-black border border-white/10 overflow-hidden shrink-0">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-amber-400">
                      {course.category}
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded">
                    {course.category}
                  </span>
                  <h3 className="font-extrabold text-base sm:text-lg text-white leading-snug">{course.title}</h3>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs text-gray-400 border-y border-white/5 py-3">
                <span className="flex items-center gap-1.5">
                  <FaUser className="text-amber-400" />
                  <span>{course.instructor}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <FaRegClock className="text-[#00e5a0]" />
                  <span>{course.duration}</span>
                </span>
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <FaStar />
                  <span>{course.rating.toFixed(1)}</span>
                </span>
              </div>

              <p className="text-xs text-gray-300 font-light leading-relaxed line-clamp-3">
                {course.description}
              </p>

              <div className="space-y-2.5">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">Course Highlights:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
                  {course.benefits?.slice(0, 4).map((b, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <FaCheck className="text-[#00e5a0] mt-0.5 shrink-0" size={12} />
                      <span className="truncate">{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: ORDER SUMMARY & PAYMENT CTA (5 Cols) */}
            <div className="lg:col-span-5 bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 border-b border-white/10 pb-3">
                Order Summary
              </h4>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Base Price</span>
                  <span className="font-mono">₹{basePrice.toLocaleString('en-IN')}</span>
                </div>

                {course.discount > 0 && (
                  <div className="flex justify-between text-[#00e5a0]">
                    <span>Course Discount ({course.discount}%)</span>
                    <span className="font-mono">-₹{(basePrice - initialDiscountPrice).toLocaleString('en-IN')}</span>
                  </div>
                )}

                {activeCoupon && (
                  <div className="flex justify-between text-amber-400 font-semibold">
                    <span>Coupon ({activeCoupon.couponCode})</span>
                    <span className="font-mono">-₹{(initialDiscountPrice - activeCoupon.finalPrice).toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between items-baseline pt-3 border-t border-white/10 text-white font-extrabold">
                  <span>Total Amount</span>
                  <div className="text-right">
                    <span className="text-2xl text-amber-400 font-black font-mono">
                      {isFree ? 'FREE' : `₹${finalPrice.toLocaleString('en-IN')}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Coupon Field */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Apply Discount Coupon
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="PROTRADER"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white uppercase placeholder-gray-600 outline-none focus:border-amber-400 transition"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={applyingCoupon}
                    className="bg-[#090d16] border border-white/10 hover:border-amber-400 text-white text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1"
                  >
                    {applyingCoupon ? <FaSpinner className="animate-spin" /> : <FaTags />}
                    <span>Apply</span>
                  </button>
                </div>
              </div>

              {/* Security Shield Indicator */}
              <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-300 font-semibold">
                <FaLock className="shrink-0" />
                <span>Encrypted 256-bit Razorpay Checkout</span>
              </div>

              {/* Main Checkout CTA */}
              <button
                onClick={handleProceedToPayment}
                className="w-full bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 hover:from-amber-500 hover:to-yellow-300 text-[#030710] font-black py-4 rounded-xl transition shadow-[0_0_25px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2 text-sm"
              >
                <FaShieldAlt size={16} />
                <span>{isFree ? 'Enroll for Free Now' : 'Proceed to Secure Payment'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default CheckoutModal;
