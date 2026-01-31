/* eslint-disable @typescript-eslint/no-explicit-any */
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getAssignmentById } from "@/services/assignmentServices";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    // 1. Authenticate Session
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // 2. Authorize Role (Solver Only)
    if (session.user.role !== "solver") {
      return NextResponse.json(
        { error: "Access denied: Solver role required" },
        { status: 403 },
      );
    }

    // 3. Fetch Data with User Context
    const data = await getAssignmentById(id);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 404 },
    );
  }
}
