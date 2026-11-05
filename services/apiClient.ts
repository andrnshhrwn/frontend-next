export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

const TOKEN_KEY = "pdam_access_token";
const USER_KEY = "pdam_user";

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
// TOKEN STORAGE HELPERS
// ======================================================

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;

  return localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(TOKEN_KEY, token);
}

export function removeAccessToken(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(TOKEN_KEY);
}

// ======================================================
// USER STORAGE HELPERS
// ======================================================

export function getStoredUser(): StoredUser | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(USER_KEY);

  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    removeStoredUser();
    return null;
  }
}

export function setStoredUser(user: StoredUser): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function removeStoredUser(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(USER_KEY);
}

// ======================================================
// API REQUEST
// ======================================================

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { params, headers = {}, ...customOptions } = options;

  // Build URL
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

  // Authorization
  const token = getAccessToken();
  const requestHeaders = new Headers(headers);

  if (token && !requestHeaders.has("Authorization")) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  // Content-Type
  const isFormData =
    typeof FormData !== "undefined" && customOptions.body instanceof FormData;

  if (!isFormData && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  try {
    const response = await fetch(url, {
      ...customOptions,
      headers: requestHeaders,
    });

    // Handle expired session
    if (response.status === 401) {
      removeAccessToken();
      removeStoredUser();

      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        window.location.href = "/login?session_expired=true";
      }

      throw new ApiError(
        401,
        "Sesi login telah kedaluwarsa. Silakan login kembali.",
      );
    }

    // Parse response
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
