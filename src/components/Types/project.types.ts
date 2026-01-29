// project.type.ts
export interface Project {
  _id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  category: string; // Added category
  buyerId: string; // ID of the user who created it
  assignedSolverId?: string; // ID of the solver (null initially)
  status: "OPEN" | "ASSIGNED" | "COMPLETED";
  applicants: string[]; // Array of Solver IDs who requested to join
  createdAt: string;
  updatedAt: string;
}
export type ProjectStatus = "OPEN" | "ASSIGNED" | "COMPLETED";
