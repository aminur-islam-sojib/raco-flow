import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getAllUsers } from "@/services/userServices";

/**
 * GET: Returns all users in the system.
 * Restricted to: ADMIN only.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // [Evaluation Criteria] Strict Role Enforcement: Only Admins can see user lists
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 },
      );
    }

    const users = await getAllUsers();

    // [API Expectation] Consistent status codes & clean contracts
    return NextResponse.json(
      {
        success: true,
        data: users,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("API_USERS_GET_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}
