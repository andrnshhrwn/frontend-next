"use client";

import React, { Suspense, useState, useEffect } from "react";
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
  Building2,
  Wrench,
} from "lucide-react";
import { authService, DEMO_ACCOUNTS } from "@/services/authService";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionExpired = searchParams.get("session_expired");

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDemoRole, setSelectedDemoRole] = useState<string | null>(null);

  useEffect(() => {
    // Jika sudah login, langsung arahkan ke dashboard
    if (authService.isAuthenticated()) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSelectDemo = (demo: (typeof DEMO_ACCOUNTS)[number]) => {
    setSelectedDemoRole(demo.role);
    setIdentifier(demo.identifier);
    setPassword(demo.password);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!identifier.trim() || !password) {
      setError("Silakan masukkan NIP/Email dan password Anda.");
      return;
    }

    try {
      setLoading(true);
      await authService.login(identifier, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(
        err?.message ||
          "Gagal masuk. Periksa kembali NIP/Email dan password Anda."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50 font-sans selection:bg-pdam-primary selection:text-white">
      {/* Kolom Kiri: Ilustrasi & Identitas Perusahaan */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-pdam-navy via-[#1e4577] to-pdam-primary p-12 flex-col justify-between relative overflow-hidden text-white">
        {/* Dekorasi Aksen Lingkaran Gelombang */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-pdam-primary/20 blur-2xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-cyan-300 shadow-inner">
            <Droplets className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-white leading-tight">
              PAM Tirta Kamuning
            </h2>
            <p className="text-[11px] text-cyan-200 tracking-wide font-medium">
              Kabupaten Kuningan - Jawa Barat
            </p>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-cyan-200 font-medium">
            <ShieldCheck className="w-4 h-4 text-cyan-300" />
            Portal Manajemen Terpusat 9 Unit Cabang
          </div>

          <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight text-white">
            Sistem Informasi Pergantian &amp; Manajemen Water Meter
          </h1>

          <p className="text-sm text-slate-200/90 leading-relaxed">
            Platform operasional digital untuk mencatat nomor seri, penugasan teknisi,
            verifikasi Berita Acara Penggantian (BAP), dan monitoring realisasi penggantian
            meter air secara transparan dan akuntabel.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
            <div>
              <p className="text-2xl font-bold text-cyan-300">267</p>
              <p className="text-xs text-slate-300 mt-0.5">Penggantian Selesai</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">9 Unit</p>
              <p className="text-xs text-slate-300 mt-0.5">Cabang Pelayanan</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-cyan-300">1.840</p>
              <p className="text-xs text-slate-300 mt-0.5">Aset Water Meter</p>
            </div>
          </div>
        </div>

        {/* Footer Kiri */}
        <div className="relative z-10 text-[11px] text-slate-300/80 flex items-center justify-between">
          <span>&copy; 2026 Perumda Air Minum Tirta Kamuning</span>
          <span>Versi Sistem 2.4</span>
        </div>
      </div>

      {/* Kolom Kanan: Form Login */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-20 py-12 bg-white">
        <div className="w-full max-w-md mx-auto space-y-6">
          {/* Header Mobile Brand */}
          <div className="lg:hidden flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-pdam-primary/10 border border-pdam-primary/20 flex items-center justify-center text-pdam-primary">
              <Droplets className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-pdam-navy">PAM Tirta Kamuning</h2>
              <p className="text-[10px] text-slate-500">Kabupaten Kuningan</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-pdam-navy tracking-tight">
              Selamat Datang Kembali
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Masukkan NIP atau Email resmi untuk masuk ke akun Anda.
            </p>
          </div>

          {/* Notifikasi Sesi Kedaluwarsa */}
          {sessionExpired && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Sesi login Anda telah berakhir. Silakan masuk kembali.</span>
            </div>
          )}

          {/* Alert Error */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Login */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                NIP atau Email Resmi
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Contoh: 19880412... atau nama@tirtakamuning.co.id"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pdam-primary/30 focus:border-pdam-primary transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <a
                  href="#bantuan"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Silakan hubungi Administrator IT Kantor Pusat Kuningan untuk reset password.");
                  }}
                  className="text-[11px] text-pdam-primary hover:underline font-medium"
                >
                  Lupa password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi akun"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pdam-primary/30 focus:border-pdam-primary transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  aria-label="Toggle password"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="checkbox checkbox-xs rounded border-slate-300 text-pdam-primary"
                />
                <span>Ingat saya di perangkat ini</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn bg-pdam-primary hover:bg-pdam-navy text-white font-semibold text-xs border-none rounded-xl py-3 shadow-md shadow-pdam-primary/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-xs" />
                  <span>Memverifikasi akun...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Switcher untuk kemudahan testing */}
          <div className="pt-5 border-t border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Uji Coba Cepat (Akun Demo PAM):
            </p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => handleSelectDemo(acc)}
                  className={`p-2 rounded-xl border text-left transition ${
                    selectedDemoRole === acc.role
                      ? "border-pdam-primary bg-pdam-primary/5 ring-1 ring-pdam-primary"
                      : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-pdam-navy font-semibold text-[11px] truncate">
                    {acc.role === "admin_pusat" && <Building2 className="w-3 h-3 text-pdam-primary" />}
                    {acc.role === "admin_cabang" && <Building2 className="w-3 h-3 text-pdam-navy" />}
                    {acc.role === "teknisi" && <Wrench className="w-3 h-3 text-amber-600" />}
                    <span className="truncate">{acc.label}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 truncate">{acc.unit}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-3 text-pdam-navy">
            <span className="loading loading-spinner loading-lg text-pdam-primary" />
            <p className="text-sm font-medium">Memuat halaman login...</p>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
