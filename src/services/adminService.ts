import { dbConnect, collections } from "@/lib/dbConnects";
import { ObjectId } from "mongodb";

export async function promoteToBuyer(targetUserId: string) {
  try {
    const userCol = dbConnect(collections.USERS);

    const result = await userCol.findOneAndUpdate(
      { _id: new ObjectId(targetUserId) },
      { $set: { role: "buyer", updatedAt: new Date() } },
      { returnDocument: "after" },
    );

    if (!result) {
      throw new Error("Target user not found in the neural network.");
    }

    return result;
  } catch (error) {
    console.error("ROLE_PROMOTION_ERROR:", error);
    throw error;
  }
}

export const getAdminGlobalStats = async () => {
  try {
    const projectsCol = dbConnect(collections.PROJECTS);
    const usersCol = dbConnect(collections.USERS);

    // Using facet to get everything in one go
    const stats = await projectsCol
      .aggregate([
        {
          $facet: {
            // 1. Mission Metrics
            missionStats: [
              {
                $group: {
                  _id: null,
                  totalMissions: { $sum: 1 },
                  activeMissions: {
                    $sum: { $cond: [{ $eq: ["$status", "ASSIGNED"] }, 1, 0] },
                  },
                  completedMissions: {
                    $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, 1, 0] },
                  },
                  netRevenue: {
                    $sum: {
                      $cond: [
                        { $eq: ["$status", "COMPLETED"] },
                        { $toDouble: "$budget" },
                        0,
                      ],
                    },
                  },
                },
              },
            ],
            // 2. User Distribution
            userMetrics: [
              {
                $lookup: {
                  from: collections.USERS,
                  pipeline: [{ $group: { _id: "$role", count: { $sum: 1 } } }],
                  as: "roleDistribution",
                },
              },
              { $limit: 1 },
            ],
          },
        },
      ])
      .toArray();

    const totalUsers = await usersCol.countDocuments();

    // Formatting for the UI
    const missionData = stats[0].missionStats[0] || {
      totalMissions: 0,
      activeMissions: 0,
      netRevenue: 0,
    };
    const roles = stats[0].userMetrics[0]?.roleDistribution || [];

    return {
      overview: {
        totalUsers,
        activeMissions: missionData.activeMissions,
        completedMissions: missionData.completedMissions,
        netRevenue: missionData.netRevenue,
        systemHealth: "OPTIMAL",
      },
      distribution: roles,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("ADMIN_STATS_SERVICE_ERROR:", error);
    throw error;
  }
};
