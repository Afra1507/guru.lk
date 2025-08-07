// src/auth/AuthContext.js
import React, { createContext, useContext, useState } from "react";
import {
  getToken,
  getCurrentUser,
  setAuthToken,
  setCurrentUser,
  clearAuth,
} from "../utils/auth";
import { fetchUserProfile } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getCurrentUser());
  const [token, setToken] = useState(getToken());

  const login = async (authToken) => {
    setAuthToken(authToken);
    setToken(authToken);
    try {
      const profile = await fetchUserProfile(authToken);
      setUser(profile);
      setCurrentUser(profile);
    } catch {
      logout();
    }
  };

  const logout = () => {
    clearAuth();
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
