import { motion } from "motion/react";
import { Award, Users, Globe, BookOpen, Heart, ShieldCheck } from "lucide-react";

export default function About() {
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="bg-indigo-900 py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black tracking-tight sm:text-6xl"
          >
            Our Mission: Quality Education for All
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-indigo-100"
          >
            We started in 2023 with a simple goal: to make HSC ICT education accessible, 
            engaging, and effective for every student in Bangladesh.
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-4xl font-black text-gray-900">500k+</h3>
              <p className="mt-2 text-sm font-bold uppercase tracking-widest text-gray-500">Students Nationwide</p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-4xl font-black text-gray-900">98%</h3>
              <p className="mt-2 text-sm font-bold uppercase tracking-widest text-gray-500">Success Rate</p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Globe className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-4xl font-black text-gray-900">64</h3>
              <p className="mt-2 text-sm font-bold uppercase tracking-widest text-gray-500">Districts Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-600">Our Values</h2>
            <p className="mt-4 text-4xl font-black tracking-tight text-gray-900">What Drives Us</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Student First", desc: "Every decision we make is centered around improving the student learning experience.", icon: Heart },
              { title: "Quality Content", desc: "We provide the most accurate and up-to-date content following the latest NCTB syllabus.", icon: BookOpen },
              { title: "Accessibility", desc: "Our platform is designed to work even on low-bandwidth connections in remote areas.", icon: Globe },
              { title: "Trust & Security", desc: "We prioritize the privacy and security of our students' data above all else.", icon: ShieldCheck },
              { title: "Innovation", desc: "We constantly update our teaching methods to keep up with the evolving tech landscape.", icon: Award },
              { title: "Community", desc: "We foster a supportive community where students can learn and grow together.", icon: Users },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{value.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-gray-500">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
