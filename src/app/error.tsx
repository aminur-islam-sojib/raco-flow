// components/ui/ErrorState.tsx
"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertOctagon, RefreshCcw, Terminal } from "lucide-react";

export const ErrorState = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    // Log the breach to your internal monitoring system
    console.error("CRITICAL_SYSTEM_BREACH:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Red Alert Backdrop Pulse */}
      <motion.div
        animate={{ opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 bg-red-600 pointer-events-none"
      />

      {/* Hexagon Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />

      <div className="relative z-10 max-w-2xl w-full">
        {/* Error Header */}
        <div className="flex items-center gap-4 mb-8 border-l-4 border-red-500 pl-6">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <AlertOctagon
              size={48}
              className="text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]"
            />
          </motion.div>
          <div>
            <h1 className="text-4xl font-black text-slate-100 uppercase tracking-tighter italic">
              System_Critical_Failure
            </h1>
            <p className="text-red-500 font-mono text-[10px] tracking-[0.3em] font-bold uppercase">
              Core_Dump_Initialized // Error_ID:{" "}
              {error.digest || "UNKNOWN_NODE"}
            </p>
          </div>
        </div>

        {/* Diagnostic Terminal */}
        <div className="bg-slate-950/80 border border-red-500/20 rounded-lg p-6 font-mono mb-8 relative">
          <div className="absolute top-2 right-4 flex gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-red-500/50" />
            <div className="h-1.5 w-1.5 rounded-full bg-red-500/50" />
            <div className="h-1.5 w-1.5 rounded-full bg-red-500/50" />
          </div>

          <div className="space-y-2 text-xs md:text-sm">
            <p className="text-slate-500">
              {">"} Initializing diagnostic sub-routine...
            </p>
            <p className="text-red-400/80">
              {">"} EXCEPTION_THROWN:{" "}
              {error.message || "Segmentation fault at 0x00451"}
            </p>
            <p className="text-slate-500">
              {">"} Memory leak detected in neural-bridge-v4...
            </p>
            <p className="text-slate-500 animate-pulse">
              {">"} Awaiting manual override...
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col md:flex-row gap-4">
          <motion.button
            whileHover={{
              scale: 1.02,
              boxShadow: "0 0 20px rgba(239,68,68,0.2)",
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => reset()}
            className="flex-1 bg-red-600 hover:bg-red-500 text-white font-black uppercase text-[10px] tracking-[0.2em] py-4 rounded flex items-center justify-center gap-2 transition-all"
          >
            <RefreshCcw size={16} />
            Reboot_Kernel
          </motion.button>

          <motion.button
            whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            onClick={() => (window.location.href = "/")}
            className="flex-1 border border-slate-800 text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] py-4 rounded flex items-center justify-center gap-2 transition-all"
          >
            <Terminal size={16} />
            Return_to_Dashboard
          </motion.button>
        </div>

        {/* Footer Data */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex justify-between items-center opacity-30 font-mono text-[8px] text-slate-500 tracking-[0.5em] uppercase">
          <span>Shield_Status: 0%</span>
          <span>Connection: Unstable</span>
          <span>Security_Level: Blackout</span>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
