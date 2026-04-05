import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Play, CheckCircle2, Users, BookOpen, Star, Clock, ChevronRight, Lock, Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "../lib/utils";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [activeChapter, setActiveChapter] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "courses", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const courseData: any = { id: docSnap.id, ...docSnap.data() };
          setCourse(courseData);
          if (courseData.chapters?.length > 0) {
            setActiveChapter(courseData.chapters[0].id);
          }
        }

        // Check enrollment if user is logged in
        if (auth.currentUser) {
          const q = query(
            collection(db, "enrollments"), 
            where("userId", "==", auth.currentUser.uid),
            where("courseId", "==", id),
            where("status", "==", "active")
          );
          const enrollmentSnap = await getDocs(q);
          setIsEnrolled(!enrollmentSnap.empty);
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!course) {
    return <div className="py-24 text-center text-4xl font-black">Course Not Found</div>;
  }

  return (
    <main className="bg-gray-50 pb-24">
      {/* Hero Section */}
      <section className="bg-indigo-900 py-16 text-white lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-4 py-1 text-sm font-semibold text-indigo-200 ring-1 ring-inset ring-indigo-500/30">
                HSC ICT Academic
              </div>
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                {course.title}
              </h1>
              <p className="max-w-xl text-lg text-indigo-100">
                {course.description}
              </p>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2 text-sm font-medium text-indigo-200">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  4.9 (12.5k reviews)
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-indigo-200">
                  <Users className="h-5 w-5 text-indigo-400" />
                  {course.studentsCount || 0} Students
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-indigo-200">
                  <BookOpen className="h-5 w-5 text-indigo-400" />
                  {course.chapters?.reduce((acc: number, ch: any) => acc + (ch.lessons?.length || 0), 0)} Lessons
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-indigo-200">
                  <Clock className="h-5 w-5 text-indigo-400" />
                  {(() => {
                    const totalSeconds = course.chapters?.reduce((acc: number, ch: any) => {
                      return acc + (ch.lessons?.reduce((lAcc: number, l: any) => {
                        const d = l.duration || "0:00";
                        const parts = d.split(":");
                        let s = 0;
                        if (parts.length === 2) {
                          s = parseInt(parts[0]) * 60 + parseInt(parts[1]);
                        } else if (parts.length === 1) {
                          s = parseInt(parts[0]) * 60;
                        }
                        return lAcc + (isNaN(s) ? 0 : s);
                      }, 0) || 0);
                    }, 0) || 0;
                    const h = Math.floor(totalSeconds / 3600);
                    const m = Math.floor((totalSeconds % 3600) / 60);
                    return h > 0 ? `${h}h ${m}m` : `${m}m`;
                  })()} Total
                </div>
              </div>
              <div className="flex items-center gap-4">
                <img
                  src={course.instructorAvatar || "https://i.pravatar.cc/150?u=rana"}
                  alt={course.instructorName || "Instructor"}
                  className="h-12 w-12 rounded-full border-2 border-indigo-500"
                />
                <div>
                  <p className="text-sm font-bold text-white">Instructor</p>
                  <p className="text-lg font-black text-indigo-300">{course.instructorName || "Rana Sir"}</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-video overflow-hidden rounded-3xl bg-indigo-800 shadow-2xl ring-1 ring-white/10">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="h-full w-full object-cover opacity-50"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="group relative flex h-20 w-20 items-center justify-center rounded-full bg-white text-indigo-600 shadow-xl transition-transform hover:scale-110">
                    <Play className="h-8 w-8 fill-current" />
                    <span className="absolute -inset-4 animate-ping rounded-full bg-white/20" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* What you'll learn */}
              <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
                <h2 className="mb-6 text-2xl font-black text-gray-900">What you'll learn</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    "All 6 chapters of HSC ICT",
                    "C Programming from scratch",
                    "HTML & Web Design basics",
                    "Number system conversions",
                    "Logic gate implementations",
                    "Database Management (SQL)",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 text-gray-600">
                      <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                      <span className="text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Content */}
              <div>
                <h2 className="mb-6 text-2xl font-black text-gray-900">Course Content</h2>
                <div className="space-y-4">
                  {course.chapters?.map((chapter: any, idx: number) => (
                    <div
                      key={chapter.id}
                      className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100"
                    >
                      <button
                        onClick={() => setActiveChapter(activeChapter === chapter.id ? null : chapter.id)}
                        className="flex w-full items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold">
                            {idx + 1}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{chapter.title}</h3>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              {chapter.lessons?.length || 0} Lessons
                            </p>
                          </div>
                        </div>
                        <ChevronRight className={cn("h-5 w-5 text-gray-400 transition-transform", activeChapter === chapter.id && "rotate-90")} />
                      </button>
                      
                      <AnimatePresence>
                        {activeChapter === chapter.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-t border-gray-50"
                          >
                            <div className="divide-y divide-gray-50">
                              {chapter.lessons?.map((lesson: any) => (
                                <div key={lesson.id} className="flex items-center justify-between p-4 px-6 hover:bg-gray-50">
                                  <div className="flex items-center gap-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                                      <Play className="h-4 w-4" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-bold text-gray-700">{lesson.title}</p>
                                      <p className="text-xs font-medium text-gray-400">{lesson.duration || "10:00"}</p>
                                    </div>
                                  </div>
                                  {lesson.isFree ? (
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-green-600 bg-green-50 px-2 py-1 rounded">Free</span>
                                  ) : (
                                    <Lock className="h-4 w-4 text-gray-300" />
                                  )}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6">
                <div className="overflow-hidden rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
                  <div className="mb-6 flex items-baseline gap-2">
                    <span className="text-4xl font-black text-gray-900">৳{course.price}</span>
                    <span className="text-lg font-bold text-gray-400 line-through">৳2,500</span>
                    <span className="ml-auto rounded-lg bg-red-50 px-2 py-1 text-xs font-bold text-red-600">40% OFF</span>
                  </div>
                  
                  {isEnrolled ? (
                    <Link 
                      to={`/course/${course.id}/learn`}
                      className="mb-4 block w-full rounded-2xl bg-green-600 py-4 text-center text-lg font-bold text-white shadow-lg shadow-green-200 transition-all hover:bg-green-700 hover:shadow-green-300"
                    >
                      Go to Course
                    </Link>
                  ) : (
                    <Link 
                      to={`/course/${course.id}/pay`}
                      className="mb-4 block w-full rounded-2xl bg-indigo-600 py-4 text-center text-lg font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-indigo-300"
                    >
                      Enroll Now
                    </Link>
                  )}
                  <p className="mb-8 text-center text-xs font-medium text-gray-500">
                    30-Day Money-Back Guarantee
                  </p>

                  <div className="space-y-4 border-t border-gray-100 pt-6">
                    <p className="text-sm font-bold text-gray-900 uppercase tracking-wider">This course includes:</p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Play className="h-4 w-4 text-indigo-500" />
                        45+ hours on-demand video
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <BookOpen className="h-4 w-4 text-indigo-500" />
                        12 downloadable resources
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Clock className="h-4 w-4 text-indigo-500" />
                        Full lifetime access
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Trophy className="h-4 w-4 text-indigo-500" />
                        Certificate of completion
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl bg-indigo-900 p-8 text-white shadow-xl">
                  <h3 className="mb-4 text-xl font-bold">Have questions?</h3>
                  <p className="mb-6 text-sm text-indigo-200">
                    Our support team is here to help you 24/7.
                  </p>
                  <button className="w-full rounded-xl bg-white/10 py-3 text-sm font-bold text-white ring-1 ring-white/20 transition-all hover:bg-white/20">
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
