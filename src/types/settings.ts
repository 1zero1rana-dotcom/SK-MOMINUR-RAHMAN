export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
  heroFeatures: string[];
  statsLabel: string;
  statsValue: string;
  categoriesTitle: string;
  categoriesSubtitle: string;
  coursesTitle: string;
  coursesSubtitle: string;
  ctaTitle: string;
  ctaSubtitle: string;
  testimonialsTitle: string;
  testimonialsSubtitle: string;
  testimonialsDescription: string;
  bkashNumber: string;
  paymentInstructions: string;
  footerText: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  facebookUrl: string;
  youtubeUrl: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  language: "en" | "bn";
  headerLinks: { name: string; path: string }[];
  footerLinks: { name: string; path: string }[];
  stats: { label: string; value: string; icon: string; color: string }[];
  testimonials: { name: string; role: string; content: string; avatar: string; rating: number }[];
  slides: { id: string; type: "image" | "video"; url: string; title?: string; subtitle?: string; buttonText?: string; buttonLink?: string }[];
  theme: {
    header: { bgColor: string; textColor: string; height: string; isSticky: boolean };
    body: { bgColor: string; textColor: string };
    footer: { bgColor: string; textColor: string; borderColor: string };
  };
  homeSections: { id: string; type: "slider" | "hero" | "categories" | "courses" | "cta" | "testimonials" | "custom_html"; visible: boolean; order: number; title?: string; subtitle?: string; content?: string }[];
}

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "ICT Masterclass",
  siteDescription: "Master HSC ICT with Rana Sir's Method",
  heroTitle: "Master HSC ICT with Rana Sir's Method",
  heroSubtitle: "Join the most comprehensive online ICT learning platform in Bangladesh. High-quality content, expert support, and proven results.",
  heroBadge: "Admission Batch 2026 is Open!",
  heroFeatures: ["Expert Instructors", "Interactive Quizzes", "Lifetime Access"],
  statsLabel: "Active Students",
  statsValue: "500,000+",
  categoriesTitle: "Categories",
  categoriesSubtitle: "Choose Your Learning Path",
  coursesTitle: "Our Courses",
  coursesSubtitle: "Featured Online Batches",
  ctaTitle: "Ready to Ace Your Exam?",
  ctaSubtitle: "Join thousands of students who are already learning with us. Get lifetime access to high-quality content and expert support.",
  testimonialsTitle: "Testimonials",
  testimonialsSubtitle: "What Our Students Say",
  testimonialsDescription: "Join thousands of satisfied students who have transformed their learning experience with us.",
  bkashNumber: "017XXXXXXXX",
  paymentInstructions: "Send the course fee to our bKash number and provide the Transaction ID below.",
  footerText: "© 2026 ICT Masterclass. All rights reserved.",
  contactEmail: "support@ictmasterclass.com",
  contactPhone: "+880 1XXX XXXXXX",
  contactAddress: "Dhaka, Bangladesh",
  facebookUrl: "https://facebook.com",
  youtubeUrl: "https://youtube.com",
  logoUrl: "",
  primaryColor: "#4f46e5", // indigo-600
  secondaryColor: "#6366f1", // indigo-500
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
  stats: [
    { label: "Students Enrolled", value: "500k+", icon: "Users", color: "bg-blue-50 text-blue-600" },
    { label: "Total Lessons", value: "1,200+", icon: "BookOpen", color: "bg-indigo-50 text-indigo-600" },
    { label: "Success Rate", value: "98%", icon: "Trophy", color: "bg-yellow-50 text-yellow-600" },
    { label: "Average Rating", value: "4.9/5", icon: "Star", color: "bg-green-50 text-green-600" },
  ],
  testimonials: [
    {
      name: "Tanvir Ahmed",
      role: "HSC 2025 Batch",
      content: "Rana Sir's ICT course is a game-changer. The way he explains C programming is just amazing. I used to be afraid of coding, but now I love it!",
      avatar: "https://i.pravatar.cc/150?u=tanvir",
      rating: 5,
    },
    {
      name: "Sadia Islam",
      role: "HSC 2024 Batch",
      content: "The interactive quizzes and chapter-wise notes helped me a lot. I got A+ in ICT thanks to this platform. Highly recommended for all HSC students.",
      avatar: "https://i.pravatar.cc/150?u=sadia",
      rating: 5,
    },
    {
      name: "Fahim Shahriar",
      role: "Admission 2025",
      content: "Best platform for ICT in Bangladesh. The quality of content and the support from the community is unmatched. It feels like a real classroom.",
      avatar: "https://i.pravatar.cc/150?u=fahim",
      rating: 5,
    },
  ],
  slides: [
    {
      id: "1",
      type: "image",
      url: "https://picsum.photos/seed/slide1/1920/1080",
      title: "Master HSC ICT with Rana Sir",
      subtitle: "The most comprehensive online platform for ICT in Bangladesh.",
      buttonText: "Enroll Now",
      buttonLink: "/courses"
    }
  ],
  theme: {
    header: { bgColor: "#ffffff", textColor: "#111827", height: "64px", isSticky: true },
    body: { bgColor: "#f9fafb", textColor: "#111827" },
    footer: { bgColor: "#ffffff", textColor: "#111827", borderColor: "#f3f4f6" }
  },
  homeSections: [
    { id: "s1", type: "slider", visible: true, order: 0 },
    { id: "s2", type: "hero", visible: true, order: 1 },
    { id: "s3", type: "categories", visible: true, order: 2 },
    { id: "s4", type: "courses", visible: true, order: 3 },
    { id: "s5", type: "cta", visible: true, order: 4 },
    { id: "s6", type: "testimonials", visible: true, order: 5 },
  ],
};
