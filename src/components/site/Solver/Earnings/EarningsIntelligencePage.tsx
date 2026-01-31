"use client";

import { NoSubmissions } from "@/components/site/Buyer/NoSubmissions"; // Reusing your empty state logic
import { motion } from "framer-motion";
import { TotalRevenueVault } from "./TotalRevenueVault";
import { MissionRevenueCard } from "./MissionRevenueCard";

const data = {
  totalRevenue: 77,
  completedMissions: [
    { title: "Neural Link Encryption", budget: 34, id: "tx_001" },
    { title: "Sub-Layer Node Breach", budget: 43, id: "tx_002" },
  ],
};

export default function EarningsIntelligencePage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  return (
    <main className="min-h-screen bg-[#020617] text-slate-200 p-6">
      <div className="max-w-6xl mx-auto">
        <TotalRevenueVault amount={data.totalRevenue} />

        <div className="mt-12">
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-[10px] tracking-[0.5em] uppercase text-slate-500 font-bold">
              Transaction_History
            </h2>
            <div className="h-px flex-1 mx-8 bg-slate-800" />
          </div>

          {data.completedMissions.length > 0 ? (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {data.completedMissions.map((mission) => (
                <MissionRevenueCard key={mission.id} mission={mission} />
              ))}
            </motion.div>
          ) : (
            <NoSubmissions />
          )}
        </div>
      </div>
    </main>
  );
}
