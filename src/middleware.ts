import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static assets and public routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname === "/" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/book")
  ) {
    return NextResponse.next();
  }

  try {
    // Create a Supabase client
    const supabase = createClient();

    // Check if the user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // If the user is not authenticated and trying to access a protected route
    if (!session) {
      const redirectUrl = new URL("/auth", request.url);
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // User is authenticated, allow access to protected routes
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // In case of any error, redirect to the login page
    return NextResponse.redirect(new URL("/auth", request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
