import { motion } from "motion/react";
import * as Icons from "lucide-react";
import { useSettings } from "../contexts/SettingsContext";

export default function Stats() {
  const { settings } = useSettings();
  
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {settings.stats.map((stat, index) => {
            const IconComponent = (Icons as any)[stat.icon] || Icons.HelpCircle;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center justify-center rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md"
              >
                <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${stat.color}`}>
                  <IconComponent className="h-7 w-7" />
                </div>
                <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                <p className="mt-1 text-sm font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
