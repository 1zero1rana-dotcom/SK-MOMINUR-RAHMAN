import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, BookOpen, FileText, HelpCircle, Settings, LogOut, ChevronRight, ShieldCheck } from "lucide-react";
import { cn } from "../../lib/utils";

const navItems = [
  { name: "Overview", icon: LayoutDashboard, path: "/dashboard" },
  { name: "My Courses", icon: BookOpen, path: "/dashboard/courses" },
  { name: "Assignments", icon: FileText, path: "/dashboard/assignments" },
  { name: "Quizzes", icon: HelpCircle, path: "/dashboard/quizzes" },
  { name: "Settings", icon: Settings, path: "/dashboard/settings" },
];

import { useAuth } from "../../contexts/AuthContext";
import { auth } from "../../firebase";

export default function DashboardSidebar() {
  const location = useLocation();
  const { user, role } = useAuth();

  const navigate = useNavigate();
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <aside className="fixed left-0 top-16 hidden h-[calc(100vh-64px)] w-64 flex-col border-r border-gray-100 bg-white lg:flex">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-8 flex items-center gap-4 rounded-2xl bg-indigo-50 p-4">
          <img
            src={user?.photoURL || `https://i.pravatar.cc/150?u=${user?.uid || 'student'}`}
            alt="Student"
            className="h-10 w-10 rounded-full border-2 border-white shadow-sm"
          />
          <div className="overflow-hidden">
            <p className="truncate text-sm font-bold text-gray-900">{user?.displayName || 'Student'}</p>
            <p className="truncate text-xs font-medium text-gray-500 uppercase tracking-wide">HSC 2025 Batch</p>
          </div>
        </div>

        <nav className="space-y-1">
          {role === "admin" && (
            <Link
              to="/admin"
              className="group mb-4 flex items-center justify-between rounded-xl bg-indigo-50 px-4 py-3 text-sm font-bold text-indigo-600 transition-all hover:bg-indigo-100"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5" />
                Admin Panel
              </div>
              <ChevronRight className="h-4 w-4" />
            </Link>
          )}
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-all",
                  isActive 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-gray-400 group-hover:text-indigo-500")} />
                  {item.name}
                </div>
                {isActive && <ChevronRight className="h-4 w-4" />}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-gray-100 p-6">
        <button 
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-600 transition-all hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
