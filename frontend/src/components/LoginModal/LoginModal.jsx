import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/authContext';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { FaEnvelope, FaLock, FaUser, FaTimes, FaSpinner, FaExclamationCircle } from 'react-icons/fa';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional()
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

export function LoginModal({ isOpen, onClose }) {
  const { login, register, googleLogin, forgotPassword, resendVerification } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login'); // login | register | forgot
  const [submitting, setSubmitting] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [resendingEmail, setResendingEmail] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    if (credentialResponse?.credential) {
      setSubmitting(true);
      const res = await googleLogin(credentialResponse.credential);
      setSubmitting(false);
      if (res?.success) {
        onClose();
        navigate('/dashboard');
      }
    }
  };

  const handleGoogleError = () => {
    toast.error('Google Sign-In failed or was cancelled.');
  };

  const customGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      if (tokenResponse?.access_token) {
        setSubmitting(true);
        const res = await googleLogin({ accessToken: tokenResponse.access_token });
        setSubmitting(false);
        if (res?.success) {
          onClose();
          navigate('/dashboard');
        }
      }
    },
    onError: handleGoogleError
  });

  const { register: regLogin, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors }, reset: resetLogin } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const { register: regRegister, handleSubmit: handleRegisterSubmit, formState: { errors: registerErrors }, reset: resetRegister } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const { register: regForgot, handleSubmit: handleForgotSubmit, formState: { errors: forgotErrors }, reset: resetForgot } = useForm({
    resolver: zodResolver(forgotSchema)
  });

  const onLogin = async (data) => {
    setSubmitting(true);
    setUnverifiedEmail('');
    const res = await login(data.email, data.password);
    setSubmitting(false);
    
    if (res?.success) {
      resetLogin();
      onClose();
      navigate('/dashboard');
    } else if (res?.error?.toLowerCase().includes('verify your email')) {
      setUnverifiedEmail(data.email);
    }
  };

  const onRegister = async (data) => {
    setSubmitting(true);
    const res = await register(data.name, data.email, data.password);
    setSubmitting(false);
    
    if (res?.success) {
      resetRegister();
      setActiveTab('login');
      setUnverifiedEmail(data.email);
    }
  };

  const onForgot = async (data) => {
    setSubmitting(true);
    const res = await forgotPassword(data.email);
    setSubmitting(false);
    if (res?.success) {
      resetForgot();
      setActiveTab('login');
    }
  };

  const handleResendVerification = async () => {
    if (!unverifiedEmail) return;
    setResendingEmail(true);
    await resendVerification(unverifiedEmail);
    setResendingEmail(false);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setUnverifiedEmail('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-[#0b132b]/90 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(234,179,8,0.15)] z-10 my-8"
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-amber-400 p-2 rounded-full hover:bg-white/5 transition duration-200"
              onClick={onClose}
            >
              <FaTimes size={18} />
            </button>

            {/* Header Brand */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                Dhan Vijeta
              </h2>
              <p className="text-xs text-gray-400 mt-1">Master Stock Market Trading & Wealth Creation</p>
            </div>

            {/* Tab Headers */}
            {activeTab !== 'forgot' && (
              <div className="flex border-b border-white/10 mb-6 relative">
                <button
                  type="button"
                  className={`flex-1 pb-3 text-center font-semibold text-sm transition-colors duration-200 ${
                    activeTab === 'login' ? 'text-amber-400' : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => switchTab('login')}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className={`flex-1 pb-3 text-center font-semibold text-sm transition-colors duration-200 ${
                    activeTab === 'register' ? 'text-amber-400' : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => switchTab('register')}
                >
                  Register
                </button>
                <motion.div
                  className="absolute bottom-0 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                  initial={false}
                  animate={{
                    left: activeTab === 'login' ? '0%' : '50%',
                    width: '50%'
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              </div>
            )}

            {/* Unverified Email Alert */}
            {unverifiedEmail && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex flex-col gap-2 text-xs text-amber-200"
              >
                <div className="flex items-center gap-2">
                  <FaExclamationCircle className="text-amber-400 shrink-0 text-sm" />
                  <span>Email verification required for <strong>{unverifiedEmail}</strong>.</span>
                </div>
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resendingEmail}
                  className="self-end text-amber-400 hover:underline font-semibold flex items-center gap-1 disabled:opacity-50"
                >
                  {resendingEmail && <FaSpinner className="animate-spin" />}
                  Resend verification link
                </button>
              </motion.div>
            )}

            {/* Google OAuth Section */}
            {activeTab !== 'forgot' && (
              <div className="mb-6 flex flex-col items-center gap-2">
                <div className="w-full flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme="filled_dark"
                    shape="pill"
                    text={activeTab === 'register' ? 'signup_with' : 'signin_with'}
                    width="350"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => customGoogleLogin()}
                  className="text-xs text-gray-400 hover:text-amber-400 transition underline mt-1"
                >
                  Or click here for Google OAuth Popup
                </button>
                <div className="w-full flex items-center my-3 text-gray-500 text-xs uppercase before:content-[''] before:flex-1 before:border-b before:border-white/10 before:mr-3 after:content-[''] after:flex-1 after:border-b after:border-white/10 after:ml-3">
                  Or continue with email
                </div>
              </div>
            )}

            {/* LOGIN FORM */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Email Address</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3.5 top-3.5 text-gray-500 text-sm" />
                    <input
                      type="email"
                      placeholder="name@example.com"
                      className="w-full bg-white/5 border border-white/10 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition duration-200"
                      {...regLogin('email')}
                    />
                  </div>
                  {loginErrors.email && (
                    <span className="text-red-400 text-xs mt-1 block">{loginErrors.email.message}</span>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-medium text-gray-300">Password</label>
                    <button
                      type="button"
                      className="text-xs text-amber-400 hover:underline"
                      onClick={() => switchTab('forgot')}
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <FaLock className="absolute left-3.5 top-3.5 text-gray-500 text-sm" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition duration-200"
                      {...regLogin('password')}
                    />
                  </div>
                  {loginErrors.password && (
                    <span className="text-red-400 text-xs mt-1 block">{loginErrors.password.message}</span>
                  )}
                </div>

                <div className="flex items-center">
                  <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-white/10 bg-white/5 text-amber-500 focus:ring-amber-400"
                      {...regLogin('rememberMe')}
                    />
                    Remember me on this device
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 hover:from-amber-500 hover:to-yellow-300 text-[#0b132b] font-bold rounded-xl py-3 mt-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <FaSpinner className="animate-spin text-sm" />
                      Authenticating...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>
            )}

            {/* REGISTER FORM */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit(onRegister)} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Full Name</label>
                  <div className="relative">
                    <FaUser className="absolute left-3.5 top-3 text-gray-500 text-sm" />
                    <input
                      type="text"
                      placeholder="Rahul Sharma"
                      className="w-full bg-white/5 border border-white/10 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition duration-200"
                      {...regRegister('name')}
                    />
                  </div>
                  {registerErrors.name && (
                    <span className="text-red-400 text-xs mt-0.5 block">{registerErrors.name.message}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Email Address</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3.5 top-3 text-gray-500 text-sm" />
                    <input
                      type="email"
                      placeholder="name@example.com"
                      className="w-full bg-white/5 border border-white/10 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition duration-200"
                      {...regRegister('email')}
                    />
                  </div>
                  {registerErrors.email && (
                    <span className="text-red-400 text-xs mt-0.5 block">{registerErrors.email.message}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Password</label>
                  <div className="relative">
                    <FaLock className="absolute left-3.5 top-3 text-gray-500 text-sm" />
                    <input
                      type="password"
                      placeholder="Min 8 chars, 1 upper, 1 special"
                      className="w-full bg-white/5 border border-white/10 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition duration-200"
                      {...regRegister('password')}
                    />
                  </div>
                  {registerErrors.password && (
                    <span className="text-red-400 text-xs mt-0.5 block">{registerErrors.password.message}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Confirm Password</label>
                  <div className="relative">
                    <FaLock className="absolute left-3.5 top-3 text-gray-500 text-sm" />
                    <input
                      type="password"
                      placeholder="Confirm password"
                      className="w-full bg-white/5 border border-white/10 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition duration-200"
                      {...regRegister('confirmPassword')}
                    />
                  </div>
                  {registerErrors.confirmPassword && (
                    <span className="text-red-400 text-xs mt-0.5 block">{registerErrors.confirmPassword.message}</span>
                  )}
                </div>

                <div>
                  <label className="flex items-start gap-2 text-xs text-gray-400 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-0.5 rounded border-white/10 bg-white/5 text-amber-500 focus:ring-amber-400"
                      {...regRegister('acceptTerms')}
                    />
                    <span>
                      I accept the <a href="/terms" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">Terms & Conditions</a> and Privacy Policy
                    </span>
                  </label>
                  {registerErrors.acceptTerms && (
                    <span className="text-red-400 text-xs mt-0.5 block">{registerErrors.acceptTerms.message}</span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 hover:from-amber-500 hover:to-yellow-300 text-[#0b132b] font-bold rounded-xl py-2.5 mt-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                >
                  {submitting ? (
                    <>
                      <FaSpinner className="animate-spin text-sm" />
                      Creating Account...
                    </>
                  ) : (
                    'Register Account'
                  )}
                </button>
              </form>
            )}

            {/* FORGOT PASSWORD FORM */}
            {activeTab === 'forgot' && (
              <div>
                <h3 className="text-lg font-bold text-amber-400 mb-1">Forgot Password</h3>
                <p className="text-xs text-gray-400 mb-4">
                  Enter your registered email address below. We will send a secure link to reset your password.
                </p>
                <form onSubmit={handleForgotSubmit(onForgot)} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Email Address</label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3.5 top-3.5 text-gray-500 text-sm" />
                      <input
                        type="email"
                        placeholder="name@example.com"
                        className="w-full bg-white/5 border border-white/10 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition duration-200"
                        {...regForgot('email')}
                      />
                    </div>
                    {forgotErrors.email && (
                      <span className="text-red-400 text-xs mt-1 block">{forgotErrors.email.message}</span>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl py-2.5 text-xs font-semibold transition duration-200"
                      onClick={() => switchTab('login')}
                    >
                      Back to Sign In
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-gradient-to-r from-amber-600 to-yellow-400 hover:from-amber-500 hover:to-yellow-300 text-[#0b132b] font-bold rounded-xl py-2.5 text-xs shadow-[0_0_20px_rgba(245,158,11,0.3)] transition duration-200 flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <FaSpinner className="animate-spin text-xs" />
                          Sending...
                        </>
                      ) : (
                        'Send Reset Link'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default LoginModal;
