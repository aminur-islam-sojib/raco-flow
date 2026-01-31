import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { createNewProject } from "@/services/projectService";
import { isBuyer } from "@/lib/projectAuth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Step 1: Check authentication
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized: No session found" },
        { status: 401 },
      );
    }

    // Step 2: Check role - only buyers can create projects
    if (!isBuyer(session)) {
      return NextResponse.json(
        { error: "Only Buyers can post projects" },
        { status: 403 },
      );
    }

    const body = await req.json();
    console.log("Received project data:", body);

    const { title, description, budget, deadline, category } = body;

    // Step 3: Validate data - Ensure all required fields are present
    if (
      !title ||
      !description ||
      budget === null ||
      budget === undefined ||
      !deadline ||
      !category
    ) {
      console.log("Validation failed:", {
        hasTitle: !!title,
        hasDescription: !!description,
        hasBudget: budget !== null && budget !== undefined,
        hasDeadline: !!deadline,
        hasCategory: !!category,
      });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Step 4: Create project with validated data
    const project = await createNewProject({
      title,
      description,
      budget: parseFloat(budget),
      deadline: new Date(deadline),
      category,
      buyerId: session.user.id, // Attach current user as buyer
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
