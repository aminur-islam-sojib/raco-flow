import { NextResponse } from "next/server";
import { assignSolverToProject } from "@/services/projectService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { projectId, solverId } = body;
    if (!projectId || !solverId) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 },
      );
    }

    const result = await assignSolverToProject(projectId, solverId);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("API_ASSIGN_ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
