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
      const data = await res.json();

      if (data.success) {
        setUsers(data.data);
      } else {
        setError(data.error || "Failed to fetch users");
      }
    } catch (err) {
      setError("An error occurred while fetching users");
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

      const data = await res.json();

      if (data.success) {
        // Optimistic update or refetch
        setUsers((prev) =>
          prev.map((u) =>
            u.id === id ? { ...u, role: "buyer" as UserRole } : u,
          ),
        );
      } else {
        // Handle error (could extend this to return error or show toast)
        console.error(data.error);
      }
    } catch (err) {
      console.error("Failed to promote user", err);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, promoteUser, loading, error, refetch: fetchUsers };
}
