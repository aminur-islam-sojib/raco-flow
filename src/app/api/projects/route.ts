import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { createNewProject } from "@/services/projectService";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "buyer") {
      return NextResponse.json(
        { error: "Only Buyers can post projects" },
        { status: 403 },
      );
    }

    const body = await req.json();
    const { title, description, budget, deadline, category } = body;

    if (!title || !description || !budget || !deadline || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const project = await createNewProject({
      title,
      description,
      budget: parseFloat(budget),
      deadline: new Date(deadline),
      category,
      buyerId: session.user.id,
    });

    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error) {
    console.error("CREATE_PROJECT_ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
