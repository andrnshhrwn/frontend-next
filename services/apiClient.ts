export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

const TOKEN_KEY = "pdam_access_token";
const USER_KEY = "pdam_user";
const SESSION_COOKIE = "pdam_session";

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

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
}

type StorageType = "local" | "session";

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
// STORAGE HELPERS
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
// SESSION COOKIE HELPERS
// ======================================================

function setSessionCookie(rememberMe: boolean): void {
  if (typeof document === "undefined") return;

  const maxAge = rememberMe ? `; max-age=${60 * 60 * 24 * 7}` : "";

  document.cookie = `${SESSION_COOKIE}=1; path=/; SameSite=Lax${maxAge}`;
}

function removeSessionCookie(): void {
  if (typeof document === "undefined") return;

  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

// ======================================================
// TOKEN STORAGE
// ======================================================

export function getAccessToken(): string | null {
  return getStoredValue(TOKEN_KEY);
}

export function setAccessToken(token: string, rememberMe: boolean): void {
  setStoredValue(TOKEN_KEY, token, rememberMe);
  setSessionCookie(rememberMe);
}

export function removeAccessToken(): void {
  removeStoredValue(TOKEN_KEY);
  removeSessionCookie();
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
  const { params, headers = {}, ...customOptions } = options;

  let url = `${API_BASE_URL}${
    endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  }`;

  if (params) {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();

    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const requestHeaders = new Headers(headers);
  const token = getAccessToken();

  if (token && !requestHeaders.has("Authorization")) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  requestHeaders.set("X-Client-Platform", "web");

  const isFormData =
    typeof FormData !== "undefined" && customOptions.body instanceof FormData;

  if (!isFormData && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const isLoginEndpoint = /\/auth\/login\/?$/.test(endpoint.split("?")[0]);

  try {
    const response = await fetch(url, {
      ...customOptions,
      headers: requestHeaders,
    });

    // ==================================================
    // HANDLE UNAUTHORIZED
    // ==================================================

    if (response.status === 401 && !isLoginEndpoint) {
      clearStoredSession();

      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        window.location.replace("/login?session_expired=true");
      }

      throw new ApiError(
        401,
        "Sesi login telah kedaluwarsa. Silakan login kembali.",
      );
    }

    // ==================================================
    // PARSE RESPONSE
    // ==================================================

    const data: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      const errorData =
        data && typeof data === "object"
          ? (data as {
              message?: string;
              error?: string | { message?: string };
              code?: string;
              errors?: ApiValidationError[];
            })
          : null;

      const errorMessage =
        errorData?.message ??
        (typeof errorData?.error === "string"
          ? errorData.error
          : errorData?.error?.message) ??
        `Terjadi kesalahan pada server (Status: ${response.status})`;

      throw new ApiError(
        response.status,
        errorMessage,
        errorData?.code,
        errorData?.errors,
      );
    }

    return data as T;
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }

    const message = error instanceof Error ? error.message : "Tidak diketahui";

    throw new ApiError(
      0,
      message || "Tidak dapat terhubung ke server backend PAM Tirta Kamuning.",
    );
  }
}

// ======================================================
// API CLIENT
// ======================================================

function serializeBody(body: unknown): BodyInit | undefined {
  if (body === undefined || body === null) {
    return undefined;
  }

  if (typeof FormData !== "undefined" && body instanceof FormData) {
    return body;
  }

  return JSON.stringify(body);
}

export const apiClient = {
  get: <T = unknown>(endpoint: string, params?: RequestOptions["params"]) =>
    apiRequest<T>(endpoint, {
      method: "GET",
      params,
    }),

  post: <T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit,
  ) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body: serializeBody(body),
    }),

  put: <T = unknown>(endpoint: string, body?: unknown) =>
    apiRequest<T>(endpoint, {
      method: "PUT",
      body: serializeBody(body),
    }),

  patch: <T = unknown>(endpoint: string, body?: unknown) =>
    apiRequest<T>(endpoint, {
      method: "PATCH",
      body: serializeBody(body),
    }),

  delete: <T = unknown>(endpoint: string) =>
    apiRequest<T>(endpoint, {
      method: "DELETE",
    }),
};
