import { UserRole } from "@/lib/user.service";
import { User } from "next-auth";
import { useState, useEffect } from "react";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users");

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch users: ${res.status} ${errorText}`);
      }

      const data = await res.json();

      if (data.success) {
        setUsers(data.data);
      } else {
        setError(data.error || "Failed to fetch users");
      }
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "An error occurred while fetching users";
      setError(msg);
      console.error("fetchUsers error:", msg);
    } finally {
      setLoading(false);
    }
  };

  const promoteUser = async (id: string) => {
    try {
      const res = await fetch("/api/users/promote", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API error: ${res.status} ${errorText}`);
      }

      const data = await res.json();

      if (data.success) {
        // Optimistic update or refetch
        setUsers((prev) =>
          prev.map((u) =>
            u.id === id ? { ...u, role: "buyer" as UserRole } : u,
          ),
        );
      } else {
        console.error("Promotion failed:", data.error);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to promote user";
      console.error("Failed to promote user:", msg);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, promoteUser, loading, error, refetch: fetchUsers };
}
