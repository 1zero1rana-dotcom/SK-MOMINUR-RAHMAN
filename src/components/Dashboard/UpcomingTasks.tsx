import { motion } from "motion/react";
import { Calendar, Clock, ArrowRight, FileText, HelpCircle } from "lucide-react";

const tasks = [
  { id: "t1", title: "C Programming Quiz", type: "quiz", deadline: "Tomorrow, 10:00 AM", icon: HelpCircle, color: "text-yellow-600 bg-yellow-50" },
  { id: "t2", title: "HTML Project Submission", type: "assignment", deadline: "Apr 15, 2026", icon: FileText, color: "text-blue-600 bg-blue-50" },
  { id: "t3", title: "Logic Gates Practice", type: "quiz", deadline: "Apr 20, 2026", icon: HelpCircle, color: "text-indigo-600 bg-indigo-50" },
];

export default function UpcomingTasks() {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-xl font-black text-gray-900">Upcoming Tasks</h2>
        <button className="text-xs font-bold uppercase tracking-widest text-indigo-600 hover:underline">View All</button>
      </div>

      <div className="space-y-6">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group flex items-center justify-between rounded-2xl bg-gray-50 p-4 transition-all hover:bg-white hover:shadow-md hover:ring-1 hover:ring-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${task.color}`}>
                <task.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">{task.title}</h3>
                <div className="mt-1 flex items-center gap-2 text-xs font-medium text-gray-500">
                  <Calendar className="h-3 w-3" />
                  {task.deadline}
                </div>
              </div>
            </div>
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-400 opacity-0 transition-all group-hover:opacity-100 hover:text-indigo-600">
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
