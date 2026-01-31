import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { dbConnect, collections } from "@/lib/dbConnects";
import { getServerSession } from "next-auth";

export const getSolverCompletedEarnings = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  try {
    const projectsCollection = dbConnect(collections.PROJECTS);

    const pipeline = [
      {
        $match: {
          assignedSolverId: userId,
          status: "COMPLETED",
          submissionUrl: { $exists: true, $ne: "" },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $toDouble: "$budget" } },
          completedMissions: {
            $push: {
              title: "$title",
              budget: "$budget",
              id: "$_id",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
          completedMissions: 1,
        },
      },
    ];

    const result = await projectsCollection.aggregate(pipeline).toArray();

    // Return formatted data or clear defaults
    return result[0] || { totalRevenue: 0, completedMissions: [] };
  } catch (error) {
    console.error("EARNINGS_AGGREGATION_ERROR:", error);
    throw new Error("Unable to synchronize financial records.");
  }
};
