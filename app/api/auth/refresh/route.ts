import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  REFRESH_COOKIE,
  REMEMBER_COOKIE,
  cookieOptions,
} from "@/lib/auth-cookie";
import { backend, isOk } from "@/lib/backend-client";

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
    const res = await backend.post("/auth/refresh", {
      refresh_token: current,
    });

    if (!isOk(res.status)) {
      const out = NextResponse.json(res.data, { status: res.status });
      // Hapus cookie rusak agar proxy tidak memicu loop redirect
      out.cookies.delete(REFRESH_COOKIE);
      out.cookies.delete(REMEMBER_COOKIE);
      return out;
    }

    const { token, refresh_token, user } = res.data.data;

    const out = NextResponse.json({ data: { token, user } });
    out.cookies.set(REFRESH_COOKIE, refresh_token, cookieOptions(remember));
    out.cookies.set(
      REMEMBER_COOKIE,
      remember ? "1" : "0",
      cookieOptions(remember),
    );
    return out;
  } catch {
    // Backend mati: cookie tidak dihapus, user bisa mencoba lagi nanti
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
