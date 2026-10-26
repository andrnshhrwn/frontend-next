'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService, type UserProfile } from '@/services/authService';
import type { UserRole } from '@/types/pdam';

// ─── RBAC Permission Matrix ────────────────────────────────────────
// Berdasarkan PRD context.md Section 2: Target User Persona & Access Control
//
// Admin Pusat  : Scope Global — semua menu, semua data unit cabang
// Admin Cabang : Scope Unit   — kelola WM unit sendiri, disposisi teknisi, validasi laporan
// Teknisi      : Scope Tugas  — hanya dashboard + penugasan yang diberikan
// ────────────────────────────────────────────────────────────────────

export type Permission =
  | 'dashboard:view'
  | 'water-meter:view'
  | 'water-meter:create'
  | 'water-meter:edit'
  | 'water-meter:delete'
  | 'pelanggan:view'
  | 'pelanggan:edit'
  | 'penugasan:view'
  | 'penugasan:create'   // Buat tiket tugas baru
  | 'penugasan:assign'   // Assign teknisi (admin cabang)
  | 'validasi:view'
  | 'validasi:approve'
  | 'data-tarif:view'
  | 'data-tarif:manage'
  | 'data-merk-wm:view'
  | 'data-merk-wm:manage'
  | 'data-user:view'
  | 'data-user:manage'
  | 'global-data:view';  // Melihat data seluruh unit cabang

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin_pusat: [
    'dashboard:view',
    'water-meter:view', 'water-meter:create', 'water-meter:edit', 'water-meter:delete',
    'pelanggan:view', 'pelanggan:edit',
    'penugasan:view', 'penugasan:create',
    'validasi:view', 'validasi:approve',
    'data-tarif:view', 'data-tarif:manage',
    'data-merk-wm:view', 'data-merk-wm:manage',
    'data-user:view', 'data-user:manage',
    'global-data:view',
  ],
  admin_cabang: [
    'dashboard:view',
    'water-meter:view', 'water-meter:create', 'water-meter:edit',
    'pelanggan:view',
    'penugasan:view', 'penugasan:assign',
    'validasi:view', 'validasi:approve',
    'data-tarif:view',
    'data-merk-wm:view',
    'data-user:view',
  ],
  teknisi: [
    'dashboard:view',
    'penugasan:view',
  ],
};

// Mapping route → permission yang diperlukan
const ROUTE_PERMISSIONS: Record<string, Permission> = {
  '/dashboard':    'dashboard:view',
  '/water-meter':  'water-meter:view',
  '/pelanggan':    'pelanggan:view',
  '/penugasan':    'penugasan:view',
  '/validasi':     'validasi:view',
  '/data-tarif':   'data-tarif:view',
  '/data-merk-wm': 'data-merk-wm:view',
  '/data-user':    'data-user:view',
};

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  /** Cek apakah user memiliki satu atau lebih permission */
  hasPermission: (...permissions: Permission[]) => boolean;
  /** Cek apakah role user ada di daftar yang diizinkan */
  hasRole: (...roles: UserRole[]) => boolean;
  /** Scope unit_kerja user (null = global/pusat) */
  userUnitId: number | null;
  /** Apakah user memiliki akses global ke semua data cabang */
  isGlobalScope: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Hook untuk mengakses context auth dan RBAC.
 * Harus digunakan di dalam <AuthProvider>.
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth() harus digunakan di dalam <AuthProvider>');
  }
  return ctx;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Provider autentikasi & otorisasi terpusat.
 * Membungkus seluruh halaman yang membutuhkan autentikasi.
 *
 * Fitur:
 * - Auto-redirect ke /login jika belum login
 * - Permission check berdasarkan role
 * - Route guard berdasarkan mapping ROUTE_PERMISSIONS
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cek autentikasi saat mount
    const isAuth = authService.isAuthenticated();
    if (!isAuth) {
      router.replace('/login');
      return;
    }

    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.replace('/login?session_expired=true');
      return;
    }

    setUser(currentUser);
    setLoading(false);
  }, [router]);

  // Route-level permission guard
  useEffect(() => {
    if (loading || !user) return;

    const requiredPerm = ROUTE_PERMISSIONS[pathname];
    if (requiredPerm) {
      const userPerms = ROLE_PERMISSIONS[user.role] || [];
      if (!userPerms.includes(requiredPerm)) {
        // User tidak punya akses ke route ini → redirect ke dashboard
        router.replace('/dashboard');
      }
    }
  }, [pathname, user, loading, router]);

  const hasPermission = (...permissions: Permission[]): boolean => {
    if (!user) return false;
    const userPerms = ROLE_PERMISSIONS[user.role] || [];
    return permissions.every((p) => userPerms.includes(p));
  };

  const hasRole = (...roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const userUnitId = user?.role === 'admin_pusat' ? null : (user?.unit_kerja?.id_unit ?? null);
  const isGlobalScope = user?.role === 'admin_pusat';

  const logout = async () => {
    await authService.logout();
  };

  const value: AuthContextValue = {
    user,
    loading,
    isAuthenticated: !!user,
    hasPermission,
    hasRole,
    userUnitId,
    isGlobalScope,
    logout,
  };

  // Loading screen saat cek autentikasi
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pdam-bg">
        <div className="flex flex-col items-center gap-3">
          <span className="loading loading-spinner loading-lg text-pdam-primary" />
          <p className="text-sm font-medium text-pdam-navy">Memverifikasi sesi...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Ekspor tambahan untuk penggunaan di luar komponen ──────────────
export { ROLE_PERMISSIONS, ROUTE_PERMISSIONS };
