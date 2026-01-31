import { NextResponse } from "next/server";
import { getProjectApplicants } from "@/services/projectService";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { validateProjectAccess } from "@/lib/projectAuth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    // Step 1: Check authentication
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Step 2: Await params (Next.js 16+)
    const { id } = await params;

    // Step 3: Get project to validate ownership
    const projectWithAgents = await getProjectApplicants(id);

    if (!projectWithAgents) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Step 3: Validate project ownership - only buyer who owns it or admin can access
    const accessValidation = validateProjectAccess(
      session,
      projectWithAgents.buyerId,
      "buyer",
    );

    if (!accessValidation.authorized) {
      return NextResponse.json(
        { error: accessValidation.error },
        { status: accessValidation.statusCode || 403 },
      );
    }

    // Step 4: Return validated data
    return NextResponse.json({
      success: true,
      data: projectWithAgents,
    });
  } catch (error) {
    console.error("FETCH_APPLICANTS_ERROR:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
