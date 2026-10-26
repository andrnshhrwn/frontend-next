import { redirect } from 'next/navigation';

/**
 * Root route ( / ) → redirect ke /login
 *
 * Alur autentikasi:
 *   1. User buka "/" → redirect ke "/login" (statis, di-prerender saat build)
 *   2. LoginPage cek authService.isAuthenticated() (localStorage)
 *      - Sudah login  → auto-redirect ke "/dashboard"
 *      - Belum login   → tampilkan form login
 *
 * Tidak menggunakan cookies()/connection() karena auth token
 * disimpan di localStorage (client-side), bukan HttpOnly cookie.
 */
export default function HomePage() {
  redirect('/login');
}