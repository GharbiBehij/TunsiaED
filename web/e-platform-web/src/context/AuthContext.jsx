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
  const navigate = useNavigate();

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      await loginWithEmail(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async ({ email, password }) => {
    setIsLoading(true);
    try {
      await signupWithEmail(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setIsLoading(false);
        return;
      }

      let profile = null;

      // ——— TRY BFF FIRST (if it's alive) ———
      try {
        const idToken = await firebaseUser.getIdToken();
        const res = await fetch('/api/v1/user/me', {
          headers: { Authorization: `Bearer ${idToken}` }
        });

        if (res.ok) {
          profile = await res.json();
        } else if (res.status === 404) {
          // Onboard if not exists
          await fetch('/api/v1/user/onboard', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${idToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
              role: 'student'
            })
          });
          const retry = await fetch('/api/v1/user/me', {
            headers: { Authorization: `Bearer ${idToken}` }
          });
          profile = await retry.json();
        }
      } catch (bffError) {
        console.log('BFF down or unreachable → using Firestore fallback');
      }

      // ——— IF BFF FAILED → USE FIRESTORE FALLBACK ———
      if (!profile) {
        const userDocRef = doc(db, "User", firebaseUser.uid);
        let snap;
        try {
          snap = await getDoc(userDocRef);
        } catch (err) {
          console.error("Firestore read failed:", err);
        }

        if (snap?.exists()) {
          profile = snap.data();
        } else {
          profile = {
            name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            email: firebaseUser.email,
            role: 'student',
            createdAt: new Date(),
            createdViaFallback: true
          };
          try {
            await setDoc(userDocRef, profile);
            console.log("User created via fallback in Firestore");
          } catch (err) {
            console.error("Failed to write fallback user:", err);
          }
        }
      }

      // ——— FINAL USER SETUP ———
      const fullUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        profile
      };

      setUser(fullUser);
      setToken(await firebaseUser.getIdToken());
      localStorage.setItem('user', JSON.stringify(fullUser));
      localStorage.setItem('token', await firebaseUser.getIdToken());

      // ——— INSTRUCTOR PENDING ALERT ———
      const pending = JSON.parse(localStorage.getItem('pendingProfile') || '{}');
      if (pending.role === 'instructor') {
        alert("Thank you! Your instructor application is under review. You can explore the platform in the meantime.");
        localStorage.removeItem('pendingProfile');
      }

      setIsLoading(false);

      // ——— ONLY REDIRECT FROM AUTH PAGES ———
      if (window.location.pathname === '/login' || window.location.pathname === '/signup') {
        navigate('/', { replace: true });
      }

    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      isAuthenticated: !!user,
      login,
      signup
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);