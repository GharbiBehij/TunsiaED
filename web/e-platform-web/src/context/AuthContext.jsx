// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from "../firebase"; // ← this is the CLIENT Firebase (browser only)
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut 
} from "firebase/auth"; // ← these are the only functions we need from Google

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);        // ← who is logged in right now?
  const [token, setToken] = useState(localStorage.getItem('token')); // ← Firebase real token
  const [isLoading, setIsLoading] = useState(false); // ← spinner while waiting
  const [error, setError] = useState(null);      // ← show error message if login fails

  // ==================================================================
  // LOGIN — talk DIRECTLY to Google, not our BFF anymore
  // ==================================================================
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      // This line goes straight to Google → no password touches our server
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // This is the REAL token from Google — unbreakable
      const firebaseToken = await firebaseUser.getIdToken();

      // Save everything exactly like before — nothing changes for the rest of the app
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || email.split('@')[0], // if no name, use email prefix
      };

      setUser(userData);
      setToken(firebaseToken);
      localStorage.setItem('token', firebaseToken);
      localStorage.setItem('user', JSON.stringify(userData));

      // Optional: tell our BFF "hey this user just logged in, create profile if not exist"
      // await fetch('/api/v1/users/onboard', { headers: { Authorization: `Bearer ${firebaseToken}` } });

    } catch (err) {
      const message = err?.message || 'Wrong email or password';
      setError(message);
      throw new Error(message); // so login form can catch it
    } finally {
      setIsLoading(false);
    }
  };

  // ==================================================================
  // SIGNUP — same thing, direct to Google
  // ==================================================================
  const signup = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const firebaseUser = userCredential.user;
      const firebaseToken = await firebaseUser.getIdToken();

      const userData = {
        uid: firebaseUser.uid,
        email: formData.email,
        name: formData.name || formData.email.split('@')[0],
      };

      setUser(userData);
      setToken(firebaseToken);
      localStorage.setItem('token', firebaseToken);
      localStorage.setItem('user', JSON.stringify(userData));

      // Later: tell BFF to save role, phone, etc.
      // await fetch('/api/v1/users/profile', { ... })

    } catch (err) {
      let message = 'Signup failed';
      if (err.code === 'auth/email-already-in-use') message = 'This email is already registered';
      if (err.code === 'auth/weak-password') message = 'Password too weak (min 6 chars)';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // ==================================================================
  // LOGOUT — clear everything + tell Firebase
  // ==================================================================
  const logout = async () => {
    await signOut(auth); // tell Google we’re done
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // ==================================================================
  // Auto-login when user comes back (page refresh)
  // ==================================================================
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Corrupted user in localStorage', e);
      }
    }
  }, []);

  // ==================================================================
  // This is what the rest of your app sees
  // ==================================================================
  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    signup,
    logout,
    error,
    setError, // optional: so forms can clear error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};