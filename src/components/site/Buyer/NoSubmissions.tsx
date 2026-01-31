// components/site/Buyer/NoSubmissions.tsx
"use client";
import { motion } from "framer-motion";
import { Radar, Search } from "lucide-react";

export const NoSubmissions = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-100 w-full border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/10 p-12 text-center"
    >
      {/* Animated Radar/Scanner Icon */}
      <div className="relative mb-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="p-4 rounded-full bg-cyan-500/5 border border-cyan-500/20"
        >
          <Radar className="w-12 h-12 text-cyan-500/50" />
        </motion.div>

        {/* Pulsing rings */}
        <span className="absolute inset-0 rounded-full border border-cyan-500 animate-ping opacity-20"></span>
      </div>

      {/* Terminal Text */}
      <div className="space-y-2">
        <h3 className="text-xl font-black tracking-widest text-slate-200 uppercase italic">
          No_Submissions_Detected
        </h3>
        <p className="text-sm font-mono text-slate-500 max-w-xs mx-auto">
          System is idling. Awaiting incoming data packets from assigned
          solvers.
        </p>
      </div>

      {/* Decorative HUD Elements */}
      <div className="mt-8 flex gap-2">
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-950 border border-slate-800 rounded-full">
          <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-[10px] font-mono text-slate-400 uppercase">
            Status: Scanning
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-950 border border-slate-800 rounded-full">
          <Search size={10} className="text-slate-500" />
          <span className="text-[10px] font-mono text-slate-400 uppercase">
            Frequency: 2.4GHz
          </span>
        </div>
      </div>
    </motion.div>
  );
};
