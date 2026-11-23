import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  REMEMBER_COOKIE,
  clearAuthCookies,
  setAuthCookies,
} from "@/lib/auth-cookie";
import { backend } from "@/lib/backend-client";
import { refreshTokens, type RefreshedTokens } from "@/lib/server-auth";

type Ctx = { params: Promise<{ path: string[] }> };

function sessionExpired() {
  const out = NextResponse.json(
    { status: "error", code: "SESSION_EXPIRED", message: "Sesi berakhir." },
    { status: 401 },
  );
  clearAuthCookies(out);
  return out;
}

function readCode(data: ArrayBuffer): string | undefined {
  try {
    return JSON.parse(Buffer.from(data).toString("utf8"))?.code;
  } catch {
    return undefined;
  }
}

async function handler(req: Request, ctx: Ctx) {
  const { path } = await ctx.params;
  const store = await cookies();

  const refreshCookie = store.get(REFRESH_COOKIE)?.value;
  const remember = store.get(REMEMBER_COOKIE)?.value === "1";
  let access = store.get(ACCESS_COOKIE)?.value;
  let renewed: RefreshedTokens | null = null;

  try {
    // Cookie access habis tetapi refresh token masih ada -> refresh dulu
    if (!access && refreshCookie) {
      renewed = await refreshTokens(refreshCookie);
      if (!renewed) return sessionExpired();
      access = renewed.token;
    }

    const url = new URL(req.url);
    const hasBody = req.method !== "GET" && req.method !== "HEAD";
    const data = hasBody ? Buffer.from(await req.arrayBuffer()) : undefined;
    const contentType = req.headers.get("content-type");

    const forward = (token?: string) =>
      backend.request<ArrayBuffer>({
        url: `/${path.join("/")}${url.search}`,
        method: req.method,
        data,
        responseType: "arraybuffer",
        timeout: 30000,
        headers: {
          "X-Client-Platform": "web",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(contentType ? { "Content-Type": contentType } : {}),
        },
      });

    let res = await forward(access);

    // Backend menyatakan access token kedaluwarsa -> refresh, ulangi sekali
    if (
      res.status === 401 &&
      refreshCookie &&
      !renewed &&
      readCode(res.data) === "TOKEN_EXPIRED"
    ) {
      renewed = await refreshTokens(refreshCookie);
      if (!renewed) return sessionExpired();
      res = await forward(renewed.token);
    }

    const noBody = res.status === 204 || res.status === 304;

    const upstreamType = res.headers["content-type"];
    const contentTypeOut =
      typeof upstreamType === "string" ? upstreamType : "application/json";

    const out = new NextResponse(noBody ? null : res.data, {
      status: res.status,
      headers: {
        "Content-Type": contentTypeOut,
        "Cache-Control": "no-store",
      },
    });

    if (renewed) setAuthCookies(out, renewed, remember);

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

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};
