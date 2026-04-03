import { motion } from "motion/react";
import { Play, MoreVertical, Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface EnrolledCourseCardProps {
  course: {
    id: string;
    title: string;
    thumbnail: string;
    progress: number;
    lastLesson: string;
  };
}

export default function EnrolledCourseCard({ course }: EnrolledCourseCardProps) {
  return (
    <div className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all group-hover:opacity-100">
          <Link
            to={`/course/${course.id}/learn`}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-indigo-600 shadow-lg"
          >
            <Play className="h-6 w-6 fill-current" />
          </Link>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{course.title}</h3>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-500">
            <span>Progress</span>
            <span className="text-indigo-600">{course.progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${course.progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-indigo-600"
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-50 pt-4">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <Clock className="h-4 w-4" />
            Next: {course.lastLesson}
          </div>
          <Link
            to={`/course/${course.id}/learn`}
            className="text-xs font-bold text-indigo-600 hover:underline"
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
}
