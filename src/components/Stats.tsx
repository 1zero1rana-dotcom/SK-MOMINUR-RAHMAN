import { motion } from "motion/react";
import { Users, BookOpen, Trophy, Star } from "lucide-react";

const stats = [
  { label: "Students Enrolled", value: "500k+", icon: Users, color: "bg-blue-50 text-blue-600" },
  { label: "Total Lessons", value: "1,200+", icon: BookOpen, color: "bg-indigo-50 text-indigo-600" },
  { label: "Success Rate", value: "98%", icon: Trophy, color: "bg-yellow-50 text-yellow-600" },
  { label: "Average Rating", value: "4.9/5", icon: Star, color: "bg-green-50 text-green-600" },
];

export default function Stats() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center justify-center rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md"
            >
              <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${stat.color}`}>
                <stat.icon className="h-7 w-7" />
              </div>
              <p className="text-3xl font-black text-gray-900">{stat.value}</p>
              <p className="mt-1 text-sm font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
