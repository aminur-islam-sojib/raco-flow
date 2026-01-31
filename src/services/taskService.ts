import { dbConnect, collections } from "@/lib/dbConnects";
import { ObjectId } from "mongodb";

export async function submitTaskWork(
  taskId: string,
  solverId: string,
  fileUrl: string,
) {
  const taskCollection = dbConnect(collections.SUBTASKS);

  // Requirement: Role-aware data flow
  // Ensure the solver only updates a task assigned to them
  const result = await taskCollection.updateOne(
    {
      _id: new ObjectId(taskId),
      solverId: solverId,
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
    throw new Error("Task not found or unauthorized.");
  }

  return { success: true };
}
