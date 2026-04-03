import { motion } from "motion/react";
import { BookOpen, CheckCircle2, Trophy, Clock } from "lucide-react";

const stats = [
  { label: "Enrolled Courses", value: "3", icon: BookOpen, color: "bg-blue-50 text-blue-600" },
  { label: "Completed Lessons", value: "24", icon: CheckCircle2, color: "bg-green-50 text-green-600" },
  { label: "Quiz Average", value: "88%", icon: Trophy, color: "bg-yellow-50 text-yellow-600" },
  { label: "Hours Learned", value: "12.5h", icon: Clock, color: "bg-purple-50 text-purple-600" },
];

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
        >
          <div className="flex items-center gap-4">
            <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", stat.color)}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500">{stat.label}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Helper for Tailwind classes in separate file
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
