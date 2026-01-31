/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getBuyerSubmissions } from "@/services/buyerService";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // 1. Authenticate Session
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // 2. Role Enforcement: Must be a Buyer
    if (session.user.role !== "buyer") {
      return NextResponse.json(
        { error: "Access Denied: Buyer clearance required" },
        { status: 403 },
      );
    }

    // 3. Fetch projects owned by this specific buyer
    const submissions = await getBuyerSubmissions();

    return NextResponse.json({
      success: true,
      data: submissions,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
