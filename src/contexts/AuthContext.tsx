import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot, updateDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { handleFirestoreError, OperationType } from "../lib/firestore-errors";

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
  const [roleFetched, setRoleFetched] = useState(false);

  useEffect(() => {
    // Generate or retrieve a unique device ID
    let currentDeviceId = localStorage.getItem("deviceId");
    if (!currentDeviceId) {
      currentDeviceId = Math.random().toString(36).substring(2, 15);
      localStorage.setItem("deviceId", currentDeviceId);
    }
    setDeviceId(currentDeviceId);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setUser(user);
        if (user) {
          // Listen to user document for role and device check
          const userDocRef = doc(db, "users", user.uid);
          const unsubDoc = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              // Force admin role for the master email
              const currentRole = user.email === "1zero1rana@gmail.com" ? "admin" : data.role;
              setRole(currentRole);
              setRoleFetched(true);
              
              // 1 Student with 1 Device Check (Skip for admins)
              if (currentRole !== "admin" && data.lastDeviceId && data.lastDeviceId !== currentDeviceId) {
                // Instead of alert, we just sign out
                console.warn("Session invalidated: Account used on another device.");
                auth.signOut();
              }
            } else if (user.email === "1zero1rana@gmail.com") {
              setRole("admin");
              setRoleFetched(true);
            } else {
              setRoleFetched(true);
            }
          }, (error) => {
            console.error("User doc snapshot error:", error);
            // Crucial: set roleFetched to true even on error so the app doesn't hang
            setRoleFetched(true);
            handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
          });

          // Update lastDeviceId on login, and initialize if it doesn't exist
          try {
            await setDoc(userDocRef, { 
              uid: user.uid,
              email: user.email,
              role: user.email === "1zero1rana@gmail.com" ? "admin" : "student",
              lastDeviceId: currentDeviceId,
              displayName: user.displayName,
              photoURL: user.photoURL,
              createdAt: serverTimestamp()
            }, { merge: true });
          } catch (error) {
            handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
          }
          
          // Note: unsubDoc is not returned from here, it's handled by the component unmount or next auth change
        } else {
          setRole(null);
          setRoleFetched(true);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading: loading || (user !== null && !roleFetched), role, deviceId }}>
      {(loading || (user !== null && !roleFetched)) ? (
        <div className="flex h-screen w-full items-center justify-center bg-white">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            <p className="text-sm font-bold text-gray-500 animate-pulse">Initializing ICT Masterclass...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
