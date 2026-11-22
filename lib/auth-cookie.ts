export const REFRESH_COOKIE = "refresh_token";
export const REMEMBER_COOKIE = "refresh_remember";

const SEVEN_DAYS = 60 * 60 * 24 * 7;

export function cookieOptions(remember: boolean) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    // tanpa maxAge = cookie sesi (hilang saat browser ditutup)
    ...(remember ? { maxAge: SEVEN_DAYS } : {}),
  };
}
