/**
 * PAM Tirta Kamuning - HTTP API Client
 * Terintegrasi dengan JWT Bearer Token, Base URL konfigurabel, dan penanganan respon standar.
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

const TOKEN_KEY = "pdam_access_token";
const USER_KEY = "pdam_user_profile";

export class ApiError extends Error {
  status: number;
  code?: string;
  errors?: Array<{ field?: string; message: string }>;

  constructor(status: number, message: string, code?: string, errors?: any[]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.errors = errors;
  }
}

// Token Storage Helpers
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

export function getStoredUser(): any | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredUser(user: any): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function removeStoredUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_KEY);
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, headers = {}, ...customOptions } = options;

  // Format Query Params
  let url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") {
        searchParams.append(k, String(v));
      }
    });
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  // Inject Authorization Token
  const token = getAccessToken();
  const reqHeaders = new Headers(headers);

  if (token && !reqHeaders.has("Authorization")) {
    reqHeaders.set("Authorization", `Bearer ${token}`);
  }

  // Check if body is FormData
  const isFormData = customOptions.body instanceof FormData;
  if (!isFormData && !reqHeaders.has("Content-Type")) {
    reqHeaders.set("Content-Type", "application/json");
  }

  try {
    const response = await fetch(url, {
      ...customOptions,
      headers: reqHeaders,
    });

    // 401 Unauthorized -> Sesi kedaluwarsa
    if (response.status === 401) {
      removeAccessToken();
      removeStoredUser();
      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        window.location.href = "/login?session_expired=true";
      }
      throw new ApiError(401, "Sesi login telah kedaluwarsa. Silakan login kembali.");
    }

    // Parse JSON
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const message =
        data?.message ||
        data?.error ||
        `Terjadi kesalahan pada server (Status: ${response.status})`;
      throw new ApiError(response.status, message, data?.code, data?.errors);
    }

    return data as T;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network / Offline Error
    throw new ApiError(
      0,
      error?.message || "Tidak dapat terhubung ke server backend PAM Tirta Kamuning."
    );
  }
}

export const apiClient = {
  get: <T = any>(endpoint: string, params?: Record<string, any>) =>
    apiRequest<T>(endpoint, { method: "GET", params }),

  post: <T = any>(endpoint: string, body?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    }),

  put: <T = any>(endpoint: string, body?: any) =>
    apiRequest<T>(endpoint, {
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  patch: <T = any>(endpoint: string, body?: any) =>
    apiRequest<T>(endpoint, {
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  delete: <T = any>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: "DELETE" }),
};
