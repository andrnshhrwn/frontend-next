import { NextResponse } from "next/server";
import { setAuthCookies } from "@/lib/auth-cookie";
import { backend, isOk } from "@/lib/backend-client";

export async function POST(req: Request) {
  try {
    const { username, password, rememberMe } = await req.json();

    const res = await backend.post(
      "/auth/login",
      { username, password },
      { headers: { "X-Client-Platform": "web" } },
    );

    if (!isOk(res.status)) {
      return NextResponse.json(res.data, { status: res.status });
    }

    const { token, refresh_token, user } = res.data.data;

    // Token tidak dikirim ke browser, hanya data user
    const out = NextResponse.json({ data: { user } });
    setAuthCookies(out, { token, refresh_token }, Boolean(rememberMe));
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
