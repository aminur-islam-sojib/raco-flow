import { Loader2, Timer, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

// --- Types & Interfaces ---
interface Project {
  _id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
}
export function MissionCard({
  project,
  onApply,
  isApplying,
  hasApplied,
}: {
  project: Project;
  onApply: (id: string) => void;
  isApplying: boolean;
  hasApplied: boolean;
}) {
  return (
    <div className="group relative overflow-hidden rounded-sm border border-slate-800 bg-slate-900/40 backdrop-blur-xl p-4 md:p-6 transition-all hover:border-cyan-500/50 hover:shadow-[0_0_30px_-10px_rgba(6,182,212,0.2)]">
      {/* Scanner Line Animation */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100">
        <div className="h-px w-full bg-cyan-500/30 absolute top-0 animate-scan" />
      </div>

      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 bg-cyan-950/30 border border-cyan-500/20 px-2 py-1">
          <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-[10px] font-bold text-cyan-400 tracking-tighter">
            AVAILABLE
          </span>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-500 uppercase">Bounty</p>
          <p className="text-xl font-black text-white group-hover:text-cyan-400 transition-colors">
            {project.budget.toLocaleString()}{" "}
            <span className="text-xs text-slate-500 font-normal">USD</span>
          </p>
        </div>
      </div>

      <h3 className="text-lg font-bold text-white mb-2 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all">
        {project.title}
      </h3>

      <p className="text-sm text-slate-400 line-clamp-2 mb-6 min-h-10 mask-fade-bottom">
        {project.description}
      </p>

      <div className="flex items-center gap-4 mb-6 text-[11px] text-slate-500 uppercase tracking-widest">
        <div className="flex items-center gap-1.5">
          <Timer size={14} className="text-cyan-500" />
          <span>T-Minus {formatDistanceToNow(new Date(project.deadline))}</span>
        </div>
      </div>

      <button
        onClick={() => onApply(project._id)}
        disabled={isApplying || hasApplied}
        className="w-full relative overflow-hidden bg-white text-black py-3 font-black text-xs uppercase tracking-[0.2em] hover:bg-cyan-500 hover:text-white transition-all disabled:bg-slate-800 disabled:text-slate-500"
      >
        {hasApplied ? (
          <span className="flex items-center justify-center gap-2">
            <Check size={16} /> ALREADY APPLIED
          </span>
        ) : isApplying ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" size={16} /> PENDING
          </span>
        ) : (
          "Initiate Application"
        )}
      </button>
    </div>
  );
}
