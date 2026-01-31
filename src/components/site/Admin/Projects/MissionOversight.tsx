// app/admin/oversight/page.tsx
"use client";
import { useEffect, useState } from "react";
import { Target, Shield, Coins, Search } from "lucide-react";
import { StatCard } from "./Counter";
import { ProjectMatrix } from "./ProjectMatrix";
import { AnimatePresence } from "framer-motion";
import { ProjectIntel } from "./ProjectIntel";
import type { Project } from "@/components/Types/project.types";

// Import sub-components here...

export default function MissionOversight({
  allProjects,
}: {
  allProjects: Project[];
}) {
  const [selected, setSelected] = useState<Project | null>(null);
  const [projectStats, setProjectStats] = useState<{
    totalAssignedMissions?: number;
    totalMarketVolume?: number;
    totalProjects?: number;
    totalOpenMissions?: number;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/projects/project-stats");
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();
        console.log(data.data);
        setProjectStats(data?.data);
      } catch (error) {
        console.error("Error fetching project stats:", error);
      }
    };
    fetchData();
  }, []);

  const stats = {
    activeMissions: projectStats?.totalOpenMissions ?? 0,
    totalBounty: projectStats?.totalMarketVolume ?? 0,
    agentCount: projectStats?.totalAssignedMissions ?? 0,
    totalProject: projectStats?.totalProjects ?? 0,
  };

  return (
    <main className="min-h-screen bg-[#020617] text-slate-100 p-8">
      {/* Search Header */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">
            Global Mission <span className="text-cyan-500">Oversight</span>
          </h1>

          <p className="text-slate-500 font-mono text-sm mt-1">
            Total Project : {stats.totalProject}
          </p>
        </div>
        <div className="relative group">
          <div className="absolute -inset-1 bg-cyan-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>
          <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-full px-4 py-2">
            <Search size={18} className="text-cyan-500 mr-2" />
            <input
              placeholder="Scanning Network..."
              className="bg-transparent border-none outline-none text-sm w-64 placeholder:text-slate-600"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          label="Active Missions"
          value={stats.activeMissions}
          icon={Target}
        />
        <StatCard
          label="Bounty in Circulation"
          value={stats.totalBounty}
          prefix="$"
          icon={Coins}
        />
        <StatCard
          label="Registered Agents"
          value={stats.agentCount}
          icon={Shield}
        />
      </div>

      {allProjects && (
        <ProjectMatrix
          projects={allProjects}
          onSelect={(p) => setSelected(p)}
        />
      )}
      <AnimatePresence>
        {selected && (
          <ProjectIntel project={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </main>
  );
}
