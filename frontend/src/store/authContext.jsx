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
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token');
      const urlError = urlParams.get('error');

      if (urlError) {
        toast.error(`Authentication failed: ${decodeURIComponent(urlError)}`);
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (urlToken) {
        localStorage.setItem('accessToken', urlToken);
        window.history.replaceState({}, document.title, window.location.pathname);
        toast.success('Logged in successfully!');
      }

      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const profileRes = await client.get('/auth/profile');
          setUser(profileRes.data.data.user);
          
          try {
            const wishlistRes = await client.get('/wishlists');
            setWishlist(wishlistRes.data.data.map(c => c._id) || []);
          } catch (wErr) {
            console.warn('Wishlist restoration failed:', wErr.message);
          }
        } catch (err) {
          console.error('Session restoration failed:', err.message);
          localStorage.removeItem('accessToken');
        }
      }
      setLoading(false);
    };

    initializeAuth();

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
      
      try {
        const wishlistRes = await client.get('/wishlists');
        setWishlist(wishlistRes.data.data.map(c => c._id) || []);
      } catch (wErr) {
        console.warn('Could not fetch wishlist:', wErr);
      }

      toast.success(`Welcome back, ${userData.name || 'Trader'}!`);
      return { success: true, user: userData };
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || 'Login failed';
      toast.error(message);
      return { success: false, error: message, status: err.response?.status };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await client.post('/auth/register', { name, email, password });
      const { accessToken, user: userData } = res.data.data;
      
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        setUser(userData);
      }
      toast.success(`Welcome to Dhan Vijeta, ${userData?.name || 'User'}!`);
      return { success: true, user: userData };
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const resendVerification = async (email) => {
    try {
      const res = await client.post('/auth/resend-verification', { email });
      toast.success(res.data.message || 'Verification link sent to your email');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || 'Failed to send verification link';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const res = await client.post('/auth/forgot-password', { email });
      toast.success(res.data.message || 'If registered, a password reset link has been sent');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Password reset request failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const resetPassword = async (token, password) => {
    try {
      const res = await client.post('/auth/reset-password', { token, password });
      toast.success(res.data.message || 'Password reset successful! Please log in.');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || 'Failed to reset password';
      toast.error(message);
      return { success: false, error: message };
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

  const updateProfile = async (name, password, profilePicture) => {
    try {
      const res = await client.put('/auth/profile', { name, password, profilePicture });
      setUser(res.data.data.user);
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Profile update failed';
      toast.error(message);
      return { success: false, error: message };
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

  const googleLogin = async (tokenData) => {
    try {
      const payload = typeof tokenData === 'string' ? { idToken: tokenData, credential: tokenData } : tokenData;
      const res = await client.post('/auth/google', payload);
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
      return { success: true, user: userData };
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || 'Google authentication failed';
      toast.error(message);
      return { success: false, error: message };
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
        resendVerification,
        forgotPassword,
        resetPassword,
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
