import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { BountyPanel } from "@/components/site/Solver/MyAssignment/BountyPanel";
import { MissionHeader } from "@/components/site/Solver/MyAssignment/MissionHeader";
import { BriefingTerminal } from "@/components/site/Solver/Task/BriefingTerminal";
import { ChronosCountdown } from "@/components/site/Solver/Task/ChronosCountdown";
import { TaskOrchestrator } from "@/components/site/Solver/Task/TaskOrchestrator";
import { getAssignmentById } from "@/services/assignmentServices";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}
export default async function MissionPage({ params }: Props) {
  const { id } = await params;
  if (!id) return null;

  // Ensure user is authenticated and authorized on the server
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/auth");
  }
  if (session.user.role !== "solver") {
    redirect("/auth");
  }

  // Call service directly (service also validates user/session)
  const project = await getAssignmentById(id);
  console.log("assignmentData", project);
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6">
      <div className="max-w-7xl mx-auto">
        <MissionHeader title={project.title} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-6">
            <ChronosCountdown deadline={project.deadline} />
            <BriefingTerminal description={project.description} />
            <BountyPanel amount={project.budget} />
          </div>

          {/* Core Action Area */}
          <main className="lg:col-span-8">
            <TaskOrchestrator taskId={id} />
          </main>
        </div>
      </div>
    </div>
  );
}
