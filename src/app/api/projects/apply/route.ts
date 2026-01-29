import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "solver") {
      return NextResponse.json(
        { error: "Only Solvers can apply for projects" },
        { status: 403 },
      );
    }

    const { projectId } = await req.json();

    const client = await clientPromise;
    const db = client.db("racoflow");

    const result = await db
      .collection("projects")
      .updateOne(
        { _id: new ObjectId(projectId), status: "OPEN" },
        { $addToSet: { applicants: session.user.id } },
      );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Project not available" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Application transmitted",
    });
  } catch (error) {
    return NextResponse.json({ error: "Transmission failed" }, { status: 500 });
  }
}
