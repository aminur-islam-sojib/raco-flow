import { getProjectWithApplicants } from "@/services/projectService";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{
    project_id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { project_id } = await params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  // Fetch data directly from the service
  const project = await getProjectWithApplicants(project_id);

  if (!project) {
    return <div>Project not found</div>;
  }

  // Security check: Only the buyer (or admin) can see applicants
  if (session.user.role !== "admin" && project.buyerId !== session.user.id) {
    return <div>Access Denied</div>;
  }

  const applicants = project.agentDetails || [];

  return (
    <div className="p-6 lg:p-12">
      <h1 className="text-2xl font-bold mb-4">
        Applicants for: <span className="text-cyan-500">{project.title}</span>
      </h1>

      {applicants.length === 0 ? (
        <p className="text-slate-500">No agents have applied yet.</p>
      ) : (
        <div className="grid gap-4">
          {applicants.map((applicant: any) => (
            <div
              key={applicant._id.toString()}
              className="p-4 bg-slate-900 rounded-lg border border-slate-800"
            >
              <div className="font-bold text-lg text-slate-200">
                {applicant.name}
              </div>
              <div className="text-slate-400 text-sm">{applicant.email}</div>
              {/* Add more applicant details here */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
