import { Link } from "react-router-dom";
import { BookOpen, Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { useSettings } from "../contexts/SettingsContext";

export default function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="bg-white border-t border-gray-100 pt-24 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                <BookOpen className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">
                {settings.siteName.split(' ')[0]} <span className="text-indigo-600">{settings.siteName.split(' ').slice(1).join(' ')}</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-500">
              {settings.siteDescription}
            </p>
            <div className="flex gap-4">
              <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600">
                <Facebook className="h-5 w-5" />
              </a>
              <a href={settings.youtubeUrl} target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Quick Links</h3>
            <ul className="mt-6 space-y-4">
              {settings.headerLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm font-medium text-gray-500 transition-colors hover:text-indigo-600">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Support</h3>
            <ul className="mt-6 space-y-4">
              {settings.footerLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm font-medium text-gray-500 transition-colors hover:text-indigo-600">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Contact Us</h3>
            <ul className="mt-6 space-y-4">
              <li className="flex items-center gap-3 text-sm font-medium text-gray-500">
                <Mail className="h-5 w-5 text-indigo-600" />
                {settings.contactEmail}
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-gray-500">
                <Phone className="h-5 w-5 text-indigo-600" />
                {settings.contactPhone}
              </li>
              <li className="flex items-start gap-3 text-sm font-medium text-gray-500">
                <MapPin className="h-5 w-5 text-indigo-600" />
                Dhaka, Bangladesh
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-24 border-t border-gray-100 pt-12">
          <p className="text-center text-sm font-medium text-gray-400">
            {settings.footerText}
          </p>
        </div>
      </div>
    </footer>
  );
}
