import axios, { AxiosError, type AxiosRequestConfig } from "axios";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

const USER_KEY = "pdam_user";
const DEFAULT_TIMEOUT_MS = 10000;

// ======================================================
// TYPES
// ======================================================

export type UserRole = "admin_pusat" | "admin_cabang" | "teknisi";

export interface StoredUser {
  id_user: string;
  fullname: string;
  username: string;
  role: UserRole;
  id_unit: string | null;
  nama_unit: string | null;
}

export interface ApiValidationError {
  field?: string;
  message: string;
}

export interface RequestOptions {
  method?: string;
  params?: Record<string, string | number | boolean | undefined | null>;
  headers?: HeadersInit;
  body?: unknown;
  signal?: AbortSignal | null;
  timeoutMs?: number;
  _retried?: boolean;
}

type StorageType = "local" | "session";

export interface RefreshResult {
  token: string;
  user: StoredUser;
}

interface ErrorBody {
  message?: string;
  error?: string | { message?: string };
  code?: string;
  errors?: ApiValidationError[];
}

// ======================================================
// API ERROR
// ======================================================

export class ApiError extends Error {
  status: number;
  code?: string;
  errors?: ApiValidationError[];

  constructor(
    status: number,
    message: string,
    code?: string,
    errors?: ApiValidationError[],
  ) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.errors = errors;
  }
}

// ======================================================
// AXIOS INSTANCES
// ======================================================

// Untuk data: langsung ke backend Express
const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: DEFAULT_TIMEOUT_MS,
});

// Untuk auth: ke Route Handler Next (same-origin, membawa cookie httpOnly)
export const authHttp = axios.create({
  baseURL: "",
  timeout: DEFAULT_TIMEOUT_MS,
});

// ======================================================
// STORAGE HELPERS (hanya untuk profil user, bukan token)
// ======================================================

function getStorage(type: StorageType): Storage | null {
  if (typeof window === "undefined") return null;

  return type === "local" ? window.localStorage : window.sessionStorage;
}

function getStoredValue(key: string): string | null {
  const localValue = getStorage("local")?.getItem(key);

  if (localValue !== null && localValue !== undefined) {
    return localValue;
  }

  return getStorage("session")?.getItem(key) ?? null;
}

function setStoredValue(key: string, value: string, rememberMe: boolean): void {
  const localStorage = getStorage("local");
  const sessionStorage = getStorage("session");

  if (!localStorage || !sessionStorage) return;

  localStorage.removeItem(key);
  sessionStorage.removeItem(key);

  if (rememberMe) {
    localStorage.setItem(key, value);
  } else {
    sessionStorage.setItem(key, value);
  }
}

function removeStoredValue(key: string): void {
  getStorage("local")?.removeItem(key);
  getStorage("session")?.removeItem(key);
}

// ======================================================
// ACCESS TOKEN (disimpan di memori, bukan storage)
// ======================================================

let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function removeAccessToken(): void {
  accessToken = null;
}

// ======================================================
// ERROR HELPERS
// ======================================================

function extractMessage(data: ErrorBody | null, status: number): string {
  return (
    data?.message ??
    (typeof data?.error === "string" ? data.error : data?.error?.message) ??
    `Terjadi kesalahan pada server (Status: ${status})`
  );
}

export function toApiError(error: unknown, timeoutMs: number): ApiError {
  if (error instanceof ApiError) return error;

  if (axios.isAxiosError<ErrorBody>(error)) {
    if (error.response) {
      const { status, data } = error.response;
      const body = data && typeof data === "object" ? data : null;

      return new ApiError(
        status,
        extractMessage(body, status),
        body?.code,
        body?.errors,
      );
    }

    if (error.code === AxiosError.ECONNABORTED || error.code === "ETIMEDOUT") {
      return new ApiError(
        0,
        `Server tidak merespons dalam ${Math.round(timeoutMs / 1000)} detik.`,
        "TIMEOUT",
      );
    }

    if (axios.isCancel(error)) {
      return new ApiError(0, "Permintaan dibatalkan.", "CANCELED");
    }

    return new ApiError(
      0,
      "Tidak dapat terhubung ke server backend PAM Tirta Kamuning.",
      "NETWORK_ERROR",
    );
  }

  return new ApiError(
    0,
    error instanceof Error && error.message
      ? error.message
      : "Tidak dapat terhubung ke server backend PAM Tirta Kamuning.",
  );
}

// ======================================================
// REFRESH SESSION
// ======================================================

// Single-flight: banyak request bersamaan -> refresh hanya sekali.
// Wajib, karena refresh token berotasi di backend.
let refreshPromise: Promise<RefreshResult> | null = null;

