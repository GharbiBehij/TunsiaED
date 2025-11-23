// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from "../firebase";
import { db } from "../firebase.js";
import { loginWithEmail, signupWithEmail } from "../lib/auth.js";
import { onAuthStateChanged, signOut } from "firebase/auth";  // ← ADDED signOut
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authAction, setAuthAction] = useState(null);

  const navigate = useNavigate();

  // ------------------------------
  // LOGIN + SIGNUP
  // ------------------------------
  const login = async (email, password) => {
    setAuthAction("login");
    setIsLoading(true);
    try {
      await loginWithEmail(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async ({ email, password }) => {
    setAuthAction("signup");
    setIsLoading(true);
    try {
      await signupWithEmail(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------------------
  // LOGOUT — CLEAN & SAFE
  // ------------------------------
  const logout = async () => {
    try {
      await signOut(auth);                    // ← Firebase sign out
      setUser(null);
      setToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate('/login', { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // ------------------------------
  // AUTH LISTENER
  // ------------------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setIsLoading(false);
        return;
      }

      const idToken = await firebaseUser.getIdToken();
      let profile = null;

      // TRY BFF
      try {
        const res = await fetch("/api/v1/user/me", {
          headers: { Authorization: `Bearer ${idToken}` }
        });

        if (res.ok) {
          profile = await res.json();
        } else if (res.status === 404) {
          const onboardRes = await fetch("/api/v1/user/onboard", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${idToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
              role: "student",
            }),
          });
          
          if (onboardRes.ok) {
            const retry = await fetch("/api/v1/user/me", {
              headers: { Authorization: `Bearer ${idToken}` }
            });
            if (retry.ok) {
              profile = await retry.json();
            }
          }
        }
      } catch (err) {
        console.error("BFF request failed:", err);
        // Will fallback to Firestore below
      }

      // FIRESTORE FALLBACK
      if (!profile) {
        const userDocRef = doc(db, "User", firebaseUser.uid);
        const snap = await getDoc(userDocRef);
        profile = snap.exists() ? snap.data() : {
          name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
          email: firebaseUser.email,
          role: "student",
          createdAt: new Date(),
        };
        if (!snap.exists()) await setDoc(userDocRef, profile);
      }

      const fullUser = { uid: firebaseUser.uid, email: firebaseUser.email, profile };
      setUser(fullUser);
      setToken(idToken);
      localStorage.setItem("user", JSON.stringify(fullUser));
      localStorage.setItem("token", idToken);

      if (authAction === "login" || authAction === "signup") {
        navigate("/", { replace: true });
        setAuthAction(null);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [navigate, authAction]);

  return (
    <AuthContext.Provider
    value={{
      user,
      token,
      isLoading,
      isAuthenticated: !!user,
      isAdmin: user?.profile?.isAdmin === true,
      isInstructor: user?.profile?.isInstructor === true,
      isStudent: user?.profile?.isStudent === true || !user?.profile?.isAdmin && !user?.profile?.isInstructor,
      login,
      signup,
      logout,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);