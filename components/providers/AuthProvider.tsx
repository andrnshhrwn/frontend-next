"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { UserRole } from "@/services/authService";
import { useAuthStore } from "@/lib/auth/auth-store";
import PageSkeleton from "../layouts/PageSkeleton";

function isPageReload(): boolean {
  if (typeof window === "undefined") return false;

  const navEntries = performance.getEntriesByType(
    "navigation",
  ) as PerformanceNavigationTiming[];

  return navEntries.length > 0 && navEntries[0]?.type === "reload";
}

export function AuthProvider({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: UserRole[];
}) {
  const router = useRouter();
  const [isReload, setIsReload] = useState(false);

  const status = useAuthStore((s) => s.status);
  const userRole = useAuthStore((s) => s.user?.role);
  const initialize = useAuthStore((s) => s.initialize);
  const retry = useAuthStore((s) => s.retry);

  const hasAccess = roles
    ? userRole !== undefined && roles.includes(userRole)
    : true;

  const isChecking = status === "idle" || status === "checking";
  const isAuthenticated = status === "authenticated";
  const canRenderContent = isAuthenticated && hasAccess;

  useEffect(() => {
    setIsReload(isPageReload());
    void initialize();
  }, [initialize]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?session_expired=true");
    }
  }, [status, router]);

  return (
    <>
      <div
        aria-hidden={!canRenderContent}
        className={canRenderContent ? "contents" : "hidden"}
      >
        {children}
      </div>

      {isChecking && (
        <div
          role="status"
          aria-live="polite"
          aria-label="Memeriksa sesi Anda..."
          className="fixed inset-0 z-100 flex min-h-screen items-center justify-center overflow-auto bg-pdam-bg p-4"
        >
          {isReload ? (
            <p className="text-sm opacity-70">Memeriksa sesi Anda...</p>
          ) : (
            <PageSkeleton />
          )}
        </div>
      )}

      {status === "error" && (
        <div className="fixed inset-0 z-100 flex min-h-screen flex-col items-center justify-center gap-3 bg-pdam-bg">
          <p className="text-sm">
            Gagal memverifikasi sesi. Periksa koneksi Anda.
          </p>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => void retry()}
          >
            Coba lagi
          </button>
        </div>
      )}
    </>
  );
}
