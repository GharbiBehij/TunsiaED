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
  // ✅ Initialize from localStorage to maintain state on refresh
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
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

    // Don't set loading state for redirects since the page will unload
    try {
      await loginWithGoogleLib();
      console.log("✅ Google redirect initiated");
      // The page will redirect, so this code won't execute
    } catch (err) {
      console.error("❌ Google login failed:", err);
      localStorage.removeItem('googleAuthInProgress');
      // Only set loading to false if there's an immediate error
      setIsLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
      console.log('✅ Logged out');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    async function handleRedirectResult() {
      try {
        console.log('🔄 Checking for Google redirect result...');
        const result = await getRedirectResult(auth);

        if (result && result.user) {
          console.log('✅ Google sign-in successful via redirect:', result.user.email);
          console.log('🔍 Google user data:', {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
            providerData: result.user.providerData
          });

          const wasGoogleAuth = localStorage.getItem('googleAuthInProgress');
          if (wasGoogleAuth) {
            console.log('🔄 Detected Google auth redirect, will navigate after profile loads');
            setAuthAction("google-redirect");
            localStorage.removeItem('googleAuthInProgress');
          }
        } else {
          console.log('ℹ️ No Google redirect result found (this is normal for regular page loads)');
        }
      } catch (error) {
        console.error('❌ Google redirect error:', error);

        localStorage.removeItem('googleAuthInProgress');
        setIsLoading(false);

        // Navigate back to login on error
        navigate('/login', { replace: true });
      }
    }

    handleRedirectResult();
  }, [navigate]);

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

      // Set loading state when processing auth
      setIsLoading(true);

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
        email: firebaseUser.email,
        name: storedProfile?.name || firebaseUser.displayName || firebaseUser.email.split("@")[0],
        role: storedProfile?.role || "student",
        phone: storedProfile?.phone || null,
        birthPlace: storedProfile?.birthPlace || null,
        birthDate: storedProfile?.birthDate || null,
      };

      let profile = await fetchProfileViaBff(idToken, onboardPayload);

      // If we just onboarded a user, force refresh the token to get updated custom claims
      let finalToken = idToken;
      if (profile && storedProfile) {
        console.log('🔄 Forcing token refresh after onboarding to get custom claims');
        try {
          finalToken = await firebaseUser.getIdToken(true); // forceRefresh = true
          console.log('✅ Token refreshed with custom claims');
        } catch (refreshError) {
          console.warn('⚠️ Failed to refresh token after onboarding:', refreshError);
          // Continue with original token
        }
      }

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
        profile: {
          ...profile,
          // Ensure role flags are properly set
          isAdmin: profile.isAdmin === true,
          isInstructor: profile.isInstructor === true || profile.role === 'instructor',
          isStudent: profile.isStudent === true || profile.role === 'student' || (!profile.isAdmin && !profile.isInstructor),
        },
      };

      setUser(fullUser);
      setToken(finalToken);
      localStorage.setItem("user", JSON.stringify(fullUser));
      localStorage.setItem("token", finalToken);

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

      // 🔁 Fallback: logged in user on /login but no authAction → still redirect away
      if (firebaseUser && location.pathname === '/login' && !authAction) {
        const redirectPath = localStorage.getItem('redirectAfterAuth');
        localStorage.removeItem('redirectAfterAuth');
        const targetPath =
          redirectPath && redirectPath !== '/login' && redirectPath !== '/signup'
            ? redirectPath
            : '/';
        navigate(targetPath, { replace: true });
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [navigate, authAction, location.pathname]);

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
        isInstructor: user?.profile?.isInstructor === true || user?.profile?.role === 'instructor',
        isStudent:
          user?.profile?.isStudent === true ||
          user?.profile?.role === 'student' ||
          (!user?.profile?.isAdmin && !user?.profile?.isInstructor && user?.profile?.role !== 'instructor'),
        hasActiveSubscription: user?.profile?.hasActiveSubscription === true,
        activePlanId: user?.profile?.activePlanId || null,

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
