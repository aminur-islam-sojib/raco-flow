"use client";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/components/Types/project.types";

export function ProjectMatrix({
  projects,
  onSelect,
}: {
  projects: Project[];
  onSelect: (p: Project) => void;
}) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-950/50 text-slate-400 uppercase text-xs tracking-widest">
            <th className="px-6 py-4 font-semibold">Project ID</th>
            <th className="px-6 py-4 font-semibold">Title</th>
            <th className="px-6 py-4 font-semibold">Buyer</th>
            <th className="px-6 py-4 font-semibold">Status</th>
            <th className="px-6 py-4 font-semibold">Budget</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          <AnimatePresence mode="popLayout">
            {projects.map((project, index) => (
              <motion.tr
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                key={project._id}
                onClick={() => onSelect(project)}
                className="group cursor-pointer hover:bg-cyan-500/5 transition-colors relative"
              >
                <td className="px-6 py-4 font-mono text-cyan-500 text-sm">
                  {project._id}
                </td>
                <td className="px-6 py-4 font-medium text-slate-200">
                  {project.title}
                </td>
                <td className="px-6 py-4 text-slate-400">{project.buyerId}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={project.status} />
                </td>
                <td className="px-6 py-4 font-semibold text-amber-500">
                  ${Number(project.budget).toLocaleString()}
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    OPEN: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]",
    ASSIGNED:
      "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]",
    COMPLETED:
      "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-bold border ${colors[status]}`}
    >
      {status}
    </span>
  );
}
