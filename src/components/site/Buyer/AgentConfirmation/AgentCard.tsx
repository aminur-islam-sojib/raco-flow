/* eslint-disable @next/next/no-img-element */
// components/AgentCard.tsx
import { motion } from "framer-motion";
import { ShieldCheck, Cpu } from "lucide-react";

interface AgentCardProps {
  agent: {
    _id: string;
    name: string;
    email: string;
    image: string;
    isActive: boolean;
  };
  onSelect: () => void;
}

export const AgentCard = ({ agent, onSelect }: AgentCardProps) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0 },
    }}
    whileHover={{ y: -5, rotateX: 2, rotateY: -2 }}
    className="group relative p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl hover:border-cyan-500/50 transition-all duration-300"
  >
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
      <Cpu size={80} />
    </div>

    <div className="flex items-start justify-between mb-6">
      <div className="relative">
        <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-cyan-500/30 p-1">
          <div className="absolute inset-0 rounded-full border border-cyan-400 animate-[spin_4s_linear_infinite] border-t-transparent border-l-transparent" />
          <img
            src={agent.image}
            alt={agent.name}
            className="h-full w-full rounded-full bg-slate-800"
          />
        </div>
        {agent.isActive && (
          <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-[#020617] bg-emerald-500">
            <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
          </div>
        )}
      </div>
      <span className="font-mono text-[10px] text-slate-500 bg-slate-800/50 px-2 py-1 rounded">
        ID: {agent._id}
      </span>
    </div>

    <div className="mb-8">
      <h3 className="text-xl font-semibold text-white group-hover:text-cyan-400 transition-colors">
        {agent.name}
      </h3>
      <p className="text-sm text-slate-400 font-mono">{agent.email}</p>
    </div>

    <button
      onClick={onSelect}
      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-cyan-600 text-white font-bold text-sm transition-all active:scale-95"
    >
      <ShieldCheck size={18} />
      AUTHORIZE ASSIGNMENT
    </button>
  </motion.div>
);
