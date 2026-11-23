import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  REFRESH_COOKIE,
  REMEMBER_COOKIE,
  clearAuthCookies,
  setAuthCookies,
} from "@/lib/auth-cookie";
import { refreshTokens } from "@/lib/server-auth";

export async function POST() {
  const store = await cookies();
  const current = store.get(REFRESH_COOKIE)?.value;
  const remember = store.get(REMEMBER_COOKIE)?.value === "1";

  if (!current) {
    return NextResponse.json(
      { status: "error", code: "NO_REFRESH_TOKEN", message: "Belum login." },
      { status: 401 },
    );
  }

  try {
    const tokens = await refreshTokens(current);

    if (!tokens) {
      const out = NextResponse.json(
        { status: "error", code: "SESSION_EXPIRED", message: "Sesi berakhir." },
        { status: 401 },
      );
      clearAuthCookies(out);
      return out;
    }

    const out = NextResponse.json({ data: { user: tokens.user } });
    setAuthCookies(out, tokens, remember);
    return out;
  } catch {
    return NextResponse.json(
      {
        status: "error",
        code: "BACKEND_UNREACHABLE",
        message: "Server tidak dapat dihubungi.",
      },
      { status: 502 },
    );
  }
}
