import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  role: string | null;
  deviceId: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  role: null,
  deviceId: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    // Generate or retrieve a unique device ID
    let currentDeviceId = localStorage.getItem("deviceId");
    if (!currentDeviceId) {
      currentDeviceId = Math.random().toString(36).substring(2, 15);
      localStorage.setItem("deviceId", currentDeviceId);
    }
    setDeviceId(currentDeviceId);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Listen to user document for role and device check
        const userDocRef = doc(db, "users", user.uid);
        const unsubDoc = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setRole(data.role);
            
            // 1 Student with 1 Device Check
            if (data.lastDeviceId && data.lastDeviceId !== currentDeviceId) {
              alert("You have been logged out because your account is being used on another device.");
              auth.signOut();
            }
          }
        });

        // Update lastDeviceId on login
        try {
          await updateDoc(userDocRef, { lastDeviceId: currentDeviceId });
        } catch (error) {
          console.error("Error updating device ID:", error);
        }

        return () => unsubDoc();
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, role, deviceId }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
