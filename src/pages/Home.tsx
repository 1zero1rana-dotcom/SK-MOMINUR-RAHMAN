import Hero from "../components/Hero";
import Stats from "../components/Stats";
import CourseCard from "../components/CourseCard";
import Testimonials from "../components/Testimonials";
import Slider from "../components/Slider";
import { motion } from "motion/react";
import { ArrowRight, BookOpen, GraduationCap, Laptop, Code, Database, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useSettings } from "../contexts/SettingsContext";
import { useState, useEffect } from "react";
import { collection, onSnapshot, query, limit } from "firebase/firestore";
import { db } from "../firebase";

const categories = [
  { name: "Academic", icon: GraduationCap, color: "text-blue-600 bg-blue-50" },
  { name: "Admission", icon: BookOpen, color: "text-indigo-600 bg-indigo-50" },
  { name: "Mathematics", icon: Laptop, color: "text-purple-600 bg-purple-50" },
  { name: "Programming", icon: Code, color: "text-green-600 bg-green-50" },
  { name: "Database", icon: Database, color: "text-orange-600 bg-orange-50" },
  { name: "Web Design", icon: Globe, color: "text-pink-600 bg-pink-50" },
];

export default function Home() {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "courses"), limit(3));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCourses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const renderSection = (section: any) => {
    if (!section.visible) return null;

    switch (section.type) {
      case "slider":
        return <Slider key={section.id} slides={settings.slides} />;
      case "hero":
        return (
          <div key={section.id}>
            <Hero />
            <Stats />
          </div>
        );
      case "categories":
        return (
          <section key={section.id} className="py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-16 text-center">
                <h2 className="text-sm font-bold uppercase tracking-widest text-primary">{settings.categoriesTitle}</h2>
                <p className="mt-4 text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
                  {settings.categoriesSubtitle}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group flex flex-col items-center justify-center rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer"
                  >
                    <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${category.color} transition-transform group-hover:scale-110`}>
                      <category.icon className="h-8 w-8" />
                    </div>
                    <p className="text-sm font-bold text-gray-900">{category.name}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );
      case "courses":
        return (
          <section key={section.id} className="bg-gray-50 py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-primary">{settings.coursesTitle}</h2>
                  <p className="mt-4 text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
                    {settings.coursesSubtitle}
                  </p>
                </div>
                <Link
                  to="/courses"
                  className="group flex items-center gap-2 text-lg font-bold text-primary hover:text-primary/80"
                >
                  View All Courses
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : courses.length > 0 ? (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No courses available at the moment.</p>
                </div>
              )}
            </div>
          </section>
        );
      case "testimonials":
        return <Testimonials key={section.id} />;
      case "cta":
        return (
          <section key={section.id} className="py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="relative overflow-hidden rounded-[40px] bg-primary px-8 py-16 text-center text-white shadow-2xl shadow-primary/20 lg:px-16 lg:py-24">
                <div className="absolute top-0 left-0 -z-10 h-full w-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]" />
                <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />

                <h2 className="mx-auto max-w-3xl text-4xl font-black tracking-tight sm:text-6xl leading-[1.1]">
                  {settings.ctaTitle}
                </h2>
                <p className="mx-auto mt-8 max-w-2xl text-lg text-white/80">
                  {settings.ctaSubtitle}
                </p>
                <div className="mt-12 flex flex-wrap justify-center gap-6">
                  <Link
                    to={user ? "/dashboard" : "/register"}
                    className="rounded-full bg-white px-10 py-5 text-lg font-bold text-primary shadow-xl transition-all hover:bg-gray-50 hover:scale-105"
                  >
                    {user ? "Go to Dashboard" : "Join Now for Free"}
                  </Link>
                  <Link
                    to="/courses"
                    className="rounded-full bg-white/10 px-10 py-5 text-lg font-bold text-white ring-1 ring-white/30 backdrop-blur-sm transition-all hover:bg-white/20"
                  >
                    Explore Courses
                  </Link>
                </div>
              </div>
            </div>
          </section>
        );
      case "custom_html":
        return (
          <section key={section.id} className="py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div dangerouslySetInnerHTML={{ __html: section.content || "" }} />
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <main className="bg-white">
      {settings.homeSections
        .sort((a, b) => a.order - b.order)
        .map((section) => renderSection(section))}
    </main>
  );
}
