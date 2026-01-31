import { dbConnect, collections } from "@/lib/dbConnects";
import { ObjectId } from "mongodb";

export async function submitTaskWork(
  projectId: string,
  solverId: string,
  fileUrl: string,
) {
  const projectCollection = dbConnect(collections.PROJECTS);

  // Requirement: Role-aware data flow
  // Ensure the solver only updates a project assigned to them
  const result = await projectCollection.updateOne(
    {
      _id: new ObjectId(projectId),
      assignedSolverId: solverId,
      status: "ASSIGNED",
    },
    {
      $set: {
        submissionUrl: fileUrl,
        status: "SUBMITTED",
        submittedAt: new Date(),
      },
    },
  );

  if (result.matchedCount === 0) {
    throw new Error(
      "Project not found or unauthorized. Make sure the project is assigned to you.",
    );
  }

  return { success: true };
}
export async function confirmTaskWork(projectId: string, buyerId: string) {
  const projectCollection = dbConnect(collections.PROJECTS);

  const result = await projectCollection.updateOne(
    {
      _id: new ObjectId(projectId),
      buyerId: buyerId,
      status: "SUBMITTED",
    },
    {
      $set: {
        status: "CONFIRMED",
        submittedAt: new Date(),
      },
    },
  );

  if (result.matchedCount === 0) {
    throw new Error(
      "Project not found or unauthorized. Make sure the project is assigned to you.",
    );
  }

  return { success: true };
}
