import React from 'react';
import { Link } from 'react-router-dom';
import { FaYoutube, FaTelegramPlane, FaInstagram, FaTwitter } from 'react-icons/fa';

export function Footer() {
  return (
    <footer className="bg-[#050811] border-t border-white/5 pt-16 pb-8 px-6 mt-20 relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        
        {/* BRAND COLUMN */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/logo.png" alt="Dhan Vijeta Logo" className="h-9 w-auto object-contain transition-transform group-hover:scale-105" />
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500">
              DHAN VIJETA
            </span>
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed">
            Empowering retail traders and investors with deep, structured, and actionable financial education. Learn Price Action, Trading Psychology, Options, Futures, and Wealth Management.
          </p>
          <div className="flex gap-4 mt-2">
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-red-500 transition">
              <FaYoutube size={22} />
            </a>
            <a href="https://telegram.org" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-sky-400 transition">
              <FaTelegramPlane size={22} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-pink-500 transition">
              <FaInstagram size={22} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition">
              <FaTwitter size={22} />
            </a>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h4 className="text-sm font-semibold uppercase text-finance-gold tracking-wider mb-4">Quick Links</h4>
          <div className="flex flex-col gap-2.5 text-sm text-gray-400">
            <Link to="/courses" className="hover:text-white transition">All Courses</Link>
            <Link to="/demo-videos" className="hover:text-white transition">Demo Videos</Link>
            <Link to="/blog" className="hover:text-white transition">Blog / Market Insights</Link>
            <Link to="/about" className="hover:text-white transition">About Us</Link>
          </div>
        </div>

        {/* CONTACT INFO */}
        <div>
          <h4 className="text-sm font-semibold uppercase text-finance-gold tracking-wider mb-4">Contact Info</h4>
          <div className="flex flex-col gap-2.5 text-sm text-gray-400">
            <p>Email: contact@dhanvijeta.com</p>
            <p>WhatsApp Support: +91 98765 43210</p>
            <p>Office: Financial District, Gachibowli, Hyderabad, India</p>
          </div>
        </div>

        {/* METRICS */}
        <div>
          <h4 className="text-sm font-semibold uppercase text-finance-gold tracking-wider mb-4">YouTube Metrics</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-center">
              <span className="block text-lg font-bold text-finance-emerald">500K+</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">Subscribers</span>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-center">
              <span className="block text-lg font-bold text-finance-emerald">15M+</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">Total Views</span>
            </div>
          </div>
        </div>

      </div>

      {/* SEBI DISCLAIMER */}
      <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 pb-4">
        <div className="bg-finance-navy/40 border border-white/5 rounded-xl p-5 mb-8">
          <span className="block text-xs font-bold text-red-400 uppercase tracking-widest mb-1.5">
            SEBI Regulatory Disclaimer
          </span>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Dhan Vijeta and its educators are not registered investment advisors under SEBI (Securities and Exchange Board of India) guidelines. All content, video tutorials, articles, PDF files, and analysis shared on this website are exclusively for informational and educational purposes. We do not provide buying/selling recommendations or portfolio tips. Stock market investments, swing trading, options and futures trading carry a high level of risk. Please consult a qualified financial advisor before making any transaction decisions.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} Dhan Vijeta. All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
            <Link to="/terms-conditions" className="hover:text-white transition">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
