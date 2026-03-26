import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const url = req.nextUrl.clone();
    const hostname = req.headers.get("host") || "";

    const isAdminSubdomain =
      hostname === "admin.localhost:3000" ||
      hostname === "admin.intercessor.uk";

    if (isAdminSubdomain && !url.pathname.startsWith("/admin")) {
      url.pathname = `/admin${url.pathname}`;
      return NextResponse.rewrite(url);
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/admin/login",
    },
    callbacks: {
      authorized: ({ req, token }) => {
        const url = req.nextUrl.clone();
        const hostname = req.headers.get("host") || "";

        const isAdminSubdomain =
          hostname === "admin.localhost:3000" ||
          hostname === "admin.intercessor.uk";

        const isAuthRequired =
          (url.pathname.startsWith("/admin") && !url.pathname.startsWith("/admin/login")) ||
          (isAdminSubdomain && !url.pathname.startsWith("/login"));

        if (isAuthRequired) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};