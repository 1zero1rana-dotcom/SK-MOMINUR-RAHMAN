import { Link, useNavigate } from "react-router-dom";
import { BookOpen, LogIn, Menu, X, ShieldCheck, User, LogOut, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "../lib/utils";
import { useAuth } from "../contexts/AuthContext";
import { useSettings } from "../contexts/SettingsContext";
import { auth } from "../firebase";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, role, loading } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      setIsProfileOpen(false);
      setIsOpen(false);
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) return null; // Or a minimal skeleton

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt={settings.siteName} className="h-10 w-auto object-contain" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
              <BookOpen className="h-6 w-6" />
            </div>
          )}
          <span className="text-xl font-bold tracking-tight text-gray-900">
            {settings.siteName.split(' ')[0]} <span className="text-primary">{settings.siteName.split(' ').slice(1).join(' ')}</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex md:items-center md:gap-8">
          {settings.headerLinks?.length > 0 ? (
            settings.headerLinks.map((link: any, i: number) => (
              <Link key={i} to={link.path} className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">{link.name}</Link>
            ))
          ) : (
            <>
              <Link to="/courses" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Courses</Link>
              <Link to="/about" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">About</Link>
              <Link to="/community" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Community</Link>
            </>
          )}
          <div className="h-4 w-[1px] bg-gray-200" />
          
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 rounded-full bg-gray-50 p-1.5 pr-3 transition-all hover:bg-gray-100 ring-1 ring-gray-200"
              >
                <img
                  src={user.photoURL || `https://i.pravatar.cc/100?u=${user.uid}`}
                  alt="Profile"
                  className="h-8 w-8 rounded-full border border-white shadow-sm"
                />
                <span className="text-sm font-bold text-gray-700">{user.displayName?.split(' ')[0] || 'Student'}</span>
                <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform", isProfileOpen && "rotate-180")} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-black/5 focus:outline-none">
                  <div className="px-4 py-3 border-b border-gray-50 mb-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Signed in as</p>
                    <p className="truncate text-sm font-bold text-gray-900">{user.email}</p>
                  </div>
                  
                  {role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-primary hover:bg-primary/5 transition-colors"
                    >
                      <ShieldCheck className="h-5 w-5" />
                      Admin Panel
                    </Link>
                  )}
                  
                  <Link
                    to="/dashboard"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="h-5 w-5 text-gray-400" />
                    My Dashboard
                  </Link>
                  
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Login</Link>
              <Link 
                to="/register" 
                className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-primary/90 transition-all hover:shadow-primary/20"
              >
                Join Now
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className={cn("md:hidden", isOpen ? "block" : "hidden")}>
        <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3 border-t border-gray-100 bg-white">
          {settings.headerLinks?.length > 0 ? (
            settings.headerLinks.map((link: any, i: number) => (
              <Link key={i} to={link.path} onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary">{link.name}</Link>
            ))
          ) : (
            <>
              <Link to="/courses" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary">Courses</Link>
              <Link to="/about" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary">About</Link>
              <Link to="/community" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary">Community</Link>
            </>
          )}
          
          {user ? (
            <>
              <div className="h-[1px] bg-gray-100 my-2" />
              {role === "admin" && (
                <Link to="/admin" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-2 text-base font-bold text-primary hover:bg-primary/5">Admin Panel</Link>
              )}
              <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-2 text-base font-bold text-primary hover:bg-primary/5">My Dashboard</Link>
              <button 
                onClick={() => { handleSignOut(); setIsOpen(false); }}
                className="block w-full text-left rounded-md px-3 py-2 text-base font-bold text-red-600 hover:bg-red-50"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary">Login</Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="mt-4 block w-full rounded-full bg-primary px-3 py-3 text-center text-base font-semibold text-white shadow-md">Join Now</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
