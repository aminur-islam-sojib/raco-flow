import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const role = token?.role as string;

    // 1. ADMIN PROTECTION
    // Prevents anyone except 'admin' from accessing /admin dashboard or admin APIs
    if (path.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(
        new URL("/auth?error=Unauthorized", req.url),
      );
    }

    // 2. BUYER PROTECTION
    // Only 'buyer' can access the buyer panel and project creation tools
    if (path.startsWith("/buyer") && role !== "buyer") {
      return NextResponse.redirect(
        new URL("/auth?error=Unauthorized", req.url),
      );
    }

    // 3. SOLVER PROTECTION
    // Only 'solver' can access the marketplace bidding and task submission tools
    if (path.startsWith("/solver") && role !== "solver") {
      return NextResponse.redirect(
        new URL("/auth?error=Unauthorized", req.url),
      );
    }

    // 4. PENDING USER PROTECTION
    // If a user is just a 'user' (not yet promoted to Buyer),
    // restrict them from areas requiring elevated permissions.
    if (path.startsWith("/dashboard") && role === "user") {
      // You could redirect them to a "Waiting for Approval" page
      // return NextResponse.redirect(new URL("/pending-approval", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // authorized: returns true if the user is logged in
      authorized: ({ token }) => !!token,
    },
    // This matches your 'pages' config in options.ts
    pages: {
      signIn: "/auth",
    },
  },
);

// Define exactly which routes trigger the middleware
export const config = {
  matcher: [
    "/admin/:path*",
    "/buyer/:path*",
    "/solver/:path*",
    "/api/admin/:path*",
    "/api/projects/:path*",
    "/api/tasks/:path*",
  ],
};
