import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const middleware = withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // 1. Role Extraction
    const userRole = token?.role as string;

    // 2. Access Control Logic
    // ---------------------------------------------------------

    // ADMIN ROUTES PROTECTION
    if (path.startsWith("/admin") && userRole !== "admin") {
      return NextResponse.redirect(
        new URL("/auth?error=AccessDenied", req.url),
      );
    }

    // BUYER ROUTES PROTECTION
    if (path.startsWith("/buyer") && userRole !== "buyer") {
      // Allow Admin to see Buyer pages for oversight, otherwise redirect
      if (userRole !== "admin") {
        return NextResponse.redirect(
          new URL("/auth?error=AccessDenied", req.url),
        );
      }
    }

    // SOLVER ROUTES PROTECTION
    if (path.startsWith("/solver") && userRole !== "solver") {
      if (userRole !== "admin") {
        return NextResponse.redirect(
          new URL("/auth?error=AccessDenied", req.url),
        );
      }
    }

    // 3. API PROTECTION (Critical for Security)
    // ---------------------------------------------------------
    // Solvers can promote themselves - don't block /api/admin/promote
    if (
      path.startsWith("/api/admin") &&
      path !== "/api/admin/promote" &&
      userRole !== "admin"
    ) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 },
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // This ensures the middleware only runs if the user is authenticated
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth", // Redirect here if not logged in
    },
  },
);

export default middleware;

// 4. Matcher Configuration
// ---------------------------------------------------------
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth endpoints)
     * - api/uploadthing (UploadThing endpoints - needs public access for callbacks)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/admin/:path*",
    "/buyer/:path*",
    "/solver/:path*",
    "/api/admin/:path*",
    "/api/projects/create", // Only Buyers create
    "/api/tasks/:path*", // Only Solvers submit
  ],
};
