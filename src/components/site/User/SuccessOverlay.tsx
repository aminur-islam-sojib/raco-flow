// components/promotion/SuccessOverlay.tsx
"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export const SuccessOverlay = () => {
  const [positions, setPositions] = useState<number[] | null>(null);

  useEffect(() => {
    const vals = Array.from({ length: 12 }, () => Math.random() * 100);
    const raf = requestAnimationFrame(() => {
      setPositions(vals);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-xl w-full text-center p-12 bg-slate-900/40 border border-emerald-500/30 rounded-3xl backdrop-blur-2xl relative overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.1)]"
    >
      {/* Background Data Particles */}
      {positions &&
        positions.map((p, i) => (
          <motion.div
            key={i}
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: -200, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            className="absolute w-1 h-4 bg-emerald-500/20"
            style={{
              left: `${p}%`,
              bottom: "-20px",
            }}
          />
        ))}

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Badge */}
        <motion.div
          initial={{ rotate: -20, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(16,185,129,0.5)]"
        >
          <ShieldCheck className="w-12 h-12 text-black" strokeWidth={2.5} />
        </motion.div>

        {/* Success Text */}
        <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-2">
          Clearance_Granted
        </h2>
        <p className="text-emerald-500 font-mono text-[10px] tracking-[0.4em] uppercase font-bold mb-8">
          Buyer Status: Active // Node_Synced
        </p>

        <div className="bg-slate-950/50 border border-slate-800 p-6 rounded-xl mb-10 text-left w-full">
          <p className="text-slate-400 text-xs font-mono leading-relaxed">
            <span className="text-emerald-500 font-bold">SYST_MSG:</span> Your
            account has been successfully upgraded to the Buyer tier. You now
            have full authorization to deploy missions, manage treasury assets,
            and recruit top-tier Solvers.
          </p>
        </div>

        {/* Action Button */}
        <Link href="/buyer/dashboard" className="w-full">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 transition-all rounded-lg"
          >
            Go to Buyer Dashboard
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
};
