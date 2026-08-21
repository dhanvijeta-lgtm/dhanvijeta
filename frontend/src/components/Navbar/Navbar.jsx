import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../store/authContext';
import { FaUserCircle, FaBars, FaTimes, FaArrowRight, FaShieldAlt } from 'react-icons/fa';

export function Navbar({ onOpenLogin }) {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/courses', label: 'Courses' },
    { path: '/demo-videos', label: 'Demo Videos' },
    { path: '/blog', label: 'Blog' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ];

  return (
    <nav className="sticky top-0 z-40 w-full bg-[#030710]/80 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative p-1.5 rounded-xl bg-white/5 border border-white/10 group-hover:border-amber-400/40 transition">
            <img
              src="/logo.png"
              alt="Dhan Vijeta Logo"
              className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-black tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              DHAN VIJETA
            </span>
            <span className="text-[10px] uppercase font-bold text-[#00e5a0] bg-[#00e5a0]/10 border border-[#00e5a0]/30 rounded px-1.5 py-0.5 tracking-wider hidden sm:inline-block">
              EdTech
            </span>
          </div>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-medium transition-all duration-200 relative py-1 ${
                  isActive
                    ? 'text-amber-400 font-semibold'
                    : 'text-gray-300 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* DESKTOP AUTH BUTTONS / DROPDOWN */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link
                to="/my-batch"
                className="text-xs font-bold uppercase tracking-wider bg-white/5 hover:bg-white/10 border border-white/15 hover:border-amber-400 text-white px-4 py-2 rounded-xl transition duration-300 shadow-md"
              >
                My Batch
              </Link>
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 bg-[#090d16] border border-white/10 hover:border-amber-400/50 px-3 py-1.5 rounded-xl text-gray-300 hover:text-white transition focus:outline-none"
                >
                  <FaUserCircle size={22} className="text-amber-400" />
                  <span className="text-xs font-bold max-w-[110px] truncate">{user?.name}</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-52 bg-[#090d16] border border-white/15 rounded-2xl py-2 shadow-2xl z-50 backdrop-blur-2xl">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2.5 text-xs font-semibold text-gray-300 hover:bg-white/5 hover:text-amber-400 transition"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2.5 text-xs font-bold text-amber-400 hover:bg-white/5 transition flex items-center justify-between"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <span>Admin Panel</span>
                        <FaShieldAlt size={12} />
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-red-400 hover:bg-white/5 hover:text-red-300 transition border-t border-white/10 mt-1"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="group relative bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 hover:from-amber-500 hover:to-yellow-300 text-[#030710] text-xs font-black uppercase tracking-wider px-6 py-2.5 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all duration-300 transform hover:scale-[1.03] active:scale-95"
            >
              Sign In
            </button>
          )}
        </div>

        {/* MOBILE HAMBURGER TOGGLE */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-300 hover:text-white p-2 rounded-xl bg-white/5 border border-white/10 transition"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <FaTimes size={20} className="text-amber-400" /> : <FaBars size={20} />}
        </button>
      </div>

      {/* FULL-SCREEN CINEMATIC MOBILE NAVIGATION PANEL */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-[65px] h-[calc(100vh-65px)] z-50 bg-[#030710]/95 backdrop-blur-2xl flex flex-col justify-between p-6 overflow-y-auto md:hidden"
          >
            {/* Background Particle Spots */}
            <div className="absolute top-1/4 right-5 w-60 h-60 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-5 w-60 h-60 bg-[#00e5a0]/10 rounded-full blur-[100px] pointer-events-none" />

            {/* STAGGERED NAV LINKS */}
            <div className="flex flex-col gap-3 relative z-10 pt-4">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gray-500 pb-2">
                NAVIGATION MENU
              </span>
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 + 0.1, duration: 0.3 }}
                >
                  <NavLink
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between text-xl font-bold py-3 px-4 rounded-xl transition ${
                        isActive
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'text-gray-200 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    <span>{link.label}</span>
                    <FaArrowRight size={14} className="opacity-40" />
                  </NavLink>
                </motion.div>
              ))}
            </div>

            {/* MOBILE AUTH / USER SECTION */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="relative z-10 pt-6 border-t border-white/10 flex flex-col gap-3 mt-6"
            >
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 mb-2">
                    <FaUserCircle size={32} className="text-amber-400" />
                    <div>
                      <div className="text-sm font-bold text-white">{user?.name}</div>
                      <div className="text-[11px] text-gray-400 font-mono">{user?.email}</div>
                    </div>
                  </div>
                  <Link
                    to="/my-batch"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold py-3.5 rounded-xl uppercase text-xs tracking-wider"
                  >
                    My Batch
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center bg-white/5 border border-white/10 text-white font-bold py-3.5 rounded-xl uppercase text-xs tracking-wider"
                  >
                    Dashboard
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center bg-emerald-500/10 border border-emerald-500/30 text-[#00e5a0] font-bold py-3.5 rounded-xl uppercase text-xs tracking-wider"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-500/10 border border-red-500/20 text-red-400 font-bold py-3.5 rounded-xl uppercase text-xs tracking-wider mt-2"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    onOpenLogin();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 text-[#030710] font-black py-4 rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.5)] uppercase tracking-wider text-sm"
                >
                  Sign In
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
