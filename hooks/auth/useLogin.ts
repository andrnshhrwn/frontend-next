"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { authService } from "@/services/authService";
import { useAuth } from "@/components/providers/AuthProvider";

export default function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { setSession, loading: authLoading, isAuthenticated } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ====================================================
  // CHECK AUTHENTICATION
  // ====================================================

  useEffect(() => {
    const sessionExpired = searchParams.get("session_expired") === "true";

    // Jangan redirect jika sesi baru saja kedaluwarsa.
    if (sessionExpired) return;

    // Tunggu validasi AuthProvider selesai.
    if (authLoading) return;

    // Pengguna yang sudah terautentikasi masuk dashboard.
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [router, searchParams, authLoading, isAuthenticated]);

  // ====================================================
  // HANDLE EXPIRED SESSION
  // ====================================================

  useEffect(() => {
    if (searchParams.get("session_expired") === "true") {
      setError("Sesi Anda telah berakhir. Silakan masuk kembali.");

      authService.clearSession();
    }
  }, [searchParams]);

  // ====================================================
  // HANDLE LOGIN
  // ====================================================

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    // Validasi input.
    if (!identifier.trim() || !password) {
      setError("Silakan masukkan username dan password.");
      return;
    }

    try {
      setLoading(true);

      // Proses login.
      const result = await authService.login(
        identifier.trim(),
        password,
        rememberMe,
      );

      // Update AuthProvider.
      setSession(result.user);

      // Redirect dashboard.
      router.replace("/dashboard");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal masuk. Periksa kembali username dan password.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // RETURN
  // ====================================================

  return {
    identifier,
    setIdentifier,

    password,
    setPassword,

    showPassword,
    setShowPassword,

    rememberMe,
    setRememberMe,

    loading,
    error,

    handleSubmit,
  };
}
