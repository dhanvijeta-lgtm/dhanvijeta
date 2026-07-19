import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/authContext';
import { FaUserCircle, FaBars, FaTimes, FaWallet, FaHeart } from 'react-icons/fa';

export function Navbar({ onOpenLogin }) {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
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
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-white/5 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="Dhan Vijeta Logo"
            className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500">
              DHAN VIJETA
            </span>
            <span className="text-[10px] uppercase font-bold text-finance-emerald border border-finance-emerald/30 rounded px-1 py-0.5 tracking-wider hidden sm:inline">
              EdTech
            </span>
          </div>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-medium transition hover:text-finance-gold ${isActive ? 'text-finance-gold' : 'text-gray-300'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* AUTH BUTTONS / DROPDOWN */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link to="/my-batch" className="text-sm font-medium bg-finance-navy border border-white/10 hover:border-finance-gold text-white px-4 py-2 rounded-xl transition">
                My Batch
              </Link>
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition focus:outline-none"
                >
                  <FaUserCircle size={26} className="text-finance-gold" />
                  <span className="text-sm font-semibold max-w-[100px] truncate">{user.name}</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-finance-navy border border-white/10 rounded-xl py-2 shadow-xl z-50">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-finance-gold transition"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-finance-gold transition font-bold"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 hover:text-red-300 transition border-t border-white/5"
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
              className="bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-finance-dark text-sm font-bold px-6 py-2.5 rounded-xl shadow-gold-glow transition"
            >
              Sign In
            </button>
          )}
        </div>

        {/* MOBILE HAMBURGER BUTTON */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-300 hover:text-white transition p-1"
        >
          {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* MOBILE MENU PANEL */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[68px] left-0 right-0 bg-finance-dark/95 border-b border-white/5 flex flex-col p-6 gap-4 z-50 shadow-2xl backdrop-blur-lg">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `text-base font-semibold py-2 transition hover:text-finance-gold ${isActive ? 'text-finance-gold border-l-2 border-finance-gold pl-3' : 'text-gray-300'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {isLoggedIn ? (
            <div className="flex flex-col gap-4 border-t border-white/10 pt-4 mt-2">
              <Link
                to="/my-batch"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-finance-navy border border-white/10 text-white py-3 rounded-xl font-semibold"
              >
                My Batch
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-white/5 text-white py-3 rounded-xl font-semibold"
              >
                Dashboard
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center bg-finance-gold/10 text-finance-gold border border-finance-gold/20 py-3 rounded-xl font-bold"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-red-500/10 text-red-400 py-3 rounded-xl font-semibold hover:bg-red-500/20 transition"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                onOpenLogin();
                setMobileMenuOpen(false);
              }}
              className="w-full bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-finance-dark font-bold py-3 rounded-xl shadow-gold-glow mt-2"
            >
              Sign In
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
