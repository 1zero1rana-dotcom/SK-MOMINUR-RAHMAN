import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  X, 
  FileText, 
  MessageSquare,
  Lock,
  ChevronDown,
  Clock
} from "lucide-react";
import { 
  doc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  updateDoc,
  serverTimestamp 
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { cn } from "../lib/utils";
import ReactMarkdown from "react-markdown";

import { useAuth } from "../contexts/AuthContext";

export default function CoursePlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading, role } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedChapters, setExpandedChapters] = useState<string[]>([]);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      const settingsSnap = await getDoc(doc(db, "settings", "site"));
      if (settingsSnap.exists()) {
        setWhatsappNumber(settingsSnap.data().contactPhone || "");
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const checkAccess = async () => {
      if (!id || authLoading) return;
      
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const isAdmin = role === "admin";

        // Check enrollment for everyone (including admins so they can test progress)
        const q = query(
          collection(db, "enrollments"),
          where("userId", "==", user.uid),
          where("courseId", "==", id)
        );
        const enrollmentSnap = await getDocs(q);
        
        if (enrollmentSnap.empty) {
          if (!isAdmin) {
            navigate(`/course/${id}`);
            return;
          }
          // Admins don't need enrollment to view, but we'll try to find one if it exists
          setEnrollment(null);
        } else {
          const enrollmentDoc = enrollmentSnap.docs[0];
          setEnrollment({ id: enrollmentDoc.id, ...enrollmentDoc.data() });
        }
        
        setIsEnrolled(true);

        // Fetch course data
        const courseSnap = await getDoc(doc(db, "courses", id));
        if (courseSnap.exists()) {
          const courseData: any = { id: courseSnap.id, ...courseSnap.data() };
          setCourse(courseData);
          
          // Set initial lesson
          if (courseData.chapters?.length > 0 && courseData.chapters[0].lessons?.length > 0) {
            setActiveLesson(courseData.chapters[0].lessons[0]);
            setExpandedChapters([courseData.chapters[0].id]);
          }
        }
      } catch (error) {
        console.error("Error checking access:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [id, navigate, user, authLoading, role]);

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => 
      prev.includes(chapterId) 
        ? prev.filter(id => id !== chapterId) 
        : [...prev, chapterId]
    );
  };

  const markAsComplete = async (lessonId: string) => {
    if (!course || isMarkingComplete) return;
    
    // If no enrollment exists (e.g. for an admin who hasn't "enrolled"), create one
    let currentEnrollment = enrollment;
    if (!currentEnrollment) {
      try {
        const { addDoc, collection } = await import("firebase/firestore");
        const newEnrollment = {
          userId: user?.uid,
          courseId: id,
          enrolledAt: serverTimestamp(),
          progress: 0,
          status: "active",
          completedLessons: []
        };
        const docRef = await addDoc(collection(db, "enrollments"), newEnrollment);
        currentEnrollment = { id: docRef.id, ...newEnrollment };
        setEnrollment(currentEnrollment);
      } catch (error) {
        console.error("Error creating enrollment for admin:", error);
        return;
      }
    }

    const completedLessons = currentEnrollment.completedLessons || [];
    if (completedLessons.includes(lessonId)) return;

    setIsMarkingComplete(true);
    try {
      const newCompletedLessons = [...completedLessons, lessonId];
      
      // Calculate total lessons
      let totalLessons = 0;
      course.chapters?.forEach((c: any) => {
        totalLessons += c.lessons?.length || 0;
      });

      const progress = Math.round((newCompletedLessons.length / totalLessons) * 100);

      await updateDoc(doc(db, "enrollments", currentEnrollment.id), {
        completedLessons: newCompletedLessons,
        progress: progress,
        lastAccessed: serverTimestamp()
      });

      setEnrollment({
        ...currentEnrollment,
        completedLessons: newCompletedLessons,
        progress: progress
      });
    } catch (error) {
      console.error("Error marking lesson as complete:", error);
    } finally {
      setIsMarkingComplete(false);
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return enrollment?.completedLessons?.includes(lessonId);
  };

  const isLessonLocked = (lessonId: string) => {
    if (role === "admin") return false;
    if (!course) return true;
    
    // Find all lessons in order
    const allLessons: any[] = [];
    course.chapters?.forEach((c: any) => {
      c.lessons?.forEach((l: any) => {
        allLessons.push(l);
      });
    });

    const lessonIndex = allLessons.findIndex(l => l.id === lessonId);
    if (lessonIndex <= 0) return false; // First lesson is never locked

    // Check if the previous lesson is completed
    const previousLesson = allLessons[lessonIndex - 1];
    return !isLessonCompleted(previousLesson.id);
  };

  const goToNextLesson = () => {
    if (!course || !activeLesson) return;
    
    const allLessons: any[] = [];
    course.chapters?.forEach((c: any) => {
      c.lessons?.forEach((l: any) => {
        allLessons.push(l);
      });
    });

    const currentIndex = allLessons.findIndex(l => l.id === activeLesson.id);
    if (currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1];
      if (!isLessonLocked(nextLesson.id)) {
        setActiveLesson(nextLesson);
        // Ensure chapter is expanded
        const nextChapter = course.chapters.find((c: any) => c.lessons.some((l: any) => l.id === nextLesson.id));
        if (nextChapter && !expandedChapters.includes(nextChapter.id)) {
          setExpandedChapters(prev => [...prev, nextChapter.id]);
        }
      }
    }
  };

  const goToPreviousLesson = () => {
    if (!course || !activeLesson) return;
    
    const allLessons: any[] = [];
    course.chapters?.forEach((c: any) => {
      c.lessons?.forEach((l: any) => {
        allLessons.push(l);
      });
    });

    const currentIndex = allLessons.findIndex(l => l.id === activeLesson.id);
    if (currentIndex > 0) {
      setActiveLesson(allLessons[currentIndex - 1]);
    }
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    
    // YouTube
    const ytRegex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const ytMatch = url.match(ytRegex);
    if (ytMatch && ytMatch[2].length === 11) {
      return `https://www.youtube.com/embed/${ytMatch[2]}?autoplay=0&rel=0&modestbranding=1`;
    }

    // Vimeo
    const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?badge=0&autopause=0&player_id=0&app_id=58479`;
    }

    // Google Drive
    if (url.includes("drive.google.com")) {
      const fileIdMatch = url.match(/\/file\/d\/([^\/]+)/) || url.match(/id=([^\&]+)/);
      if (fileIdMatch) {
        return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
      }
    }

    // If it's already an embed URL, return it
    if (url.includes("/embed/") || url.includes("player.vimeo.com/video/") || url.includes("/preview")) {
      return url;
    }

    return url;
  };

  const isDirectVideo = (url: string) => {
    if (!url) return false;
    const lowerUrl = url.toLowerCase();
    
    // Known direct video extensions
    const directExtensions = [".mp4", ".webm", ".ogg", ".mov", ".m4v"];
    if (directExtensions.some(ext => lowerUrl.includes(ext))) {
      // Ensure it's not a YouTube/Vimeo link that happens to have these strings
      if (!lowerUrl.includes("youtube.com") && !lowerUrl.includes("youtu.be") && !lowerUrl.includes("vimeo.com")) {
        return true;
      }
    }
    
    // Firebase Storage
    if (lowerUrl.includes("firebasestorage.googleapis.com") && lowerUrl.includes("alt=media")) {
      return true;
    }

    // Blob URLs
    if (lowerUrl.startsWith("blob:")) {
      return true;
    }

    return false;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!course || !isEnrolled) return null;

  return (
    <div className="flex h-screen flex-col bg-gray-900 text-white overflow-hidden">
      {/* Top Bar */}
      <header className="flex h-16 items-center justify-between border-b border-gray-800 px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ChevronLeft className="h-5 w-5" />
            <span className="hidden sm:inline font-bold">Back to Dashboard</span>
          </Link>
          <div className="h-6 w-px bg-gray-800" />
          <h1 className="text-sm font-bold truncate max-w-[200px] sm:max-w-md">
            {course.title}
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <div className="h-2 w-32 rounded-full bg-gray-800 overflow-hidden">
              <div 
                className="h-full bg-indigo-500 transition-all duration-500" 
                style={{ width: `${enrollment?.progress || 0}%` }}
              />
            </div>
            <span className="text-xs font-bold text-gray-400">{enrollment?.progress || 0}% Complete</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg bg-gray-800 p-2 text-gray-400 hover:text-white transition-colors"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {/* Video Player Section */}
          <div className="bg-black aspect-video w-full relative group">
            {activeLesson?.videoUrl ? (
              isLessonLocked(activeLesson.id) ? (
                <div className="flex h-full w-full flex-col items-center justify-center bg-gray-900/80 backdrop-blur-sm">
                  <Lock className="h-16 w-16 text-indigo-500 mb-4" />
                  <h3 className="text-xl font-black text-white">Lesson Locked</h3>
                  <p className="mt-2 text-gray-400 font-medium">Complete the previous lesson to unlock this one.</p>
                </div>
              ) : isDirectVideo(activeLesson.videoUrl) ? (
                <video 
                  key={activeLesson.id}
                  controls 
                  controlsList="nodownload"
                  onContextMenu={(e) => e.preventDefault()}
                  onEnded={() => markAsComplete(activeLesson.id)}
                  className="h-full w-full"
                  poster={course.thumbnail}
                  autoPlay
                  playsInline
                >
                  <source src={activeLesson.videoUrl} type="video/mp4" />
                  <source src={activeLesson.videoUrl} type="video/webm" />
                  <source src={activeLesson.videoUrl} type="video/ogg" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <iframe
                  key={activeLesson.id}
                  src={getEmbedUrl(activeLesson.videoUrl)}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={activeLesson.title}
                />
              )
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-900">
                <div className="text-center">
                  <Play className="mx-auto h-12 w-12 text-gray-700" />
                  <p className="mt-4 text-gray-500 font-medium">No video available for this lesson</p>
                  <p className="text-xs text-gray-600 mt-2">Admins can add a video URL in the dashboard</p>
                </div>
              </div>
            )}
          </div>

          {/* Lesson Content Section */}
          <div className="mx-auto max-w-4xl p-6 lg:p-12">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-black text-white">{activeLesson?.title}</h2>
                <p className="mt-2 text-gray-400 font-medium">Chapter: {(course as any).chapters?.find((c: any) => c.lessons?.some((l: any) => l.id === activeLesson?.id))?.title}</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={goToPreviousLesson}
                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button 
                  onClick={() => markAsComplete(activeLesson.id)}
                  disabled={isMarkingComplete || isLessonCompleted(activeLesson.id) || isLessonLocked(activeLesson.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-6 py-3 font-bold text-white shadow-lg transition-all",
                    isLessonCompleted(activeLesson.id)
                      ? "bg-green-600 shadow-green-900/20"
                      : isLessonLocked(activeLesson.id)
                        ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                        : "bg-indigo-600 shadow-indigo-900/20 hover:bg-indigo-700"
                  )}
                >
                  {isLessonCompleted(activeLesson.id) ? (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Completed
                    </>
                  ) : isLessonLocked(activeLesson.id) ? (
                    <>
                      <Lock className="h-5 w-5" />
                      Locked
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5" />
                      {isMarkingComplete ? "Marking..." : "Mark as Complete"}
                    </>
                  )}
                </button>
                <button 
                  onClick={goToNextLesson}
                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              {activeLesson?.content ? (
                <ReactMarkdown>{activeLesson.content}</ReactMarkdown>
              ) : (
                <p className="text-gray-500 italic">No additional content for this lesson.</p>
              )}
            </div>

            {/* Discussion/Notes Tabs (Placeholder) */}
            <div className="mt-16 border-t border-gray-800 pt-12">
              <div className="flex gap-8 border-b border-gray-800 mb-8">
                <button className="pb-4 text-sm font-bold text-indigo-400 border-b-2 border-indigo-400">Discussion</button>
                <button className="pb-4 text-sm font-bold text-gray-500 hover:text-gray-300">Resources</button>
                <button className="pb-4 text-sm font-bold text-gray-500 hover:text-gray-300">Notes</button>
              </div>
              <div className="text-center py-12 bg-gray-800/30 rounded-3xl border border-gray-800">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-700 mb-4" />
                <p className="text-gray-500 font-medium">Join the discussion for this lesson</p>
                <button className="mt-4 text-indigo-400 font-bold hover:text-indigo-300">Post a comment</button>
              </div>
            </div>
          </div>
        </main>

        {/* Sidebar Curriculum */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 400, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="hidden lg:flex flex-col border-l border-gray-800 bg-gray-900 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-800">
                <h3 className="text-lg font-black">Course Content</h3>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="divide-y divide-gray-800">
                  {course.chapters?.map((chapter: any, idx: number) => (
                    <div key={chapter.id} className="bg-gray-900/50">
                      <button 
                        onClick={() => toggleChapter(chapter.id)}
                        className="flex w-full items-center justify-between p-4 px-6 text-left hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-gray-500">Section {idx + 1}</span>
                          <h4 className="font-bold text-sm truncate max-w-[200px]">{chapter.title}</h4>
                        </div>
                        <ChevronDown className={cn("h-4 w-4 text-gray-500 transition-transform", expandedChapters.includes(chapter.id) && "rotate-180")} />
                      </button>
                      
                      <AnimatePresence>
                        {expandedChapters.includes(chapter.id) && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            className="overflow-hidden bg-gray-950"
                          >
                            {chapter.lessons?.map((lesson: any) => (
                              <button
                                key={lesson.id}
                                onClick={() => {
                                  if (!isLessonLocked(lesson.id)) {
                                    setActiveLesson(lesson);
                                  }
                                }}
                                className={cn(
                                  "flex w-full items-center gap-4 p-4 px-8 text-left transition-all",
                                  activeLesson?.id === lesson.id 
                                    ? "bg-indigo-600/10 text-indigo-400 ring-l-4 ring-indigo-600" 
                                    : isLessonLocked(lesson.id)
                                      ? "opacity-50 cursor-not-allowed"
                                      : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                                )}
                              >
                                <div className={cn(
                                  "flex h-6 w-6 items-center justify-center rounded-full border",
                                  activeLesson?.id === lesson.id 
                                    ? "border-indigo-400 bg-indigo-400/20" 
                                    : isLessonCompleted(lesson.id)
                                      ? "border-green-500 bg-green-500/20"
                                      : isLessonLocked(lesson.id)
                                        ? "border-gray-800 bg-gray-900"
                                        : "border-gray-700"
                                )}>
                                  {isLessonCompleted(lesson.id) ? (
                                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                                  ) : isLessonLocked(lesson.id) ? (
                                    <Lock className="h-3 w-3 text-gray-600" />
                                  ) : (
                                    <Play className="h-3 w-3" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold truncate">{lesson.title}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Clock className="h-3 w-3" />
                                    <span className="text-[10px] font-medium">{lesson.duration || "10:00"}</span>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* WhatsApp Floating Button */}
      {whatsappNumber && (
        <a
          href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-transform hover:scale-110 active:scale-95"
          title="Chat on WhatsApp"
        >
          <svg
            viewBox="0 0 24 24"
            width="28"
            height="28"
            stroke="currentColor"
            strokeWidth="2"
            fill="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3z"></path>
          </svg>
        </a>
      )}
    </div>
  );
}
