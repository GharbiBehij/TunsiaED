// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from "../firebase";
import { db } from "../firebase.js";
import { loginWithEmail, signupWithEmail, loginWithGoogle as loginWithGoogleLib } from "../lib/auth.js";
import { onAuthStateChanged, signOut, getRedirectResult } from "firebase/auth";
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
  // EMAIL LOGIN
  // ------------------------------
  const login = async (email, password) => {
    setAuthAction("login");
    setIsLoading(true);
    try {
      await loginWithEmail(email, password);
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      throw error;
    }
  };

  // ------------------------------
  // EMAIL SIGNUP
  // ------------------------------
  const signup = async ({ email, password }) => {
    setAuthAction("signup");
    setIsLoading(true);
    try {
      await signupWithEmail(email, password);
    } catch (error) {
      console.error('Signup error:', error);
      setIsLoading(false);
      throw error;
    }
  };

  // ------------------------------
  // GOOGLE LOGIN
  // ------------------------------
  const loginWithGoogle = async () => {
    console.log("🔵 Google login started...");
    setAuthAction("login");
    setIsLoading(true);

    try {
      await loginWithGoogleLib();  // ← Fixed: Use imported function
      console.log("✅ Google login initiated");
    } catch (err) {
      console.error("❌ Google login failed:", err);
      setIsLoading(false);
      throw err;
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
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // ------------------------------
  // HANDLE GOOGLE REDIRECT RESULT
  // ------------------------------
  useEffect(() => {
    async function handleRedirectResult() {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log('✅ Google sign-in successful via redirect:', result.user.email);
          setAuthAction("login");
        }
      } catch (error) {
        console.error('❌ Google redirect error:', error);
      }
    }
    
    handleRedirectResult();
  }, []);

  // ------------------------------
  // AUTH LISTENER
  // ------------------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('🔄 Auth state changed:', firebaseUser?.email || 'No user');

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

      // ------------------------------
      // TRY BFF FIRST
      // ------------------------------
      try {
        console.log('📡 Calling BFF /api/v1/user/me');
        const res = await fetch(`${API_URL}/api/v1/user/me`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          }
        });

        if (res.ok) {
          profile = await res.json();
          console.log('✅ Profile loaded from BFF:', profile);
        } else if (res.status === 404) {
          console.log('⚠️ User not found, onboarding...');
          
          const onboardRes = await fetch(`${API_URL}/api/v1/user/onboard`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${idToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
              role: "student",
            }),
          });

          if (onboardRes.ok) {
            console.log('✅ Onboarding successful');
            const retry = await fetch(`${API_URL}/api/v1/user/me`, {
              headers: {
                Authorization: `Bearer ${idToken}`,
                "Content-Type": "application/json",
              },
            });
            if (retry.ok) {
              profile = await retry.json();
              console.log('✅ Profile loaded after onboarding:', profile);
            }
          } else {
            const error = await onboardRes.json();
            console.error('❌ Onboarding failed:', error);
          }
        } else {
          console.error('❌ BFF returned status:', res.status);
        }
      } catch (bffError) {
        console.error("❌ BFF request failed:", bffError);
      }

      // ------------------------------
      // FIRESTORE FALLBACK
      // ------------------------------
      if (!profile) {
        console.log("⚠️ Using Firestore fallback");

        try {
          const userRef = doc(db, "User", firebaseUser.uid);
          const snap = await getDoc(userRef);

          if (snap.exists()) {
            profile = snap.data();
            console.log('✅ Profile loaded from Firestore:', profile);
          } else {
            console.log('📝 Creating new profile in Firestore');
            profile = {
              name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
              email: firebaseUser.email,
              isAdmin: false,
              isInstructor: false,
              isStudent: true,
              createdAt: new Date(),
            };
            await setDoc(userRef, profile);
            console.log('✅ Profile created in Firestore');
          }
        } catch (fireErr) {
          console.error("❌ Firestore fallback failed:", fireErr);
          profile = {
            name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
            email: firebaseUser.email,
            isAdmin: false,
            isInstructor: false,
            isStudent: true,
          };
        }
      }

      // ------------------------------
      // FINISH
      // ------------------------------
      const fullUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        profile,
      };

      setUser(fullUser);
      setToken(idToken);
      localStorage.setItem("user", JSON.stringify(fullUser));
      localStorage.setItem("token", idToken);

      if (authAction === "login" || authAction === "signup") {
        console.log('✅ Auth complete, navigating to home');
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
      fetch(`${API_URL}/`).catch(() => {});
    }, 10 * 60 * 1000);

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
        isStudent:
          user?.profile?.isStudent === true ||
          (!user?.profile?.isAdmin && !user?.profile?.isInstructor),

        login,
        signup,
        logout,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);