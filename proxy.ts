import { NextResponse, type NextRequest } from "next/server";
import { decode } from "@auth/core/jwt";

function getSessionCookieName(request: NextRequest): string {
  return request.cookies.get("__Secure-authjs.session-token")
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isDashboardPage = pathname.startsWith("/admin/dashboard");
  const isLoginPage = pathname === "/admin/login";

  const cookieName = getSessionCookieName(request);
  const rawToken = request.cookies.get(cookieName)?.value;

  if (!rawToken) {
    if (isDashboardPage) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  try {
    const decoded = await decode({
      token: rawToken,
      secret: process.env.AUTH_SECRET!,
      salt: cookieName,
    });

    const now = Math.floor(Date.now() / 1000);
    const isExpired = !!(
      decoded?.exp &&
      typeof decoded.exp === "number" &&
      decoded.exp < now
    );

    if (!decoded || isExpired) {
      if (isDashboardPage) {
        return NextResponse.redirect(
          new URL("/admin/login?reason=expired", request.url),
        );
      }
      return NextResponse.next();
    }

    // If logged in and trying to access login page, go to dashboard
    if (isLoginPage) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Auth Error:", error);
    if (isDashboardPage) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/admin/dashboard", "/admin/"],
};
