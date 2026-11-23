import { backend, isOk } from "@/lib/backend-client";

export interface RefreshedTokens {
  token: string;
  refresh_token: string;
  user: unknown;
}

const inflight = new Map<string, Promise<RefreshedTokens | null>>();

/**
 * Mengembalikan token baru, atau null jika refresh token ditolak backend.
 * Melempar error jika backend tidak dapat dihubungi.
 */
export function refreshTokens(
  refreshToken: string,
): Promise<RefreshedTokens | null> {
  const existing = inflight.get(refreshToken);
  if (existing) return existing;

  const promise = backend
    .post("/auth/refresh", { refresh_token: refreshToken })
    .then((res) =>
      isOk(res.status) ? (res.data.data as RefreshedTokens) : null,
    );

  inflight.set(refreshToken, promise);

  // Simpan hasil 10 detik untuk request susulan yang masih membawa cookie lama
  promise.then(
    () => setTimeout(() => inflight.delete(refreshToken), 10_000),
    () => inflight.delete(refreshToken),
  );

  return promise;
}
