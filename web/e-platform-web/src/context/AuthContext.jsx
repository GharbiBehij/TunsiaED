// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from "../firebase";
import { db } from "../firebase.js";
import { loginWithEmail, signupWithEmail } from "../lib/auth.js";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authAction, setAuthAction] = useState(null); // "login" | "signup" | null

  const navigate = useNavigate();

  console.log("AuthProvider mounted");

  // ------------------------------
  // LOGIN + SIGNUP
  // ------------------------------
  const login = async (email, password) => {
    console.log("login() triggered");
    setAuthAction("login");
    setIsLoading(true);
    try {
      await loginWithEmail(email, password);
    } finally {
      console.log("login() finished");
      setIsLoading(false);
    }
  };

  const signup = async ({ email, password }) => {
    console.log("signup() triggered");
    setAuthAction("signup");
    setIsLoading(true);
    try {
      await signupWithEmail(email, password);
    } finally {
      console.log("signup() finished");
      setIsLoading(false);
    }
  };

  // ------------------------------
  // AUTH LISTENER
  // ------------------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("AUTH EVENT FIRED:", firebaseUser ? firebaseUser.email : "no user");

      // No user → sign out
      if (!firebaseUser) {
        console.log("No Firebase user → signed out");
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
      console.log("Trying BFF /api/v1/user/me …");

      try {
        const res = await fetch("/api/v1/user/me", {
          headers: { Authorization: `Bearer ${idToken}` }
        });

        console.log("BFF /me status:", res.status);

        if (res.ok) {
          profile = await res.json();
          console.log("BFF profile success:", profile);
        } else if (res.status === 404) {
          console.log("User not in BFF → onboarding…");

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

          if (!onboardRes.ok) throw new Error("Onboarding failed");

          const retry = await fetch("/api/v1/user/me", {
            headers: { Authorization: `Bearer ${idToken}` }
          });

          if (!retry.ok) throw new Error("Retry after onboard failed");
          profile = await retry.json();
          console.log("BFF profile after onboard:", profile);
        } else {
          throw new Error(`BFF error: ${res.status}`);
        }
      } catch (err) {
        console.log("BFF down → switching to Firestore fallback");
      }

      // ------------------------------
      // FIRESTORE FALLBACK
      // ------------------------------
      if (!profile) {
        console.log("Using Firestore fallback");
        const userDocRef = doc(db, "User", firebaseUser.uid);
        const snap = await getDoc(userDocRef);

        if (snap.exists()) {
          profile = snap.data();
          console.log("Firestore profile loaded:", profile);
        } else {
          profile = {
            name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
            email: firebaseUser.email,
            role: "student",
            createdAt: new Date(),
          };
          await setDoc(userDocRef, profile);
          console.log("Created new profile in Firestore:", profile);
        }
      }

      // ------------------------------
      // FINAL USER SETUP
      // ------------------------------
      const fullUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        profile,
      };

      console.log("FINAL USER READY:", fullUser);

      setUser(fullUser);
      setToken(idToken);
      localStorage.setItem("user", JSON.stringify(fullUser));
      localStorage.setItem("token", idToken);

      // ------------------------------
      // REDIRECT ONLY AFTER LOGIN/SIGNUP
      // ------------------------------
      if (authAction === "login" || authAction === "signup") {
        console.log("Redirecting to home after", authAction);
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
        login,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);