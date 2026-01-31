// components/earnings/TotalRevenueVault.tsx
"use client";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export const TotalRevenueVault = ({ amount }: { amount: number }) => {
  return (
    <section className="relative py-20 flex flex-col items-center justify-center overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-linear-to-b from-cyan-500/5 to-transparent pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10"
      >
        <ShieldCheck size={14} className="text-cyan-400" />
        <span className="text-[10px] font-black tracking-[0.3em] text-cyan-400 uppercase">
          Verified Balance
        </span>
      </motion.div>

      <div className="relative">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-8xl md:text-9xl font-black tracking-tighter text-slate-100 italic"
        >
          {amount.toLocaleString()}
        </motion.h1>
        {/* Subtle Glitch Shadow Layers */}
        <motion.span
          animate={{ x: [-2, 2, -1, 0], opacity: [0, 0.5, 0] }}
          transition={{ repeat: Infinity, duration: 0.2, repeatDelay: 3 }}
          className="absolute inset-0 text-cyan-500 select-none pointer-events-none -z-10"
        >
          {amount.toLocaleString()}
        </motion.span>
      </div>

      <div className="mt-4 flex flex-col items-center">
        <span className="text-slate-500 font-mono text-xs tracking-widest uppercase">
          Credits Secured
        </span>
        <div className="h-0.5 w-24 bg-linear-to-r from-transparent via-cyan-500 to-transparent mt-2" />
      </div>
    </section>
  );
};
