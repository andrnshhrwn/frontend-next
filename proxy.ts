import { NextRequest, NextResponse } from "next/server";
import { authGuard } from "@/middleware/authGuard";

export function proxy(request: NextRequest) {
  const guardResponse = authGuard(request);

  if (guardResponse) {
    return guardResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
