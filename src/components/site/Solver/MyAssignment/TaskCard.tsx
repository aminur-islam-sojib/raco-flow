/* eslint-disable @typescript-eslint/no-explicit-any */
// components/mission/TaskCard.tsx
import { motion } from "framer-motion";
import { HardDrive } from "lucide-react";

export const TaskCard = ({ task }: { task: any }) => (
  <motion.div
    layout
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="relative overflow-hidden border border-slate-800 bg-slate-900/20 p-5 rounded-lg group"
  >
    {/* Scanner Light Effect */}
    <motion.div
      animate={{ top: ["-100%", "200%"] }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      className="absolute inset-0 w-full h-1/2 bg-linear-to-b from-transparent via-cyan-500/10 to-transparent pointer-events-none"
    />

    <div className="flex justify-between items-center relative z-10">
      <div>
        <h4 className="font-bold text-lg text-slate-100 group-hover:text-cyan-400 transition-colors tracking-tight">
          {task.name}
        </h4>
        <p className="text-xs text-slate-500 mt-1 font-mono uppercase italic">
          {task.specs}
        </p>
      </div>
      <motion.button
        whileHover={{ backgroundColor: "rgba(6,182,212,0.1)" }}
        className="flex items-center gap-2 px-3 py-1.5 border border-cyan-500/30 text-[10px] text-cyan-400 uppercase tracking-widest"
      >
        <HardDrive size={14} /> File Uplink
      </motion.button>
    </div>
  </motion.div>
);
