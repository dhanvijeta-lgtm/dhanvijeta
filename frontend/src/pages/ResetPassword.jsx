import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { FaLock, FaSpinner, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { useAuth } from '../store/authContext';

const resetSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(resetSchema)
  });

  const onSubmit = async (data) => {
    if (!token) {
      return;
    }
    setSubmitting(true);
    const res = await resetPassword(token, data.password);
    setSubmitting(false);
    if (res?.success) {
      setIsSuccess(true);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-[#0b132b]/90 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-8 shadow-[0_0_50px_rgba(234,179,8,0.15)]"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
            Reset Password
          </h2>
          <p className="text-xs text-gray-400 mt-1">Create a new secure password for your account</p>
        </div>

        {!token ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center text-xl mx-auto mb-3 border border-rose-500/30">
              <FaExclamationCircle />
            </div>
            <p className="text-xs text-rose-300 mb-4 bg-rose-500/10 border border-rose-500/20 rounded-lg p-3">
              Invalid or missing password reset token in URL.
            </p>
            <Link to="/" className="text-xs text-amber-400 hover:underline">
              Return to Homepage
            </Link>
          </div>
        ) : isSuccess ? (
          <div className="text-center py-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-emerald-500/30"
            >
              <FaCheckCircle />
            </motion.div>
            <h3 className="text-lg font-bold text-white mb-2">Password Reset Complete</h3>
            <p className="text-xs text-gray-300 mb-6">
              Your password has been updated successfully. You can now sign in with your new credentials.
            </p>
            <button
              onClick={() => navigate('/', { state: { openLogin: true } })}
              className="w-full bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 hover:from-amber-500 hover:to-yellow-300 text-[#0b132b] font-bold rounded-xl py-3 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition text-sm"
            >
              Proceed to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">New Password</label>
              <div className="relative">
                <FaLock className="absolute left-3.5 top-3.5 text-gray-500 text-sm" />
                <input
                  type="password"
                  placeholder="Min 8 chars, 1 upper, 1 special"
                  className="w-full bg-white/5 border border-white/10 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-500 outline-none transition"
                  {...register('password')}
                />
              </div>
              {errors.password && (
                <span className="text-red-400 text-xs mt-1 block">{errors.password.message}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Confirm New Password</label>
              <div className="relative">
                <FaLock className="absolute left-3.5 top-3.5 text-gray-500 text-sm" />
                <input
                  type="password"
                  placeholder="Confirm your new password"
                  className="w-full bg-white/5 border border-white/10 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-500 outline-none transition"
                  {...register('confirmPassword')}
                />
              </div>
              {errors.confirmPassword && (
                <span className="text-red-400 text-xs mt-1 block">{errors.confirmPassword.message}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 hover:from-amber-500 hover:to-yellow-300 text-[#0b132b] font-bold rounded-xl py-3 mt-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin text-sm" />
                  Resetting Password...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
