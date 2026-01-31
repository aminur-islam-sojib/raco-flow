import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getPaginatedMarketplace } from "@/services/projectService";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 6; // Display 6 projects per page for a clean Bento grid

    const { projects, totalPages, totalCount } = await getPaginatedMarketplace(
      page,
      limit,
    );

    // Add applicant check for current user
    const enrichedProjects = projects.map((project) => ({
      ...project,
      hasApplied:
        session?.user?.id && Array.isArray(project.applicants)
          ? project.applicants.includes(session.user.id)
          : false,
    }));

    return NextResponse.json({
      success: true,
      data: enrichedProjects,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
      },
    });
  } catch (error) {
    console.error("Marketplace fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch marketplace" },
      { status: 500 },
    );
  }
}
