import { getProjectApplicants } from "@/services/projectService";
import {
  ProjectWithApplicantsClient,
  AgentDetail,
} from "@/components/Types/project.types";
import ApplicantsPage from "@/components/site/Buyer/AgentConfirmation/ApplicantsPage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

type PageProps = {
  params: {
    project_id: string;
  };
};

type RawProjectInput = {
  _id?: { toString(): string } | string;
  buyerId?: { toString(): string } | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  applicants?: unknown[];
  agentDetails?: unknown[];
  [key: string]: unknown;
};

type RawAgentInput = {
  _id?: unknown;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  [key: string]: unknown;
};

export default async function AgentsPage({ params }: PageProps) {
  // Step 1: Check authentication
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/auth/signin");
  }

  const userId = session.user.id;
  const userRole = session.user.role;

  // Step 2: Check role - only buyers can access project details
  if (userRole !== "buyer" && userRole !== "admin") {
    redirect("/auth/signin");
  }

  const { project_id } = await params;
  console.log("Project ID:", project_id);

  if (!project_id) {
    return;
  }

  const raw = await getProjectApplicants(project_id);

  // Step 3: Validate project ownership - buyers can only see their own project logs
  if (!raw) {
    return <div>Project not found</div>;
  }

  const buyerIdString =
    typeof raw.buyerId === "string"
      ? raw.buyerId
      : raw.buyerId || String(raw.buyerId);

  if (userRole !== "admin" && buyerIdString !== userId) {
    // User is not authorized to view this project
    redirect("/");
  }

  // Serialize the result into plain JS (convert ObjectId/Date to strings)
  const serialize = (
    input: RawProjectInput,
  ): ProjectWithApplicantsClient | null => {
    if (!input) return null;

    const toIdString = (v: unknown): string => {
      if (v == null) return "";
      // Mongo ObjectId has toHexString
      if (typeof v === "object") {
        if (
          typeof (v as { toHexString?: () => string }).toHexString ===
          "function"
        ) {
          return (v as { toHexString: () => string }).toHexString();
        }
        if (typeof (v as { toString: () => string }).toString === "function") {
          const s = (v as { toString: () => string }).toString();
          // strip ObjectId("...") wrapper if present
          const m = s.match(/ObjectId\("?([a-fA-F0-9]{24})?\"?\)/);
          if (m && m[1]) return m[1];
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
        ? input.applicants.map((a) => toIdString(a))
        : [],
      agentDetails: Array.isArray(input.agentDetails)
        ? input.agentDetails.map((agent) => {
            const agentObj = agent as RawAgentInput;
            return {
              ...(agentObj ?? {}),
              _id: toIdString(agentObj._id),
              createdAt:
                agentObj.createdAt &&
                (typeof agentObj.createdAt === "string" ||
                  agentObj.createdAt instanceof Date)
                  ? new Date(agentObj.createdAt).toISOString()
                  : "",
              updatedAt:
                agentObj.updatedAt &&
                (typeof agentObj.updatedAt === "string" ||
                  agentObj.updatedAt instanceof Date)
                  ? new Date(agentObj.updatedAt).toISOString()
                  : "",
            } as AgentDetail;
          })
        : [],
    } as ProjectWithApplicantsClient;
  };

  // Step 4: Show data after validation
  const projectData = serialize(raw as unknown as RawProjectInput);

  return <div>{projectData && <ApplicantsPage data={projectData} />}</div>;
}
