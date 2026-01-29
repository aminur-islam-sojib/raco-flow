"use client";

import React, { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Command,  
} from 'lucide-react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useUsers } from '@/Hooks/useUsers';
import { UserTableRow } from './UsersTableRow';

// Types & Mock Data
export type UserRole = 'admin' | 'buyer' | 'solver' | 'user';

export interface User {
  id?: string;
  name?: string | null;
  email?: string | null;
  role?: UserRole;
  image?: string | null;
  status?: string;
  createdAt?: string;
}

// --- Implementation ---

export default function AdminUsersPage() {
  const { users, loading, promoteUser } = useUsers();
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter(u => 
    (u.name || "").toLowerCase().includes(search.toLowerCase()) || 
    (u.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 p-8 selection:bg-cyan-500/30">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-slate-500 mb-8 font-mono">
        <span className="hover:text-cyan-400 transition-colors cursor-pointer">Admin</span>
        <span>/</span>
        <span className="text-slate-200">User Governance</span>
      </nav>

      {/* Header & Search */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">
            User Directory
          </h1>
          <p className="text-slate-400 mt-1">Manage global permissions and flow-state access.</p>
        </div>

        <div className="relative group w-full md:w-96">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
          </div>
          <Input 
            placeholder="Search credentials..." 
            className="pl-10 bg-white/5 border-white/10 backdrop-blur-md focus:ring-1 focus:ring-cyan-500/50 transition-all rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="absolute inset-y-0 right-3 flex items-center">
            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-white/20 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-slate-400">
              <Command className="w-3 h-3" /> K
            </kbd>
          </div>
        </div>
      </header>

      {/* Main Table Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-2xl shadow-2xl"
      >
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="hover:bg-transparent border-white/10">
              <TableHead className="w-[250px] text-slate-400 font-medium">Identity</TableHead>
              <TableHead className="text-slate-400 font-medium">Privilege</TableHead>
              <TableHead className="text-slate-400 font-medium">Status</TableHead>
              <TableHead className="text-slate-400 font-medium">Enrolled</TableHead>
              <TableHead className="text-right text-slate-400 font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {filteredUsers.map((user, index) => (
                <UserTableRow 
                  key={user.id} 
                  user={user} 
                  index={index} 
                  onPromote={promoteUser} 
                />
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
}