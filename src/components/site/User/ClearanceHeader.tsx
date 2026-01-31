// components/promotion/ClearanceHeader.tsx
import { ArrowRight } from "lucide-react";

export const ClearanceHeader = ({ currentRank }: { currentRank: string }) => (
  <div className="flex items-center justify-center gap-6 mb-12">
    <div className="text-center">
      <span className="text-[8px] uppercase text-slate-500 block mb-1">
        Current_Rank
      </span>
      <div className="px-4 py-2 border border-slate-800 rounded bg-slate-900/50 font-mono text-slate-300">
        {currentRank.toUpperCase()}
      </div>
    </div>
    <div className="h-px w-12 bg-emerald-500/30 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-500">
        <ArrowRight size={12} />
      </div>
    </div>
    <div className="text-center">
      <span className="text-[8px] uppercase text-emerald-500 block mb-1 font-bold">
        Target_Rank
      </span>
      <div className="px-4 py-2 border border-emerald-500/50 rounded bg-emerald-500/10 font-mono text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
        BUYER
      </div>
    </div>
  </div>
);

// components/promotion/FeatureUplink.tsx
import { Zap, Shield, Cpu } from "lucide-react";

const FEATURES = [
  { icon: Zap, label: "Post Missions" },
  { icon: Cpu, label: "Manage Budgets" },
  { icon: Shield, label: "Hire Solvers" },
];

export const FeatureUplink = () => (
  <div className="grid grid-cols-3 gap-4 mb-8">
    {FEATURES.map((f, i) => (
      <div
        key={i}
        className="p-4 border border-slate-800 bg-slate-900/20 rounded-lg flex flex-col items-center gap-2"
      >
        <f.icon size={18} className="text-emerald-500" />
        <span className="text-[9px] uppercase font-bold text-slate-400 tracking-tighter">
          {f.label}
        </span>
      </div>
    ))}
  </div>
);
