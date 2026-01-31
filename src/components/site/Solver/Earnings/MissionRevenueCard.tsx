/* eslint-disable @typescript-eslint/no-explicit-any */
// components/earnings/MissionRevenueCard.tsx
"use client";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { TrendingUp, Wallet, Terminal } from "lucide-react";

export const MissionRevenueCard = ({ mission }: { mission: any }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  return (
    <motion.div
      style={{ rotateX, rotateY, perspective: 1000 }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className="group relative bg-slate-900/30 border border-slate-800 p-6 rounded-2xl hover:border-cyan-500/50 transition-colors duration-500"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl group-hover:border-cyan-500/30 transition-colors">
          <Wallet size={20} className="text-cyan-500" />
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono text-slate-600 block uppercase">
            TX_ID
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            #{mission.id.slice(-8).toUpperCase()}
          </span>
        </div>
      </div>

      <h3 className="font-mono text-sm font-bold text-slate-200 mb-4 line-clamp-1 uppercase tracking-tight">
        {mission.title}
      </h3>

      <div className="flex items-end justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-emerald-500" />
          <span className="text-2xl font-black text-slate-100">
            {mission.budget}
          </span>
          <span className="text-xs font-bold text-slate-600 tracking-widest">
            CR
          </span>
        </div>
        <div className="h-8 w-8 rounded-full border border-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Terminal size={12} className="text-cyan-500" />
        </div>
      </div>
    </motion.div>
  );
};
