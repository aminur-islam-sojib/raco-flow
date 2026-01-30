import { NextResponse } from "next/server";
import { getProjectApplicants } from "@/services/projectService";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const projectWithAgents = await getProjectApplicants(params.id);

    if (!projectWithAgents) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    if (!session || !session.user || session.user.role !== "buyer") {
      return NextResponse.json(
        { error: "Only Buyers can view projects" },
        { status: 403 },
      );
    }
    // Security: Only the Buyer who created this can see the applicants
    if (
      projectWithAgents.buyerId !== session.user.id &&
      session.user.role !== "admin"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      data: projectWithAgents,
    });
  } catch (error) {
    console.error("FETCH_APPLICANTS_ERROR:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
