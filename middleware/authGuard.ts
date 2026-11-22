import { NextRequest, NextResponse } from "next/server";

// Cookie httpOnly yang dibuat oleh Route Handler login/refresh
const SESSION_COOKIE = "refresh_token";
const PUBLIC_PATHS = ["/login"];
const DEFAULT_AUTHENTICATED_PATH = "/dashboard";

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

function redirectTo(request: NextRequest, pathname: string): NextResponse {
  const url = request.nextUrl.clone();

  url.pathname = pathname;
  url.search = "";

  return NextResponse.redirect(url);
}

export function authGuard(request: NextRequest): NextResponse | null {
  const { pathname, searchParams } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);

  // Redirect halaman root.
  if (pathname === "/") {
    return redirectTo(
      request,
      hasSession ? DEFAULT_AUTHENTICATED_PATH : "/login",
    );
  }

  const isPublic = isPublicPath(pathname);

  // Blokir akses halaman privat tanpa cookie sesi.
  if (!hasSession && !isPublic) {
    return redirectTo(request, "/login");
  }

  // Arahkan pengguna yang sudah memiliki sesi dari login ke dashboard.
  if (
    hasSession &&
    pathname === "/login" &&
    searchParams.get("session_expired") !== "true"
  ) {
    return redirectTo(request, DEFAULT_AUTHENTICATED_PATH);
  }

  return null;
}
