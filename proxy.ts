import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
});

export const config = {
  // Apply proxy only to routes in /admin, excluding /admin/login
  matcher: ["/admin/((?!login).*)"],
};