import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getProjectWithApplicants } from "@/services/projectService";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const project = await getProjectWithApplicants(params.id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    if (!session || !session.user || session.user.role !== "buyer") {
      return NextResponse.json(
        { error: "Only Buyers can post projects" },
        { status: 403 },
      );
    }
    // Security: Only the Buyer who created the project (or Admin) can see applicants
    if (session.user.role !== "admin" && project.buyerId !== session.user.id) {
      return NextResponse.json({ error: "Access Denied" }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      data: {
        title: project.title,
        budget: project.budget,
        status: project.status,
        applicants: project.agentDetails,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
