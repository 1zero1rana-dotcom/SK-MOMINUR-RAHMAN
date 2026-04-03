import { motion } from "motion/react";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  CreditCard, 
  Settings, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  MoreVertical,
  Search,
  Filter,
  Video,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ShieldCheck,
  ShieldAlert
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "../lib/utils";
import { 
  collection, 
  query, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  serverTimestamp,
  where,
  getDocs,
  setDoc,
  getDoc
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

const adminNavItems = [
  { name: "Overview", icon: LayoutDashboard, id: "overview" },
  { name: "Payments", icon: CreditCard, id: "payments" },
  { name: "Courses", icon: BookOpen, id: "courses" },
  { name: "Students", icon: Users, id: "students" },
  { name: "Settings", icon: Settings, id: "settings" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { user, loading, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || role !== "admin")) {
      if (!user) {
        navigate("/login");
      } else {
        // Access denied
      }
    }
  }, [user, loading, role, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!user || role !== "admin") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <ShieldAlert className="h-20 w-20 text-red-600 mb-6" />
        <h1 className="text-4xl font-black text-gray-900">Access Denied</h1>
        <p className="mt-4 text-lg text-gray-600 max-w-md">
          You do not have administrative privileges to access this dashboard. 
          If you believe this is an error, please contact support.
        </p>
        <button 
          onClick={() => navigate("/dashboard")}
          className="mt-8 rounded-2xl bg-indigo-600 px-8 py-4 font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 pt-16">
      {/* Admin Sidebar */}
      <aside className="fixed left-0 top-16 hidden h-[calc(100vh-64px)] w-64 flex-col border-r border-gray-100 bg-white lg:flex">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-8 flex items-center gap-4 rounded-2xl bg-indigo-900 p-4 text-white shadow-lg shadow-indigo-200">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 font-black">
              {auth.currentUser?.displayName?.[0] || "A"}
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-sm font-bold">{auth.currentUser?.displayName || "Admin"}</p>
              <p className="truncate text-[10px] font-bold uppercase tracking-widest text-indigo-300">Super Admin</p>
            </div>
          </div>

          <nav className="space-y-1">
            {adminNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all",
                    isActive 
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-gray-400 group-hover:text-indigo-500")} />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-64">
        <div className="mx-auto max-w-7xl p-6 lg:p-12">
          {activeTab === "overview" && <AdminOverview />}
          {activeTab === "payments" && <AdminPayments />}
          {activeTab === "courses" && <AdminCourses />}
          {activeTab === "students" && <AdminStudents />}
        </div>
      </main>
    </div>
  );
}

