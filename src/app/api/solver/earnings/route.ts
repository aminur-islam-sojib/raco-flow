/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getSolverCompletedEarnings } from "@/services/solverService";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Role Enforcement: Ensure requester is an authenticated solver
    if (!session || session?.user?.role !== "solver") {
      return NextResponse.json(
        { error: "Unauthorized: Solver clearance required" },
        { status: 401 },
      );
    }

    const data = await getSolverCompletedEarnings();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
