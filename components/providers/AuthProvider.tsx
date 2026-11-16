"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { usePathname, useRouter } from "next/navigation";

import {
  authService,
  type UserProfile,
  type UserRole,
} from "@/services/authService";

import { ApiError } from "@/services/apiClient";

// ======================================================
// TYPES
// ======================================================

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  verificationError: boolean;
  isAuthenticated: boolean;
  hasRole: (...roles: UserRole[]) => boolean;
  userUnitId: string | null;
  isGlobalScope: boolean;
  setSession: (user: UserProfile) => void;
  retry: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ======================================================
// HOOK
// ======================================================

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth() harus digunakan di dalam <AuthProvider>");
  }

  return context;
}

// ======================================================
// AUTH PROVIDER
// ======================================================

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [verificationError, setVerificationError] = useState(false);

  const routerRef = useRef(router);
  const pathnameRef = useRef(pathname);

  useEffect(() => {
    routerRef.current = router;
    pathnameRef.current = pathname;
  }, [router, pathname]);

  // ====================================================
  // RESTORE SESSION
  // ====================================================

  const restoreSession = useCallback(async () => {
    setLoading(true);
    setVerificationError(false);

    const isLoginPage = pathnameRef.current === "/login";

    const isExpiredLogin =
      isLoginPage &&
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("session_expired") ===
        "true";

    // Halaman login dengan sesi kedaluwarsa.
    if (isExpiredLogin) {
      authService.clearSession();
      setUser(null);
      setLoading(false);
      return;
    }

    const token = authService.getToken();

    // Tidak ada token.
    if (!token) {
      authService.clearSession();
      setUser(null);
      setLoading(false);

      if (!isLoginPage) {
        routerRef.current.replace("/login");
      }

      return;
    }

    try {
      // Validasi token ke backend.
      const currentUser = await authService.getMe(token);
      setUser(currentUser);
    } catch (error: unknown) {
      setUser(null);

      if (error instanceof ApiError && error.status === 401) {
        // apiClient sudah menangani redirect.
        authService.clearSession();
      } else {
        // Gangguan jaringan atau server.
        setVerificationError(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // ====================================================
  // INITIAL SESSION CHECK
  // ====================================================

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  // ====================================================
  // SET SESSION AFTER LOGIN
  // ====================================================

  const setSession = useCallback((nextUser: UserProfile) => {
    setUser(nextUser);
    setVerificationError(false);
    setLoading(false);
  }, []);

  // ====================================================
  // RETRY
  // ====================================================

  const retry = useCallback(() => {
    void restoreSession();
  }, [restoreSession]);

  // ====================================================
  // ROLE MANAGEMENT
  // ====================================================

  const hasRole = useCallback(
    (...roles: UserRole[]): boolean => {
      return user !== null && roles.includes(user.role);
    },
    [user],
  );

  const userUnitId: string | null = user?.id_unit ?? null;
  const isGlobalScope = user?.role === "admin_pusat";

  // ====================================================
  // LOGOUT
  // ====================================================

  const logout = useCallback(async (): Promise<void> => {
    await authService.logout();

    setUser(null);
    setVerificationError(false);

    routerRef.current.replace("/login");
  }, []);

  // ====================================================
  // CONTEXT VALUE
  // ====================================================

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      verificationError,
      isAuthenticated: user !== null,
      hasRole,
      userUnitId,
      isGlobalScope,
      setSession,
      retry,
      logout,
    }),
    [
      user,
      loading,
      verificationError,
      hasRole,
      userUnitId,
      isGlobalScope,
      setSession,
      retry,
      logout,
    ],
  );

  // Selalu render children. Akses dijaga oleh proxy.ts.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
