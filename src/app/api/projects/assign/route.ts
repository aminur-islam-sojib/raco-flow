import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import {
  assignSolverToProject,
  getProjectApplicants,
} from "@/services/projectService";
import { validateProjectAccess } from "@/lib/projectAuth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Step 1: Check authentication
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { projectId, solverId } = body;

    if (!projectId || !solverId) {
      return NextResponse.json(
        { error: "Missing parameters: projectId and solverId required" },
        { status: 400 },
      );
    }

    // Step 2: Fetch project to verify ownership
    const project = await getProjectApplicants(projectId);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Step 3: Validate that only the project owner (buyer) can assign solvers
    const accessValidation = validateProjectAccess(
      session,
      project.buyerId,
      "buyer",
    );

    if (!accessValidation.authorized) {
      return NextResponse.json(
        { error: accessValidation.error },
        { status: accessValidation.statusCode || 403 },
      );
    }

    // Step 4: Verify the solver is in the applicants list
    const isApplicant = project.applicants?.includes(solverId);
    if (!isApplicant) {
      return NextResponse.json(
        { error: "Solver is not an applicant for this project" },
        { status: 400 },
      );
    }

    // Step 5: Perform assignment
    const result = await assignSolverToProject(projectId, solverId);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("API_ASSIGN_ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
