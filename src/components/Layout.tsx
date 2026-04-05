import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { motion, AnimatePresence } from "motion/react";
import { useLocation } from "react-router-dom";

import { useSettings } from "../contexts/SettingsContext";

export default function Layout() {
  const location = useLocation();
  const { settings } = useSettings();

  return (
    <div 
      className="flex min-h-screen flex-col font-sans selection:bg-indigo-100 selection:text-indigo-600"
      style={{ backgroundColor: settings.theme.body.bgColor, color: settings.theme.body.textColor }}
    >
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex-1"
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
      <Footer />
    </div>
  );
}
