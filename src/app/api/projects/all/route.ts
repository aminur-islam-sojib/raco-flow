import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getAllProjects } from "@/services/projectService";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status"); // Optional filter: ?status=OPEN

    // Build the query
    let query: any = {};
    if (status) query.status = status;
    if (!session || !session.user || session.user.role !== "buyer") {
      return NextResponse.json(
        { error: "Only Buyers can view projects" },
        { status: 403 },
      );
    }

    // RBAC: If the user is a Solver, they should probably only see OPEN projects
    if (session.user.role === "solver") {
      query.status = "OPEN";
    }

    const projects = await getAllProjects(query);

    return NextResponse.json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
