/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getAdminGlobalStats } from "@/services/adminService";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Security Gatekeeper
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Access Denied: Level 5 Admin Clearance Required" },
        { status: 403 },
      );
    }

    const dashboardData = await getAdminGlobalStats();

    return NextResponse.json({
      success: true,
      data: dashboardData,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal System Breach: Data Fetch Failed" },
      { status: 500 },
    );
  }
}
