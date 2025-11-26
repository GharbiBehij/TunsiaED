// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from "../firebase";
import { loginWithEmail, signupWithEmail, loginWithGoogle as loginWithGoogleLib } from "../lib/auth.js";
import { onAuthStateChanged, signOut, getRedirectResult } from "firebase/auth";
import { useNavigate, useLocation } from 'react-router-dom';
import { z } from 'zod'; 

const AuthContext = createContext();
const API_URL = process.env.REACT_APP_BFF_API_URL || 'https://tunsiaed.onrender.com';

// ✅ Validation schema for localStorage data
const PendingProfileSchema = z.object({
  name: z.string().max(100),
  role: z.enum(['student', 'instructor']),
  phone: z.string().max(20).nullable().optional(),
  birthPlace: z.string().max(100).nullable().optional(),
  birthDate: z.string().nullable().optional(),
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authAction, setAuthAction] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const fetchProfileViaBff = async (idToken, onboardPayload) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/user/me`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        }
      });

      if (res.ok) {
        return await res.json();
      }

      if (res.status === 404) {
        const onboardRes = await fetch(`${API_URL}/api/v1/user/onboard`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(onboardPayload),
        });

        if (!onboardRes.ok) {
          const error = await onboardRes.json().catch(() => ({}));
          throw new Error(error.error || 'Onboarding failed');
        }

        localStorage.removeItem("pendingProfile");

        const retry = await fetch(`${API_URL}/api/v1/user/me`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        });

        if (retry.ok) {
          return await retry.json();
        }

        throw new Error(`Profile not found after onboarding`);
      }

      throw new Error(`BFF responded with status ${res.status}`);
    } catch (error) {
      console.error('❌ BFF profile flow failed:', error);
      return null;
    }
  };

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

  const loginWithGoogle = async () => {
    console.log("🔵 Google login started...");
    
    localStorage.setItem('googleAuthInProgress', 'true');
    localStorage.setItem('redirectAfterAuth', location.pathname);
    
    setIsLoading(true);

    try {
      await loginWithGoogleLib();
      console.log("✅ Google redirect initiated");
    } catch (err) {
      console.error("❌ Google login failed:", err);
      localStorage.removeItem('googleAuthInProgress');
      setIsLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setToken(null);
      localStorage.clear();
      navigate("/login", { replace: true });
      console.log('✅ Logged out');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    async function handleRedirectResult() {
      try {
        const result = await getRedirectResult(auth);
        
        if (result) {
          console.log('✅ Google sign-in successful via redirect:', result.user.email);
          
          const wasGoogleAuth = localStorage.getItem('googleAuthInProgress');
          if (wasGoogleAuth) {
            console.log('🔄 Detected Google auth redirect, will navigate after profile loads');
            setAuthAction("google-redirect");
            localStorage.removeItem('googleAuthInProgress');
          }
        }
      } catch (error) {
        console.error('❌ Google redirect error:', error);
        localStorage.removeItem('googleAuthInProgress');
      }
    }
    
    handleRedirectResult();
  }, []);

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
      
      // ✅ VALIDATE localStorage data before using
      let storedProfile = null;
      try {
        const stored = localStorage.getItem("pendingProfile");
        if (stored) {
          const parsed = JSON.parse(stored);
          const validated = PendingProfileSchema.safeParse(parsed);
          
          if (validated.success) {
            storedProfile = validated.data;
            console.log('📋 Found valid pending profile from signup');
          } else {
            console.warn('⚠️ Invalid pendingProfile data, ignoring:', validated.error);
            localStorage.removeItem("pendingProfile");
          }
        }
      } catch (err) {
        console.error('Error parsing pendingProfile:', err);
        localStorage.removeItem("pendingProfile");
      }
      
      const onboardPayload = {
        name: storedProfile?.name || firebaseUser.displayName || firebaseUser.email.split("@")[0],
        role: storedProfile?.role || "student",
        phone: storedProfile?.phone || null,
        birthPlace: storedProfile?.birthPlace || null,
        birthDate: storedProfile?.birthDate || null,
      };

      let profile = await fetchProfileViaBff(idToken, onboardPayload);

      if (!profile) {
        profile = {
          name: onboardPayload.name,
          email: firebaseUser.email,
          phone: onboardPayload.phone,
          birthPlace: onboardPayload.birthPlace,
          birthDate: onboardPayload.birthDate,
          isAdmin: false,
          isInstructor: onboardPayload.role === "instructor",
          isStudent: onboardPayload.role === "student" || !onboardPayload.role,
        };
      }
      
      localStorage.removeItem("pendingProfile");

      const fullUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        profile,
      };

      setUser(fullUser);
      setToken(idToken);
      localStorage.setItem("user", JSON.stringify(fullUser));
      localStorage.setItem("token", idToken);

      if (authAction === "login" || authAction === "signup" || authAction === "google-redirect") {
        console.log('✅ Auth complete, navigating...');
        
        const redirectPath = localStorage.getItem('redirectAfterAuth');
        localStorage.removeItem('redirectAfterAuth');
        
        const targetPath = redirectPath && redirectPath !== '/login' && redirectPath !== '/signup' 
          ? redirectPath 
          : '/';
        
        navigate(targetPath, { replace: true });
        setAuthAction(null);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [navigate, authAction]);

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