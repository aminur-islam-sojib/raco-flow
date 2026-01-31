"use client";

// components/mission/MissionHeader.tsx
import { motion } from "framer-motion";

export const MissionHeader = ({ title }: { title: string }) => {
  // Logic to split the title: first part neutral, last part Cyan
  const words = title.split(" ");
  const midIndex = Math.ceil(words.length / 2);
  const firstPart = words.slice(0, midIndex).join(" ");
  const secondPart = words.slice(midIndex).join(" ");

  return (
    <header className="mb-10 border-b border-cyan-900/30 pb-6">
      <div className="flex justify-between items-start">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic leading-none">
            <span className="text-slate-100 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              {firstPart}{" "}
            </span>
            <span className="text-cyan-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]">
              {secondPart}
            </span>
          </h1>
        </motion.div>

        <div className="text-right hidden md:block">
          <p className="text-[10px] uppercase tracking-widest text-cyan-500 mb-1 font-bold">
            Status Uplink
          </p>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/20 px-3 py-1 border border-cyan-500/20 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            ENCRYPTED CONNECTION
          </div>
        </div>
      </div>
    </header>
  );
};
