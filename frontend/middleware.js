
import { NextResponse } from "next/server";

export function middleware(req) {
  const { cookies, nextUrl } = req;

  const userId = cookies.get("userid");
  const devSession = cookies.get("next-auth.session-token");

  const isLoggedIn = userId || devSession;

  // Public routes (accessible without login)
  const publicPaths = ["/", "/login", "/signup"];
  const isPublicPath = publicPaths.includes(nextUrl.pathname);

  //  If not logged in and trying to access a protected route → redirect to the login page,
  if (!isLoggedIn && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If logged in and trying to access login or signup → redirect to profile
  if (isLoggedIn && ["/login", "/signup"].includes(nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  return NextResponse.next();
}

// Apply middleware to all routes except static/assets
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
