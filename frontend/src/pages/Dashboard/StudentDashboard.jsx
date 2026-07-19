import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import client from '../../api/client';
import { useAuth } from '../../store/authContext';
import { FaGraduationCap, FaAward, FaCalendarAlt, FaBell, FaUser, FaLock, FaKey, FaHistory } from 'react-icons/fa';
import toast from 'react-hot-toast';

export function StudentDashboard() {
  const { user, updateProfile } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('courses'); // courses | notifications | payments | settings

  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePassword, setProfilePassword] = useState('');

  // 1. Fetch Enrolled Courses & Progress
  const { data: purchases, isLoading: loadingPurchases } = useQuery({
    queryKey: ['my-purchases'],
    queryFn: async () => {
      const res = await client.get('/my-batch');
      return res.data.data;
    }
  });

  // 2. Fetch Notification List
  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await client.get('/notifications');
      return res.data.data;
    }
  });

  // 3. Fetch Transaction logs
  const { data: payments } = useQuery({
    queryKey: ['payment-history'],
    queryFn: async () => {
      const res = await client.get('/payments/history');
      return res.data.data;
    }
  });

  // 4. Mark notifications read mutation
  const markReadMutation = useMutation({
    mutationFn: async () => {
      await client.put('/notifications/read-all');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const handleUpdateProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileName) return;
    const success = await updateProfile(profileName, profilePassword || undefined);
    if (success) {
      setProfilePassword('');
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      
      {/* PROFILE WELCOME CARD */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-emerald-glow">
        <div className="flex gap-4 items-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-finance-gold to-finance-slate flex items-center justify-center text-finance-dark text-2xl font-black">
            {user?.name?.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">{user?.name}</h1>
            <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
            <span className="inline-block mt-2 text-[10px] uppercase font-bold text-finance-gold bg-finance-gold/10 border border-finance-gold/20 px-2 py-0.5 rounded">
              Active Member
            </span>
          </div>
        </div>

        {/* Streak details */}
        <div className="flex gap-6 shrink-0 border-t sm:border-t-0 sm:border-l border-white/5 pt-4 sm:pt-0 sm:pl-6 w-full sm:w-auto">
          <div className="text-center">
            <span className="block text-2xl font-extrabold text-finance-emerald">🔥 {user?.streakCount || 1}</span>
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Learning Streak</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl font-extrabold text-white">{(purchases || []).length}</span>
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Courses Active</span>
          </div>
        </div>
      </div>

      {/* TABS SELECT ROW */}
      <div className="flex border-b border-white/5 overflow-x-auto pb-1 scrollbar-none gap-2 select-none">
        {[
          { id: 'courses', label: 'My Enrolled Courses', icon: <FaGraduationCap /> },
          { id: 'notifications', label: 'Notifications', icon: <FaBell /> },
          { id: 'payments', label: 'Payment Ledger', icon: <FaHistory /> },
          { id: 'settings', label: 'Settings', icon: <FaUser /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              if (tab.id === 'notifications') markReadMutation.mutate();
            }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-finance-gold border-finance-gold'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* DETAILS VIEW COMPONENT */}
      <div>
        
        {/* COURSES TAB */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            {loadingPurchases ? (
              <div className="h-40 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-t-finance-gold border-finance-navy rounded-full animate-spin"></div>
              </div>
            ) : !purchases || purchases.length === 0 ? (
              <div className="text-center py-12 bg-finance-navy/10 border border-white/5 rounded-2xl p-6 max-w-xl mx-auto">
                <h3 className="text-lg font-bold text-gray-400 mb-2">No Active Enrollments</h3>
                <p className="text-xs text-gray-500 mb-4">You have not bought any courses yet. Browse catalog to start.</p>
                <a href="/courses" className="inline-block bg-finance-gold text-finance-dark font-bold text-xs px-4 py-2 rounded-xl">
                  Explore Courses
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {purchases.map((purchase) => {
                  const course = purchase.courseId;
                  if (!course) return null;
                  return (
                    <div key={purchase._id} className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col justify-between space-y-4">
                      <div className="flex gap-4">
                        <div className="w-20 aspect-video rounded-lg bg-finance-navy overflow-hidden shrink-0">
                          {course.thumbnail ? (
                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-[10px] text-gray-500 font-bold uppercase">{course.category}</div>
                          )}
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase bg-finance-gold/10 text-finance-gold border border-finance-gold/20 px-2 py-0.5 rounded font-bold">
                            {course.category}
                          </span>
                          <h3 className="font-extrabold text-sm text-white line-clamp-1">{course.title}</h3>
                          <span className="text-[10px] text-gray-500">Duration: {course.duration}</span>
                        </div>
                      </div>

                      {/* Progress slider bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-bold text-gray-400">
                          <span>Progress</span>
                          <span className="text-finance-gold">{purchase.completionPercentage}%</span>
                        </div>
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-300"
                            style={{ width: `${purchase.completionPercentage}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        {/* Certificate link */}
                        {purchase.completionPercentage === 100 ? (
                          <a
                            href={`/api/certificates/verify/DV-${course._id.toString().slice(-4).toUpperCase()}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-[11px] font-bold text-finance-emerald hover:underline"
                          >
                            <FaAward />
                            <span>Download Certificate</span>
                          </a>
                        ) : (
                          <span className="text-[10px] text-gray-500">Certificate unlocks at 100%</span>
                        )}
                        <a
                          href={`/my-batch/${course._id}`}
                          className="bg-finance-gold hover:bg-yellow-400 text-finance-dark text-xs font-black px-4 py-2 rounded-xl transition"
                        >
                          Study Now
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div className="glass-card rounded-2xl border border-white/5 p-6 max-w-xl mx-auto space-y-4">
            <h3 className="text-base font-bold text-white mb-2">Notification Inbox</h3>
            {!notifications || notifications.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-6">Your inbox is clean. No notifications found.</p>
            ) : (
              <div className="divide-y divide-white/5">
                {notifications.map((notif) => (
                  <div key={notif._id} className="py-4 first:pt-0 last:pb-0 flex justify-between gap-4">
                    <div className="space-y-1">
                      <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded border ${
                        notif.type === 'PaymentSuccess' 
                          ? 'bg-finance-emerald/10 text-finance-emerald border-finance-emerald/20' 
                          : notif.type === 'CourseUpdated'
                          ? 'bg-finance-gold/10 text-finance-gold border-finance-gold/20'
                          : 'bg-white/5 text-gray-400 border-white/10'
                      }`}>
                        {notif.type}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-white">{notif.title}</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">{notif.content}</p>
                    </div>
                    <span className="text-[9px] text-gray-500 font-mono self-start mt-1 whitespace-nowrap">
                      {formatDate(notif.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PAYMENTS TAB */}
        {activeTab === 'payments' && (
          <div className="glass-card rounded-2xl border border-white/5 p-6 max-w-2xl mx-auto overflow-hidden">
            <h3 className="text-base font-bold text-white mb-4">Payment Ledger</h3>
            {!payments || payments.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-6">No transaction records found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-gray-500 font-bold uppercase tracking-wider">
                      <th className="pb-3">Course</th>
                      <th className="pb-3">Transaction ID</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {payments.map((pay) => (
                      <tr key={pay._id} className="text-gray-300">
                        <td className="py-3 font-semibold text-white max-w-[120px] truncate">{pay.courseId?.title || 'Course'}</td>
                        <td className="py-3 font-mono text-[10px] text-gray-500">{pay.paymentId || 'Pending'}</td>
                        <td className="py-3 font-semibold text-white">₹{pay.amount.toLocaleString('en-IN')}</td>
                        <td className="py-3 text-gray-400">{formatDate(pay.createdAt)}</td>
                        <td className="py-3 text-right">
                          <span className={`inline-block text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${
                            pay.status === 'captured'
                              ? 'bg-finance-emerald/10 text-finance-emerald border-finance-emerald/20'
                              : 'bg-finance-rose/10 text-finance-rose border-finance-rose/20'
                          }`}>
                            {pay.status === 'captured' ? 'SUCCESS' : 'FAILED'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="glass-card rounded-2xl border border-white/5 p-8 max-w-md mx-auto space-y-6">
            <h3 className="text-base font-bold text-white mb-2">Account Settings</h3>
            
            <form onSubmit={handleUpdateProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-3.5 text-gray-500" />
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-finance-gold transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Update Password (Optional)</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-3.5 text-gray-500" />
                  <input
                    type="password"
                    placeholder="Set new password"
                    value={profilePassword}
                    onChange={(e) => setProfilePassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-finance-gold transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-finance-dark font-extrabold py-3.5 rounded-xl transition shadow-gold-glow mt-2"
              >
                Save Profile Changes
              </button>
            </form>
          </div>
        )}

      </div>

    </div>
  );
}

export default StudentDashboard;
