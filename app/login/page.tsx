"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  Droplets,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { authService } from "@/services/authService";

function LoginForm() {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!identifier.trim() || !password) {
      setError("Silakan masukkan username dan password.");
      return;
    }

    try {
      setLoading(true);

      await authService.login(identifier.trim(), password);

      // Backend mengembalikan token dan data pengguna.
      // Sesi disimpan oleh authService setelah login berhasil.
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

  return (
    <main className="min-h-screen bg-pdam-bg flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Panel informasi */}
        <section className="hidden lg:flex flex-col justify-between bg-primary p-10 text-white">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-2xl bg-white/15 p-3">
                <Droplets size={32} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">PAM Tirta Kamuning</h1>
                <p className="text-sm text-white/75">
                  Sistem Informasi Pengelolaan Water Meter
                </p>
              </div>
            </div>

            <div className="mt-16">
              <h2 className="text-4xl font-bold leading-tight">
                Pengelolaan water meter yang lebih terintegrasi.
              </h2>
              <p className="mt-5 max-w-md leading-7 text-white/80">
                Kelola data pelanggan, distribusi water meter, penugasan
                teknisi, dan proses validasi dalam satu sistem.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4">
            <ShieldCheck size={28} />
            <div>
              <p className="font-semibold">Akses sistem terlindungi</p>
              <p className="text-sm text-white/75">
                Masuk menggunakan akun yang terdaftar.
              </p>
            </div>
          </div>
        </section>

        {/* Form login */}
        <section className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary p-3 text-white">
                <Droplets size={28} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  PAM Tirta Kamuning
                </h1>
                <p className="text-sm text-gray-500">
                  Sistem Informasi Water Meter
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Selamat datang</h2>
            <p className="mt-2 text-gray-500">
              Masuk untuk melanjutkan ke dashboard.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <AlertCircle size={20} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Username
              </label>

              <div className="relative">
                <User
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Masukkan username akun Anda"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Password
              </label>

              <div className="relative">
                <Lock
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-12 pr-12 text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                />

                <button
                  type="button"
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Tampilkan password"
                  }
                  onClick={() => setShowPassword((current) => !current)}
                  disabled={loading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                  className="checkbox checkbox-sm checkbox-primary"
                />
                Ingat saya
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
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
        </section>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-pdam-bg">
          <span className="loading loading-spinner loading-lg text-primary" />
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
