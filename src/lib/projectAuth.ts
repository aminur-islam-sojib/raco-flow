import { Session } from "next-auth";
import { ObjectId } from "mongodb";

/**
 * Validate if user is authorized to access a project
 * Checks:
 * 1. User is authenticated
 * 2. User has buyer role
 * 3. User owns the project (or is admin)
 */
export function validateProjectAccess(
  session: Session | null,
  projectBuyerId: string | ObjectId,
  requiredRole: "buyer" | "admin" = "buyer",
): {
  authorized: boolean;
  error?: string;
  statusCode?: number;
} {
  // Step 1: Check if user is authenticated
  if (!session || !session.user) {
    return {
      authorized: false,
      error: "Unauthorized: No session found",
      statusCode: 401,
    };
  }

  // Step 2: Check if user has required role
  if (session.user.role !== requiredRole && session.user.role !== "admin") {
    return {
      authorized: false,
      error: `Forbidden: Only ${requiredRole}s can access this resource`,
      statusCode: 403,
    };
  }

  // Step 3: Check ownership (unless user is admin)
  const buyerIdString =
    typeof projectBuyerId === "string"
      ? projectBuyerId
      : projectBuyerId.toString();
  const userIdString = session.user.id ?? "";

  if (session.user.role !== "admin" && buyerIdString !== userIdString) {
    return {
      authorized: false,
      error: "Forbidden: You can only access your own projects",
      statusCode: 403,
    };
  }

  return { authorized: true };
}

/**
 * Check if user is a buyer (for role-based checks only)
 */
export function isBuyer(session: Session | null): boolean {
  return session?.user?.role === "buyer" || session?.user?.role === "admin";
}

/**
 * Check if user is an admin
 */
export function isAdmin(session: Session | null): boolean {
  return session?.user?.role === "admin";
}
