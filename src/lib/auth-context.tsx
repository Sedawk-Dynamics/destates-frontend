"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types";
import { loginApi, registerApi, getMeApi } from "./api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("destates_token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await getMeApi();
      setUser(res.data);
    } catch {
      localStorage.removeItem("destates_token");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const res = await loginApi(email, password);
    localStorage.setItem("destates_token", res.data.token);
    setUser(res.data.user);
  };

  const register = async (data: { name: string; email: string; password: string; phone?: string }) => {
    const res = await registerApi(data);
    localStorage.setItem("destates_token", res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem("destates_token");
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
