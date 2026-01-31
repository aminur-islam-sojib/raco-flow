import { motion } from "framer-motion";
import type { Project } from "@/components/Types/project.types";

export function ProjectIntel({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      className="fixed top-0 right-0 h-full w-100 bg-[#020617]/95 backdrop-blur-2xl border-l border-slate-800 p-8 shadow-2xl z-50"
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-slate-500 hover:text-white"
      >
        ✕
      </button>
      <div className="mt-8 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Mission Intel</h2>
          <p className="font-mono text-cyan-500 text-sm">{project._id}</p>
        </div>

        <div className="space-y-4">
          <label className="text-xs uppercase text-slate-500 tracking-tighter">
            Objective Description
          </label>
          <p className="text-slate-300 bg-slate-900/50 p-4 rounded-lg border border-slate-800 italic">
            &quot;{project.description}&quot;
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase text-slate-500">Deadline</label>
            <p className="text-slate-100 font-medium">{project.deadline}</p>
          </div>
          <div>
            <label className="text-xs uppercase text-slate-500">
              Total Bounty
            </label>
            <p className="text-amber-500 font-bold">
              ${Number(project.budget).toLocaleString()}
            </p>
          </div>
        </div>

        {project.status === "ASSIGNED" && (
          <div className="p-4 border border-cyan-500/30 rounded-lg bg-cyan-500/5">
            <label className="text-xs uppercase text-cyan-500 font-bold">
              Assigned Solver
            </label>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs">
                👤
              </div>
              <a
                href={`/agents/${project.assignedSolverId}`}
                className="text-slate-100 hover:underline"
              >
                {project.assignedSolverId}
              </a>
            </div>
          </div>
        )}

        <div className="pt-8 border-t border-slate-800">
          <p className="text-[10px] text-slate-600 uppercase text-center">
            Admin Oversight Mode: Read Only Access
          </p>
        </div>
      </div>
    </motion.div>
  );
}
