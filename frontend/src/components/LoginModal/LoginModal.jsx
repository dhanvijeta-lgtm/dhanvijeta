import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../store/authContext';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { FaGoogle, FaEnvelope, FaLock, FaUser, FaTimes } from 'react-icons/fa';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
});

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

export function LoginModal({ isOpen, onClose }) {
  const { login, register, googleLogin } = useAuth();
  const [activeTab, setActiveTab] = useState('login'); // login | register | forgot
  const [submitting, setSubmitting] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    if (credentialResponse?.credential) {
      setSubmitting(true);
      const success = await googleLogin(credentialResponse.credential);
      setSubmitting(false);
      if (success) onClose();
    }
  };

  const handleGoogleError = () => {
    toast.error('Google Sign-In failed or was cancelled.');
  };

  const customGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      if (tokenResponse?.access_token) {
        setSubmitting(true);
        const success = await googleLogin({ accessToken: tokenResponse.access_token });
        setSubmitting(false);
        if (success) onClose();
      }
    },
    onError: handleGoogleError
  });

  // Forms configurations
  const { register: regLogin, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const { register: regRegister, handleSubmit: handleRegisterSubmit, formState: { errors: registerErrors } } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const { register: regForgot, handleSubmit: handleForgotSubmit, formState: { errors: forgotErrors } } = useForm({
    resolver: zodResolver(forgotSchema)
  });

  if (!isOpen) return null;

  const onLogin = async (data) => {
    setSubmitting(true);
    const success = await login(data.email, data.password);
    setSubmitting(false);
    if (success) onClose();
  };

  const onRegister = async (data) => {
    setSubmitting(true);
    const success = await register(data.name, data.email, data.password);
    setSubmitting(false);
    if (success) setActiveTab('login');
  };

  const onForgot = async (data) => {
    // Mock triggering a password reset
    setSubmitting(true);
    try {
      const { default: client } = await import('../../api/client');
      await client.post('/auth/forgot-password', { email: data.email });
      alert('If the email is registered, a password reset link has been dispatched.');
      setActiveTab('login');
    } catch (e) {
      alert('An error occurred. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-finance-dark/80 backdrop-blur-md" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative w-full max-w-md glass-card rounded-2xl p-8 border border-white/10 shadow-gold-glow animate-float-slow">
        {/* Close Button */}
        <button className="absolute top-4 right-4 text-gray-400 hover:text-finance-gold transition" onClick={onClose}>
          <FaTimes size={20} />
        </button>

        {/* Tab Headers */}
        {activeTab !== 'forgot' && (
          <div className="flex border-b border-white/10 mb-6">
            <button
              className={`flex-1 pb-3 text-center font-medium transition ${activeTab === 'login' ? 'text-finance-gold border-b-2 border-finance-gold' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('login')}
            >
              Sign In
            </button>
            <button
              className={`flex-1 pb-3 text-center font-medium transition ${activeTab === 'register' ? 'text-finance-gold border-b-2 border-finance-gold' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('register')}
            >
              Register
            </button>
          </div>
        )}

        {/* GOOGLE SIGN IN */}
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
              className="text-xs text-gray-400 hover:text-finance-gold transition underline mt-1"
            >
              Having trouble? Click here for Google Popup
            </button>
            <div className="w-full flex items-center my-3 text-gray-500 text-xs uppercase before:content-[''] before:flex-1 before:border-b before:border-white/10 before:mr-3 after:content-[''] after:flex-1 after:border-b after:border-white/10 after:ml-3">
              Or
            </div>
          </div>
        )}

        {/* LOGIN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1 font-medium">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3.5 text-gray-500" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full bg-white/5 border border-white/10 focus:border-finance-gold rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 outline-none transition"
                  {...regLogin('email')}
                />
              </div>
              {loginErrors.email && <span className="text-red-500 text-xs mt-1 block">{loginErrors.email.message}</span>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm text-gray-400 font-medium">Password</label>
                <button type="button" className="text-xs text-finance-gold hover:underline" onClick={() => setActiveTab('forgot')}>
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <FaLock className="absolute left-3 top-3.5 text-gray-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 focus:border-finance-gold rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 outline-none transition"
                  {...regLogin('password')}
                />
              </div>
              {loginErrors.password && <span className="text-red-500 text-xs mt-1 block">{loginErrors.password.message}</span>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-finance-dark font-bold rounded-xl py-3 mt-2 shadow-gold-glow transition disabled:opacity-50"
            >
              {submitting ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit(onRegister)} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1 font-medium">Full Name</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-3.5 text-gray-500" />
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-white/5 border border-white/10 focus:border-finance-gold rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 outline-none transition"
                  {...regRegister('name')}
                />
              </div>
              {registerErrors.name && <span className="text-red-500 text-xs mt-1 block">{registerErrors.name.message}</span>}
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1 font-medium">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3.5 text-gray-500" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full bg-white/5 border border-white/10 focus:border-finance-gold rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 outline-none transition"
                  {...regRegister('email')}
                />
              </div>
              {registerErrors.email && <span className="text-red-500 text-xs mt-1 block">{registerErrors.email.message}</span>}
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1 font-medium">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3.5 text-gray-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 focus:border-finance-gold rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 outline-none transition"
                  {...regRegister('password')}
                />
              </div>
              {registerErrors.password && <span className="text-red-500 text-xs mt-1 block">{registerErrors.password.message}</span>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-finance-dark font-bold rounded-xl py-3 mt-2 shadow-gold-glow transition disabled:opacity-50"
            >
              {submitting ? 'Creating Account...' : 'Register'}
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {activeTab === 'forgot' && (
          <div>
            <h3 className="text-xl font-bold text-finance-gold mb-2">Reset Password</h3>
            <p className="text-sm text-gray-400 mb-6">Enter your registered email below, and we will send you a secure link to reset your password.</p>
            <form onSubmit={handleForgotSubmit(onForgot)} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1 font-medium">Email Address</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-3.5 text-gray-500" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="w-full bg-white/5 border border-white/10 focus:border-finance-gold rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 outline-none transition"
                    {...regForgot('email')}
                  />
                </div>
                {forgotErrors.email && <span className="text-red-500 text-xs mt-1 block">{forgotErrors.email.message}</span>}
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl py-3 font-semibold transition"
                  onClick={() => setActiveTab('login')}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-finance-dark font-bold rounded-xl py-3 shadow-gold-glow transition disabled:opacity-50"
                >
                  {submitting ? 'Sending...' : 'Send Link'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginModal;
