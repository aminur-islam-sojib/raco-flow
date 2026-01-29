// src/services/userService.ts
import { collections, dbConnect } from "@/lib/dbConnects";
import { ObjectId } from "mongodb";

export async function getAllUsers() {
  const usersCollection = await dbConnect(collections.USERS);
  const users = await usersCollection.find({}).toArray();
  return users.map((user: any) => ({
    ...user,
    id: user._id.toString(),
  }));
}

export async function promoteUserToBuyer(userId: string) {
  const usersCollection = dbConnect(collections.USERS);
  const users = await usersCollection.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { role: "buyer", updatedAt: new Date() } },
  );
  return users;
}
