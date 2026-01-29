import { useState } from "react";

export interface CreateProjectData {
  title: string;
  description: string;
  budget: number;
  deadline: string;
  category: string;
}

export interface Project extends CreateProjectData {
  _id: string;
  buyerId: string;
  status: string;
  applicants: any[];
  createdAt: Date;
  updatedAt: Date;
}

export function useProjects() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProject = async (projectData: CreateProjectData) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create project");
      }

      return { success: true, project: data.data };
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while creating the project";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { createProject, loading, error };
}
