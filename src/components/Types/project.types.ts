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

export interface AgentDetail {
  _id: string;
  name?: string;
  email: string;
  image?: string;
  role: "user" | "admin" | "buyer" | "solver" | "guest";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectWithApplicants extends Project {
  agentDetails: AgentDetail[];
}

// Client-serializable version (ensure all ObjectId/Date are strings)
export interface ProjectWithApplicantsClient extends Project {
  agentDetails: AgentDetail[];
}

export type ProjectStatus = "OPEN" | "ASSIGNED" | "COMPLETED" | "SUBMITTED";
