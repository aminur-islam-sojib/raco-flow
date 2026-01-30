/* eslint-disable @typescript-eslint/no-explicit-any */
// app/projects/[project_id]/agents/page.tsx

import ProjectApplicantsPage from "@/components/site/Buyer/AgentConfirmation/AgentDashboard";
import { getProjectApplicants } from "@/services/projectService";
import { ProjectWithApplicantsClient } from "@/components/Types/project.types";

type PageProps = {
  params: {
    project_id: string;
  };
};

export default async function AgentsPage({ params }: PageProps) {
  const { project_id } = await params;
  console.log("Project ID:", project_id);

  if (!project_id) {
    return;
  }

  const raw = await getProjectApplicants(project_id);
  console.log("Project data fetched:", raw);

  // Serialize the result into plain JS (convert ObjectId/Date to strings)
  const serialize = (input: any): ProjectWithApplicantsClient | null => {
    if (!input) return null;

    const toIdString = (v: any) => {
      if (v == null) return "";
      // Mongo ObjectId has toHexString
      if (typeof v === "object") {
        if (typeof v.toHexString === "function") return v.toHexString();
        if (typeof v.toString === "function") {
          const s = v.toString();
          // strip ObjectId("...") wrapper if present
          const m = s.match(/ObjectId\("?([a-fA-F0-9]{24})"?\)/);
          if (m) return m[1];
          return s;
        }
      }
      return String(v);
    };

    return {
      ...input,
      _id: toIdString(input._id),
      buyerId: toIdString(input.buyerId),
      createdAt: input.createdAt ? new Date(input.createdAt).toISOString() : "",
      updatedAt: input.updatedAt ? new Date(input.updatedAt).toISOString() : "",
      // ensure applicants array is plain strings
      applicants: Array.isArray(input.applicants)
        ? input.applicants.map((a: any) => toIdString(a))
        : [],
      agentDetails: Array.isArray(input.agentDetails)
        ? input.agentDetails.map((agent: any) => ({
            ...agent,
            _id: toIdString(agent._id),
            createdAt: agent.createdAt
              ? new Date(agent.createdAt).toISOString()
              : "",
            updatedAt: agent.updatedAt
              ? new Date(agent.updatedAt).toISOString()
              : "",
          }))
        : [],
    } as ProjectWithApplicantsClient;
  };

  const projectData = serialize(raw);

  return (
    <div>
      <ProjectApplicantsPage projectData={projectData} />
    </div>
  );
}
