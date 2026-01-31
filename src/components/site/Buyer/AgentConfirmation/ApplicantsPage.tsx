"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ProjectHeader } from "./ProjectHeader";
import { AgentCard } from "./AgentCard";
import { AssignmentModal } from "./AssignmentModal";
import type {
  ProjectWithApplicantsClient,
  AgentDetail,
} from "@/components/Types/project.types";

export default function ApplicantsPage({
  data,
}: {
  data: ProjectWithApplicantsClient | null;
}) {
  const [selectedAgent, setSelectedAgent] = useState<AgentDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  console.log(data);

  const handleAssignment = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: data?._id,
          solverId: selectedAgent?._id,
        }),
      });

      // Check if response is OK before parsing JSON
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Response error:", res.status, errorText);
        throw new Error(`API error: ${res.status} ${res.statusText}`);
      }

      const json = await res.json();
      console.log(json);
      console.log(res);
      setSuccess(true);
    } catch (err) {
      console.error("assign error", err);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
    setTimeout(() => {
      setSelectedAgent(null);
      setSuccess(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#020617] p-6 md:p-12">
      <ProjectHeader
        title={data?.title ?? ""}
        category={data?.category ?? ""}
        budget={String(data?.budget ?? 0)}
        applicantCount={data?.agentDetails?.length ?? 0}
      />

      <motion.div
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {data?.agentDetails?.map((agent: AgentDetail) => (
          <AgentCard
            key={agent._id}
            agent={{
              _id: agent._id,
              name: agent.name ?? "",
              email: agent.email,
              image: agent.image ?? "",
              isActive: agent.isActive,
            }}
            onSelect={() => setSelectedAgent(agent)}
          />
        ))}
      </motion.div>

      <AssignmentModal
        isOpen={!!selectedAgent}
        isAssigning={loading}
        isSuccess={success}
        agentName={selectedAgent?.name ?? ""}
        onClose={() => setSelectedAgent(null)}
        onConfirm={handleAssignment}
      />
    </div>
  );
}
