"use client";

import React, { useState, useMemo } from "react";
import { AnimatePresence } from "framer-motion";

import { ProjectStatus } from "@/components/Types/project.types";
import { ProjectCard } from "./ProjectCard";
import { EmptyState } from "./EmptyState";

export interface Project {
  _id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  status: ProjectStatus;
  category: string;
}

interface BuyerDashboardProps {
  projects: Project[];
}

export default function BuyerDashboard({ projects = [] }: BuyerDashboardProps) {
  const [filter, setFilter] = useState<ProjectStatus | "ALL">("ALL");

  const filteredProjects = useMemo(() => {
    return filter === "ALL"
      ? projects
      : projects.filter((p) => p.status === filter);
  }, [projects, filter]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 lg:p-12 relative overflow-hidden">
      {/* Background Grid Overlay */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic">
              Mission <span className="text-cyan-500">Control</span>
            </h1>
            <p className="text-slate-500 font-mono text-sm mt-1">
              RacoFlow Command Center v2.0
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-slate-900/50 p-1 rounded-lg border border-slate-800">
              {(["ALL", "OPEN", "ASSIGNED", "COMPLETED"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                    filter === s
                      ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Project Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
