import { motion } from "motion/react";
import DashboardSidebar from "../components/Dashboard/Sidebar";
import DashboardStats from "../components/Dashboard/Stats";
import EnrolledCourseCard from "../components/Dashboard/EnrolledCourseCard";
import UpcomingTasks from "../components/Dashboard/UpcomingTasks";
import { ArrowRight, Play, Bell, CheckCircle2, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, getDoc, doc, orderBy, limit, updateDoc, arrayUnion } from "firebase/firestore";
import { db, auth } from "../firebase";
import { cn } from "../lib/utils";

import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) return;

    const q = query(
      collection(db, "notifications"),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    const unsubNotifications = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotifications(notifs);
    }, (error) => {
      console.error("Notifications snapshot error:", error);
    });

    return () => unsubNotifications();
  }, [user, authLoading]);

  const markNotificationAsRead = async (notifId: string) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, "notifications", notifId), {
        readBy: arrayUnion(user.uid)
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    
    if (user) {
      const q = query(
        collection(db, "enrollments"),
        where("userId", "==", user.uid),
        where("status", "==", "active")
      );

      const unsubEnrollments = onSnapshot(q, async (snapshot) => {
        const coursesData = await Promise.all(
          snapshot.docs.map(async (enrollmentDoc) => {
            const enrollment = enrollmentDoc.data();
            const courseSnap = await getDoc(doc(db, "courses", enrollment.courseId));
            if (courseSnap.exists()) {
              return {
                id: courseSnap.id,
                ...courseSnap.data(),
                enrollmentId: enrollmentDoc.id,
                progress: enrollment.progress || 0,
                lastLesson: enrollment.lastLesson || "Not started"
              };
            }
            return null;
          })
        );
        setEnrolledCourses(coursesData.filter(c => c !== null));
        setLoading(false);
      }, (error) => {
        console.error("Enrollments snapshot error:", error);
        setLoading(false);
      });

      return () => unsubEnrollments();
    } else {
      setLoading(false);
    }
  }, [user, authLoading]);

  return (
    <div className="flex min-h-screen bg-gray-50 pt-16">
      <DashboardSidebar />
      
      <main className="flex-1 lg:pl-64">
        <div className="mx-auto max-w-7xl p-6 lg:p-12">
          <header className="mb-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                Welcome back, <span className="text-indigo-600">{user?.displayName?.split(' ')[0] || 'Student'}!</span>
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                {enrolledCourses.length > 0 
                  ? `You have ${enrolledCourses.length} active courses. Keep learning!`
                  : "You haven't enrolled in any courses yet. Start your journey today!"}
              </p>
            </div>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-indigo-300"
            >
              Explore More Courses
              <ArrowRight className="h-4 w-4" />
            </Link>
          </header>

          <DashboardStats />

          <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Continue Learning */}
              <section>
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="text-2xl font-black text-gray-900">Continue Learning</h2>
                  <Link to="/dashboard/courses" className="text-sm font-bold text-indigo-600 hover:underline">View All</Link>
                </div>
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
                  </div>
                ) : enrolledCourses.length === 0 ? (
                  <div className="rounded-3xl bg-white p-12 text-center shadow-sm ring-1 ring-gray-100">
                    <p className="text-gray-500 font-medium">No enrolled courses found.</p>
                    <Link to="/courses" className="mt-4 inline-block text-indigo-600 font-bold hover:underline">Browse Courses</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {enrolledCourses.slice(0, 2).map((course) => (
                      <EnrolledCourseCard key={course.id} course={course} />
                    ))}
                  </div>
                )}
              </section>

              {/* Recent Activity or Progress Chart could go here */}
              <section className="rounded-3xl bg-indigo-900 p-8 text-white shadow-xl">
                <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-black">Ready for a challenge?</h2>
                    <p className="max-w-md text-indigo-200">
                      Take the Chapter 3 Mock Test to test your knowledge of Number Systems and Logic Gates.
                    </p>
                    <button className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-indigo-600 transition-all hover:bg-indigo-50">
                      Start Mock Test
                      <Play className="h-4 w-4 fill-current" />
                    </button>
                  </div>
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white/10 ring-8 ring-white/5">
                    <div className="text-center">
                      <p className="text-3xl font-black">12</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">Days Streak</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar Content */}
            <div className="lg:col-span-1 space-y-8">
              {/* Notifications Section */}
              <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-black text-gray-900">Notifications</h2>
                  <Bell className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="space-y-4">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-gray-500 font-medium text-center py-4">No new notifications</p>
                  ) : (
                    notifications.map((notif) => {
                      const isRead = notif.readBy?.includes(user?.uid);
                      return (
                        <div 
                          key={notif.id} 
                          className={cn(
                            "group relative flex items-start gap-4 rounded-2xl p-4 transition-all hover:bg-gray-50",
                            !isRead && "bg-indigo-50/50 ring-1 ring-indigo-100"
                          )}
                          onClick={() => !isRead && markNotificationAsRead(notif.id)}
                        >
                          <div className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                            notif.type === "course_update" ? "bg-indigo-100 text-indigo-600" : "bg-green-100 text-green-600"
                          )}>
                            {notif.type === "course_update" ? <Info className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">{notif.title}</p>
                            <p className="text-xs text-gray-500 line-clamp-2 mt-1">{notif.message}</p>
                            <p className="mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                              {notif.createdAt?.toDate ? new Date(notif.createdAt.toDate()).toLocaleDateString() : 'Just now'}
                            </p>
                          </div>
                          {!isRead && (
                            <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-indigo-600" />
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <UpcomingTasks />
              
              <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
                <h2 className="mb-6 text-xl font-black text-gray-900">Community Activity</h2>
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-4">
                      <img
                        src={`https://i.pravatar.cc/100?img=${i + 20}`}
                        className="h-10 w-10 rounded-full border-2 border-white shadow-sm"
                        alt="User"
                      />
                      <div>
                        <p className="text-sm font-bold text-gray-900">User_{i} asked a question</p>
                        <p className="text-xs text-gray-500">"How do I convert binary to octal?"</p>
                        <p className="mt-1 text-[10px] font-bold text-indigo-600 uppercase tracking-widest">2 hours ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