export function refreshSession(): Promise<RefreshResult> {
  refreshPromise ??= authHttp
    .post<{ data?: RefreshResult }>("/api/auth/refresh")
    .then((res) => {
      const payload = res.data?.data;

      if (!payload?.token || !payload?.user) {
        throw new ApiError(401, "Sesi refresh tidak valid.");
      }

      accessToken = payload.token;
      return { token: payload.token, user: payload.user };
    })
    .catch((error: unknown) => {
      throw toApiError(error, DEFAULT_TIMEOUT_MS);
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

// ======================================================
// USER STORAGE
// ======================================================

export function getStoredUser(): StoredUser | null {
  if (typeof window === "undefined") return null;

  const raw = getStoredValue(USER_KEY);

  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    removeStoredUser();
    return null;
  }
}

export function setStoredUser(user: StoredUser, rememberMe: boolean): void {
  setStoredValue(USER_KEY, JSON.stringify(user), rememberMe);
}

export function removeStoredUser(): void {
  removeStoredValue(USER_KEY);
}

// ======================================================
// SESSION MANAGEMENT
// ======================================================

export function clearStoredSession(): void {
  removeAccessToken();
  removeStoredUser();
}

// ======================================================
// API REQUEST
// ======================================================

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    method = "GET",
    params,
    headers,
    body,
    signal,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    _retried = false,
  } = options;

  const cleanEndpoint = endpoint.split("?")[0];
  const url = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  const isLoginEndpoint = /\/auth\/login\/?$/.test(cleanEndpoint);
  const isAuthMeEndpoint = /\/auth\/me\/?$/.test(cleanEndpoint);

  const requestHeaders = new Headers(headers);
  requestHeaders.set("X-Client-Platform", "web");

  // Body string tanpa Content-Type dianggap JSON.
  // Objek dan FormData ditangani otomatis oleh axios.
  if (typeof body === "string" && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  // ----------------------------------------------------
  // PULIHKAN SESI (token memori kosong, mis. setelah reload)
  // ----------------------------------------------------

  if (
    typeof window !== "undefined" &&
    !getAccessToken() &&
    !isLoginEndpoint &&
    !requestHeaders.has("Authorization")
  ) {
    try {
      await refreshSession();
    } catch (err) {
      if (isAuthMeEndpoint && err instanceof ApiError && err.status === 401) {
        clearStoredSession();
        throw err;
      }
    }
  }

  const token = getAccessToken();

  if (token && !requestHeaders.has("Authorization")) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  // Parameter kosong tidak ikut dikirim
  const cleanParams = params
    ? Object.fromEntries(
        Object.entries(params).filter(
          ([, value]) => value !== undefined && value !== null && value !== "",
        ),
      )
    : undefined;

  const headerObject: Record<string, string> = {};
  requestHeaders.forEach((value, key) => {
    headerObject[key] = value;
  });

  const config: AxiosRequestConfig = {
    url,
    method,
    params: cleanParams,
    data: body,
    headers: headerObject,
    timeout: timeoutMs,
    signal: signal ?? undefined,
  };

  try {
    const response = await http.request<T>(config);
    return response.data;
  } catch (error: unknown) {
    // ==================================================
    // HANDLE UNAUTHORIZED
    // ==================================================

    if (
      axios.isAxiosError<ErrorBody>(error) &&
      error.response?.status === 401 &&
      !isLoginEndpoint
    ) {
      const code = error.response.data?.code;

      // Access token kedaluwarsa: refresh lalu ulangi request satu kali.
      if (code === "TOKEN_EXPIRED" && !_retried) {
        try {
          await refreshSession();

          // Pakai header asli tanpa Authorization lama
          const retryHeaders = new Headers(headers);
          retryHeaders.delete("Authorization");

          return await apiRequest<T>(endpoint, {
            ...options,
            headers: retryHeaders,
            _retried: true,
          });
        } catch (retryError) {
          // Error selain 401 (mis. jaringan, 500) diteruskan apa adanya
          if (!(retryError instanceof ApiError) || retryError.status !== 401) {
            throw retryError;
          }
        }
      }

      // Sesi benar-benar tidak valid
      clearStoredSession();

      if (!isAuthMeEndpoint && typeof window !== "undefined") {
        // Hapus cookie refresh token di server agar tidak terjadi loop redirect
        await authHttp.post("/api/auth/logout").catch(() => {});

        if (window.location.pathname !== "/login") {
          window.location.replace("/login?session_expired=true");
        }
      }

      throw new ApiError(
        401,
        "Sesi login telah kedaluwarsa. Silakan login kembali.",
        code,
      );
    }

    throw toApiError(error, timeoutMs);
  }
}

// ======================================================
// API CLIENT
// ======================================================

export const apiClient = {
  get: <T = unknown>(endpoint: string, params?: RequestOptions["params"]) =>
    apiRequest<T>(endpoint, {
      method: "GET",
      params,
    }),

  post: <T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">,
  ) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body,
    }),

  put: <T = unknown>(endpoint: string, body?: unknown) =>
    apiRequest<T>(endpoint, {
      method: "PUT",
      body,
    }),

  patch: <T = unknown>(endpoint: string, body?: unknown) =>
    apiRequest<T>(endpoint, {
      method: "PATCH",
      body,
    }),

  delete: <T = unknown>(endpoint: string) =>
    apiRequest<T>(endpoint, {
      method: "DELETE",
    }),
};
