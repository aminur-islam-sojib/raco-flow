/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { promoteToBuyer } from "@/services/adminService";

export async function PATCH(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    console.log(
      "API /promote - Full session:",
      JSON.stringify(session, null, 2),
    );

    if (!session) {
      console.log("API /promote - No session found");
      return NextResponse.json(
        { error: "Unauthorized: Please log in." },
        { status: 401 },
      );
    }

    const { targetUserId } = await req.json();
    console.log("API /promote - targetUserId from body:", targetUserId);
    console.log("API /promote - session.user:", session.user);

    if (!targetUserId) {
      return NextResponse.json(
        { error: "Missing Target User ID" },
        { status: 400 },
      );
    }

    // Promote the user
    const updatedUser = await promoteToBuyer(targetUserId);

    return NextResponse.json({
      success: true,
      message: `User ${updatedUser.email} has been promoted to Buyer.`,
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Promotion error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
