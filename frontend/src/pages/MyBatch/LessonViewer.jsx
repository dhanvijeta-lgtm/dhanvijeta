import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import client from '../../api/client';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import {
  FaChevronDown,
  FaChevronUp,
  FaFilePdf,
  FaClipboardList,
  FaBullhorn,
  FaCheckCircle,
  FaRegCircle,
  FaAward,
  FaArrowLeft,
  FaArrowRight,
  FaSpinner,
  FaLock
} from 'react-icons/fa';
import toast from 'react-hot-toast';

export function LessonViewer() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeLesson, setActiveLesson] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [activeTab, setActiveTab] = useState('notes');

  // Fetch course details under My Batch
  const { data, isLoading, error } = useQuery({
    queryKey: ['batch-details', courseId],
    queryFn: async () => {
      try {
        const res = await client.get(`/my-batch/${courseId}`);
        return res.data.data;
      } catch (err) {
        if (err.response?.status === 403) {
          toast.error('You have not purchased this course yet.');
          navigate('/courses');
        }
        throw err;
      }
    }
  });

  // Fetch secure authorized video details from backend API
  const { data: videoData, isLoading: isVideoLoading, error: videoError } = useQuery({
    queryKey: ['authorized-video', courseId, activeLesson?._id],
    queryFn: async () => {
      if (!activeLesson?._id) return null;
      try {
        const res = await client.get(`/courses/${courseId}/lessons/${activeLesson._id}/video`);
        return res.data.data;
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load authorized video stream');
        throw err;
      }
    },
    enabled: !!activeLesson?._id
  });

  // Set initial active lesson on load
  useEffect(() => {
    if (data?.course?.sections?.length > 0 && !activeLesson) {
      const firstSection = data.course.sections[0];
      if (firstSection.lessons?.length > 0) {
        setActiveLesson(firstSection.lessons[0]);
        setOpenSections({ [firstSection._id]: true });
      }
    }
  }, [data, activeLesson]);

  // Complete lesson mutation
  const completeMutation = useMutation({
    mutationFn: async (lessonId) => {
      const res = await client.post(`/my-batch/${courseId}/lessons/${lessonId}/complete`);
      return res.data.data;
    },
    onSuccess: (resData) => {
      queryClient.invalidateQueries({ queryKey: ['batch-details', courseId] });
      toast.success('Progress updated!');
      if (resData.certificateIssued) {
        toast.success('Congratulations! You completed the course and earned a certificate.');
      }
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-amber-400 border-white/10 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-20 space-y-4">
        <h3 className="text-lg font-bold text-red-400">Error loading batch content.</h3>
        <Link to="/courses" className="inline-block bg-white/10 text-white px-4 py-2 rounded-xl text-xs font-bold">
          Return to Courses
        </Link>
      </div>
    );
  }

  const { course, purchase, announcements } = data;
  const completedList = purchase?.progress?.completedLessons || [];

  // Helper arrays for previous & next lesson navigation
  const allLessons = course.sections?.flatMap((s) => s.lessons) || [];
  const currentLessonIndex = allLessons.findIndex((l) => l._id === activeLesson?._id);
  const prevLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson =
    currentLessonIndex !== -1 && currentLessonIndex < allLessons.length - 1
      ? allLessons[currentLessonIndex + 1]
      : null;

  const toggleSection = (id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLessonEnd = () => {
    if (activeLesson && !completedList.includes(activeLesson._id)) {
      completeMutation.mutate(activeLesson._id);
    }
  };

  const isCurrentCompleted = completedList.includes(activeLesson?._id);

  return (
    <div className="space-y-6">
      {/* BREADCRUMB & BACK HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/my-batch"
            className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-amber-400 transition bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl"
          >
            <FaArrowLeft size={12} />
            <span>My Batches</span>
          </Link>
          <span className="text-gray-600">/</span>
          <span className="text-xs font-bold text-white max-w-[200px] sm:max-w-md truncate">{course.title}</span>
        </div>

        {activeLesson && (
          <span className="text-[11px] font-mono text-amber-400 font-bold bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full">
            Lesson {currentLessonIndex + 1} of {allLessons.length}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* LEFT COLUMN: FULL-SCREEN CINEMATIC PLAYER & CONTROLS */}
        <div className="lg:col-span-2 space-y-6">
          {/* Authorized Video Player Container */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/10">
            {isVideoLoading ? (
              <div className="aspect-video flex flex-col items-center justify-center gap-3 text-amber-400">
                <FaSpinner className="animate-spin text-3xl" />
                <span className="text-xs font-mono tracking-wider">AUTHORIZING SECURE STREAM...</span>
              </div>
            ) : videoError ? (
              <div className="aspect-video flex flex-col items-center justify-center p-6 text-center space-y-3 bg-red-500/10">
                <FaLock className="text-red-400 text-3xl mx-auto" />
                <h4 className="text-sm font-bold text-white">Video Access Denied</h4>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  {videoError.response?.data?.message || 'You must purchase this course to unlock video streaming.'}
                </p>
              </div>
            ) : activeLesson ? (
              <VideoPlayer
                src={videoData?.embedUrl || videoData?.videoUrl || activeLesson.videoStreamUrl}
                provider={videoData?.provider || activeLesson.videoProvider}
                fileId={videoData?.fileId || activeLesson.googleDriveFileId}
                poster={activeLesson.thumbnail}
                onEnded={handleLessonEnd}
              />
            ) : (
              <div className="aspect-video flex items-center justify-center text-gray-500 text-sm">
                Select a lesson from syllabus to play
              </div>
            )}
          </div>

          {/* PLAYER BOTTOM CONTROLS STRIP (Prev, Mark Complete, Next) */}
          {activeLesson && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#090d16] border border-white/10 rounded-2xl">
              <button
                disabled={!prevLesson}
                onClick={() => prevLesson && setActiveLesson(prevLesson)}
                className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <FaArrowLeft size={12} />
                <span>Previous Lesson</span>
              </button>

              <button
                onClick={() => completeMutation.mutate(activeLesson._id)}
                disabled={completeMutation.isPending}
                className={`flex items-center gap-2 text-xs font-black px-5 py-2.5 rounded-xl transition shadow-md ${
                  isCurrentCompleted
                    ? 'bg-emerald-500/20 text-[#00e5a0] border border-[#00e5a0]/30'
                    : 'bg-gradient-to-r from-amber-500 to-yellow-400 text-[#030710] hover:scale-105'
                }`}
              >
                <FaCheckCircle size={14} />
                <span>{isCurrentCompleted ? 'Completed ✓' : 'Mark as Complete'}</span>
              </button>

              <button
                disabled={!nextLesson}
                onClick={() => nextLesson && setActiveLesson(nextLesson)}
                className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <span>Next Lesson</span>
                <FaArrowRight size={12} />
              </button>
            </div>
          )}

          {/* Lesson title and info */}
          {activeLesson && (
            <div className="space-y-2 border-b border-white/10 pb-4">
              <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">{activeLesson.title}</h2>
              <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
                {activeLesson.description || 'No description provided for this lesson.'}
              </p>
            </div>
          )}

          {/* RESOURCE TABS */}
          <div className="flex border-b border-white/10 select-none gap-2">
            {[
              { id: 'notes', label: 'PDF Worksheets & Notes', icon: <FaFilePdf /> },
              { id: 'assignments', label: 'Assignments', icon: <FaClipboardList /> },
              { id: 'announcements', label: 'Batch Board', icon: <FaBullhorn /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold transition border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-amber-400 border-amber-400'
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* RESOURCE DETAILS VIEW */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 min-h-[150px]">
            {activeTab === 'notes' && (
              <div>
                {activeLesson?.pdfUrl ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex gap-3 items-center">
                      <FaFilePdf size={28} className="text-red-500 shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-white">Lesson Study Notes</h4>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                          PDF File Document
                        </p>
                      </div>
                    </div>
                    <a
                      href={activeLesson.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-amber-400 hover:bg-yellow-300 text-[#030710] text-xs font-black px-4 py-2.5 rounded-xl transition"
                    >
                      Open / Download Notes
                    </a>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">
                    No PDF worksheets loaded for this lesson. Use the video to take personal notes.
                  </p>
                )}
              </div>
            )}

            {activeTab === 'assignments' && (
              <div className="space-y-4">
                {activeLesson?.assignment ? (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">Task Details</h4>
                      <p className="text-xs text-gray-300 leading-relaxed">{activeLesson.assignment}</p>
                    </div>
                    <button
                      onClick={() => alert('Assignment submission recorded successfully!')}
                      className="bg-[#090d16] border border-white/10 hover:border-amber-400 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition"
                    >
                      Submit Assignment Work
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">No assignment tasks mapped to this lesson.</p>
                )}
              </div>
            )}

            {activeTab === 'announcements' && (
              <div className="space-y-4">
                {!announcements || announcements.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No recent announcements posted for this batch.</p>
                ) : (
                  <div className="space-y-4 divide-y divide-white/10">
                    {announcements.map((item) => (
                      <div key={item._id} className="pt-4 first:pt-0 space-y-1.5">
                        <h4 className="text-sm font-bold text-amber-400">{item.title}</h4>
                        <p className="text-xs text-gray-300 leading-relaxed font-light">{item.content}</p>
                        <span className="text-[10px] text-gray-500 font-mono block">
                          Posted: {new Date(item.createdAt).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: SYLLABUS LISTING */}
        <div className="lg:col-span-1 space-y-6">
          {/* Progress Metrics Panel */}
          <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4">
            <div className="flex justify-between items-center text-xs font-bold text-gray-400">
              <span>Syllabus Progress</span>
              <span className="text-amber-400">{purchase.completionPercentage}%</span>
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
              <div
                className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${purchase.completionPercentage}%` }}
              ></div>
            </div>

            {purchase.completionPercentage === 100 && (
              <a
                href={`/api/certificates/verify/DV-${course._id.toString().slice(-4).toUpperCase()}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#00e5a0]/10 border border-[#00e5a0]/30 text-[#00e5a0] font-black text-xs py-3 rounded-xl hover:bg-[#00e5a0]/20 transition shadow-lg"
              >
                <FaAward size={16} />
                <span>Collect Certificate</span>
              </a>
            )}
          </div>

          {/* Accordion Sections checklist */}
          <div className="space-y-3">
            {course.sections?.map((section) => {
              const isOpen = !!openSections[section._id];
              return (
                <div key={section._id} className="glass-card rounded-xl border border-white/10 overflow-hidden">
                  <button
                    onClick={() => toggleSection(section._id)}
                    className="w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm bg-white/[0.02]"
                  >
                    <span className="truncate pr-2">{section.title}</span>
                    {isOpen ? (
                      <FaChevronUp size={12} className="text-amber-400" />
                    ) : (
                      <FaChevronDown size={12} className="text-amber-400" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="border-t border-white/10 divide-y divide-white/5">
                      {section.lessons?.map((lesson) => {
                        const isCompleted = completedList.includes(lesson._id);
                        const isActive = activeLesson?._id === lesson._id;

                        return (
                          <div
                            key={lesson._id}
                            onClick={() => setActiveLesson(lesson)}
                            className={`p-3.5 pl-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition ${
                              isActive ? 'bg-amber-500/10 border-l-2 border-amber-400' : ''
                            }`}
                          >
                            <div className="flex gap-2.5 items-center truncate">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!isCompleted) {
                                    completeMutation.mutate(lesson._id);
                                  }
                                }}
                                className="text-gray-500 hover:text-amber-400 transition shrink-0"
                              >
                                {isCompleted ? (
                                  <FaCheckCircle className="text-[#00e5a0]" size={16} />
                                ) : (
                                  <FaRegCircle size={16} />
                                )}
                              </button>
                              <span
                                className={`text-xs truncate font-medium ${
                                  isActive ? 'text-amber-400 font-bold' : 'text-gray-300'
                                }`}
                              >
                                {lesson.title}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {lesson.isPreview && (
                                <span className="text-[9px] font-bold text-[#00e5a0] bg-[#00e5a0]/10 border border-[#00e5a0]/20 px-1.5 py-0.5 rounded">
                                  FREE
                                </span>
                              )}
                              <span className="text-[10px] text-gray-500 font-mono">
                                {Math.round(lesson.videoDuration / 60)}m
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LessonViewer;
