import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { REFRESH_COOKIE, clearAuthCookies } from "@/lib/auth-cookie";
import { backend } from "@/lib/backend-client";

export async function POST() {
  const store = await cookies();
  const current = store.get(REFRESH_COOKIE)?.value;

  if (current) {
    await backend
      .post("/auth/logout", { refresh_token: current })
      .catch(() => {});
  }

  const out = NextResponse.json({ data: null });
  clearAuthCookies(out);
  return out;
}
