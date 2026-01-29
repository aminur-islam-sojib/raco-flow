import ProjectList, { Project } from "@/components/site/Buyer/ProjectList";
import { getAllProjects } from "@/services/projectService";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export default async function BuyerPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/signin");
  }

  // Optional: Check role if needed
  // if (session.user.role !== "buyer") { ... }

  const rawProjects = await getAllProjects({});

  // Serialize _id and other potential non-serializable fields
  // We strictly cast here because we know the shape from the DB (mostly)
  // and we want to satisfy the component prop type.
  const projects = rawProjects.map((p: any) => ({
    ...p,
    _id: p._id.toString(),
    deadline: new Date(p.deadline).toISOString(),
  })) as Project[];

  // Filter for RBAC if needed (e.g. show only my projects? The request was "fetch all projects", assuming marketplace view or buyer's own projects.
  // Context: "Buyer Dashboard". Usually buyers see their own projects.
  // But `getAllProjects({})` fetches everything. The mock data had "OPEN" and "ASSIGNED".
  // The user said "fetch all projects data from here and pass...".
  // I will pass all for now as requested.

  return (
    <div>
      <ProjectList projects={projects} />
    </div>
  );
}
