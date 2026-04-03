import { motion } from "motion/react";
import { Users, BookOpen, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Course } from "../types";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-xl hover:-translate-y-1"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
          Best Seller
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">{course.instructor}</span>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-bold text-gray-900">4.9</span>
          </div>
        </div>

        <h3 className="mb-3 text-xl font-black leading-tight text-gray-900 group-hover:text-indigo-600 transition-colors">
          {course.title}
        </h3>
        
        <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-gray-500">
          {course.description}
        </p>

        <div className="mt-auto space-y-6">
          <div className="flex items-center justify-between border-t border-gray-50 pt-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                <Users className="h-4 w-4 text-indigo-400" />
                {course.stats.students.toLocaleString()} Students
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                <BookOpen className="h-4 w-4 text-indigo-400" />
                {course.stats.lessons} Lessons
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-400 line-through">৳2,500</span>
              <span className="text-2xl font-black text-indigo-600">৳{course.price}</span>
            </div>
            <Link
              to={`/course/${course.id}`}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-indigo-50 px-6 text-sm font-bold text-indigo-600 transition-all hover:bg-indigo-600 hover:text-white"
            >
              Enroll Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
