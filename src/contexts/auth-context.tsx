
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import api from "@/lib/api";
import { AuthUser } from "@/services/auth.service";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("gearnest-token");

    if (!token) {
      setUser(null);
      return;
    }

    try {
      const response = await api.get("/users/me");

      if (response.data.success) {
        const profile = response.data.user;

        const authenticatedUser: AuthUser = {
          id: profile._id?.toString() || profile.id,
          name: profile.name,
          email: profile.email,
          photo: profile.photo,
          role: profile.role,
        };

        setUser(authenticatedUser);

        localStorage.setItem(
          "gearnest-user",
          JSON.stringify(authenticatedUser)
        );
      }
    } catch (error) {
      console.error("Authentication check failed:", error);

      localStorage.removeItem("gearnest-token");
      localStorage.removeItem("gearnest-user");
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await refreshUser();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [refreshUser]);

  const logout = () => {
    localStorage.removeItem("gearnest-token");
    localStorage.removeItem("gearnest-user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
