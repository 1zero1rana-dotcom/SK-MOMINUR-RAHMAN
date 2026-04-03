import { Link } from "react-router-dom";
import { BookOpen, LogIn, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
            <BookOpen className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">
            ICT <span className="text-indigo-600">Masterclass</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex md:items-center md:gap-8">
          <Link to="/courses" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Courses</Link>
          <Link to="/about" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">About</Link>
          <Link to="/community" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Community</Link>
          <div className="h-4 w-[1px] bg-gray-200" />
          <Link 
            to="/dashboard" 
            className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Dashboard
          </Link>
          <Link 
            to="/register" 
            className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition-all hover:shadow-indigo-200"
          >
            Join Now
          </Link>
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
          <Link to="/courses" className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600">Courses</Link>
          <Link to="/about" className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600">About</Link>
          <Link to="/community" className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600">Community</Link>
          <Link to="/login" className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600">Login</Link>
          <Link to="/register" className="mt-4 block w-full rounded-full bg-indigo-600 px-3 py-3 text-center text-base font-semibold text-white shadow-md">Join Now</Link>
        </div>
      </div>
    </nav>
  );
}
