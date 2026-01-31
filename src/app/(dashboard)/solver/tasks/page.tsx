import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getMyProjectApplications } from "@/services/projectService";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function page() {
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

  return <div>page</div>;
}
