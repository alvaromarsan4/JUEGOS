"use client";

import { createContext, useEffect, useState } from "react";
import { login as loginService } from "@/services/api";

export const AuthContext = createContext({ user: null, login: async () => {}, logout: () => {} });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount (persist login across reloads)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("pg_user");
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  const login = async (credentials) => {
    try {
      const result = await loginService(credentials);
      if (result && result.success) {
        setUser(result.user);
        try {
          localStorage.setItem("pg_user", JSON.stringify(result.user));
        } catch (e) {}
        return { success: true, user: result.user };
      }

      return { success: false, message: result.message || "Credenciales inválidas" };
    } catch (err) {
      return { success: false, message: err.message || "Error de red" };
    }
  };

  const logout = async () => {
    // Client-side logout: clear local state. If you have a server logout endpoint,
    // call it here to invalidate the session on the server.
    setUser(null);
    try {
      localStorage.removeItem("pg_user");
    } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
