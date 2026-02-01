// components/admin/GlobalMetricsStrip.tsx
"use client";
import { motion } from "framer-motion";
import { Users, Globe, Zap, TrendingUp, TrendingDown } from "lucide-react";

const METRICS = [
  {
    label: "TOTAL_USERS",
    value: "12,842",
    trend: "+12%",
    isUp: true,
    icon: Users,
    color: "text-blue-500",
    sparkline: [20, 40, 35, 50, 45, 60, 55],
  },
  {
    label: "ACTIVE_MISSIONS",
    value: "412",
    trend: "-3%",
    isUp: false,
    icon: Zap,
    color: "text-purple-500",
    sparkline: [60, 50, 55, 40, 45, 30, 35],
  },
  {
    label: "NET_REVENUE",
    value: "84.2k",
    trend: "+24%",
    isUp: true,
    icon: TrendingUp,
    color: "text-emerald-500",
    sparkline: [10, 20, 15, 30, 45, 60, 80],
  },
  {
    label: "SYSTEM_UPTIME",
    value: "99.99%",
    trend: "STABLE",
    isUp: true,
    icon: Globe,
    color: "text-cyan-500",
    sparkline: [100, 100, 99, 100, 100, 100, 100],
  },
];

export const GlobalMetricsStrip = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {METRICS.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group hover:border-purple-500/30 transition-colors"
        >
          {/* Subtle Glow Background */}
          <div
            className={`absolute -right-4 -top-4 w-24 h-24 blur-3xl opacity-10 rounded-full transition-colors ${metric.color.replace("text", "bg")}`}
          />

          <div className="flex justify-between items-start mb-4">
            <div
              className={`p-2 rounded-lg bg-slate-950 border border-slate-800 ${metric.color}`}
            >
              <metric.icon size={18} />
            </div>
            <div className="text-right">
              <p className="text-[10px] font-mono text-slate-500 tracking-widest uppercase mb-1">
                {metric.label}
              </p>
              <h3 className="text-2xl font-black text-white tracking-tighter italic">
                {metric.value}
              </h3>
            </div>
          </div>

          <div className="flex items-end justify-between gap-4">
            {/* Sparkline visualization */}
            <div className="flex items-end gap-1 h-8 flex-1">
              {metric.sparkline.map((val, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${val}%` }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className={`w-full rounded-t-[1px] ${metric.isUp ? "bg-blue-500/40" : "bg-red-500/40"}`}
                />
              ))}
            </div>

            <div
              className={`flex items-center gap-1 font-mono text-[10px] font-bold ${metric.isUp ? "text-emerald-500" : "text-red-500"}`}
            >
              {metric.isUp ? (
                <TrendingUp size={10} />
              ) : (
                <TrendingDown size={10} />
              )}
              {metric.trend}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
