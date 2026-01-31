/* eslint-disable @typescript-eslint/no-explicit-any */
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { dbConnect, collections } from "@/lib/dbConnects";
import { getServerSession } from "next-auth";
import { Project } from "@/components/Types/project.types";

function sanitizeProject(doc: any): Project {
  if (!doc) return doc;
  return {
    ...doc,
    _id: doc._id?.toString ? doc._id.toString() : String(doc._id),
    title: doc.title,
    description: doc.description,
    budget:
      typeof doc.budget === "number" ? doc.budget : Number(doc.budget || 0),
    deadline: doc.deadline
      ? doc.deadline.toISOString
        ? doc.deadline.toISOString()
        : String(doc.deadline)
      : "",
    category: doc.category || "",
    buyerId: doc.buyerId?.toString
      ? doc.buyerId.toString()
      : String(doc.buyerId || ""),
    assignedSolverId: doc.assignedSolverId?.toString
      ? doc.assignedSolverId.toString()
      : doc.assignedSolverId,
    status: doc.status,
    applicants: Array.isArray(doc.applicants)
      ? doc.applicants.map((a: any) => (a?.toString ? a.toString() : String(a)))
      : [],
    createdAt: doc.createdAt
      ? doc.createdAt.toISOString
        ? doc.createdAt.toISOString()
        : String(doc.createdAt)
      : new Date().toISOString(),
    updatedAt: doc.updatedAt
      ? doc.updatedAt.toISOString
        ? doc.updatedAt.toISOString()
        : String(doc.updatedAt)
      : new Date().toISOString(),
  } as Project;
}

export async function getBuyerSubmissions() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized: No session found");
  }
  const buyerId = session.user?.id;
  if (!buyerId) {
    throw new Error("Unauthorized: No buyer ID in session");
  }
  try {
    const projectCol = dbConnect(collections.PROJECTS);

    console.log("Fetching submissions for buyerId:", buyerId);
    // Fetch projects created by this buyer that are either ASSIGNED or SUBMITTED
    const projectsRaw = await projectCol
      .find({
        buyerId: buyerId,
        status: { $in: ["ASSIGNED", "SUBMITTED"] },
      })
      .sort({ updatedAt: -1 })
      .toArray();

    console.log(`Found ${projectsRaw.length} submissions`);
    return projectsRaw.map(sanitizeProject);
  } catch (error) {
    console.error("BUYER_SUBMISSION_FETCH_ERROR:", error);
    throw new Error(
      `Unable to retrieve project submissions: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
