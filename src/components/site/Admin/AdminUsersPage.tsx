"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useUsers } from "@/Hooks/useUsers";
import { UserTableRow } from "./UsersTableRow";
import Link from "next/link";

export type UserRole = "admin" | "buyer" | "solver" | "user";

export interface User {
  id?: string;
  name?: string | null;
  email?: string | null;
  role?: UserRole;
  image?: string | null;
  status?: string;
  createdAt?: string;
  isActive?: boolean;
}

export default function AdminUsersPage() {
  const { users, loading, promoteUser } = useUsers();
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter(
    (u) =>
      (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase()),
  );

  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    // Uses 'bg-background' and 'text-foreground' for shadcn theme compatibility
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 selection:bg-primary/30 transition-colors duration-300">
      {/* Breadcrumbs - Using muted-foreground for secondary text */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8 font-mono">
        <Link
          href="/admin"
          className="hover:text-primary transition-colors cursor-pointer uppercase tracking-tight"
        >
          Admin
        </Link>
        <span>/</span>
        <span className="text-foreground/80">User Governance</span>
      </nav>

      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter bg-gradient-to-br from-foreground to-foreground/50 bg-clip-text text-transparent">
            User Directory
          </h1>
          <p className="text-muted-foreground mt-1 text-balance">
            Monitor and elevate user privileges across the RacoFlow ecosystem.
          </p>
        </div>

        {/* Search Bar with Glassmorphism and Variable Colors */}
        <div className="relative group w-full md:w-96">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <Input
            ref={inputRef}
            placeholder="Search credentials..."
            className="pl-10 pr-12 bg-secondary/50 border-border backdrop-blur-xl focus-visible:ring-2 focus-visible:ring-primary/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 placeholder:text-muted-foreground/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="absolute inset-y-0 right-3 flex items-center gap-2">
            {search && (
              <button
                onClick={() => setSearch("")}
                className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors mr-1"
              >
                <X className="w-3 h-3" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity">
              <Command className="w-3 h-3" /> K
            </kbd>
          </div>
        </div>
      </header>

      {/* Futuristic Table Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-border bg-card/30 backdrop-blur-2xl shadow-xl dark:shadow-cyan-950/10"
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50 uppercase text-[11px] tracking-widest">
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="w-[280px] text-muted-foreground font-semibold py-4">
                  Identity
                </TableHead>
                <TableHead className="text-muted-foreground font-semibold">
                  Privilege
                </TableHead>
                <TableHead className="text-muted-foreground font-semibold">
                  Status
                </TableHead>
                <TableHead className="text-muted-foreground font-semibold">
                  Enrolled
                </TableHead>
                <TableHead className="text-right text-muted-foreground font-semibold px-6">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout" initial={false}>
                {loading ? (
                  <TableSkeleton />
                ) : (
                  filteredUsers.map((user, index) => (
                    <UserTableRow
                      key={user.id}
                      user={user}
                      index={index}
                      onPromote={promoteUser}
                    />
                  ))
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </div>
  );
}

// Skeleton state for production feel
function TableSkeleton() {
  return Array.from({ length: 5 }).map((_, i) => (
    <TableRow key={i} className="border-border/50">
      <TableCell colSpan={5}>
        <div className="h-12 w-full bg-muted/20 animate-pulse rounded-lg" />
      </TableCell>
    </TableRow>
  ));
}
