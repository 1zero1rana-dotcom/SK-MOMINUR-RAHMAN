import { motion } from "motion/react";
import { Play, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Hero() {
  const { user } = useAuth();
  return (
    <section className="relative overflow-hidden bg-white pt-16 pb-24 lg:pt-32 lg:pb-40">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-50/50 blur-3xl opacity-70" />
      <div className="absolute bottom-0 right-0 -z-10 h-[400px] w-[400px] rounded-full bg-indigo-100/30 blur-3xl opacity-50" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-semibold text-indigo-600 ring-1 ring-inset ring-indigo-200">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
              Admission Batch 2026 is Open!
            </div>
            
            <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl leading-[1.1]">
              Master <span className="text-indigo-600">HSC ICT</span> with Confidence.
            </h1>
            
            <p className="max-w-xl text-lg leading-relaxed text-gray-600">
              Join over 500,000 students across Bangladesh. Learn from the best educators, 
              practice with interactive quizzes, and ace your exams with Redwan's Method.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to={user ? "/dashboard" : "/courses"}
                className="group flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-indigo-300"
              >
                {user ? "Go to Dashboard" : "Get Started"}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <button className="flex items-center gap-3 rounded-full bg-white px-8 py-4 text-lg font-bold text-gray-900 ring-1 ring-gray-200 transition-all hover:bg-gray-50">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                  <Play className="h-5 w-5 fill-current" />
                </div>
                Watch Intro
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Expert Instructors
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Interactive Quizzes
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Lifetime Access
              </div>
            </div>
          </motion.div>

          {/* Visual/Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-indigo-100 shadow-2xl shadow-indigo-200">
              <img
                src="https://picsum.photos/seed/education/1200/1200"
                alt="HSC ICT Education"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 to-transparent" />
              
              {/* Floating stats card */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute bottom-8 left-8 right-8 rounded-2xl bg-white/90 p-6 backdrop-blur-md shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Active Students</p>
                    <p className="text-3xl font-black text-gray-900">500,000+</p>
                  </div>
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <img
                        key={i}
                        src={`https://i.pravatar.cc/100?img=${i + 10}`}
                        className="h-10 w-10 rounded-full border-2 border-white"
                        alt="Student"
                      />
                    ))}
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-indigo-600 text-xs font-bold text-white">
                      +10k
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 h-24 w-24 rounded-2xl bg-yellow-400/20 blur-xl" />
            <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-indigo-600/10 blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
