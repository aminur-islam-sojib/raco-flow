import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getAdminGlobalStats } from "@/services/projectService";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Enforcement: Admin role check [cite: 19, 113]
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Access Denied: Admin Clearance Required" },
        { status: 403 },
      );
    }

    const stats = await getAdminGlobalStats();

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (err) {
    console.error("Project stats fetch error:", err);
    return NextResponse.json(
      { error: "Internal System Error" },
      { status: 500 },
    );
  }
}
