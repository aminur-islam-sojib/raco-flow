/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getMyProjectApplications } from "@/services/projectService";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log("Full session object:", JSON.stringify(session, null, 2));
    console.log("Session user:", session?.user);
    console.log("User role:", session?.user?.role);

    // 🛡️ Rule Enforcement: Must be a logged-in Solver
    if (!session) {
      return NextResponse.json(
        { error: "No session found. Please log in first." },
        { status: 401 },
      );
    }

    if (!session?.user?.role) {
      return NextResponse.json(
        { error: "User role not found in session" },
        { status: 401 },
      );
    }

    if (session.user.role !== "solver") {
      return NextResponse.json(
        {
          error: `Unauthorized: Only solvers can access this. Your role is: ${session.user.role}`,
        },
        { status: 403 },
      );
    }

    const applications = await getMyProjectApplications();

    // 📦 Success Response
    return NextResponse.json({
      success: true,
      count: applications?.length,
      data: applications,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
