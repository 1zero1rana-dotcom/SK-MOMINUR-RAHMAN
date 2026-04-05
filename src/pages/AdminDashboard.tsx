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
  ShieldAlert,
  LogOut,
  Play,
  Globe,
  Facebook,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Menu,
  Save,
  Image as ImageIcon,
  Palette,
  MoveUp,
  MoveDown,
  Trophy,
  Star,
  Layout,
  Clock
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
import { db, auth, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL, uploadString } from "firebase/storage";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

const adminNavItems = [
  { name: "Overview", icon: LayoutDashboard, id: "overview" },
  { name: "Payments", icon: CreditCard, id: "payments" },
  { name: "Courses", icon: BookOpen, id: "courses" },
  { name: "Students", icon: Users, id: "students" },
  { name: "Page Builder", icon: Layout, id: "builder" },
  { name: "Slider", icon: ImageIcon, id: "slider" },
  { name: "Theme", icon: Palette, id: "theme" },
  { name: "Settings", icon: Settings, id: "settings" },
];

import { useSettings } from "../contexts/SettingsContext";

function FileUpload({ 
  onUpload, 
  path, 
  accept = "image/*", 
  label = "Upload", 
  className = "" 
}: { 
  onUpload: (url: string) => void; 
  path: string; 
  accept?: string; 
  label?: string; 
  className?: string;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setProgress(0);

    try {
      console.log("FileUpload: Starting simple upload to path:", path, "File:", file.name, "Size:", file.size);
      console.log("Current Auth User:", auth.currentUser?.uid || "Not Logged In");
      
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const storageRef = ref(storage, `${path}/${Date.now()}_${sanitizedName}`);
      
      // Use uploadBytes for better reliability in this environment
      const result = await uploadBytes(storageRef, file);
      console.log("FileUpload: Simple upload success! Getting download URL...");
      
      const url = await getDownloadURL(result.ref);
      console.log("FileUpload success! URL:", url);
      onUpload(url);
      setIsUploading(false);
      setProgress(100);
    } catch (error: any) {
      console.error("FileUpload error:", error.code, error.message);
      setIsUploading(false);
      alert(`Upload failed (${error.code}): ${error.message}. Please check your internet connection or try a smaller file.`);
    }
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <input 
        type="file" 
        accept={accept} 
        onChange={handleFileChange}
        className="absolute inset-0 opacity-0 cursor-pointer z-10"
        disabled={isUploading}
      />
      <button 
        type="button"
        className={cn(
          "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all",
          isUploading ? "bg-gray-100 text-gray-400" : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
        )}
      >
        {isUploading ? (
          <>
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            {progress > 0 ? `${Math.round(progress)}%` : "Uploading..."}
          </>
        ) : (
          <>
            <Plus className="h-3 w-3" />
            {label}
          </>
        )}
      </button>
    </div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { user, loading, role } = useAuth();
  const { settings, updateSettings } = useSettings();
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
          {activeTab === "builder" && <AdminBuilder settings={settings} onUpdate={updateSettings} />}
          {activeTab === "slider" && <AdminSlider settings={settings} onUpdate={updateSettings} />}
          {activeTab === "theme" && <AdminTheme settings={settings} onUpdate={updateSettings} />}
          {activeTab === "settings" && <AdminSettings settings={settings} onUpdate={updateSettings} />}
        </div>
      </main>
    </div>
  );
}

