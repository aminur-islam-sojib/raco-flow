// components/admin/UserDistributionSector.tsx
"use client";
import { motion } from "framer-motion";
import { Users } from "lucide-react";

export const UserDistributionSector = () => {
  const solverPercent = 64; // Data placeholder
  const buyerPercent = 36;

  return (
    <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xs font-black tracking-widest uppercase text-slate-400 flex items-center gap-2">
          <Users size={14} className="text-purple-500" />{" "}
          User_Distribution_Matrix
        </h3>
        <span className="text-[10px] font-mono text-slate-600 uppercase">
          Total: 4,892 Units
        </span>
      </div>

      <div className="space-y-6">
        <div className="relative h-12 w-full bg-slate-950 rounded-lg overflow-hidden flex border border-slate-800">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${solverPercent}%` }}
            className="h-full bg-linear-to-r from-blue-600 to-blue-400 relative"
          >
            <div className="absolute inset-0 bg-white/10 animate-pulse" />
          </motion.div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${buyerPercent}%` }}
            className="h-full bg-linear-to-r from-purple-500 to-purple-700"
          />
        </div>

        <div className="flex justify-between font-mono text-xs">
          <div className="flex flex-col">
            <span className="text-blue-400 font-black tracking-tighter text-lg">
              {solverPercent}%
            </span>
            <span className="text-[10px] text-slate-500">SOLVER_ASSETS</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-purple-400 font-black tracking-tighter text-lg">
              {buyerPercent}%
            </span>
            <span className="text-[10px] text-slate-500">BUYER_NODES</span>
          </div>
        </div>
      </div>
    </section>
  );
};
