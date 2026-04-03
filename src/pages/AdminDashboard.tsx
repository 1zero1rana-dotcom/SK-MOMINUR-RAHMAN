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
  Filter
} from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";

const adminNavItems = [
  { name: "Overview", icon: LayoutDashboard, id: "overview" },
  { name: "Payments", icon: CreditCard, id: "payments" },
  { name: "Courses", icon: BookOpen, id: "courses" },
  { name: "Students", icon: Users, id: "students" },
  { name: "Settings", icon: Settings, id: "settings" },
];

const mockPayments = [
  { id: "p1", user: "Tanvir Ahmed", course: "HSC ICT Full Course", trxId: "8N7A6D5C4B", amount: 1500, status: "pending", date: "2026-04-03 10:00 AM" },
  { id: "p2", user: "Sadia Islam", course: "C Programming Masterclass", trxId: "9M8B7E6D5C", amount: 1200, status: "verified", date: "2026-04-02 02:30 PM" },
  { id: "p3", user: "Fahim Shahriar", course: "HSC ICT Full Course", trxId: "7L6K5J4I3H", amount: 1500, status: "rejected", date: "2026-04-01 11:15 AM" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex min-h-screen bg-gray-50 pt-16">
      {/* Admin Sidebar */}
      <aside className="fixed left-0 top-16 hidden h-[calc(100vh-64px)] w-64 flex-col border-r border-gray-100 bg-white lg:flex">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-8 flex items-center gap-4 rounded-2xl bg-indigo-900 p-4 text-white shadow-lg shadow-indigo-200">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 font-black">R</div>
            <div className="overflow-hidden">
              <p className="truncate text-sm font-bold">Admin Redwan</p>
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
        </div>
      </main>
    </div>
  );
}

function AdminOverview() {
  return (
    <div className="space-y-12">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">Admin Dashboard</h1>
          <p className="mt-2 text-lg text-gray-600">Overview of your platform's performance.</p>
        </div>
        <button className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700">
          <Plus className="h-4 w-4" />
          Add New Course
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Revenue", value: "৳750,000", icon: CreditCard, color: "bg-green-50 text-green-600" },
          { label: "Total Students", value: "12,500", icon: Users, color: "bg-blue-50 text-blue-600" },
          { label: "Active Courses", value: "8", icon: BookOpen, color: "bg-indigo-50 text-indigo-600" },
          { label: "Pending Payments", value: "15", icon: CreditCard, color: "bg-yellow-50 text-yellow-600" },
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
                <th className="pb-4">Student</th>
                <th className="pb-4">Course</th>
                <th className="pb-4">TrxID</th>
                <th className="pb-4">Amount</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockPayments.map((p) => (
                <tr key={p.id} className="group hover:bg-gray-50 transition-colors">
                  <td className="py-4">
                    <p className="text-sm font-bold text-gray-900">{p.user}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">{p.date}</p>
                  </td>
                  <td className="py-4 text-sm font-medium text-gray-600">{p.course}</td>
                  <td className="py-4 text-sm font-mono font-bold text-indigo-600">{p.trxId}</td>
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
                  <td className="py-4">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="h-5 w-5" />
                    </button>
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
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-black tracking-tight text-gray-900">Payment Verification</h1>
        <p className="mt-2 text-gray-600">Verify manual bKash transactions from students.</p>
      </header>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          {["All", "Pending", "Verified", "Rejected"].map((s) => (
            <button key={s} className="rounded-full bg-white px-4 py-2 text-xs font-bold text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50">
              {s}
            </button>
          ))}
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input type="text" className="w-full rounded-xl border-0 bg-white py-2 pl-10 text-sm ring-1 ring-gray-200" placeholder="Search TrxID..." />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {mockPayments.filter(p => p.status === "pending").map((p) => (
          <div key={p.id} className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <CreditCard className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{p.user}</h3>
                  <p className="text-sm text-gray-500">Enrolling in: <span className="font-bold text-indigo-600">{p.course}</span></p>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-1">
                <p className="text-2xl font-black text-gray-900">৳{p.amount}</p>
                <p className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest">TrxID: {p.trxId}</p>
              </div>

              <div className="flex gap-3">
                <button className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-green-100 hover:bg-green-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Approve
                </button>
                <button className="flex items-center gap-2 rounded-xl bg-red-50 px-6 py-3 text-sm font-bold text-red-600 hover:bg-red-100">
                  <XCircle className="h-4 w-4" />
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminCourses() {
  const [showAddCourse, setShowAddCourse] = useState(false);

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Course Management</h1>
          <p className="mt-2 text-gray-600">Add, edit, or remove courses and lessons.</p>
        </div>
        <button 
          onClick={() => setShowAddCourse(true)}
          className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Create Course
        </button>
      </header>

      {showAddCourse && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-100"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Add New Course</h2>
            <button onClick={() => setShowAddCourse(false)} className="text-gray-400 hover:text-gray-600">
              <XCircle className="h-6 w-6" />
            </button>
          </div>
          <form className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700">Course Title</label>
                <input type="text" className="mt-1 block w-full rounded-xl border-0 bg-gray-50 py-3 px-4 ring-1 ring-gray-200" placeholder="e.g. HSC ICT Chapter 5" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">Price (BDT)</label>
                <input type="number" className="mt-1 block w-full rounded-xl border-0 bg-gray-50 py-3 px-4 ring-1 ring-gray-200" placeholder="1500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">Thumbnail URL</label>
                <input type="text" className="mt-1 block w-full rounded-xl border-0 bg-gray-50 py-3 px-4 ring-1 ring-gray-200" placeholder="https://..." />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700">Description</label>
                <textarea rows={4} className="mt-1 block w-full rounded-xl border-0 bg-gray-50 py-3 px-4 ring-1 ring-gray-200" placeholder="Course description..."></textarea>
              </div>
              <button type="submit" className="w-full rounded-2xl bg-indigo-600 py-4 font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700">
                Save Course
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="group overflow-hidden rounded-[32px] bg-white shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md">
            <div className="aspect-video bg-gray-100">
              <img src={`https://picsum.photos/seed/course_${i}/800/600`} className="h-full w-full object-cover" alt="Course" />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900">HSC ICT Chapter {i}</h3>
              <p className="mt-2 text-sm text-gray-500">12 Lessons • 2,500 Students</p>
              <div className="mt-6 flex gap-2">
                <button className="flex-1 rounded-xl bg-gray-50 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100">Edit Course</button>
                <button className="flex-1 rounded-xl bg-indigo-50 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-100">Manage Videos</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
