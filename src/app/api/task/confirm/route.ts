import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { confirmTaskWork } from "@/services/taskService";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session?.user?.role !== "buyer") {
      return NextResponse.json(
        { error: "Unauthorized: Only buyers can confirm" },
        { status: 401 },
      );
    }

    const { taskId } = await req.json();

    if (!taskId) {
      return NextResponse.json(
        { error: "Missing required fields: taskId and submissionUrl" },
        { status: 400 },
      );
    }

    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json(
        { error: "User ID not found in session" },
        { status: 400 },
      );
    }

    await confirmTaskWork(taskId, userId);

    return NextResponse.json({
      success: true,
      message: "Package Deployed Successfully",
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Task submission error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
