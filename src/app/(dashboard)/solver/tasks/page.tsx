/* eslint-disable @typescript-eslint/no-explicit-any */
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { VoidScanner } from "@/components/site/Shared/VoidScanner";
import MissionSelectionHub from "@/components/site/Solver/Task/Assignments";
import { getMyProjectApplications } from "@/services/projectService";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function MissionPage() {
  const session = await getServerSession(authOptions);

  // Check if user is logged in
  if (!session || !session.user) {
    redirect("/auth");
  }

  // Check if user is a solver
  if (session.user.role !== "solver") {
    redirect("/auth");
  }

  // Get applications directly in the server component
  const myAssignment = await getMyProjectApplications();
  console.log(myAssignment);

  // Sanitize documents: convert ObjectId/Date/etc to plain serializable values
  const sanitizeDoc = (doc: any) => {
    if (!doc) return doc;
    return {
      ...doc,
      _id: doc._id?.toString ? doc._id.toString() : doc._id,
      assignedSolverId: doc.assignedSolverId?.toString
        ? doc.assignedSolverId.toString()
        : doc.assignedSolverId,
      applicants: Array.isArray(doc.applicants)
        ? doc.applicants.map((a: any) => (a && a.toString ? a.toString() : a))
        : doc.applicants,
      createdAt: doc.createdAt?.toISOString
        ? doc.createdAt.toISOString()
        : doc.createdAt,
      updatedAt: doc.updatedAt?.toISOString
        ? doc.updatedAt.toISOString()
        : doc.updatedAt,
    };
  };

  const sanitizedAssignments = Array.isArray(myAssignment)
    ? myAssignment.map(sanitizeDoc)
    : myAssignment
      ? sanitizeDoc(myAssignment)
      : [];

  if (sanitizedAssignments.length < 1) {
    return <VoidScanner />;
  }

  return (
    <div>
      <MissionSelectionHub myAssignments={sanitizedAssignments} />
    </div>
  );
}
