import { UserRole } from "./user.service";
import { Session } from "next-auth";

/**
 * Valid user roles in the application
 */
export const VALID_ROLES: UserRole[] = ["user", "admin", "buyer", "solver"];

/**
 * Role descriptions for UI display
 */
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  user: "Regular User",
  admin: "System Administrator",
  buyer: "Project Buyer",
  solver: "Problem Solver",
};

/**
 * Role permissions mapping
 */
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  user: [
    "view_profile",
    "edit_profile",
    "view_public_projects",
    "browse_solvers",
  ],
  buyer: [
    "create_project",
    "edit_own_project",
    "assign_solver",
    "review_submissions",
    "approve_work",
    "view_analytics",
  ],
  solver: [
    "view_assigned_projects",
    "create_subtasks",
    "submit_deliverables",
    "view_own_submissions",
    "bid_on_projects",
  ],
  admin: [
    "manage_users",
    "promote_user_role",
    "deactivate_user",
    "view_all_projects",
    "view_all_submissions",
    "system_analytics",
    "manage_roles",
  ],
};

/**
 * Check if user has a specific role
 */
export function isRole(session: Session | null, role: UserRole): boolean {
  if (!session?.user) return false;
  const user = session.user as Record<string, unknown>;
  return user.role === role;
}

/**
 * Check if user has any of the specified roles
 */
export function hasRole(session: Session | null, roles: UserRole[]): boolean {
  if (!session?.user) return false;
  const user = session.user as Record<string, unknown>;
  return roles.includes(user.role as UserRole);
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(
  session: Session | null,
  permission: string,
): boolean {
  if (!session?.user) return false;
  const user = session.user as Record<string, unknown>;
  const userRole = user.role as UserRole;
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
}

/**
 * Check if user is admin
 */
export function isAdmin(session: Session | null): boolean {
  return isRole(session, "admin");
}

/**
 * Check if user is buyer
 */
export function isBuyer(session: Session | null): boolean {
  return isRole(session, "buyer");
}

/**
 * Check if user is solver
 */
export function isSolver(session: Session | null): boolean {
  return isRole(session, "solver");
}

/**
 * Validate role
 */
export function isValidRole(role: string): role is UserRole {
  return VALID_ROLES.includes(role as UserRole);
}

/**
 * Get user role from session
 */
export function getUserRole(session: Session | null): UserRole | null {
  if (!session?.user) return null;
  const user = session.user as Record<string, unknown>;
  return (user.role as UserRole) || null;
}

/**
 * Role hierarchy for admin operations
 * Higher number = higher authority
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  user: 0,
  solver: 1,
  buyer: 2,
  admin: 3,
};

/**
 * Check if one role can manage another
 */
export function canManageRole(
  managerRole: UserRole,
  targetRole: UserRole,
): boolean {
  return ROLE_HIERARCHY[managerRole] > ROLE_HIERARCHY[targetRole];
}
