import { motion } from "motion/react";
import DashboardSidebar from "../components/Dashboard/Sidebar";
import DashboardStats from "../components/Dashboard/Stats";
import EnrolledCourseCard from "../components/Dashboard/EnrolledCourseCard";
import UpcomingTasks from "../components/Dashboard/UpcomingTasks";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";

const enrolledCourses = [
  { id: "hsc-ict-full", title: "HSC ICT Full Course (Academic)", thumbnail: "https://picsum.photos/seed/ict1/800/600", progress: 65, lastLesson: "Logic Gates" },
  { id: "c-programming", title: "C Programming Masterclass", thumbnail: "https://picsum.photos/seed/code/800/600", progress: 30, lastLesson: "Variables & Data Types" },
  { id: "web-design", title: "Web Design for Beginners", thumbnail: "https://picsum.photos/seed/web/800/600", progress: 10, lastLesson: "HTML Tags" },
];

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50 pt-16">
      <DashboardSidebar />
      
      <main className="flex-1 lg:pl-64">
        <div className="mx-auto max-w-7xl p-6 lg:p-12">
          <header className="mb-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                Welcome back, <span className="text-indigo-600">Redwan!</span>
              </h1>
              <p className="mt-2 text-lg text-gray-600">You've completed 65% of your current course. Keep it up!</p>
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
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  {enrolledCourses.slice(0, 2).map((course) => (
                    <EnrolledCourseCard key={course.id} course={course} />
                  ))}
                </div>
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
            <div className="lg:col-span-1">
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
