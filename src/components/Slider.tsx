import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Link } from "react-router-dom";

interface Slide {
  id: string;
  type: "image" | "video";
  url: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
}

export default function Slider({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (!slides || slides.length === 0) return null;

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    
    // YouTube
    const ytRegex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const ytMatch = url.match(ytRegex);
    if (ytMatch && ytMatch[2].length === 11) {
      return `https://www.youtube.com/embed/${ytMatch[2]}?autoplay=1&mute=1&controls=0&loop=1&playlist=${ytMatch[2]}&rel=0&modestbranding=1`;
    }

    // Vimeo
    const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`;
    }

    // Google Drive
    if (url.includes("drive.google.com")) {
      const fileIdMatch = url.match(/\/file\/d\/([^\/]+)/) || url.match(/id=([^\&]+)/);
      if (fileIdMatch) {
        return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
      }
    }

    return url;
  };

  const isDirectVideo = (url: string) => {
    if (!url) return false;
    const lowerUrl = url.toLowerCase();
    const directExtensions = [".mp4", ".webm", ".ogg", ".mov", ".m4v"];
    if (directExtensions.some(ext => lowerUrl.includes(ext))) {
      if (!lowerUrl.includes("youtube.com") && !lowerUrl.includes("youtu.be") && !lowerUrl.includes("vimeo.com")) {
        return true;
      }
    }
    if (lowerUrl.includes("firebasestorage.googleapis.com") && lowerUrl.includes("alt=media")) {
      return true;
    }
    return false;
  };

  return (
    <div className="relative h-[600px] w-full overflow-hidden bg-gray-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          {slides[current].type === "video" ? (
            isDirectVideo(slides[current].url) ? (
              <video
                src={slides[current].url}
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover opacity-60"
              />
            ) : (
              <div className="absolute inset-0 opacity-60 pointer-events-none">
                <iframe
                  src={getEmbedUrl(slides[current].url)}
                  className="h-full w-full scale-[1.5]"
                  allow="autoplay; fullscreen"
                  title="Background Video"
                />
              </div>
            )
          ) : (
            <img
              src={slides[current].url}
              alt={slides[current].title}
              className="h-full w-full object-cover opacity-60"
              referrerPolicy="no-referrer"
            />
          )}
          
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 via-transparent to-transparent">
            <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl"
              >
                {slides[current].title}
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mx-auto mt-6 max-w-2xl text-lg text-gray-200 sm:text-xl"
              >
                {slides[current].subtitle}
              </motion.p>
              {slides[current].buttonText && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-10"
                >
                  <Link
                    to={slides[current].buttonLink || "/"}
                    className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-indigo-500/20 transition-all hover:bg-indigo-700 hover:scale-105"
                  >
                    {slides[current].buttonText}
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition-all hover:bg-white/20"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition-all hover:bg-white/20"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          
          <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all ${
                  current === i ? "w-8 bg-indigo-500" : "w-2 bg-white/30"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
