/* eslint-disable @typescript-eslint/no-explicit-any */
import MissionOversight from "@/components/site/Admin/Projects/MissionOversight";
import { getAllProjects } from "@/services/projectService";
import type { Project, ProjectStatus } from "@/components/Types/project.types";

export default async function page() {
  const rawProjects = await getAllProjects();

  const toIdString = (v: unknown): string => {
    if (v == null) return "";
    if (typeof v === "object") {
      const candidate = v as {
        toHexString?: () => string;
        toString?: () => string;
      };
      if (typeof candidate.toHexString === "function")
        return candidate.toHexString();
      if (typeof candidate.toString === "function") return candidate.toString();
    }
    return String(v);
  };

  // Serialize DB objects to plain JS values so they are safe to pass to Client components
  const allProjects: Project[] = (rawProjects || []).map((p: any) => ({
    _id: toIdString(p._id),
    title: p.title ? String(p.title) : "",
    description: p.description ? String(p.description) : "",
    budget:
      typeof p.budget === "string"
        ? parseFloat(p.budget as string)
        : typeof p.budget === "number"
          ? p.budget
          : 0,
    deadline: p.deadline
      ? p.deadline instanceof Date
        ? p.deadline.toISOString()
        : new Date(String(p.deadline)).toISOString()
      : "",
    category: p.category ? String(p.category) : "",
    buyerId: toIdString(p.buyerId),
    assignedSolverId: p.assignedSolverId
      ? toIdString(p.assignedSolverId)
      : undefined,
    status: ((): ProjectStatus => {
      const allowed: ProjectStatus[] = ["OPEN", "ASSIGNED", "COMPLETED"];
      const s = p.status ? String(p.status) : "";
      return allowed.includes(s as ProjectStatus)
        ? (s as ProjectStatus)
        : "OPEN";
    })(),
    applicants: Array.isArray(p.applicants)
      ? p.applicants.map((a: any) => toIdString(a))
      : [],
    createdAt: p.createdAt
      ? p.createdAt instanceof Date
        ? p.createdAt.toISOString()
        : new Date(String(p.createdAt)).toISOString()
      : "",
    updatedAt: p.updatedAt
      ? p.updatedAt instanceof Date
        ? p.updatedAt.toISOString()
        : new Date(String(p.updatedAt)).toISOString()
      : "",
  })) as Project[];

  return (
    <div>{allProjects && <MissionOversight allProjects={allProjects} />}</div>
  );
}
