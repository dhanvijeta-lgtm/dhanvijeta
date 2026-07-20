import React, { createContext, useState, useEffect, useContext } from 'react';
import client from '../api/client';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Restore session and fetch user wishlist on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const profileRes = await client.get('/auth/profile');
          setUser(profileRes.data.data.user);
          
          const wishlistRes = await client.get('/wishlists');
          setWishlist(wishlistRes.data.data.map(c => c._id) || []);
        } catch (err) {
          console.error('Session restoration failed:', err.message);
          localStorage.removeItem('accessToken');
        }
      }
      setLoading(false);
    };

    initializeAuth();

    // Listen to silent refresh failures
    const handleLogoutEvent = () => {
      setUser(null);
      setWishlist([]);
      toast.error('Session expired. Please log in again.');
    };
    window.addEventListener('auth-logout', handleLogoutEvent);
    return () => window.removeEventListener('auth-logout', handleLogoutEvent);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await client.post('/auth/login', { email, password });
      const { accessToken, user: userData } = res.data.data;
      
      localStorage.setItem('accessToken', accessToken);
      setUser(userData);
      
      // Fetch wishlist
      const wishlistRes = await client.get('/wishlists');
      setWishlist(wishlistRes.data.data.map(c => c._id) || []);

      toast.success('Welcome back!');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      await client.post('/auth/register', { name, email, password });
      toast.success('Registration successful! Please check your email for verification.');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = async () => {
    try {
      await client.post('/auth/logout');
    } catch (e) {
      console.warn('Backend logout failed', e);
    }
    localStorage.removeItem('accessToken');
    setUser(null);
    setWishlist([]);
    toast.success('Logged out successfully');
  };

  const updateProfile = async (name, password) => {
    try {
      const res = await client.put('/auth/profile', { name, password });
      setUser(res.data.data.user);
      toast.success('Profile updated successfully');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.error || 'Profile update failed');
      return false;
    }
  };

  const toggleWishlist = async (courseId) => {
    if (!user) {
      toast.error('Please log in to manage your wishlist');
      return;
    }

    const isWishlisted = wishlist.includes(courseId);
    try {
      if (isWishlisted) {
        await client.delete(`/wishlists/${courseId}`);
        setWishlist(prev => prev.filter(id => id !== courseId));
        toast.success('Course removed from wishlist');
      } else {
        await client.post('/wishlists', { courseId });
        setWishlist(prev => [...prev, courseId]);
        toast.success('Course added to wishlist');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update wishlist');
    }
  };

  const googleLogin = async (idToken) => {
    try {
      const res = await client.post('/auth/google', { idToken });
      const { accessToken, user: userData } = res.data.data;
      
      localStorage.setItem('accessToken', accessToken);
      setUser(userData);
      
      try {
        const wishlistRes = await client.get('/wishlists');
        setWishlist(wishlistRes.data.data.map(c => c._id) || []);
      } catch (wErr) {
        console.warn('Could not fetch wishlist:', wErr);
      }

      toast.success(`Welcome, ${userData.name}!`);
      return true;
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Google authentication failed');
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        wishlist,
        loading,
        isLoggedIn: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        googleLogin,
        logout,
        updateProfile,
        toggleWishlist
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
