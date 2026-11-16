import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "pdam_session";

const PUBLIC_PATHS = ["/login"];

const DEFAULT_AUTHENTICATED_PATH = "/dashboard";

// ======================================================
// PUBLIC PATH CHECK
// ======================================================

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

// ======================================================
// REDIRECT HELPER
// ======================================================

function redirectTo(request: NextRequest, pathname: string): NextResponse {
  const url = request.nextUrl.clone();

  url.pathname = pathname;
  url.search = "";

  return NextResponse.redirect(url);
}

// ======================================================
// AUTH GUARD
// ======================================================

export function authGuard(request: NextRequest): NextResponse | null {
  const { pathname, searchParams } = request.nextUrl;

  const hasSession = request.cookies.has(SESSION_COOKIE);

  const isPublic = isPublicPath(pathname);

  // ----------------------------------------------------
  // UNAUTHENTICATED USER
  // ----------------------------------------------------

  if (!hasSession && !isPublic) {
    return redirectTo(request, "/login");
  }

  // ----------------------------------------------------
  // AUTHENTICATED USER ACCESSING LOGIN
  // ----------------------------------------------------

  if (
    hasSession &&
    pathname === "/login" &&
    searchParams.get("session_expired") !== "true"
  ) {
    return redirectTo(request, DEFAULT_AUTHENTICATED_PATH);
  }

  // ----------------------------------------------------
  // ROOT REDIRECT
  // ----------------------------------------------------

  if (pathname === "/") {
    return redirectTo(
      request,
      hasSession ? DEFAULT_AUTHENTICATED_PATH : "/login",
    );
  }

  return null;
}
