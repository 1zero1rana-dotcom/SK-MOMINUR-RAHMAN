import React, { createContext, useContext, useEffect, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { SiteSettings, DEFAULT_SETTINGS } from "../types/settings";

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
        setSettings({ ...DEFAULT_SETTINGS, ...docSnap.data() } as SiteSettings);
      } else {
        // Initialize settings if they don't exist
        setDoc(settingsDocRef, DEFAULT_SETTINGS);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    const settingsDocRef = doc(db, "settings", "site");
    await setDoc(settingsDocRef, { ...settings, ...newSettings }, { merge: true });
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
