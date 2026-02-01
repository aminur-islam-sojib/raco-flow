// components/admin/CommandCenter.tsx
"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Zap,
  ShoppingBag,
  Activity,
  Users,
  CheckCircle2,
  Globe,
} from "lucide-react";

const DATA = {
  overview: {
    totalUsers: 11,
    activeMissions: 0,
    completedMissions: 2,
    netRevenue: 77,
    systemHealth: "OPTIMAL",
  },
  distribution: [
    {
      _id: "admin",
      count: 2,
      color: "text-purple-500",
      bg: "bg-purple-500",
      label: "Admin",
    },
    {
      _id: "solver",
      count: 3,
      color: "text-cyan-500",
      bg: "bg-cyan-500",
      label: "Solver",
    },
    {
      _id: "buyer",
      count: 5,
      color: "text-emerald-500",
      bg: "bg-emerald-500",
      label: "Buyer",
    },
    {
      _id: "user",
      count: 1,
      color: "text-slate-500",
      bg: "bg-slate-500",
      label: "User",
    },
  ],
};

// --- Sub-Component: Rolling Numbers ---
const RollingNumber = ({
  value,
  prefix = "",
}: {
  value: number;
  prefix?: string;
}) => (
  <motion.span
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="font-black italic"
  >
    {prefix}
    {value}
  </motion.span>
);

export default function AdminCommandCenter() {
  const [time, setTime] = useState(new Date());
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 md:p-12 relative overflow-hidden font-sans">
      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[size:100%_2px,3px_100%]" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* HEADER & CLOCK */}
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-slate-800 pb-6 gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white flex items-center gap-3">
              Command_Center{" "}
              <span className="text-xs font-mono text-cyan-500 not-italic tracking-[0.5em] mt-2">
                v1.5.0
              </span>
            </h1>
          </div>
          <div className="text-right font-mono">
            <p className="text-[10px] text-slate-500 tracking-widest uppercase mb-1 flex items-center justify-end gap-2">
              <Globe size={10} className="animate-spin-slow" />{" "}
              Satellite_Sync_Active
            </p>
            <p className="text-2xl text-cyan-400 tabular-nums drop-shadow-[0_0_8px_#22d3ee]">
              {time.toLocaleTimeString("en-US", { hour12: false })}
            </p>
          </div>
        </div>

        {/* VITALS HERO STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Revenue Pod */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-6 rounded-2xl group hover:border-emerald-500/50 transition-all duration-500">
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">
              Net_Revenue
            </p>
            <div className="text-4xl text-white">
              <span className="text-emerald-500 opacity-50 mr-1 inline-block animate-pulse">
                ₿
              </span>
              <RollingNumber value={DATA.overview.netRevenue} />
            </div>
          </div>

          {/* System Health Pod */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">
              System_Integrity
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xl font-bold text-emerald-400 tracking-tighter uppercase">
                {DATA.overview.systemHealth}
              </span>
              <div className="flex-1 h-8 overflow-hidden relative">
                <svg
                  className="absolute inset-0 w-full h-full stroke-emerald-500 opacity-50"
                  viewBox="0 0 100 40"
                >
                  <motion.path
                    d="M0 20 L20 20 L25 5 L35 35 L40 20 L100 20"
                    fill="none"
                    strokeWidth="2"
                    animate={{ x: [0, -20, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Mission Status Pod */}
          <div className="col-span-2 bg-slate-900/40 backdrop-blur-md border border-slate-800 p-6 rounded-2xl grid grid-cols-2 gap-4">
            <div className="opacity-40">
              <p className="text-[10px] font-mono text-slate-500 uppercase mb-1">
                Active
              </p>
              <div className="text-3xl font-black text-slate-400">
                {DATA.overview.activeMissions}
              </div>
            </div>
            <div className="border-l border-slate-800 pl-4">
              <p className="text-[10px] font-mono text-emerald-500/70 uppercase mb-1 flex items-center gap-1">
                <CheckCircle2 size={10} /> Completed
              </p>
              <div className="text-3xl font-black text-emerald-400 drop-shadow-[0_0_10px_#10b981]">
                {DATA.overview.completedMissions}
              </div>
            </div>
          </div>
        </div>

        {/* USER FLEET COMPOSITION (POWER BAR) */}
        <section className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-8 rounded-3xl">
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-xs font-mono text-slate-500 uppercase tracking-[0.4em]">
              User_Fleet_Composition
            </h3>
            <span className="text-2xl font-black italic">
              {DATA.overview.totalUsers}{" "}
              <span className="text-[10px] not-italic text-slate-600 tracking-widest">
                UNITS
              </span>
            </span>
          </div>

          {/* The Segmented Power Bar */}
          <div className="flex h-4 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5 gap-1">
            {DATA.distribution.map((role) => (
              <motion.div
                key={role._id}
                initial={{ width: 0 }}
                animate={{
                  width: `${(role.count / DATA.overview.totalUsers) * 100}%`,
                  boxShadow:
                    hoveredRole === role._id ? `0 0 15px currentColor` : "none",
                }}
                transition={{ duration: 1, ease: "circOut" }}
                className={`h-full rounded-sm ${role.bg} opacity-80 ${hoveredRole === role._id ? "opacity-100 scale-y-110" : ""}`}
              />
            ))}
          </div>

          {/* Legend Table */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {DATA.distribution.map((role) => {
              const Icon =
                role._id === "admin"
                  ? ShieldCheck
                  : role._id === "solver"
                    ? Zap
                    : role._id === "buyer"
                      ? ShoppingBag
                      : Users;
              return (
                <div
                  key={role._id}
                  onMouseEnter={() => setHoveredRole(role._id)}
                  onMouseLeave={() => setHoveredRole(null)}
                  className={`p-4 rounded-xl border border-transparent hover:border-slate-800 hover:bg-slate-950/50 transition-all cursor-crosshair group ${hoveredRole === role._id ? "ring-1 ring-slate-700" : ""}`}
                >
                  <div
                    className={`mb-2 ${role.color} group-hover:scale-110 transition-transform`}
                  >
                    <Icon size={20} />
                  </div>
                  <p className="text-[10px] text-slate-500 uppercase font-mono tracking-widest">
                    {role.label}
                  </p>
                  <p className="text-xl font-black text-white">{role.count}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
