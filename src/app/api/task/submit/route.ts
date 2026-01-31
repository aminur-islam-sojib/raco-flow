import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { submitTaskWork } from "@/services/taskService";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session?.user?.role !== "solver") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { taskId, submissionUrl } = await req.json();

    if (!taskId || !submissionUrl) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 400 });
    }

    await submitTaskWork(taskId, userId, submissionUrl);

    return NextResponse.json({ success: true, message: "Package Deployed" });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
