"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/authService";

export default function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authService.isAuthenticated()) {
      router.replace("/dashboard");
    }
  }, [router]);

  useEffect(() => {
    if (searchParams.get("session_expired") === "true") {
      setError("Sesi Anda telah berakhir. Silakan masuk kembali.");
      authService.clearSession();
    }
  }, [searchParams]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!identifier.trim() || !password) {
      setError("Silakan masukkan username dan password.");
      return;
    }

    try {
      setLoading(true);

      await authService.login(identifier.trim(), password, rememberMe);

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
