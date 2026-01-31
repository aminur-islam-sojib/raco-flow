"use client";

// components/mission/BountyPanel.tsx
import { Target, ShieldCheck, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface BountyProps {
  amount: string;
  currency?: string;
}

export const BountyPanel = ({ amount, currency = "CREDITS" }: BountyProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden border-l-4 border-amber-500 bg-linear-to-r from-amber-500/10 to-transparent p-5 backdrop-blur-sm"
    >
      {/* Background Decorative Element */}
      <div className="absolute right-[-10%] top-[-20%] opacity-5 rotate-12">
        <Target size={120} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-amber-500/80 font-bold">
            Projected Bounty
          </span>
          <ShieldCheck size={14} className="text-amber-500" />
        </div>

        <div className="flex items-baseline gap-2">
          <motion.span
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-3xl font-mono font-black text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]"
          >
            {amount}
          </motion.span>
          <span className="text-xs font-bold text-amber-600/70 tracking-widest">
            {currency}
          </span>
        </div>

        {/* Micro-Data Visualization */}
        <div className="mt-4 pt-4 border-t border-amber-500/20 flex gap-4">
          <div className="flex flex-col">
            <span className="text-[8px] uppercase text-slate-500">
              Tax Deducted
            </span>
            <span className="text-[10px] font-mono text-slate-300">0.00%</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] uppercase text-slate-500">
              Risk Factor
            </span>
            <span className="text-[10px] font-mono text-red-500 flex items-center gap-1">
              <TrendingUp size={10} /> HIGH
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
