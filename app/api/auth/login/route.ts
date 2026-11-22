import { NextResponse } from "next/server";
import {
  REFRESH_COOKIE,
  REMEMBER_COOKIE,
  cookieOptions,
} from "@/lib/auth-cookie";
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
    const remember = Boolean(rememberMe);

    const out = NextResponse.json({ data: { token, user } });
    out.cookies.set(REFRESH_COOKIE, refresh_token, cookieOptions(remember));
    out.cookies.set(
      REMEMBER_COOKIE,
      remember ? "1" : "0",
      cookieOptions(remember),
    );
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
