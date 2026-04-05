import { Link } from "react-router-dom";
import { BookOpen, Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { useSettings } from "../contexts/SettingsContext";

export default function Footer() {
  const { settings } = useSettings();

  return (
    <footer 
      className="pt-24 pb-12 border-t transition-all"
      style={{ 
        backgroundColor: settings.theme.footer.bgColor, 
        color: settings.theme.footer.textColor,
        borderColor: settings.theme.footer.borderColor
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt={settings.siteName} className="h-10 w-auto object-contain" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                  <BookOpen className="h-6 w-6" />
                </div>
              )}
              <span className="text-xl font-bold tracking-tight" style={{ color: settings.theme.footer.textColor }}>
                {settings.siteName.split(' ')[0]} <span className="text-primary">{settings.siteName.split(' ').slice(1).join(' ')}</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed opacity-70">
              {settings.siteDescription}
            </p>
            <div className="flex gap-4">
              <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-primary/5 hover:text-primary" style={{ backgroundColor: `${settings.theme.footer.textColor}0D`, color: `${settings.theme.footer.textColor}66` }}>
                <Facebook className="h-5 w-5" />
              </a>
              <a href={settings.youtubeUrl} target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-primary/5 hover:text-primary" style={{ backgroundColor: `${settings.theme.footer.textColor}0D`, color: `${settings.theme.footer.textColor}66` }}>
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: settings.theme.footer.textColor }}>Quick Links</h3>
            <ul className="mt-6 space-y-4">
              {settings.headerLinks?.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm font-medium opacity-70 transition-colors hover:text-primary hover:opacity-100">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: settings.theme.footer.textColor }}>Support</h3>
            <ul className="mt-6 space-y-4">
              {settings.footerLinks?.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm font-medium opacity-70 transition-colors hover:text-primary hover:opacity-100">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: settings.theme.footer.textColor }}>Contact Us</h3>
            <ul className="mt-6 space-y-4">
              <li className="flex items-center gap-3 text-sm font-medium opacity-70">
                <Mail className="h-5 w-5 text-primary" />
                {settings.contactEmail}
              </li>
              <li className="flex items-center gap-3 text-sm font-medium opacity-70">
                <Phone className="h-5 w-5 text-primary" />
                {settings.contactPhone}
              </li>
              <li className="flex items-start gap-3 text-sm font-medium opacity-70">
                <MapPin className="h-5 w-5 text-primary" />
                {settings.contactAddress}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-24 border-t pt-12" style={{ borderColor: settings.theme.footer.borderColor }}>
          <p className="text-center text-sm font-medium opacity-50">
            {settings.footerText}
          </p>
        </div>
      </div>
    </footer>
  );
}
