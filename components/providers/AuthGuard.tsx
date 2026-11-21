"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import type { UserRole } from "@/services/authService";
import { useAuthStore } from "@/lib/auth/auth-store";

function FullScreenMessage({ text }: { text: string }) {
  return (
    <div className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center bg-pdam-bg">
      <p className="text-sm opacity-70">{text}</p>
    </div>
  );
}

export function AuthGuard({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: UserRole[];
}) {
  const router = useRouter();

  const status = useAuthStore((s) => s.status);
  const initialize = useAuthStore((s) => s.initialize);
  const retry = useAuthStore((s) => s.retry);

  const hasAccess = useAuthStore((s) =>
    roles ? s.user !== null && roles.includes(s.user.role) : true,
  );

  const isChecking = status === "idle" || status === "checking";
  const isAuthenticated = status === "authenticated";
  const canRenderContent = isAuthenticated && hasAccess;

  useEffect(() => {
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

      {isChecking && <FullScreenMessage text="Memeriksa sesi Anda..." />}

      {status === "error" && (
        <div className="fixed inset-0 z-[100] flex min-h-screen flex-col items-center justify-center gap-3 bg-pdam-bg">
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

      {status === "unauthenticated" && (
        <FullScreenMessage text="Mengalihkan..." />
      )}

      {isAuthenticated && !hasAccess && (
        <FullScreenMessage text="Anda tidak memiliki akses ke halaman ini." />
      )}
    </>
  );
}
