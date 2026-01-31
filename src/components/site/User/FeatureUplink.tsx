// components/promotion/FeatureUplink.tsx
import { Zap, Shield, BarChart3 } from "lucide-react";

const FEATURES = [
  { icon: Zap, title: "Mission Deployment", desc: "Create and fund new tasks" },
  {
    icon: Shield,
    title: "Solver Verification",
    desc: "Review and hire top talent",
  },
  {
    icon: BarChart3,
    title: "Treasury Control",
    desc: "Full budget management",
  },
];

export const FeatureUplink = () => (
  <div className="space-y-6">
    {FEATURES.map((f, i) => (
      <div key={i} className="flex items-start gap-4 group">
        <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 group-hover:shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all">
          <f.icon size={18} />
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            {f.title}
          </h4>
          <p className="text-[10px] text-slate-500 font-mono italic">
            {f.desc}
          </p>
        </div>
      </div>
    ))}
  </div>
);
