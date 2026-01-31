import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { collections, dbConnect } from "@/lib/dbConnects";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";

export const getAssignmentById = async (projectId: string) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  try {
    const projectsCollection = dbConnect(collections.PROJECTS);

    // Security: Match by ID AND ensure the requester is the assigned solver
    const query = {
      _id: new ObjectId(projectId),
      assignedSolverId: userId, // Rule: No unauthorized data access
      status: "ASSIGNED",
    };

    const project = await projectsCollection.findOne(query);

    if (!project) {
      throw new Error("Mission not found or unauthorized access.");
    }

    return project;
  } catch (error) {
    console.error("ASSIGNMENT_FETCH_ERROR:", error);
    throw error;
  }
};
