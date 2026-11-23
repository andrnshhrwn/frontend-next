import type { NextResponse } from "next/server";

export const ACCESS_COOKIE = "access_token";
export const REFRESH_COOKIE = "refresh_token";
export const REMEMBER_COOKIE = "refresh_remember";

const SEVEN_DAYS = 60 * 60 * 24 * 7;

// Harus <= JWT_EXPIRES_IN backend (15m).
export const ACCESS_MAX_AGE = 14 * 60;

const base = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export const accessCookieOptions = () => ({ ...base, maxAge: ACCESS_MAX_AGE });

export const cookieOptions = (remember: boolean) => ({
  ...base,
  // Tanpa maxAge = cookie sesi (hilang saat browser ditutup)
  ...(remember ? { maxAge: SEVEN_DAYS } : {}),
});

export function setAuthCookies(
  res: NextResponse,
  tokens: { token: string; refresh_token: string },
  remember: boolean,
) {
  res.cookies.set(ACCESS_COOKIE, tokens.token, accessCookieOptions());
  res.cookies.set(
    REFRESH_COOKIE,
    tokens.refresh_token,
    cookieOptions(remember),
  );
  res.cookies.set(
    REMEMBER_COOKIE,
    remember ? "1" : "0",
    cookieOptions(remember),
  );
}

export function clearAuthCookies(res: NextResponse) {
  res.cookies.delete(ACCESS_COOKIE);
  res.cookies.delete(REFRESH_COOKIE);
  res.cookies.delete(REMEMBER_COOKIE);
}
