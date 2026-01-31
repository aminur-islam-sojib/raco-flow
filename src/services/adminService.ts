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