function AdminSettings({ settings, onUpdate }: { settings: any; onUpdate: (s: any) => Promise<void> }) {
  const [isSaving, setIsSaving] = useState(false);
  const [headerLinks, setHeaderLinks] = useState(settings.headerLinks || []);
  const [heroFeatures, setHeroFeatures] = useState(settings.heroFeatures || []);
  const [stats, setStats] = useState(settings.stats || []);
  const [testimonials, setTestimonials] = useState(settings.testimonials || []);
  const [primaryColor, setPrimaryColor] = useState(settings.primaryColor || "#4f46e5");
  const [secondaryColor, setSecondaryColor] = useState(settings.secondaryColor || "#6366f1");
  const [footerLinks, setFooterLinks] = useState(settings.footerLinks || []);

  useEffect(() => {
    setHeaderLinks(settings.headerLinks || []);
    setHeroFeatures(settings.heroFeatures || []);
    setStats(settings.stats || []);
    setTestimonials(settings.testimonials || []);
    setPrimaryColor(settings.primaryColor || "#4f46e5");
    setSecondaryColor(settings.secondaryColor || "#6366f1");
    setFooterLinks(settings.footerLinks || []);
  }, [settings]);

  const handleAddLink = () => {
    setHeaderLinks([...headerLinks, { name: "New Link", path: "/" }]);
  };

  const handleRemoveLink = (index: number) => {
    setHeaderLinks(headerLinks.filter((_: any, i: number) => i !== index));
  };

  const handleLinkChange = (index: number, field: string, value: string) => {
    const newLinks = [...headerLinks];
    newLinks[index][field] = value;
    setHeaderLinks(newLinks);
  };

  const handleAddFooterLink = () => {
    setFooterLinks([...footerLinks, { name: "New Link", path: "/" }]);
  };

  const handleRemoveFooterLink = (index: number) => {
    setFooterLinks(footerLinks.filter((_: any, i: number) => i !== index));
  };

  const handleFooterLinkChange = (index: number, field: string, value: string) => {
    const newLinks = [...footerLinks];
    newLinks[index][field] = value;
    setFooterLinks(newLinks);
  };

  const handleAddFeature = () => {
    setHeroFeatures([...heroFeatures, "New Feature"]);
  };

  const handleRemoveFeature = (index: number) => {
    setHeroFeatures(heroFeatures.filter((_: any, i: number) => i !== index));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...heroFeatures];
    newFeatures[index] = value;
    setHeroFeatures(newFeatures);
  };

  const handleAddStat = () => {
    setStats([...stats, { label: "New Stat", value: "0", icon: "Users", color: "bg-blue-50 text-blue-600" }]);
  };

  const handleRemoveStat = (index: number) => {
    setStats(stats.filter((_: any, i: number) => i !== index));
  };

  const handleStatChange = (index: number, field: string, value: string) => {
    const newStats = [...stats];
    newStats[index][field] = value;
    setStats(newStats);
  };

  const handleAddTestimonial = () => {
    setTestimonials([...testimonials, { name: "Student Name", role: "Batch", content: "Feedback", avatar: "https://i.pravatar.cc/150", rating: 5 }]);
  };

  const handleRemoveTestimonial = (index: number) => {
    setTestimonials(testimonials.filter((_: any, i: number) => i !== index));
  };

  const handleTestimonialChange = (index: number, field: string, value: any) => {
    const newTestimonials = [...testimonials];
    newTestimonials[index][field] = value;
    setTestimonials(newTestimonials);
  };

  const [testStatus, setTestStatus] = useState<string | null>(null);

  const testStorage = async () => {
    setTestStatus("Testing Storage (Simple Upload)... Attempting to write to 'test/' folder.");
    try {
      const testRef = ref(storage, `test/connection_test_${Date.now()}.txt`);
      const testContent = "Storage connection test successful!";
      
      console.log("Testing Simple Upload to:", testRef.fullPath);
      console.log("Bucket:", storage.app.options.storageBucket);
      console.log("Current Auth State:", auth.currentUser ? `Logged in as ${auth.currentUser.uid}` : "Not logged in");
      
      // CORS Diagnostic: Try a simple fetch to the storage API
      try {
        const bucket = storage.app.options.storageBucket;
        console.log("Running CORS diagnostic fetch to:", `https://firebasestorage.googleapis.com/v0/b/${bucket}/o`);
        const fetchResponse = await fetch(`https://firebasestorage.googleapis.com/v0/b/${bucket}/o`, { method: 'GET' });
        console.log("CORS Diagnostic: Fetch status:", fetchResponse.status);
      } catch (fetchErr) {
        console.error("CORS Diagnostic: Fetch failed (This confirms a CORS or Network issue):", fetchErr);
      }
      
      // Add a timeout to the upload test
      const uploadPromise = uploadString(testRef, testContent);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Upload timed out after 15 seconds. This usually indicates a CORS or network issue.")), 15000)
      );

      await Promise.race([uploadPromise, timeoutPromise]);
      
      const url = await getDownloadURL(testRef);
      setTestStatus(`Success! Storage is working. Test file: ${url}`);
      console.log("Storage test success:", url);
    } catch (err: any) {
      console.error("Storage test failed:", err);
      let msg = err.message;
      if (err.code === 'storage/unauthorized') msg = "Unauthorized. Check your storage.rules.";
      if (err.code === 'storage/retry-limit-exceeded') msg = "Network error or CORS issue.";
      setTestStatus(`Storage test failed: ${msg}`);
      
      // Diagnostic hint
      console.log("Diagnostic: If this hangs at 0% or times out, check if your Firebase project has Storage enabled and if CORS is configured for the bucket.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.target as HTMLFormElement);
    
    const newSettings = {
      siteName: formData.get("siteName") as string,
      siteDescription: formData.get("siteDescription") as string,
      heroTitle: formData.get("heroTitle") as string,
      heroSubtitle: formData.get("heroSubtitle") as string,
      heroBadge: formData.get("heroBadge") as string,
      statsLabel: formData.get("statsLabel") as string,
      statsValue: formData.get("statsValue") as string,
      categoriesTitle: formData.get("categoriesTitle") as string,
      categoriesSubtitle: formData.get("categoriesSubtitle") as string,
      coursesTitle: formData.get("coursesTitle") as string,
      coursesSubtitle: formData.get("coursesSubtitle") as string,
      ctaTitle: formData.get("ctaTitle") as string,
      ctaSubtitle: formData.get("ctaSubtitle") as string,
      testimonialsTitle: formData.get("testimonialsTitle") as string,
      testimonialsSubtitle: formData.get("testimonialsSubtitle") as string,
      testimonialsDescription: formData.get("testimonialsDescription") as string,
      bkashNumber: formData.get("bkashNumber") as string,
      paymentInstructions: formData.get("paymentInstructions") as string,
      footerText: formData.get("footerText") as string,
      contactEmail: formData.get("contactEmail") as string,
      contactPhone: formData.get("contactPhone") as string,
      contactAddress: formData.get("contactAddress") as string,
      facebookUrl: formData.get("facebookUrl") as string,
      youtubeUrl: formData.get("youtubeUrl") as string,
      primaryColor,
      secondaryColor,
      logoUrl: settings.logoUrl,
      headerLinks,
      footerLinks,
      heroFeatures,
      stats,
      testimonials,
      language: formData.get("language") as string,
    };

    console.log("Saving settings:", newSettings);

    try {
      await onUpdate(newSettings);
      alert("Settings updated successfully!");
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("Failed to update settings. Please check console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-12 pb-24">
      <header>
        <h1 className="text-3xl font-black tracking-tight text-gray-900">Site Customization</h1>
        <p className="mt-2 text-lg text-gray-600">Manage logo, menu, colors, and global content.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* General Settings */}
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Settings className="h-5 w-5 text-indigo-600" />
              General Identity
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700">Site Name</label>
                <input name="siteName" defaultValue={settings.siteName} type="text" className="mt-1 block w-full rounded-xl border-0 bg-gray-50 py-3 px-4 ring-1 ring-gray-200" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">Site Description</label>
                <textarea name="siteDescription" defaultValue={settings.siteDescription} rows={2} className="mt-1 block w-full rounded-xl border-0 bg-gray-50 py-3 px-4 ring-1 ring-gray-200" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700">Primary Color</label>
                  <div className="mt-1 flex items-center gap-2">
                    <input 
                      name="primaryColor" 
                      value={primaryColor} 
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      type="color" 
                      className="h-10 w-10 rounded-lg border-0 bg-transparent p-0 cursor-pointer" 
                    />
                    <input 
                      type="text" 
                      value={primaryColor} 
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1 rounded-xl border-0 bg-gray-50 py-2 px-3 text-xs ring-1 ring-gray-200" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700">Secondary Color</label>
                  <div className="mt-1 flex items-center gap-2">
                    <input 
                      name="secondaryColor" 
                      value={secondaryColor} 
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      type="color" 
                      className="h-10 w-10 rounded-lg border-0 bg-transparent p-0 cursor-pointer" 
                    />
                    <input 
                      type="text" 
                      value={secondaryColor} 
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="flex-1 rounded-xl border-0 bg-gray-50 py-2 px-3 text-xs ring-1 ring-gray-200" 
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700">Logo</label>
                <div className="mt-2 space-y-3">
                  <div className="flex items-center gap-4">
                    {settings.logoUrl && (
                      <img src={settings.logoUrl} alt="Logo" className="h-12 w-12 rounded-lg object-contain ring-1 ring-gray-200 p-1 bg-white" />
                    )}
                    <div className="flex-1">
                      <input 
                        name="logoUrl" 
                        value={settings.logoUrl} 
                        onChange={(e) => onUpdate({ ...settings, logoUrl: e.target.value })}
                        type="text" 
                        placeholder="Logo URL (e.g. from ImgBB or PostImages)"
                        className="w-full rounded-xl border-0 bg-gray-50 py-2 px-3 text-xs ring-1 ring-gray-200 focus:ring-indigo-600 transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-gray-100" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">or</span>
                    <div className="h-px flex-1 bg-gray-100" />
                  </div>
                  <FileUpload 
                    path="site" 
                    label="Upload Logo"
                    className="w-full"
                    onUpload={async (url) => {
                      await onUpdate({ ...settings, logoUrl: url });
                    }}
                  />
                  <div className="rounded-xl bg-amber-50 p-3 border border-amber-100">
                    <p className="text-[10px] text-amber-800 font-medium leading-relaxed">
                      <strong>ImgBB Tip:</strong> Do not use the "Viewer Link" (e.g. ibb.co/XYZ). 
                      Instead, copy the <strong>Direct Link</strong> (e.g. i.ibb.co/XYZ/logo.png). 
                      The URL <strong>must</strong> end in .jpg, .png, or .webp.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Management */}
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Menu className="h-5 w-5 text-indigo-600" />
                Navigation Menu
              </h2>
              <button type="button" onClick={handleAddLink} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                <Plus className="h-3 w-3" /> Add Link
              </button>
            </div>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {headerLinks.map((link: any, index: number) => (
                <div key={index} className="flex items-center gap-2 rounded-xl bg-gray-50 p-3 ring-1 ring-gray-200">
                  <input 
                    type="text" 
                    value={link.name} 
                    onChange={(e) => handleLinkChange(index, "name", e.target.value)}
                    className="flex-1 bg-transparent text-sm font-bold text-gray-900 focus:outline-none"
                    placeholder="Link Name"
                  />
                  <input 
                    type="text" 
                    value={link.path} 
                    onChange={(e) => handleLinkChange(index, "path", e.target.value)}
                    className="flex-1 bg-transparent text-xs text-gray-500 focus:outline-none"
                    placeholder="/path"
                  />
                  <button type="button" onClick={() => handleRemoveLink(index)} className="text-gray-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Section */}
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-indigo-600" />
              Hero Section
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700">Hero Badge</label>
                <input name="heroBadge" defaultValue={settings.heroBadge} type="text" className="mt-1 block w-full rounded-xl border-0 bg-gray-50 py-3 px-4 ring-1 ring-gray-200" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">Hero Title</label>
                <input name="heroTitle" defaultValue={settings.heroTitle} type="text" className="mt-1 block w-full rounded-xl border-0 bg-gray-50 py-3 px-4 ring-1 ring-gray-200" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">Hero Subtitle</label>
                <textarea name="heroSubtitle" defaultValue={settings.heroSubtitle} rows={3} className="mt-1 block w-full rounded-xl border-0 bg-gray-50 py-3 px-4 ring-1 ring-gray-200" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-bold text-gray-700">Hero Features</label>
                  <button type="button" onClick={handleAddFeature} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                    <Plus className="h-3 w-3" /> Add Feature
                  </button>
                </div>
                <div className="space-y-2">
                  {heroFeatures.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <input 
                        type="text" 
                        value={feature} 
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        className="flex-1 rounded-xl border-0 bg-gray-50 py-2 px-3 text-sm ring-1 ring-gray-200" 
                      />
                      <button type="button" onClick={() => handleRemoveFeature(index)} className="text-gray-400 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700">Stats Label</label>
                  <input name="statsLabel" defaultValue={settings.statsLabel} type="text" className="mt-1 block w-full rounded-xl border-0 bg-gray-50 py-3 px-4 ring-1 ring-gray-200" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700">Stats Value</label>
                  <input name="statsValue" defaultValue={settings.statsValue} type="text" className="mt-1 block w-full rounded-xl border-0 bg-gray-50 py-3 px-4 ring-1 ring-gray-200" />
                </div>
              </div>
            </div>
          </div>

          {/* Home Page Sections */}
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-indigo-600" />
              Home Page Sections
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700">Categories Title</label>
                  <input name="categoriesTitle" defaultValue={settings.categoriesTitle} type="text" className="mt-1 block w-full rounded-xl border-0 bg-gray-50 py-3 px-4 ring-1 ring-gray-200" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700">Categories Subtitle</label>
                  <input name="categoriesSubtitle" defaultValue={settings.categoriesSubtitle} type="text" className="mt-1 block w-full rounded-xl border-0 bg-gray-50 py-3 px-4 ring-1 ring-gray-200" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700">Courses Title</label>
                  <input name="coursesTitle" defaultValue={settings.coursesTitle} type="text" className="mt-1 block w-full rounded-xl border-0 bg-gray-50 py-3 px-4 ring-1 ring-gray-200" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700">Courses Subtitle</label>
                  <input name="coursesSubtitle" defaultValue={settings.coursesSubtitle} type="text" className="mt-1 block w-full rounded-xl border-0 bg-gray-50 py-3 px-4 ring-1 ring-gray-200" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">CTA Title</label>
                <input name="ctaTitle" defaultValue={settings.ctaTitle} type="text" className="mt-1 block w-full rounded-xl border-0 bg-gray-50 py-3 px-4 ring-1 ring-gray-200" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">CTA Subtitle</label>
                <textarea name="ctaSubtitle" defaultValue={settings.ctaSubtitle} rows={2} className="mt-1 block w-full rounded-xl border-0 bg-gray-50 py-3 px-4 ring-1 ring-gray-200" />
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-indigo-600" />
                Stats Section
              </h2>
              <button type="button" onClick={handleAddStat} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                <Plus className="h-3 w-3" /> Add Stat
              </button>
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {stats.map((stat: any, index: number) => (
                <div key={index} className="space-y-3 rounded-xl bg-gray-50 p-4 ring-1 ring-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 uppercase">Stat #{index + 1}</span>
                    <button type="button" onClick={() => handleRemoveStat(index)} className="text-gray-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      type="text" 
                      value={stat.label} 
                      onChange={(e) => handleStatChange(index, "label", e.target.value)}
                      className="rounded-lg border-0 bg-white py-2 px-3 text-sm ring-1 ring-gray-200"
                      placeholder="Label"
                    />
                    <input 
                      type="text" 
                      value={stat.value} 
                      onChange={(e) => handleStatChange(index, "value", e.target.value)}
                      className="rounded-lg border-0 bg-white py-2 px-3 text-sm ring-1 ring-gray-200"
                      placeholder="Value"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      type="text" 
                      value={stat.icon} 
                      onChange={(e) => handleStatChange(index, "icon", e.target.value)}
                      className="rounded-lg border-0 bg-white py-2 px-3 text-sm ring-1 ring-gray-200"
                      placeholder="Lucide Icon Name"
                    />
                    <input 
                      type="text" 
                      value={stat.color} 
                      onChange={(e) => handleStatChange(index, "color", e.target.value)}
                      className="rounded-lg border-0 bg-white py-2 px-3 text-sm ring-1 ring-gray-200"
                      placeholder="Tailwind Color Classes"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100 space-y-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Star className="h-5 w-5 text-indigo-600" />
                Testimonials
              </h2>
              <button type="button" onClick={handleAddTestimonial} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                <Plus className="h-3 w-3" /> Add Testimonial
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="sm:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700">Section Title</label>
                  <input name="testimonialsTitle" defaultValue={settings.testimonialsTitle} type="text" className="mt-1 block w-full rounded-xl border-0 bg-gray-50 py-3 px-4 ring-1 ring-gray-200" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700">Section Subtitle</label>
                  <input name="testimonialsSubtitle" defaultValue={settings.testimonialsSubtitle} type="text" className="mt-1 block w-full rounded-xl border-0 bg-gray-50 py-3 px-4 ring-1 ring-gray-200" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700">Description</label>
                  <input name="testimonialsDescription" defaultValue={settings.testimonialsDescription} type="text" className="mt-1 block w-full rounded-xl border-0 bg-gray-50 py-3 px-4 ring-1 ring-gray-200" />
                </div>
              </div>
              {testimonials.map((testimonial: any, index: number) => (
                <div key={index} className="space-y-3 rounded-xl bg-gray-50 p-4 ring-1 ring-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 uppercase">Testimonial #{index + 1}</span>
                    <button type="button" onClick={() => handleRemoveTestimonial(index)} className="text-gray-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <input 
                    type="text" 
                    value={testimonial.name} 
                    onChange={(e) => handleTestimonialChange(index, "name", e.target.value)}
                    className="w-full rounded-lg border-0 bg-white py-2 px-3 text-sm ring-1 ring-gray-200"
                    placeholder="Student Name"
                  />
                  <input 
                    type="text" 
                    value={testimonial.role} 
                    onChange={(e) => handleTestimonialChange(index, "role", e.target.value)}
                    className="w-full rounded-lg border-0 bg-white py-2 px-3 text-sm ring-1 ring-gray-200"
                    placeholder="Role/Batch"
                  />
                  <textarea 
                    value={testimonial.content} 
                    onChange={(e) => handleTestimonialChange(index, "content", e.target.value)}
                    className="w-full rounded-lg border-0 bg-white py-2 px-3 text-sm ring-1 ring-gray-200"
                    rows={3}
                    placeholder="Feedback Content"
                  />
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase">Avatar</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={testimonial.avatar} 
                        onChange={(e) => handleTestimonialChange(index, "avatar", e.target.value)}
                        className="flex-1 rounded-lg border-0 bg-white py-2 px-3 text-xs ring-1 ring-gray-200"
                        placeholder="Avatar URL"
                      />
                      <FileUpload 
                        path="testimonials/avatars" 
                        onUpload={(url) => handleTestimonialChange(index, "avatar", url)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase">Rating (1-5)</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="5"
                      value={testimonial.rating} 
                      onChange={(e) => handleTestimonialChange(index, "rating", parseInt(e.target.value))}
                      className="w-full rounded-lg border-0 bg-white py-2 px-3 text-sm ring-1 ring-gray-200"
                      placeholder="Rating (1-5)"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Settings */}
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-indigo-600" />
              Payment Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700">bKash Number</label>
                <input name="bkashNumber" defaultValue={settings.bkashNumber} type="text" className="mt-1 block w-full rounded-xl border-0 bg-gray-50 py-3 px-4 ring-1 ring-gray-200" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">Payment Instructions</label>
                <textarea name="paymentInstructions" defaultValue={settings.paymentInstructions} rows={3} className="mt-1 block w-full rounded-xl border-0 bg-gray-50 py-3 px-4 ring-1 ring-gray-200" />
              </div>
            </div>
          </div>

          {/* Contact & Social */}
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-600" />
              Contact & Social
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700">Email</label>
                  <input name="contactEmail" defaultValue={settings.contactEmail} type="email" className="mt-1 block w-full rounded-xl border-0 bg-gray-50 py-3 px-4 ring-1 ring-gray-200" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700">Phone</label>
                  <input name="contactPhone" defaultValue={settings.contactPhone} type="text" className="mt-1 block w-full rounded-xl border-0 bg-gray-50 py-3 px-4 ring-1 ring-gray-200" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">Address</label>
                <input name="contactAddress" defaultValue={settings.contactAddress} type="text" className="mt-1 block w-full rounded-xl border-0 bg-gray-50 py-3 px-4 ring-1 ring-gray-200" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">Facebook URL</label>
                <input name="facebookUrl" defaultValue={settings.facebookUrl} type="text" className="mt-1 block w-full rounded-xl border-0 bg-gray-50 py-3 px-4 ring-1 ring-gray-200" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">YouTube URL</label>
                <input name="youtubeUrl" defaultValue={settings.youtubeUrl} type="text" className="mt-1 block w-full rounded-xl border-0 bg-gray-50 py-3 px-4 ring-1 ring-gray-200" />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100 space-y-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-600" />
                Footer Content
              </h2>
              <button type="button" onClick={handleAddFooterLink} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                <Plus className="h-3 w-3" /> Add Footer Link
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700">Footer Copyright Text</label>
                <input name="footerText" defaultValue={settings.footerText} type="text" className="mt-1 block w-full rounded-xl border-0 bg-gray-50 py-3 px-4 ring-1 ring-gray-200" />
              </div>
              
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700">Footer Links</label>
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                  {footerLinks.map((link: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 rounded-xl bg-gray-50 p-2 ring-1 ring-gray-200">
                      <input 
                        type="text" 
                        value={link.name} 
                        onChange={(e) => handleFooterLinkChange(index, "name", e.target.value)}
                        className="flex-1 bg-transparent text-xs font-bold text-gray-900 focus:outline-none"
                        placeholder="Link Name"
                      />
                      <input 
                        type="text" 
                        value={link.path} 
                        onChange={(e) => handleFooterLinkChange(index, "path", e.target.value)}
                        className="flex-1 bg-transparent text-[10px] text-gray-500 focus:outline-none"
                        placeholder="/path"
                      />
                      <button type="button" onClick={() => handleRemoveFooterLink(index)} className="text-gray-400 hover:text-red-600">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-2xl bg-indigo-600 px-12 py-4 font-bold text-white shadow-xl shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 transition-all hover:scale-105"
          >
            {isSaving ? "Saving..." : "Save All Settings"}
          </button>
        </div>
      </form>
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

function AdminBuilder({ settings, onUpdate }: { settings: any; onUpdate: (s: any) => Promise<void> }) {
  const [sections, setSections] = useState(settings.homeSections || []);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggleVisibility = (id: string) => {
    setSections(sections.map((s: any) => s.id === id ? { ...s, visible: !s.visible } : s));
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const newSections = [...sections];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;
    
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    
    // Update order property
    newSections.forEach((s, i) => s.order = i);
    setSections(newSections);
  };

  const handleAddSection = (type: any) => {
    setSections([...sections, { 
      id: Date.now().toString(), 
      type, 
      visible: true, 
      order: sections.length,
      content: type === "custom_html" ? "<div class='py-12 text-center'><h2 class='text-3xl font-bold'>New Custom Section</h2></div>" : ""
    }]);
  };

  const handleRemoveSection = (id: string) => {
    setSections(sections.filter((s: any) => s.id !== id));
  };

  const handleContentChange = (id: string, content: string) => {
    setSections(sections.map((s: any) => s.id === id ? { ...s, content } : s));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate({ ...settings, homeSections: sections });
      console.log("Builder settings saved!");
    } catch (error) {
      console.error("Error saving builder settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Page Builder</h1>
          <p className="mt-2 text-lg text-gray-600">Reorder and toggle visibility of home page sections.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <select 
              className="rounded-xl border-0 bg-white py-2 px-4 text-sm ring-1 ring-gray-200"
              onChange={(e) => e.target.value && handleAddSection(e.target.value)}
              value=""
            >
              <option value="">Add Section...</option>
              <option value="hero">Hero</option>
              <option value="stats">Stats</option>
              <option value="categories">Categories</option>
              <option value="courses">Courses</option>
              <option value="cta">CTA</option>
              <option value="testimonials">Testimonials</option>
              <option value="custom_html">Custom HTML</option>
            </select>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700 disabled:opacity-50"
          >
            <Save className="h-5 w-5" />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </header>

      <div className="space-y-4">
        {sections.sort((a: any, b: any) => a.order - b.order).map((section: any, index: number) => (
          <div key={section.id} className="space-y-4">
            <div 
              className={cn(
                "flex items-center justify-between rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all",
                !section.visible && "opacity-50 grayscale"
              )}
            >
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-1">
                  <button 
                    onClick={() => handleMove(index, "up")} 
                    disabled={index === 0}
                    className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                  >
                    <MoveUp className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleMove(index, "down")} 
                    disabled={index === sections.length - 1}
                    className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                  >
                    <MoveDown className="h-4 w-4" />
                  </button>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 capitalize">{section.type.replace('_', ' ')}</h3>
                  <p className="text-xs text-gray-500">Section ID: {section.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleToggleVisibility(section.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all",
                    section.visible ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                  )}
                >
                  {section.visible ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  {section.visible ? "Visible" : "Hidden"}
                </button>
                <button
                  onClick={() => handleRemoveSection(section.id)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {section.type === "custom_html" && (
              <div className="rounded-3xl bg-gray-50 p-6 ring-1 ring-gray-200">
                <label className="block text-sm font-bold text-gray-700 mb-2">Custom HTML Content</label>
                <textarea
                  value={section.content || ""}
                  onChange={(e) => handleContentChange(section.id, e.target.value)}
                  rows={5}
                  className="w-full rounded-2xl border-0 bg-white p-4 font-mono text-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500"
                  placeholder="<div>Your HTML here...</div>"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminSlider({ settings, onUpdate }: { settings: any; onUpdate: (s: any) => Promise<void> }) {
  const [slides, setSlides] = useState(settings.slides || []);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddSlide = () => {
    setSlides([...slides, { 
      id: Date.now().toString(), 
      type: "image", 
      url: "https://picsum.photos/seed/new/1920/1080",
      title: "New Slide Title",
      subtitle: "New slide subtitle text goes here.",
      buttonText: "Learn More",
      buttonLink: "/"
    }]);
  };

  const handleRemoveSlide = (id: string) => {
    setSlides(slides.filter((s: any) => s.id !== id));
  };

  const handleSlideChange = (id: string, field: string, value: string) => {
    setSlides(slides.map((s: any) => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate({ ...settings, slides });
      console.log("Slider settings saved!");
    } catch (error) {
      console.error("Error saving slider settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Home Slider</h1>
          <p className="mt-2 text-lg text-gray-600">Manage images and videos for the main home page slider.</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleAddSlide}
            className="flex items-center gap-2 rounded-2xl bg-white border border-gray-200 px-6 py-3 font-bold text-gray-700 shadow-sm transition-all hover:bg-gray-50"
          >
            <Plus className="h-5 w-5" />
            Add Slide
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700 disabled:opacity-50"
          >
            <Save className="h-5 w-5" />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {slides.map((slide: any) => (
          <div key={slide.id} className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100 space-y-6 relative group">
            <button 
              onClick={() => handleRemoveSlide(slide.id)}
              className="absolute top-4 right-4 p-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 className="h-5 w-5" />
            </button>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700">Type</label>
                  <select 
                    value={slide.type} 
                    onChange={(e) => handleSlideChange(slide.id, "type", e.target.value)}
                    className="mt-1 block w-full rounded-xl border-0 bg-gray-50 py-3 px-4 ring-1 ring-gray-200"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700">Media URL</label>
                  <div className="mt-1 flex gap-2">
                    <input 
                      type="text" 
                      value={slide.url} 
                      onChange={(e) => handleSlideChange(slide.id, "url", e.target.value)}
                      className="flex-1 rounded-xl border-0 bg-gray-50 py-3 px-4 ring-1 ring-gray-200"
                      placeholder="https://..."
                    />
                    <FileUpload 
                      path="slider" 
                      accept={slide.type === "video" ? "video/*" : "image/*"}
                      onUpload={(url) => handleSlideChange(slide.id, "url", url)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700">Title</label>
                <input 
                  type="text" 
                  value={slide.title} 
                  onChange={(e) => handleSlideChange(slide.id, "title", e.target.value)}
                  className="mt-1 block w-full rounded-xl border-0 bg-gray-50 py-3 px-4 ring-1 ring-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700">Subtitle</label>
                <textarea 
                  value={slide.subtitle} 
                  onChange={(e) => handleSlideChange(slide.id, "subtitle", e.target.value)}
                  rows={2}
                  className="mt-1 block w-full rounded-xl border-0 bg-gray-50 py-3 px-4 ring-1 ring-gray-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700">Button Text</label>
                  <input 
                    type="text" 
                    value={slide.buttonText} 
                    onChange={(e) => handleSlideChange(slide.id, "buttonText", e.target.value)}
                    className="mt-1 block w-full rounded-xl border-0 bg-gray-50 py-3 px-4 ring-1 ring-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700">Button Link</label>
                  <input 
                    type="text" 
                    value={slide.buttonLink} 
                    onChange={(e) => handleSlideChange(slide.id, "buttonLink", e.target.value)}
                    className="mt-1 block w-full rounded-xl border-0 bg-gray-50 py-3 px-4 ring-1 ring-gray-200"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminTheme({ settings, onUpdate }: { settings: any; onUpdate: (s: any) => Promise<void> }) {
  const [theme, setTheme] = useState(settings.theme || {
    header: { bgColor: "#ffffff", textColor: "#111827", height: "64px", isSticky: true },
    body: { bgColor: "#f9fafb", textColor: "#111827" },
    footer: { bgColor: "#ffffff", textColor: "#111827", borderColor: "#f3f4f6" }
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleThemeChange = (section: string, field: string, value: any) => {
    setTheme({
      ...theme,
      [section]: {
        ...theme[section as keyof typeof theme],
        [field]: value
      }
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate({ ...settings, theme });
      console.log("Theme settings saved!");
    } catch (error) {
      console.error("Error saving theme settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Theme Customization</h1>
          <p className="mt-2 text-lg text-gray-600">Customize colors and layout for header, body, and footer.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700 disabled:opacity-50"
        >
          <Save className="h-5 w-5" />
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Header Theme */}
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100 space-y-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Menu className="h-5 w-5 text-indigo-600" />
            Header
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700">Background Color</label>
              <div className="mt-1 flex items-center gap-2">
                <input 
                  type="color" 
                  value={theme.header.bgColor} 
                  onChange={(e) => handleThemeChange("header", "bgColor", e.target.value)}
                  className="h-10 w-10 rounded-lg border-0 bg-transparent p-0 cursor-pointer" 
                />
                <input 
                  type="text" 
                  value={theme.header.bgColor} 
                  onChange={(e) => handleThemeChange("header", "bgColor", e.target.value)}
                  className="flex-1 rounded-xl border-0 bg-gray-50 py-2 px-3 text-xs ring-1 ring-gray-200" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700">Text Color</label>
              <div className="mt-1 flex items-center gap-2">
                <input 
                  type="color" 
                  value={theme.header.textColor} 
                  onChange={(e) => handleThemeChange("header", "textColor", e.target.value)}
                  className="h-10 w-10 rounded-lg border-0 bg-transparent p-0 cursor-pointer" 
                />
                <input 
                  type="text" 
                  value={theme.header.textColor} 
                  onChange={(e) => handleThemeChange("header", "textColor", e.target.value)}
                  className="flex-1 rounded-xl border-0 bg-gray-50 py-2 px-3 text-xs ring-1 ring-gray-200" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700">Height</label>
              <input 
                type="text" 
                value={theme.header.height} 
                onChange={(e) => handleThemeChange("header", "height", e.target.value)}
                className="mt-1 block w-full rounded-xl border-0 bg-gray-50 py-3 px-4 ring-1 ring-gray-200"
                placeholder="64px"
              />
            </div>
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={theme.header.isSticky} 
                onChange={(e) => handleThemeChange("header", "isSticky", e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label className="text-sm font-bold text-gray-700">Sticky Header</label>
            </div>
          </div>
        </div>

        {/* Body Theme */}
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100 space-y-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Layout className="h-5 w-5 text-indigo-600" />
            Body
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700">Background Color</label>
              <div className="mt-1 flex items-center gap-2">
                <input 
                  type="color" 
                  value={theme.body.bgColor} 
                  onChange={(e) => handleThemeChange("body", "bgColor", e.target.value)}
                  className="h-10 w-10 rounded-lg border-0 bg-transparent p-0 cursor-pointer" 
                />
                <input 
                  type="text" 
                  value={theme.body.bgColor} 
                  onChange={(e) => handleThemeChange("body", "bgColor", e.target.value)}
                  className="flex-1 rounded-xl border-0 bg-gray-50 py-2 px-3 text-xs ring-1 ring-gray-200" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700">Text Color</label>
              <div className="mt-1 flex items-center gap-2">
                <input 
                  type="color" 
                  value={theme.body.textColor} 
                  onChange={(e) => handleThemeChange("body", "textColor", e.target.value)}
                  className="h-10 w-10 rounded-lg border-0 bg-transparent p-0 cursor-pointer" 
                />
                <input 
                  type="text" 
                  value={theme.body.textColor} 
                  onChange={(e) => handleThemeChange("body", "textColor", e.target.value)}
                  className="flex-1 rounded-xl border-0 bg-gray-50 py-2 px-3 text-xs ring-1 ring-gray-200" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Theme */}
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100 space-y-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            Footer
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700">Background Color</label>
              <div className="mt-1 flex items-center gap-2">
                <input 
                  type="color" 
                  value={theme.footer.bgColor} 
                  onChange={(e) => handleThemeChange("footer", "bgColor", e.target.value)}
                  className="h-10 w-10 rounded-lg border-0 bg-transparent p-0 cursor-pointer" 
                />
                <input 
                  type="text" 
                  value={theme.footer.bgColor} 
                  onChange={(e) => handleThemeChange("footer", "bgColor", e.target.value)}
                  className="flex-1 rounded-xl border-0 bg-gray-50 py-2 px-3 text-xs ring-1 ring-gray-200" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700">Text Color</label>
              <div className="mt-1 flex items-center gap-2">
                <input 
                  type="color" 
                  value={theme.footer.textColor} 
                  onChange={(e) => handleThemeChange("footer", "textColor", e.target.value)}
                  className="h-10 w-10 rounded-lg border-0 bg-transparent p-0 cursor-pointer" 
                />
                <input 
                  type="text" 
                  value={theme.footer.textColor} 
                  onChange={(e) => handleThemeChange("footer", "textColor", e.target.value)}
                  className="flex-1 rounded-xl border-0 bg-gray-50 py-2 px-3 text-xs ring-1 ring-gray-200" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700">Border Color</label>
              <div className="mt-1 flex items-center gap-2">
                <input 
                  type="color" 
                  value={theme.footer.borderColor} 
                  onChange={(e) => handleThemeChange("footer", "borderColor", e.target.value)}
                  className="h-10 w-10 rounded-lg border-0 bg-transparent p-0 cursor-pointer" 
                />
                <input 
                  type="text" 
                  value={theme.footer.borderColor} 
                  onChange={(e) => handleThemeChange("footer", "borderColor", e.target.value)}
                  className="flex-1 rounded-xl border-0 bg-gray-50 py-2 px-3 text-xs ring-1 ring-gray-200" 
                />
              </div>
            </div>
          </div>
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

  // Form states for controlled inputs with upload
  const [thumbnail, setThumbnail] = useState("");
  const [instructorAvatar, setInstructorAvatar] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "courses"), (snapshot) => {
      setCourses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (editingCourse) {
      setThumbnail(editingCourse.thumbnail || "");
      setInstructorAvatar(editingCourse.instructorAvatar || "");
    } else {
      setThumbnail("");
      setInstructorAvatar("");
    }
  }, [editingCourse, showAddCourse]);

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const courseData = {
      title: formData.get("title") as string,
      price: Number(formData.get("price")),
      thumbnail,
      instructorName: formData.get("instructorName") as string,
      instructorAvatar,
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
                <div className="mt-1 flex gap-2">
                  <input 
                    name="thumbnail" 
                    value={thumbnail} 
                    onChange={(e) => setThumbnail(e.target.value)}
                    type="text" 
                    required 
                    className="flex-1 rounded-xl border-0 bg-gray-50 py-3 px-4 ring-1 ring-gray-200" 
                    placeholder="https://..." 
                  />
                  <FileUpload 
                    path="courses/thumbnails" 
                    onUpload={(url) => setThumbnail(url)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">Instructor Name</label>
                <input name="instructorName" defaultValue={editingCourse?.instructorName} type="text" required className="mt-1 block w-full rounded-xl border-0 bg-gray-50 py-3 px-4 ring-1 ring-gray-200" placeholder="Rana Sir" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">Instructor Avatar URL</label>
                <div className="mt-1 flex gap-2">
                  <input 
                    name="instructorAvatar" 
                    value={instructorAvatar} 
                    onChange={(e) => setInstructorAvatar(e.target.value)}
                    type="text" 
                    className="flex-1 rounded-xl border-0 bg-gray-50 py-3 px-4 ring-1 ring-gray-200" 
                    placeholder="https://..." 
                  />
                  <FileUpload 
                    path="instructors/avatars" 
                    onUpload={(url) => setInstructorAvatar(url)}
                  />
                </div>
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

  const handleLessonUpdate = (chapterId: string, lessonId: string, updates: any) => {
    setChapters(chapters.map(ch => {
      if (ch.id === chapterId) {
        return {
          ...ch,
          lessons: ch.lessons.map((l: any) => l.id === lessonId ? { ...l, ...updates } : l)
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
      console.log("Course content updated successfully!");
      onBack();
    } catch (error) {
      console.error("Error saving video management changes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-24">
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
                    <LessonItem 
                      key={lesson.id} 
                      lesson={lesson} 
                      courseId={course.id}
                      onUpdate={(updates) => handleLessonUpdate(chapter.id, lesson.id, updates)}
                      onRemove={() => {
                        setChapters(chapters.map(ch => ch.id === chapter.id ? {
                          ...ch,
                          lessons: ch.lessons.filter((l: any) => l.id !== lesson.id)
                        } : ch));
                      }}
                    />
                  ))}
                  <button 
                    onClick={() => addLesson(chapter.id)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-100 py-4 text-sm font-bold text-gray-400 hover:border-indigo-100 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <Plus className="h-4 w-4" />
                    Add Lesson
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-end">
          <button 
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="rounded-2xl bg-indigo-600 px-12 py-4 font-bold text-white shadow-xl shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSaving ? "Saving Changes..." : "Save All Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function LessonItem({ lesson, courseId, onUpdate, onRemove }: { lesson: any; courseId: string; onUpdate: (u: any) => void; onRemove: () => void }) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const getVideoDuration = (source: string | File): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.crossOrigin = "anonymous";
      
      video.onloadedmetadata = () => {
        const minutes = Math.floor(video.duration / 60);
        const seconds = Math.floor(video.duration % 60);
        resolve(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        URL.revokeObjectURL(video.src);
      };
      
      video.onerror = () => {
        console.error("Error loading video metadata for duration");
        resolve("0:00");
        if (source instanceof File) URL.revokeObjectURL(video.src);
      };
      
      if (source instanceof File) {
        video.src = URL.createObjectURL(source);
      } else {
        video.src = source;
      }
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);
    setProgress(0);

    try {
      // Get duration locally before upload
      const duration = await getVideoDuration(file);
      
      // Sanitize filename to avoid issues with special characters
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const storageRef = ref(storage, `courses/${courseId}/videos/${Date.now()}_${sanitizedName}`);
      
      console.log("Starting simple upload for:", file.name, "Size:", file.size, "Type:", file.type);
      console.log("Current Auth User:", auth.currentUser?.uid || "Not Logged In");
      
      // Use uploadBytes for better reliability
      const uploadPromise = uploadBytes(storageRef, file);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Upload timed out after 30 seconds. Large files may take longer, but this usually indicates a connection issue.")), 30000)
      );

      const result = await Promise.race([uploadPromise, timeoutPromise]) as any;
      console.log("LessonItem: Simple upload success! Getting download URL...");
      
      const url = await getDownloadURL(result.ref);
      console.log("LessonItem success! URL:", url);
      
      onUpdate({ videoUrl: url, duration });
      
      setIsUploading(false);
      setProgress(100);
    } catch (err: any) {
      console.error("Upload error object:", err);
      let message = `Upload failed (${err.code || 'unknown'}): ${err.message}`;
      
      if (err.code === 'storage/unauthorized') {
        message = "Upload failed: Unauthorized. Please ensure Firebase Storage rules allow authenticated uploads.";
      } else if (err.code === 'storage/canceled') {
        message = "Upload canceled.";
      } else if (err.code === 'storage/retry-limit-exceeded') {
        message = "Upload failed: Retry limit exceeded. Please check your connection.";
      }
      
      setError(message);
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white p-4 ring-1 ring-gray-100 lg:flex-row lg:items-center relative overflow-hidden">
      <div className="flex flex-1 items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <Play className="h-4 w-4 fill-current" />
        </div>
        <input 
          type="text" 
          value={lesson.title} 
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="flex-1 bg-transparent text-sm font-bold text-gray-900 focus:outline-none"
          placeholder="Lesson Title"
        />
      </div>
      
      <div className="flex flex-1 items-center gap-3">
        <div className="flex-1 relative">
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              value={lesson.videoUrl} 
              onChange={(e) => onUpdate({ videoUrl: e.target.value })}
              className="flex-1 bg-gray-50 rounded-lg py-2 px-3 text-xs text-gray-900 font-medium focus:outline-none ring-1 ring-gray-100 focus:ring-indigo-600 transition-all"
              placeholder="Paste Video URL (YouTube, Vimeo, Drive...)"
            />
            <button
              type="button"
              onClick={async () => {
                if (lesson.videoUrl) {
                  const isEmbed = lesson.videoUrl.includes("youtube.com") || 
                                 lesson.videoUrl.includes("youtu.be") || 
                                 lesson.videoUrl.includes("vimeo.com");
                  
                  if (isEmbed) {
                    setError("Auto-duration is only for direct video files. Please enter manually for YouTube/Vimeo.");
                    setTimeout(() => setError(null), 5000);
                    return;
                  }

                  const duration = await getVideoDuration(lesson.videoUrl);
                  if (duration !== "0:00") {
                    onUpdate({ duration });
                  } else {
                    setError("Could not get duration. Please enter manually.");
                    setTimeout(() => setError(null), 5000);
                  }
                }
              }}
              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Auto-calculate duration"
            >
              <Clock className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-1 bg-gray-50 rounded-lg py-1 px-2 ring-1 ring-gray-100">
              <Clock className="h-3 w-3 text-gray-400" />
              <input 
                type="text" 
                value={lesson.duration || ""} 
                onChange={(e) => onUpdate({ duration: e.target.value })}
                className="w-12 bg-transparent text-[10px] font-bold text-gray-900 focus:outline-none"
                placeholder="10:00"
              />
            </div>
          </div>
          {error && (
            <div className="absolute top-full left-0 mt-1 text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-md z-10 shadow-sm">
              {error}
            </div>
          )}
        </div>
        
        <div className="relative">
          <input 
            type="file" 
            accept="video/*, .mkv, .avi, .mov, .flv, .wmv, .mp4, .webm" 
            onChange={handleFileUpload}
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
            disabled={isUploading}
          />
          <button 
            type="button"
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-all",
              isUploading ? "bg-gray-100 text-gray-400" : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
            )}
          >
            <Video className="h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <input 
              type="checkbox" 
              checked={lesson.isFree} 
              onChange={(e) => onUpdate({ isFree: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
            <span className="text-[10px] font-bold text-gray-400 uppercase">Free</span>
          </div>
          <button 
            onClick={onRemove}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isUploading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="w-48 space-y-4">
            <div className="flex justify-between text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
              <span>Uploading Video...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1 w-full rounded-full bg-gray-100 overflow-hidden">
              <div className="h-1 rounded-full bg-indigo-600 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
