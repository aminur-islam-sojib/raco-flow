"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Loader2, Timer } from "lucide-react";
import { MissionCard } from "@/components/site/Solver/MissionCard";
import { SkeletonGrid } from "@/components/site/Solver/SkeletonGrid";

// --- Types & Interfaces ---
interface Project {
  _id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
}

export default function SolverMarketplace() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalCount: 0,
  });

  const fetchMissions = async (targetPage: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/marketplace?page=${targetPage}`);
      const result = await res.json();
      if (result.success) {
        setProjects(result.data);
        setPagination(result.pagination);
      }
    } catch (error) {
      console.error("Failed to load missions", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchMissions(page);
  }, [page]);

  const handleNext = () => {
    if (page < pagination.totalPages) setPage((p) => p + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage((p) => p - 1);
  };
  const [applyingId, setApplyingId] = useState<string | null>(null);

  const handleApply = async (projectId: string) => {
    setApplyingId(projectId);
    try {
      await fetch("/api/projects/apply", {
        method: "POST",
        body: JSON.stringify({ projectId }),
      });
      // Logic for success state could go here
    } catch (error) {
      console.error("Initiation failed", error);
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-8 font-mono">
      {/* Header Section */}
      <header className="mb-8 md:mb-12 flex flex-col md:flex-row justify-between md:items-end gap-6 md:gap-0 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tighter uppercase italic">
            SOLVER_<span className="text-cyan-500">MARKETPLACE</span>
          </h1>
          <p className="text-slate-500 font-mono text-sm mt-1">
            Available Contracts: {pagination.totalCount}
          </p>
        </div>
        <div className="text-left md:text-right">
          <span className="text-xs text-cyan-500/50 block mb-1">
            SYSTEM_STATUS
          </span>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-sm font-bold">ENCRYPTED_CONNECTION</span>
          </div>
        </div>
      </header>

      {/* Main Grid with Transitions */}
      <div className="relative min-h-150">
        <AnimatePresence mode="wait" custom={page}>
          {loading ? (
            <SkeletonGrid key="loader" />
          ) : (
            <motion.div
              key={page}
              custom={page}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {projects.map((project) => (
                <MissionCard
                  key={project._id}
                  project={project}
                  onApply={handleApply}
                  isApplying={applyingId === project._id}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* High-Tech Pagination Footer */}
      <footer className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 border-t border-slate-800 pt-8">
        <button
          onClick={handlePrev}
          disabled={page === 1 || loading}
          className="px-6 py-2 border border-slate-700 hover:border-cyan-500 disabled:opacity-30 transition-colors group"
        >
          <span className="group-hover:text-cyan-400">{"< PREV_SECTOR"}</span>
        </button>

        <div className="text-center">
          <p className="text-xs text-slate-500 uppercase mb-1">
            Navigation_Coord
          </p>
          <p className="text-xl font-bold tracking-[0.2em] text-white">
            SECTOR {page} / {pagination.totalPages}
          </p>
        </div>

        <button
          onClick={handleNext}
          disabled={page === pagination.totalPages || loading}
          className="px-6 py-2 border border-slate-700 hover:border-cyan-500 disabled:opacity-30 transition-colors group"
        >
          <span className="group-hover:text-cyan-400">{"NEXT_SECTOR >"}</span>
        </button>
      </footer>
    </div>
  );
}
