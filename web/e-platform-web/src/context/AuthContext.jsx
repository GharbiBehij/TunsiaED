// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from "../firebase";
import { db } from "../firebase.js";
import { loginWithEmail, signupWithEmail } from "../lib/auth.js";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
const API_URL = process.env.REACT_APP_BFF_API_URL || 'https://tunsiaed.onrender.com';

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
  // LOGOUT
  // ------------------------------
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate('/', { replace: true });
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

      // TRY BFF FIRST
      try {
        const res = await fetch(`${API_URL}/api/v1/user/me`, {
          headers: { 
            Authorization: `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (res.ok) {
          profile = await res.json();
        } else if (res.status === 404) {
          // User not onboarded yet - create profile
          const onboardRes = await fetch(`${API_URL}/api/v1/user/onboard`, {
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
            // Retry fetching profile after onboarding
            const retry = await fetch(`${API_URL}/api/v1/user/me`, {
              headers: { 
                Authorization: `Bearer ${idToken}`,
                'Content-Type': 'application/json'
              }
            });
            if (retry.ok) {
              profile = await retry.json();
            }
          }
        }
      } catch (err) {
        console.error("BFF request failed:", err);
      } // ← FIXED: Single closing brace

      // FIRESTORE FALLBACK (only if BFF failed)
      if (!profile) {
        console.log("Using Firestore fallback");
        try {
          const userDocRef = doc(db, "User", firebaseUser.uid);
          const snap = await getDoc(userDocRef);
          
          if (snap.exists()) {
            profile = snap.data();
          } else {
            // Create default profile in Firestore
            profile = {
              name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
              email: firebaseUser.email,
              isAdmin: false,
              isInstructor: false,
              isStudent: true,
              createdAt: new Date(),
            };
            await setDoc(userDocRef, profile);
          }
        } catch (firestoreErr) {
          console.error("Firestore fallback failed:", firestoreErr);
          // Last resort: create minimal profile
          profile = {
            name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
            email: firebaseUser.email,
            isAdmin: false,
            isInstructor: false,
            isStudent: true,
          };
        }
      }

      // Build full user object
      const fullUser = { 
        uid: firebaseUser.uid, 
        email: firebaseUser.email, 
        profile 
      };
      
      setUser(fullUser);
      setToken(idToken);
      localStorage.setItem("user", JSON.stringify(fullUser));
      localStorage.setItem("token", idToken);

      // Navigate after login/signup
      if (authAction === "login" || authAction === "signup") {
        navigate("/", { replace: true });
        setAuthAction(null);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [navigate, authAction]);

  // ------------------------------
  // KEEP RENDER WARM
  // ------------------------------
  useEffect(() => {
    const keepAlive = setInterval(() => {
      fetch(`${API_URL}/`)
        .catch(() => console.log('Keep-alive ping failed'));
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(keepAlive);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: user?.profile?.isAdmin === true,
        isInstructor: user?.profile?.isInstructor === true,
        isStudent: user?.profile?.isStudent === true || (!user?.profile?.isAdmin && !user?.profile?.isInstructor),
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