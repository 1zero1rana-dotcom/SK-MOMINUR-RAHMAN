import React, { createContext, useContext, useEffect, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { SiteSettings, DEFAULT_SETTINGS } from "../types/settings";
import { handleFirestoreError, OperationType } from "../lib/firestore-errors";

interface SettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULT_SETTINGS,
  loading: true,
  updateSettings: async () => {},
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const settingsDocRef = doc(db, "settings", "site");
    
    const unsubscribe = onSnapshot(settingsDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as SiteSettings;
        setSettings({ ...DEFAULT_SETTINGS, ...data } as SiteSettings);
        
        // Update CSS variables for theme colors
        if (data.primaryColor) {
          document.documentElement.style.setProperty('--primary-color', data.primaryColor);
        }
        if (data.secondaryColor) {
          document.documentElement.style.setProperty('--secondary-color', data.secondaryColor);
        }
      } else {
        // Initialize settings if they don't exist (this might fail if not admin, which is fine)
        setDoc(settingsDocRef, DEFAULT_SETTINGS).catch(err => {
          console.warn("Settings initialization skipped: insufficient permissions.");
        });
      }
      setLoading(false);
    }, (error) => {
      // If we can't read settings, we still want the app to load with defaults
      console.error("Error fetching settings:", error);
      setLoading(false);
      // We don't throw here to avoid blocking the whole app, but we log it
      try {
        handleFirestoreError(error, OperationType.GET, "settings/site");
      } catch (e) {
        // Log the structured error but don't crash the provider
        console.error("Structured Settings Error:", e);
      }
    });

    return () => unsubscribe();
  }, []);

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    const settingsDocRef = doc(db, "settings", "site");
    try {
      await setDoc(settingsDocRef, { ...settings, ...newSettings }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "settings/site");
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
