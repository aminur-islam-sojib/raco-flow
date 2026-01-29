import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { promoteUserToBuyer } from "@/services/userServices";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    await promoteUserToBuyer(userId);

    return NextResponse.json({
      success: true,
      message: "User promoted to Buyer successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: "Promotion failed" }, { status: 500 });
  }
}
