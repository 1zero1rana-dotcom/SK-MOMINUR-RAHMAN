export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  bkashNumber: string;
  paymentInstructions: string;
  footerText: string;
  contactEmail: string;
  contactPhone: string;
  facebookUrl: string;
  youtubeUrl: string;
  language: "en" | "bn";
  headerLinks: { name: string; path: string }[];
  footerLinks: { name: string; path: string }[];
}

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "ICT Masterclass",
  siteDescription: "Master HSC ICT with Redwan's Method",
  heroTitle: "Master HSC ICT with Redwan's Method",
  heroSubtitle: "Join the most comprehensive online ICT learning platform in Bangladesh. High-quality content, expert support, and proven results.",
  bkashNumber: "017XXXXXXXX",
  paymentInstructions: "Send the course fee to our bKash number and provide the Transaction ID below.",
  footerText: "© 2026 ICT Masterclass. All rights reserved.",
  contactEmail: "support@ictmasterclass.com",
  contactPhone: "+880 1XXX XXXXXX",
  facebookUrl: "https://facebook.com",
  youtubeUrl: "https://youtube.com",
  language: "bn",
  headerLinks: [
    { name: "Courses", path: "/courses" },
    { name: "About", path: "/about" },
    { name: "Community", path: "/community" },
  ],
  footerLinks: [
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
    { name: "Refund Policy", path: "/refund" },
  ],
};
