import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './store/authContext';
import { MotionProvider } from './store/MotionContext';

// Components
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import LoginModal from './components/LoginModal/LoginModal';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import AnimatedMarketBackground from './components/AnimatedMarketBackground/AnimatedMarketBackground';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import PageTransition from './components/PageTransition/PageTransition';

// Pages
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import DemoVideos from './pages/DemoVideos';
import About from './pages/About';
import Contact from './pages/Contact';
import BlogList from './pages/Blog/BlogList';
import BlogDetails from './pages/Blog/BlogDetails';
import StudentDashboard from './pages/Dashboard/StudentDashboard';
import CourseDashboard from './pages/MyBatch/CourseDashboard';
import LessonViewer from './pages/MyBatch/LessonViewer';
import AdminDashboard from './pages/Admin/AdminDashboard';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

function LayoutWrapper() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const location = useLocation();

  // Watch for auth redirects redirecting with state openLogin
  useEffect(() => {
    if (location.state?.openLogin) {
      setIsLoginOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-white relative selection:bg-amber-500/30 selection:text-amber-300">
      {/* Global Cinematic Animated Background System */}
      <AnimatedMarketBackground forceAuthMode={isLoginOpen} />

      {/* Primary Navigation */}
      <Navbar onOpenLogin={() => setIsLoginOpen(true)} />

      {/* Main App Route Container with Page Transitions */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <PageTransition>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:slug" element={<CourseDetails onOpenLogin={() => setIsLoginOpen(true)} />} />
            <Route path="/demo-videos" element={<DemoVideos />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogDetails />} />

            {/* Auth Flow Pages */}
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Student Dashboards */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-batch"
              element={
                <ProtectedRoute>
                  <CourseDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-batch/:courseId"
              element={
                <ProtectedRoute>
                  <LessonViewer />
                </ProtectedRoute>
              }
            />

            {/* Admin Dashboard */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
      </main>

      {/* Footer */}
      <Footer />

      {/* Auth overlay modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}

export function App() {
  const googleClientId =
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    '48923631189-ae386sergrd5vftp2uc15hn4q9jbh225.apps.googleusercontent.com';

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <MotionProvider>
              <LoadingScreen />
              <LayoutWrapper />
              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    background: '#090d16',
                    color: '#fff',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                  },
                }}
              />
            </MotionProvider>
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
