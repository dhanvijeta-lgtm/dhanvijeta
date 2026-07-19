import React from 'react';
import { Link } from 'react-router-dom';
import { FaCompass } from 'react-icons/fa';

export function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
      <FaCompass size={60} className="text-finance-gold animate-bounce" />
      <div className="space-y-2">
        <h1 className="text-5xl font-black text-white">404</h1>
        <h2 className="text-xl font-bold text-gray-400">Page Not Found</h2>
        <p className="text-xs text-gray-500 max-w-xs mx-auto">The page you are looking for has been moved, renamed, or is currently unavailable.</p>
      </div>
      <Link to="/" className="bg-finance-navy border border-white/10 hover:border-finance-gold px-6 py-2.5 rounded-xl text-sm font-semibold transition">
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;
