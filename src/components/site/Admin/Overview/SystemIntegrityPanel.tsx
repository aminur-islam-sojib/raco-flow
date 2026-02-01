// components/admin/SystemIntegrityPanel.tsx
"use client";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

export const SystemIntegrityPanel = () => (
  <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-xs font-black tracking-widest uppercase text-slate-400 flex items-center gap-2">
        <Activity size={14} className="text-blue-500" /> System_Heartbeat
      </h3>
      <div className="flex gap-4">
        <div className="text-right">
          <p className="text-[8px] text-slate-500 uppercase">CPU_Load</p>
          <p className="text-xs font-mono text-blue-400">14.2%</p>
        </div>
        <div className="text-right">
          <p className="text-[8px] text-slate-500 uppercase">MEM_Usage</p>
          <p className="text-xs font-mono text-purple-400">4.8GB</p>
        </div>
      </div>
    </div>

    <div className="h-24 w-full bg-slate-950 rounded-lg relative overflow-hidden flex items-center">
      <svg className="w-full h-12 stroke-blue-500/50" viewBox="0 0 400 100">
        <motion.path
          d="M0 50 L150 50 L160 20 L180 80 L190 50 L400 50"
          fill="none"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </svg>
    </div>
  </div>
);
