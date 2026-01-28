import { ObjectId } from "mongodb";
import { collections, dbConnect } from "./dbConnects";
import bcrypt from "bcryptjs";

export type UserRole = "user" | "admin" | "buyer" | "solver";

export interface User {
  _id?: ObjectId;
  name?: string;
  email: string;
  image?: string;
  password?: string;
  role: UserRole;
  provider?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Find a user by email (single source of truth)
 */
export async function findUserByEmail(email: string) {
  if (!email) return null;

  const usersCollection = dbConnect(collections.USERS);
  return await usersCollection.findOne({ email });
}

/**
 * Find a user by ID
 */
export async function findUserById(id: string | ObjectId) {
  const usersCollection = dbConnect(collections.USERS);
  const userId = typeof id === "string" ? new ObjectId(id) : id;
  return await usersCollection.findOne({ _id: userId });
}

/**
 * Create OAuth user (Google, GitHub, etc.)
 * Role is written ONCE - defaults to "user"
 */
export async function createOAuthUser({
  name,
  email,
  image,
  role = "user",
  provider,
}: {
  name?: string;
  email: string;
  image?: string;
  role?: UserRole;
  provider: string;
}): Promise<User> {
  if (!email) {
    throw new Error("Email is required to create OAuth user");
  }

  const usersCollection = dbConnect(collections.USERS);

  // Check if user already exists
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return existingUser as User;
  }

  const userDoc: User = {
    name: name || undefined,
    email,
    image: image || undefined,
    role,
    provider,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await usersCollection.insertOne(userDoc);

  return {
    ...userDoc,
    _id: result.insertedId as ObjectId,
  };
}

/**
 * Create a credentials-based user (registration)
 * Role defaults to "user"
 */
export async function createCredentialsUser({
  name,
  email,
  password,
  role = "user",
}: {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}): Promise<User> {
  if (!email || !password || !name) {
    throw new Error("Name, email, and password are required");
  }

  const usersCollection = dbConnect(collections.USERS);

  // Check if user already exists
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  const userDoc: User = {
    name,
    email,
    password: hashedPassword,
    role,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await usersCollection.insertOne(userDoc);

  return {
    ...userDoc,
    _id: result.insertedId as ObjectId,
  };
}

/**
 * Verify user password
 */
export async function verifyPassword(
  storedPassword: string,
  providedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(providedPassword, storedPassword);
}

/**
 * Update user role (Admin only)
 */
export async function updateUserRole(
  userId: string | ObjectId,
  newRole: UserRole,
): Promise<User | null> {
  const usersCollection = dbConnect(collections.USERS);
  const objectId = typeof userId === "string" ? new ObjectId(userId) : userId;

  const result = await usersCollection.findOneAndUpdate(
    { _id: objectId },
    {
      $set: {
        role: newRole,
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" },
  );

  return result?.value ? (result.value as User) : null;
}

/**
 * Get all users with a specific role
 */
export async function getUsersByRole(role: UserRole): Promise<User[]> {
  const usersCollection = dbConnect(collections.USERS);
  const users = await usersCollection.find({ role, isActive: true }).toArray();
  return users as unknown as User[];
}

/**
 * Deactivate a user
 */
export async function deactivateUser(
  userId: string | ObjectId,
): Promise<User | null> {
  const usersCollection = dbConnect(collections.USERS);
  const objectId = typeof userId === "string" ? new ObjectId(userId) : userId;

  const result = await usersCollection.findOneAndUpdate(
    { _id: objectId },
    {
      $set: {
        isActive: false,
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" },
  );

  return result?.value ? (result.value as User) : null;
}
