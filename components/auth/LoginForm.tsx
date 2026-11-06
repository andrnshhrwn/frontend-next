"use client";

import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, User } from "lucide-react";
import AuthInput from "./AuthInput";
import useLogin from "@/hooks/auth/useLogin";

export default function LoginForm() {
  const {
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
  } = useLogin();

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Selamat datang</h2>

        <p className="mt-2 text-gray-500">
          Masuk untuk melanjutkan ke dashboard.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle size={20} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          id="username"
          name="username"
          label="Username"
          type="text"
          autoComplete="username"
          placeholder="Masukkan username akun Anda"
          value={identifier}
          onChange={setIdentifier}
          disabled={loading}
          icon={<User size={20} />}
        />

        <AuthInput
          id="password"
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          placeholder="Masukkan password"
          value={password}
          onChange={setPassword}
          disabled={loading}
          icon={<Lock size={20} />}
          trailing={
            <button
              type="button"
              aria-label={
                showPassword ? "Sembunyikan password" : "Tampilkan password"
              }
              onClick={() => setShowPassword((current) => !current)}
              disabled={loading}
              className="flex items-center justify-center text-gray-400 transition hover:text-gray-700 disabled:cursor-not-allowed"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          }
        />

        <div className="flex items-center">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              disabled={loading}
              className="checkbox checkbox-xs checkbox-primary"
            />
            Ingat saya
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3.5 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm" />
              Memproses...
            </>
          ) : (
            <>
              Masuk
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-xs leading-5 text-gray-400">
        Sistem Informasi PAM Tirta Kamuning
        <br />
        Gunakan akun resmi yang telah didaftarkan oleh administrator.
      </p>
    </>
  );
}
