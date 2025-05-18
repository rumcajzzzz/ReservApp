import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Check auth condition
  const isAuthPage = request.nextUrl.pathname.startsWith("/auth");
  const isPublicPage =
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname.startsWith("/book");

  // If not authenticated and trying to access protected route
  if (!session && !isAuthPage && !isPublicPage) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // If authenticated and trying to access auth page
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*.svg).*)"],
};
