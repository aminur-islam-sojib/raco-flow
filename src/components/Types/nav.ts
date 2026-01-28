// types/nav.ts
export type UserRole = "admin" | "buyer" | "solver" | "user" | "guest";

export interface NavItem {
  label: string;
  href: string;
}

export const ROLE_LINKS: Record<UserRole, NavItem[]> = {
  admin: [
    { label: "Users", href: "/admin/users" },
    { label: "All Projects", href: "/admin/projects" },
    { label: "System Health", href: "/admin/health" },
  ],
  buyer: [
    { label: "My Projects", href: "/buyer/projects" },
    { label: "Marketplace", href: "/marketplace" },
    { label: "Post Work", href: "/buyer/post" },
  ],
  solver: [
    { label: "Find Projects", href: "/solver/find" },
    { label: "My Tasks", href: "/solver/tasks" },
    { label: "Earnings", href: "/solver/earnings" },
  ],
  user: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Explore", href: "/explore" },
  ],
  guest: [
    { label: "Features", href: "#features" },
    { label: "Workflow", href: "#workflow" },
    { label: "Pricing", href: "#pricing" },
  ],
};
