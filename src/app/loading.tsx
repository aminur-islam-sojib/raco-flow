"use client";

import { motion } from "framer-motion";
import { Cpu } from "lucide-react";

export const GlobalLoader = () => {
  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-[#020617]">
      {/* Background Grid Decorative */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_at_center,black,transparent_80%)]" />

      <div className="relative flex flex-col items-center">
        {/* Outer Rotating Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 rounded-full border-t-2 border-b-2 border-cyan-500/30 border-l-2 border-r-2 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
        />

        {/* Inner Counter-Rotating Hexagon */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-4 rounded-full border-2 border-dashed border-cyan-400/20"
        />

        {/* Central Core Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0.5, 1, 0.5], scale: 1 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Cpu className="text-cyan-400 w-8 h-8 drop-shadow-[0_0_8px_#06b6d4]" />
        </motion.div>
      </div>

      {/* Loading Status Text */}
      <div className="mt-12 flex flex-col items-center gap-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 px-3 py-1 bg-cyan-950/20 border border-cyan-500/20 rounded-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <p className="text-[10px] font-mono tracking-[0.3em] text-cyan-400 uppercase font-bold">
            Syncing_Neural_Link
          </p>
        </motion.div>

        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ backgroundColor: ["#1e293b", "#06b6d4", "#1e293b"] }}
              transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
              className="h-1 w-4 rounded-full"
            />
          ))}
        </div>
      </div>

      {/* Bottom Data Streams */}
      <div className="absolute bottom-10 flex gap-12 opacity-20 font-mono text-[8px] text-slate-500 uppercase tracking-widest">
        <span>Kernel_V: 15.0.1</span>
        <span>Secure_Protocol: AES-256</span>
        <span>Uplink: Active</span>
      </div>
    </div>
  );
};

export default GlobalLoader;
