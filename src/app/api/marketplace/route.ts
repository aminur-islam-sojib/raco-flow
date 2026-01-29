import { NextResponse } from "next/server";
import { getPaginatedMarketplace } from "@/services/projectService";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 6; // Display 6 projects per page for a clean Bento grid

    const { projects, totalPages, totalCount } = await getPaginatedMarketplace(
      page,
      limit,
    );

    return NextResponse.json({
      success: true,
      data: projects,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch marketplace" },
      { status: 500 },
    );
  }
}
