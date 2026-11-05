"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  authService,
  type UserProfile,
  type UserRole,
} from "@/services/authService";

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  hasRole: (...roles: UserRole[]) => boolean;
  userUnitId: string | null;
  isGlobalScope: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth() harus digunakan di dalam <AuthProvider>");
  }

  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      const token = authService.getToken();

      if (!token) {
        authService.clearSession();

        if (active) {
          setUser(null);
          setLoading(false);
          router.replace("/login");
        }

        return;
      }

      try {
        const currentUser = await authService.getMe(token);

        if (active) {
          localStorage.setItem("pdam_user", JSON.stringify(currentUser));
          setUser(currentUser);
        }
      } catch {
        if (active) {
          authService.clearSession();
          setUser(null);
          router.replace("/login?session_expired=true");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void restoreSession();

    return () => {
      active = false;
    };
  }, [router]);

  const hasRole = (...roles: UserRole[]): boolean =>
    user !== null && roles.includes(user.role);

  // UUID menggunakan string, bukan number.
  const userUnitId: string | null = user?.id_unit ?? null;

  const isGlobalScope = user?.role === "admin_pusat";

  const logout = async (): Promise<void> => {
    await authService.logout();
    setUser(null);
    router.replace("/login");
  };

  const value: AuthContextValue = {
    user,
    loading,
    isAuthenticated: user !== null,
    hasRole,
    userUnitId,
    isGlobalScope,
    logout,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pdam-bg">
        <div className="flex flex-col items-center gap-3">
          <span className="loading loading-spinner loading-lg text-pdam-primary" />
          <p className="text-sm font-medium text-pdam-navy">
            Memverifikasi sesi...
          </p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
