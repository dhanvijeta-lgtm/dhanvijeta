import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaExclamationTriangle, FaSpinner, FaArrowRight, FaEnvelope } from 'react-icons/fa';
import client from '../api/client';
import { useAuth } from '../store/authContext';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { resendVerification } = useAuth();

  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const [errorMessage, setErrorMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('No verification token provided in the URL.');
      return;
    }

    const verifyToken = async () => {
      try {
        await client.get(`/auth/verify-email?token=${token}`);
        setStatus('success');
      } catch (err) {
        setStatus('error');
        setErrorMessage(
          err.response?.data?.message ||
          err.response?.data?.error ||
          'Failed to verify email. The link may have expired or is invalid.'
        );
      }
    };

    verifyToken();
  }, [token]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!resendEmail) return;
    setIsResending(true);
    await resendVerification(resendEmail);
    setIsResending(false);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-[#0b132b]/90 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-8 text-center shadow-[0_0_50px_rgba(234,179,8,0.15)]"
      >
        {status === 'verifying' && (
          <div className="flex flex-col items-center py-6">
            <FaSpinner className="animate-spin text-4xl text-amber-400 mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Verifying Your Email</h2>
            <p className="text-sm text-gray-400">Please wait while we confirm your account details...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center py-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-3xl mb-4 border border-emerald-500/30"
            >
              <FaCheckCircle />
            </motion.div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent mb-2">
              Email Verified Successfully!
            </h2>
            <p className="text-sm text-gray-300 mb-6">
              Your email address has been verified. Your Dhan Vijeta account is now fully active.
            </p>
            <button
              onClick={() => navigate('/', { state: { openLogin: true } })}
              className="w-full bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 hover:from-amber-500 hover:to-yellow-300 text-[#0b132b] font-bold rounded-xl py-3 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition flex items-center justify-center gap-2 text-sm"
            >
              Proceed to Sign In <FaArrowRight />
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center py-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-16 h-16 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center text-3xl mb-4 border border-rose-500/30"
            >
              <FaExclamationTriangle />
            </motion.div>
            <h2 className="text-xl font-bold text-white mb-2">Verification Failed</h2>
            <p className="text-xs text-rose-300 mb-6 bg-rose-500/10 border border-rose-500/20 rounded-lg p-3">
              {errorMessage}
            </p>

            <form onSubmit={handleResend} className="w-full space-y-3">
              <label className="block text-left text-xs text-gray-400 font-medium">
                Request a new verification link
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3.5 top-3.5 text-gray-500 text-sm" />
                <input
                  type="email"
                  required
                  placeholder="Enter your registered email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-500 outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={isResending}
                className="w-full bg-white/10 hover:bg-white/20 text-amber-400 border border-amber-500/30 font-semibold rounded-xl py-2.5 text-xs transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isResending ? <FaSpinner className="animate-spin" /> : 'Resend Verification Email'}
              </button>
            </form>

            <Link
              to="/"
              className="mt-6 text-xs text-gray-400 hover:text-amber-400 transition"
            >
              Return to Homepage
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
