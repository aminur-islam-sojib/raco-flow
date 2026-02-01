"use client";
import { GlobalMetricsStrip } from "@/components/site/Admin/Overview/GlobalMetricsStrip";
import { LiveTransactionFeed } from "@/components/site/Admin/Overview/LiveTransactionFeed";
import { SystemIntegrityPanel } from "@/components/site/Admin/Overview/SystemIntegrityPanel";
import { UserDistributionSector } from "@/components/site/Admin/Overview/UserDistributionSector";
import { motion } from "framer-motion";

export default function AdminOverview() {
  return (
    <main className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-8 relative overflow-hidden">
      {/* Scanline Overlay Effect */}
      <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(to_bottom,transparent_50%,rgba(168,85,247,0.02)_50%)] bg-size-[100%_4px] animate-scanline" />

      {/* Terminal Unlock Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-400 mx-auto space-y-6"
      >
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase text-white flex items-center gap-3">
              <span className="w-2 h-8 bg-purple-600 rounded-full" />
              Operations_Overview
            </h1>
            <p className="text-[10px] font-mono text-slate-500 tracking-[0.4em] uppercase mt-1">
              Auth_Level: Principal_Admin // Sector: Zero
            </p>
          </div>
          <div className="flex gap-2 font-mono text-[10px]">
            <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-full animate-pulse">
              LIVE_SYSTEM_SYNC
            </span>
          </div>
        </header>

        <GlobalMetricsStrip />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <UserDistributionSector />
            <SystemIntegrityPanel />
          </div>
          <div className="lg:col-span-4">
            <LiveTransactionFeed />
          </div>
        </div>
      </motion.div>
    </main>
  );
}
