import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // Get hostname from request headers
  const hostname = request.headers.get("host") || "";

  // Define your exact admin domains here (local and production)
  const isAdminSubdomain =
    hostname === "admin.localhost:3000" ||
    hostname === "admin.intercessor.uk";

  // If the request is for the admin subdomain, rewrite it to /admin folder
  if (isAdminSubdomain) {
    // Only rewrite if we aren't already explicitly requesting /admin
    if (!url.pathname.startsWith("/admin")) {
      url.pathname = `/admin${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  // If it's the main domain but someone tries to access /admin directly, 
  // you might want to redirect them or block it. 
  // For now, we'll just let normal traffic pass through.
  return NextResponse.next();
}

// Ensure middleware runs only on specific paths if necessary, 
// or let it check every request by omitting the matcher.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
