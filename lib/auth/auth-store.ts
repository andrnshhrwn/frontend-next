import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { useCallback } from "react";

import {
  authService,
  type UserProfile,
  type UserRole,
} from "@/services/authService";
import { ApiError } from "@/services/apiClient";

type AuthStatus =
  | "idle"
  | "checking"
  | "authenticated"
  | "unauthenticated"
  | "error";

interface AuthState {
  user: UserProfile | null;
  status: AuthStatus;

  initialize: () => Promise<void>;
  retry: () => Promise<void>;
  setSession: (user: UserProfile) => void;
  logout: () => Promise<void>;
}

const SESSION_CHECK_TIMEOUT_MS = 12000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error("Timeout memverifikasi sesi.")),
      ms,
    );

    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

let inFlight: Promise<void> | null = null;

async function verifySession(
  set: (
    partial: Partial<AuthState> | ((state: AuthState) => Partial<AuthState>),
  ) => void,
): Promise<void> {
  set({ status: "checking" });

  try {
    // Cookie dibaca proxy di server; refresh otomatis bila perlu
    const user = await withTimeout(
      authService.getMe(),
      SESSION_CHECK_TIMEOUT_MS,
    );

    if (!user) {
      throw new Error("Data pengguna tidak ditemukan.");
    }

    set({ user, status: "authenticated" });
  } catch (error: unknown) {
    if (error instanceof ApiError && error.status === 401) {
      authService.clearSession();
      set({ user: null, status: "unauthenticated" });
      return;
    }

    set({ user: null, status: "error" });
  }
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => {
      const runVerification = (): Promise<void> => {
        if (inFlight) {
          return inFlight;
        }

        inFlight = verifySession(set).finally(() => {
          inFlight = null;
        });

        return inFlight;
      };

      return {
        user: null,
        status: "idle",

        initialize: () => {
          const status = get().status;

          if (status === "authenticated" || status === "unauthenticated") {
            return Promise.resolve();
          }

          return runVerification();
        },

        retry: () => runVerification(),

        setSession: (user) => {
          set({ user, status: "authenticated" });
        },

        logout: async () => {
          await authService.logout();

          set({ user: null, status: "unauthenticated" });

          window.location.replace("/login");
        },
      };
    },
    {
      name: "AuthStore",
      enabled: process.env.NODE_ENV === "development",
    },
  ),
);

export const useUser = () => useAuthStore((s) => s.user);

export const useHasRole = (...roles: UserRole[]) =>
  useAuthStore((s) => s.user !== null && roles.includes(s.user.role));

export const useUserUnitId = () => useAuthStore((s) => s.user?.id_unit ?? null);

export const useIsGlobalScope = () =>
  useAuthStore(
    (s) => s.user?.role === "admin_pusat" || s.user?.role === "pimpinan",
  );

export const useRoleChecker = () => {
  const role = useAuthStore((s) => s.user?.role);

  return useCallback(
    (...roles: UserRole[]) => role !== undefined && roles.includes(role),
    [role],
  );
};
