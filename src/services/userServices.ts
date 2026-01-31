// src/services/userService.ts
import { collections, dbConnect } from "@/lib/dbConnects";
import { ObjectId } from "mongodb";
import { User } from "@/lib/user.service";

interface UserWithId extends Omit<User, "_id"> {
  _id: ObjectId;
  id: string;
}

export async function getAllUsers(): Promise<UserWithId[]> {
  const usersCollection = await dbConnect(collections.USERS);
  const users = (await usersCollection.find({}).toArray()) as (User & {
    _id: ObjectId;
  })[];
  return users.map((user) => ({
    ...user,
    id: user._id.toString(),
  }));
}

export async function promoteUserToBuyer(userId: string) {
  const usersCollection = dbConnect(collections.USERS);
  const result = await usersCollection.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { role: "buyer", updatedAt: new Date() } },
  );
  return result;
}
