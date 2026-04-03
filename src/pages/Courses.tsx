import { motion } from "motion/react";
import CourseCard from "../components/CourseCard";
import { HSC_ICT_COURSES } from "../constants";
import { Search, Filter, BookOpen, GraduationCap, Code } from "lucide-react";
import { useState } from "react";

const categories = ["All", "Academic", "Admission", "Programming", "Web Design"];

export default function Courses() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <main className="bg-gray-50 min-h-screen pb-24">
      {/* Header */}
      <section className="bg-indigo-900 py-16 text-white lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black tracking-tight sm:text-6xl"
          >
            Explore Our <span className="text-indigo-300">Courses</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-indigo-100"
          >
            Choose from a wide range of HSC ICT courses designed to help you succeed in your exams and beyond.
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-md py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-6 py-2 text-sm font-bold transition-all ${
                    activeCategory === cat
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                      : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="relative max-w-md w-full">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full rounded-2xl border-0 bg-gray-50 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                placeholder="Search for courses..."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Course Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {HSC_ICT_COURSES.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
