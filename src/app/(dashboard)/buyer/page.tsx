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

  const userId = session.user.id;
  const userRole = session.user.role;

  // Step 1: Check role
  if (userRole !== "buyer" && userRole !== "admin") {
    redirect("/auth/signin");
  }

  // Step 2: Fetch all projects
  const rawProjects = await getAllProjects({});

  // Step 3: Validate data - Filter projects based on user role
  // Admins can see all projects, buyers see only their own
  const filteredProjects = rawProjects.filter((p) => {
    if (userRole === "admin") {
      return true; // Admins can see all projects
    }
    // Buyers can only see their own projects
    const buyerId =
      typeof p.buyerId === "string" ? p.buyerId : p.buyerId?.toString();
    return buyerId === userId;
  });

  // Step 4: Serialize and return data
  const projects = filteredProjects.map((p) => ({
    ...p,
    _id: p._id.toString(),
    deadline: new Date(p.deadline).toISOString(),
  })) as Project[];

  return (
    <div>
      <ProjectList projects={projects} />
    </div>
  );
}
