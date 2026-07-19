import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import client from '../../api/client';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import { FaChevronDown, FaChevronUp, FaFilePdf, FaClipboardList, FaBullhorn, FaCheckCircle, FaRegCircle, FaAward } from 'react-icons/fa';
import toast from 'react-hot-toast';

export function LessonViewer() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeLesson, setActiveLesson] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [activeTab, setActiveTab] = useState('notes'); // notes | assignments | announcements

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

  // Set initial active lesson on load
  useEffect(() => {
    if (data?.course?.sections?.length > 0 && !activeLesson) {
      // Find first lesson of first section
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
        <div className="w-12 h-12 border-4 border-t-finance-gold border-finance-navy rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-20">
        <h3 className="text-lg font-bold text-finance-rose">Error loading batch content.</h3>
      </div>
    );
  }

  const { course, purchase, announcements } = data;
  const completedList = purchase?.progress?.completedLessons || [];

  const toggleSection = (id) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLessonEnd = () => {
    if (activeLesson && !completedList.includes(activeLesson._id)) {
      completeMutation.mutate(activeLesson._id);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      
      {/* LEFT COLUMN: PLAYER & RESOURCES */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Video Player */}
        {activeLesson ? (
          <VideoPlayer 
            src={activeLesson.videoStreamUrl} 
            onEnded={handleLessonEnd}
          />
        ) : (
          <div className="aspect-video bg-black rounded-2xl flex items-center justify-center text-gray-500 text-sm">
            Select a lesson from syllabus to play
          </div>
        )}

        {/* Lesson title and info */}
        {activeLesson && (
          <div className="space-y-2 border-b border-white/5 pb-4">
            <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
              {activeLesson.title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed">
              {activeLesson.description || 'No description provided for this lesson.'}
            </p>
          </div>
        )}

        {/* RESOURCE TABS SELECT ROW */}
        <div className="flex border-b border-white/5 select-none gap-2">
          {[
            { id: 'notes', label: 'PDF Worksheets & Notes', icon: <FaFilePdf /> },
            { id: 'assignments', label: 'Assignments', icon: <FaClipboardList /> },
            { id: 'announcements', label: 'Batch Board', icon: <FaBullhorn /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold transition border-b-2 whitespace-nowrap ${
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

        {/* RESOURCE DETAILS VIEW */}
        <div className="glass-card rounded-2xl p-6 border border-white/5 min-h-[150px]">
          
          {/* NOTES */}
          {activeTab === 'notes' && (
            <div>
              {activeLesson?.pdfUrl ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex gap-3 items-center">
                    <FaFilePdf size={28} className="text-red-500 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Lesson Study Notes</h4>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">PDF File Document</p>
                    </div>
                  </div>
                  <a 
                    href={activeLesson.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-finance-gold hover:bg-yellow-400 text-finance-dark text-xs font-black px-4 py-2.5 rounded-xl transition"
                  >
                    Open / Download Notes
                  </a>
                </div>
              ) : (
                <p className="text-xs text-gray-500 italic">No PDF worksheets loaded for this lesson. Use the video to take personal notes.</p>
              )}
            </div>
          )}

          {/* ASSIGNMENTS */}
          {activeTab === 'assignments' && (
            <div className="space-y-4">
              {activeLesson?.assignment ? (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white">Task Details</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{activeLesson.assignment}</p>
                  </div>
                  <button 
                    onClick={() => alert('Mock assignment submission successful!')}
                    className="bg-finance-navy border border-white/10 hover:border-finance-gold text-white text-xs font-bold px-4 py-2.5 rounded-xl transition"
                  >
                    Submit Assignment Work
                  </button>
                </div>
              ) : (
                <p className="text-xs text-gray-500 italic">No assignment tasks mapped to this lesson.</p>
              )}
            </div>
          )}

          {/* ANNOUNCEMENTS */}
          {activeTab === 'announcements' && (
            <div className="space-y-4">
              {!announcements || announcements.length === 0 ? (
                <p className="text-xs text-gray-500 italic">No recent announcements posted for this batch.</p>
              ) : (
                <div className="space-y-4 divide-y divide-white/5">
                  {announcements.map((item, idx) => (
                    <div key={item._id} className={`pt-4 first:pt-0 space-y-1.5`}>
                      <h4 className="text-sm font-bold text-finance-gold">{item.title}</h4>
                      <p className="text-xs text-gray-400 leading-relaxed font-light">{item.content}</p>
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
        <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-4">
          <div className="flex justify-between items-center text-xs font-bold text-gray-400">
            <span>Syllabus Progress</span>
            <span className="text-finance-gold">{purchase.completionPercentage}%</span>
          </div>
          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full"
              style={{ width: `${purchase.completionPercentage}%` }}
            ></div>
          </div>

          {purchase.completionPercentage === 100 && (
            <a 
              href={`/api/certificates/verify/DV-${course._id.toString().slice(-4).toUpperCase()}`}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-finance-emerald/10 border border-finance-emerald/20 text-finance-emerald font-black text-xs py-3 rounded-xl hover:bg-finance-emerald/20 transition"
            >
              <FaAward />
              <span>Collect Certificate</span>
            </a>
          )}
        </div>

        {/* Accordion Sections checklist */}
        <div className="space-y-3">
          {course.sections?.map((section) => {
            const isOpen = !!openSections[section._id];
            return (
              <div key={section._id} className="glass-card rounded-xl border border-white/5 overflow-hidden">
                <button
                  onClick={() => toggleSection(section._id)}
                  className="w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm bg-white/[0.01]"
                >
                  <span className="truncate pr-2">{section.title}</span>
                  {isOpen ? <FaChevronUp size={12} className="text-finance-gold" /> : <FaChevronDown size={12} className="text-finance-gold" />}
                </button>

                {isOpen && (
                  <div className="border-t border-white/5 divide-y divide-white/5">
                    {section.lessons?.map((lesson) => {
                      const isCompleted = completedList.includes(lesson._id);
                      const isActive = activeLesson?._id === lesson._id;

                      return (
                        <div 
                          key={lesson._id}
                          onClick={() => setActiveLesson(lesson)}
                          className={`p-3.5 pl-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition ${isActive ? 'bg-finance-gold/5' : ''}`}
                        >
                          <div className="flex gap-2.5 items-center truncate">
                            {/* Checkbox triggers complete */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!isCompleted) {
                                  completeMutation.mutate(lesson._id);
                                }
                              }}
                              className="text-gray-500 hover:text-finance-gold transition shrink-0"
                            >
                              {isCompleted ? (
                                <FaCheckCircle className="text-finance-emerald" size={16} />
                              ) : (
                                <FaRegCircle size={16} />
                              )}
                            </button>
                            <span className={`text-xs truncate font-medium ${isActive ? 'text-finance-gold font-bold' : 'text-gray-300'}`}>
                              {lesson.title}
                            </span>
                          </div>

                          <span className="text-[10px] text-gray-500 font-mono shrink-0">
                            {Math.round(lesson.videoDuration / 60)}m
                          </span>

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
  );
}

export default LessonViewer;
