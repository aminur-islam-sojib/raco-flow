/* eslint-disable @typescript-eslint/no-explicit-any */
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { collections, dbConnect } from "@/lib/dbConnects";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";

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

export async function getProjectApplicants(projectId: string) {
  try {
    const projectCol = dbConnect(collections.PROJECTS);

    const pipeline = [
      // 1. Match the specific project by ID
      { $match: { _id: new ObjectId(projectId) } },

      // 2. Convert string IDs in applicants array to ObjectIds for lookup
      {
        $addFields: {
          applicantIds: {
            $map: {
              input: "$applicants",
              as: "id",
              in: { $toObjectId: "$$id" },
            },
          },
        },
      },

      // 3. Join with Users collection to get full details [cite: 87, 88]
      {
        $lookup: {
          from: collections.USERS,
          localField: "applicantIds",
          foreignField: "_id",
          as: "agentDetails",
        },
      },

      // 4. Security: Remove passwords and internal fields
      {
        $project: {
          applicantIds: 0,
          "agentDetails.password": 0,
          "agentDetails.emailVerified": 0,
        },
      },
    ];

    const result = await projectCol.aggregate(pipeline).toArray();
    return result[0] || null;
  } catch (error) {
    console.error("Error fetching applicants:", error);
    throw error;
  }
}

/**
 * Core Workflow: Assign one problem solver to a project
 * State Transition: OPEN -> ASSIGNED [cite: 42, 59]
 */
export async function assignSolverToProject(
  projectId: string,
  solverId: string,
) {
  try {
    const projectCol = dbConnect(collections.PROJECTS);

    // Update the project document
    const result = await projectCol.updateOne(
      {
        _id: new ObjectId(projectId),
        status: "OPEN", // Safety: Only assign if currently unassigned [cite: 59]
      },
      {
        $set: {
          status: "ASSIGNED", // Transition project state [cite: 42]
          assignedSolverId: solverId, // Assign the specific solver [cite: 26]
          updatedAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      throw new Error("Project not found or already assigned.");
    }

    return { success: true, message: "Mission Assigned Successfully" };
  } catch (error) {
    console.error("ASSIGNMENT_DB_ERROR:", error);
    throw error;
  }
}

export async function getAdminGlobalStats() {
  try {
    const projectCol = dbConnect(collections.PROJECTS);

    const stats = await projectCol
      .aggregate([
        {
          $group: {
            _id: null,
            totalProjects: { $sum: 1 },
            totalMarketVolume: { $sum: "$budget" },
            // Counts projects where an agent has been assigned [cite: 42]
            totalAssignedMissions: {
              $sum: { $cond: [{ $eq: ["$status", "ASSIGNED"] }, 1, 0] },
            },
            // Optional: Count currently open bounties [cite: 39]
            totalOpenMissions: {
              $sum: { $cond: [{ $eq: ["$status", "OPEN"] }, 1, 0] },
            },
          },
        },
      ])
      .toArray();

    // Default values if no projects exist yet
    return (
      stats[0] || {
        totalProjects: 0,
        totalMarketVolume: 0,
        totalAssignedMissions: 0,
        totalOpenMissions: 0,
      }
    );
  } catch (error) {
    console.error("ADMIN_STATS_ERROR:", error);
    throw new Error("Failed to compute global intelligence.");
  }
}

/**
 * Requirement: Problem Solver - Track project requests
 * Finds projects where the current user is an applicant.
 */
export async function getMyProjectApplications() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return;
  }
  try {
    const projectCol = dbConnect(collections.PROJECTS);

    const missions = await projectCol
      .find({
        applicants: { $in: [userId] },
      })
      .sort({ createdAt: -1 })
      .toArray();

    return missions;
  } catch (error) {
    console.error("MY_APPLICATIONS_DB_ERROR:", error);
    throw new Error("Failed to retrieve your mission history.");
  }
}