function AdminStudents() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleToggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "student" : "admin";
    if (confirm(`Are you sure you want to make this user a ${newRole}?`)) {
      try {
        await updateDoc(doc(db, "users", userId), { role: newRole });
      } catch (error) {
        console.error("Error updating user role:", error);
      }
    }
  };

  const filteredStudents = students.filter(s => 
    s.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Student Management</h1>
          <p className="mt-2 text-gray-600">Manage user roles and view student activity.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search students..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border-0 bg-white py-3 pl-10 pr-4 text-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-600 shadow-sm"
          />
        </div>
      </header>

      <div className="rounded-3xl bg-white shadow-sm ring-1 ring-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-xs font-bold uppercase tracking-widest text-gray-400">
                <th className="px-8 py-4">Student</th>
                <th className="px-8 py-4">Email</th>
                <th className="px-8 py-4">Role</th>
                <th className="px-8 py-4">Joined</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">Loading students...</td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">No students found matching your search.</td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <img src={student.photoURL || `https://i.pravatar.cc/150?u=${student.id}`} className="h-10 w-10 rounded-full border-2 border-white shadow-sm" alt="" />
                        <span className="text-sm font-bold text-gray-900">{student.displayName || "Anonymous"}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-sm text-gray-600">{student.email}</td>
                    <td className="px-8 py-4">
                      <span className={cn(
                        "rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-widest",
                        student.role === "admin" ? "bg-indigo-50 text-indigo-600" : "bg-gray-100 text-gray-600"
                      )}>
                        {student.role}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-[10px] text-gray-500 uppercase tracking-widest">
                      {student.createdAt?.toDate?.()?.toLocaleDateString() || "Recently"}
                    </td>
                    <td className="px-8 py-4 text-right">
                      <button 
                        onClick={() => handleToggleRole(student.id, student.role)}
                        className={cn(
                          "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all",
                          student.role === "admin" ? "text-gray-400 hover:text-gray-600" : "text-indigo-600 hover:bg-indigo-50"
                        )}
                      >
                        {student.role === "admin" ? <ShieldAlert className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                        {student.role === "admin" ? "Demote" : "Make Admin"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminOverview() {
  const [stats, setStats] = useState({
    revenue: 0,
    students: 0,
    courses: 0,
    pending: 0
  });
  const [recentPayments, setRecentPayments] = useState<any[]>([]);

  useEffect(() => {
    // Fetch stats and recent payments
    const unsubPayments = onSnapshot(collection(db, "payments"), (snapshot) => {
      const payments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const pending = payments.filter((p: any) => p.status === "pending").length;
      const revenue = payments
        .filter((p: any) => p.status === "verified")
        .reduce((acc, p: any) => acc + (p.amount || 0), 0);
      
      setStats(prev => ({ ...prev, pending, revenue }));
      setRecentPayments(payments.slice(0, 5));
    });

    const unsubCourses = onSnapshot(collection(db, "courses"), (snapshot) => {
      setStats(prev => ({ ...prev, courses: snapshot.size }));
    });

    const unsubUsers = onSnapshot(query(collection(db, "users"), where("role", "==", "student")), (snapshot) => {
      setStats(prev => ({ ...prev, students: snapshot.size }));
    });

    return () => {
      unsubPayments();
      unsubCourses();
      unsubUsers();
    };
  }, []);

  return (
    <div className="space-y-12">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">Admin Dashboard</h1>
          <p className="mt-2 text-lg text-gray-600">Overview of your platform's performance.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Revenue", value: `৳${stats.revenue.toLocaleString()}`, icon: CreditCard, color: "bg-green-50 text-green-600" },
          { label: "Total Students", value: stats.students.toLocaleString(), icon: Users, color: "bg-blue-50 text-blue-600" },
          { label: "Active Courses", value: stats.courses.toString(), icon: BookOpen, color: "bg-indigo-50 text-indigo-600" },
          { label: "Pending Payments", value: stats.pending.toString(), icon: CreditCard, color: "bg-yellow-50 text-yellow-600" },
        ].map((stat, i) => (
          <div key={i} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-center gap-4">
              <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", stat.color)}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
        <h2 className="mb-8 text-xl font-black text-gray-900">Recent Payments</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-bold uppercase tracking-widest text-gray-400">
                <th className="pb-4">TrxID</th>
                <th className="pb-4">Amount</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentPayments.map((p) => (
                <tr key={p.id} className="group hover:bg-gray-50 transition-colors">
                  <td className="py-4 text-sm font-mono font-bold text-indigo-600">{p.transactionId}</td>
                  <td className="py-4 text-sm font-black text-gray-900">৳{p.amount}</td>
                  <td className="py-4">
                    <span className={cn(
                      "rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-widest",
                      p.status === "verified" ? "bg-green-50 text-green-600" : 
                      p.status === "pending" ? "bg-yellow-50 text-yellow-600" : "bg-red-50 text-red-600"
                    )}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-4 text-[10px] text-gray-500 uppercase tracking-widest">
                    {p.createdAt?.toDate?.()?.toLocaleString() || "Just now"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminPayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "payments"), where("status", "==", "pending"));
    const unsub = onSnapshot(q, (snapshot) => {
      setPayments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleVerify = async (id: string, status: "verified" | "rejected", userId: string, courseId: string) => {
    try {
      await updateDoc(doc(db, "payments", id), { status });
      
      if (status === "verified") {
        // Create enrollment
        await addDoc(collection(db, "enrollments"), {
          userId,
          courseId,
          enrolledAt: serverTimestamp(),
          progress: 0,
          status: "active"
        });
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-black tracking-tight text-gray-900">Payment Verification</h1>
        <p className="mt-2 text-gray-600">Verify manual bKash transactions from students.</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="py-12 text-center text-gray-500">Loading pending payments...</div>
        ) : payments.length === 0 ? (
          <div className="py-12 text-center text-gray-500">No pending payments to verify.</div>
        ) : (
          payments.map((p) => (
            <div key={p.id} className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                    <CreditCard className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Student ID: {p.userId.substring(0, 8)}...</h3>
                    <p className="text-sm text-gray-500">Course ID: <span className="font-bold text-indigo-600">{p.courseId}</span></p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-1">
                  <p className="text-2xl font-black text-gray-900">৳{p.amount}</p>
                  <p className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest">TrxID: {p.transactionId}</p>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => handleVerify(p.id, "verified", p.userId, p.courseId)}
                    className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-green-100 hover:bg-green-700"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Approve
                  </button>
                  <button 
                    onClick={() => handleVerify(p.id, "rejected", p.userId, p.courseId)}
                    className="flex items-center gap-2 rounded-xl bg-red-50 px-6 py-3 text-sm font-bold text-red-600 hover:bg-red-100"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function AdminCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  const [managingCourse, setManagingCourse] = useState<any | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "courses"), (snapshot) => {
      setCourses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const courseData = {
      title: formData.get("title") as string,
      price: Number(formData.get("price")),
      thumbnail: formData.get("thumbnail") as string,
      description: formData.get("description") as string,
      updatedAt: serverTimestamp(),
    };

    try {
      if (editingCourse) {
        await updateDoc(doc(db, "courses", editingCourse.id), courseData);
      } else {
        await addDoc(collection(db, "courses"), {
          ...courseData,
          createdAt: serverTimestamp(),
          chapters: []
        });
      }
      setShowAddCourse(false);
      setEditingCourse(null);
    } catch (error) {
      console.error("Error saving course:", error);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteDoc(doc(db, "courses", id));
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    }
  };

  if (managingCourse) {
    return <ManageVideos course={managingCourse} onBack={() => setManagingCourse(null)} />;
  }

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Course Management</h1>
          <p className="mt-2 text-gray-600">Add, edit, or remove courses and lessons.</p>
        </div>
        <button 
          onClick={() => {
            setEditingCourse(null);
            setShowAddCourse(true);
          }}
          className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Create Course
        </button>
      </header>

      {(showAddCourse || editingCourse) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-100"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">{editingCourse ? "Edit Course" : "Add New Course"}</h2>
            <button onClick={() => { setShowAddCourse(false); setEditingCourse(null); }} className="text-gray-400 hover:text-gray-600">
              <XCircle className="h-6 w-6" />
            </button>
          </div>
          <form onSubmit={handleSaveCourse} className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700">Course Title</label>
                <input name="title" defaultValue={editingCourse?.title} type="text" required className="mt-1 block w-full rounded-xl border-0 bg-gray-50 py-3 px-4 ring-1 ring-gray-200" placeholder="e.g. HSC ICT Chapter 5" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">Price (BDT)</label>
                <input name="price" defaultValue={editingCourse?.price} type="number" required className="mt-1 block w-full rounded-xl border-0 bg-gray-50 py-3 px-4 ring-1 ring-gray-200" placeholder="1500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">Thumbnail URL</label>
                <input name="thumbnail" defaultValue={editingCourse?.thumbnail} type="text" required className="mt-1 block w-full rounded-xl border-0 bg-gray-50 py-3 px-4 ring-1 ring-gray-200" placeholder="https://..." />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700">Description</label>
                <textarea name="description" defaultValue={editingCourse?.description} rows={4} required className="mt-1 block w-full rounded-xl border-0 bg-gray-50 py-3 px-4 ring-1 ring-gray-200" placeholder="Course description..."></textarea>
              </div>
              <button type="submit" className="w-full rounded-2xl bg-indigo-600 py-4 font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700">
                {editingCourse ? "Update Course" : "Save Course"}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div key={course.id} className="group overflow-hidden rounded-[32px] bg-white shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md">
            <div className="aspect-video bg-gray-100 relative">
              <img src={course.thumbnail || `https://picsum.photos/seed/${course.id}/800/600`} className="h-full w-full object-cover" alt="Course" />
              <button 
                onClick={() => handleDeleteCourse(course.id)}
                className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-xl text-red-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900">{course.title}</h3>
              <p className="mt-2 text-sm text-gray-500">{course.chapters?.length || 0} Chapters • ৳{course.price}</p>
              <div className="mt-6 flex gap-2">
                <button 
                  onClick={() => setEditingCourse(course)}
                  className="flex-1 rounded-xl bg-gray-50 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Edit Course
                </button>
                <button 
                  onClick={() => setManagingCourse(course)}
                  className="flex-1 rounded-xl bg-indigo-50 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-100"
                >
                  Manage Videos
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ManageVideos({ course, onBack }: { course: any; onBack: () => void }) {
  const [chapters, setChapters] = useState<any[]>(course.chapters || []);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const addChapter = () => {
    const newChapter = {
      id: Math.random().toString(36).substring(7),
      title: "New Chapter",
      lessons: [],
    };
    setChapters([...chapters, newChapter]);
    setExpandedChapter(newChapter.id);
  };

  const addLesson = (chapterId: string) => {
    setChapters(chapters.map(ch => {
      if (ch.id === chapterId) {
        return {
          ...ch,
          lessons: [
            ...ch.lessons,
            { id: Math.random().toString(36).substring(7), title: "New Lesson", videoUrl: "", duration: "00:00", isFree: false }
          ]
        };
      }
      return ch;
    }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await updateDoc(doc(db, "courses", course.id), {
        chapters: chapters
      });
      onBack();
    } catch (error) {
      console.error("Error saving video management changes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm ring-1 ring-gray-100 hover:text-indigo-600"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Manage Videos</h1>
          <p className="text-sm text-gray-500">Course: <span className="font-bold text-indigo-600">{course.title}</span></p>
        </div>
      </header>

      <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Chapters & Lessons</h2>
          <button 
            onClick={addChapter}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Add Chapter
          </button>
        </div>

        <div className="space-y-4">
          {chapters.map((chapter) => (
            <div key={chapter.id} className="overflow-hidden rounded-2xl ring-1 ring-gray-100">
              <div 
                className="flex cursor-pointer items-center justify-between bg-gray-50 p-4 transition-colors hover:bg-gray-100"
                onClick={() => setExpandedChapter(expandedChapter === chapter.id ? null : chapter.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white font-bold text-indigo-600 shadow-sm">
                    {chapters.indexOf(chapter) + 1}
                  </div>
                  <input 
                    type="text" 
                    value={chapter.title} 
                    onChange={(e) => {
                      setChapters(chapters.map(ch => ch.id === chapter.id ? { ...ch, title: e.target.value } : ch));
                    }}
                    className="bg-transparent font-bold text-gray-900 focus:outline-none"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setChapters(chapters.filter(ch => ch.id !== chapter.id));
                    }}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  {expandedChapter === chapter.id ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                </div>
              </div>

              {expandedChapter === chapter.id && (
                <div className="p-4 space-y-4">
                  {chapter.lessons.map((lesson: any) => (
                    <div key={lesson.id} className="flex flex-col gap-4 rounded-xl bg-white p-4 ring-1 ring-gray-100 md:flex-row md:items-center">
                      <div className="flex flex-1 items-center gap-3">
                        <Video className="h-5 w-5 text-indigo-600" />
                        <input 
                          type="text" 
                          value={lesson.title} 
                          onChange={(e) => {
                            setChapters(chapters.map(ch => ch.id === chapter.id ? {
                              ...ch,
                              lessons: ch.lessons.map((l: any) => l.id === lesson.id ? { ...l, title: e.target.value } : l)
                            } : ch));
                          }}
                          className="flex-1 bg-transparent text-sm font-medium text-gray-900 focus:outline-none"
                          placeholder="Lesson Title"
                        />
                      </div>
                      <div className="flex flex-1 items-center gap-3">
                        <input 
                          type="text" 
                          value={lesson.videoUrl} 
                          onChange={(e) => {
                            setChapters(chapters.map(ch => ch.id === chapter.id ? {
                              ...ch,
                              lessons: ch.lessons.map((l: any) => l.id === lesson.id ? { ...l, videoUrl: e.target.value } : l)
                            } : ch));
                          }}
                          className="flex-1 bg-transparent text-xs text-gray-500 focus:outline-none"
                          placeholder="Video URL (YouTube/Vimeo)"
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            checked={lesson.isFree}
                            onChange={(e) => {
                              setChapters(chapters.map(ch => ch.id === chapter.id ? {
                                ...ch,
                                lessons: ch.lessons.map((l: any) => l.id === lesson.id ? { ...l, isFree: e.target.checked } : l)
                              } : ch));
                            }}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                          />
                          <span className="text-xs font-medium text-gray-500">Free</span>
                        </div>
                        <button 
                          onClick={() => {
                            setChapters(chapters.map(ch => ch.id === chapter.id ? {
                              ...ch,
                              lessons: ch.lessons.filter((l: any) => l.id !== lesson.id)
                            } : ch));
                          }}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => addLesson(chapter.id)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-3 text-sm font-bold text-gray-400 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <Plus className="h-4 w-4" />
                    Add Lesson
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-end gap-4">
          <button 
            onClick={onBack}
            className="rounded-xl px-6 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="rounded-xl bg-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
