import { collections, dbConnect } from "@/lib/dbConnects";
import { ObjectId } from "mongodb";

export async function createNewProject(data: any) {
  const projectsCollection = dbConnect(collections.PROJECTS);

  const project = {
    ...data,
    status: "OPEN",
    applicants: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await projectsCollection.insertOne(project);
  return { ...project, _id: result.insertedId };
}

/**
 * Fetches all projects with optional filtering by status or role.
 * @param filter - MongoDB query object (e.g., { status: "OPEN" })
 */
export async function getAllProjects(filter = {}) {
  try {
    const projectsCollection = dbConnect(collections.PROJECTS);

    // Fetching projects, converting the cursor to an array
    const projects = await projectsCollection
      .find(filter)
      .sort({ createdAt: -1 }) // Newest projects first
      .toArray();

    return projects;
  } catch (error) {
    console.error("DATABASE_ERROR_FETCH_PROJECTS:", error);
    throw new Error("Failed to fetch projects from database");
  }
}

export async function getProjectWithApplicants(projectId: string) {
  const projectsCollection = dbConnect(collections.PROJECTS);

  // [Industry-Grade] Using Aggregation to join Project + Applicant Users
  const projectData = await projectsCollection
    .aggregate([
      { $match: { _id: new ObjectId(projectId) } },
      {
        $lookup: {
          from: "users", // Join with users collection
          localField: "applicants", // The array of IDs in Project
          foreignField: "_id", // The ID field in Users
          as: "agentDetails", // Output array name
        },
      },
      {
        // Remove sensitive data like passwords from the joined user objects
        $project: {
          "agentDetails.password": 0,
          "agentDetails.emailVerified": 0,
        },
      },
    ])
    .toArray();

  return projectData[0] || null;
}

export async function getMarketplaceProjects() {
  const projectsCollection = dbConnect(collections.PROJECTS);

  // Fetch projects that are OPEN
  // We use .project() to only send what the Solver needs to see
  return await projectsCollection
    .find({ status: "OPEN" })
    .project({
      title: 1,
      description: 1,
      budget: 1,
      deadline: 1,
      category: 1,
      buyerId: 1,
      applicantCount: { $size: "$applicants" },
    })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getPaginatedMarketplace(page: number, limit: number) {
  const projectsCollection = dbConnect(collections.PROJECTS);
  const skip = (page - 1) * limit;

  // Run two queries in parallel for better performance
  const [projects, total] = await Promise.all([
    projectsCollection
      .find({ status: "OPEN" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    projectsCollection.countDocuments({ status: "OPEN" }),
  ]);

  return {
    projects,
    totalPages: Math.ceil(total / limit),
    totalCount: total,
  };
}
