export type Role = "admin" | "buyer" | "solver" | "user" | "guest";

export type NavItem = {
  label: string;
  href: string;
  description?: string;
};

export const NAV_CONFIG: Record<Role, NavItem[]> = {
  admin: [
    { label: "Overview", href: "/admin" },
    { label: "User Management", href: "/admin/users" },
    { label: "All Projects", href: "/admin/projects" },
  ],
  buyer: [
    { label: "My Projects", href: "/buyer" },
    { label: "Create Project", href: "/buyer/create" },
    { label: "Solver Requests", href: "/buyer/requests" },
  ],
  solver: [
    { label: "Marketplace", href: "/solver/marketplace" },
    { label: "Active Tasks", href: "/solver/tasks" },
    { label: "Earnings", href: "/solver/earnings" },
  ],
  user: [
    { label: "Home", href: "/" },
    { label: "Become a Buyer", href: "/apply-buyer" },
    { label: "Profile", href: "/profile" },
  ],
  guest: [
    { label: "Home", href: "/" },
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },
  ],
};
