// types/mission.ts
export type MissionStatus = "OPEN" | "ASSIGNED" | "COMPLETED";

export interface Project {
  _id: string;
  title: string;
  status: MissionStatus;
  budget: number;
  buyerId: string;
  assignedSolverId?: string;
  description: string;
  deadline: string;
}
