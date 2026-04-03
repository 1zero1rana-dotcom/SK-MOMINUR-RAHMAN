import { Link } from "react-router-dom";
import { BookOpen, Facebook, Youtube, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 pt-16 pb-8 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white">
                <BookOpen className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                ICT <span className="text-indigo-400">Masterclass</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              The most comprehensive online learning platform for HSC ICT students in Bangladesh. 
              Empowering students with quality education and practical skills.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors"><Youtube className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors"><Twitter className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-gray-300">Quick Links</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/courses" className="hover:text-white transition-colors">All Courses</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/community" className="hover:text-white transition-colors">Community</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-gray-300">Support</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/faq" className="hover:text-white transition-colors">Help & FAQ</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-gray-300">Contact Us</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <Mail className="mt-1 h-4 w-4 text-indigo-400" />
                <span>support@ictmasterclass.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-1 h-4 w-4 text-indigo-400" />
                <span>+880 1234 567890</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-1 h-4 w-4 text-indigo-400" />
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-gray-800 pt-8 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} ICT Masterclass. All rights reserved. Built with ❤️ for Bangladeshi students.</p>
        </div>
      </div>
    </footer>
  );
}
