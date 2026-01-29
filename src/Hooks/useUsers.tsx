import { UserRole } from "@/lib/user.service";
import { User } from "next-auth";
import { useState } from "react";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Kaelen Vance', email: 'kv@racoflow.ai', role: 'admin', status: 'active', createdAt: '2025-11-12' },
    { id: '2', name: 'Sora Tanaka', email: 'sora@web3.io', role: 'user', status: 'active', createdAt: '2026-01-05' },
   
  ]);

  const promoteUser = async (id: string) => {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    setUsers(prev => prev.map(u => 
      u.id === id ? { ...u, role: 'buyer' as UserRole } : u
    ));
  };

  return { users, promoteUser, loading: false };
}