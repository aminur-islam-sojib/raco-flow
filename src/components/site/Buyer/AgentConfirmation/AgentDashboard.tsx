/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import type {
  ProjectWithApplicantsClient,
  AgentDetail,
} from "@/components/Types/project.types";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  UserCheck,
  Loader2,
  AlertCircle,
  Cpu,
} from "lucide-react";

export default function ProjectApplicantsPage({
  projectData,
}: {
  projectData: ProjectWithApplicantsClient | null;
}) {
  const [selectedAgent, setSelectedAgent] = useState<AgentDetail | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAuthorize = async () => {
    setIsAssigning(true);
    // Simulate Blockchain/API assignment delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsAssigning(false);
    setSuccess(true);
    setTimeout(() => {
      setIsConfirming(false);
      setSuccess(false);
      setSelectedAgent(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 md:p-12 font-sans selection:bg-cyan-500/30">
      {/* 1. PROJECT HEADER */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto mb-12 border-b border-slate-800 pb-8 relative"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-cyan-500 font-mono text-xs tracking-widest uppercase">
                {projectData?.category}
              </span>
              <span className="h-1 w-1 rounded-full bg-slate-700" />
              <span className="text-slate-500 font-mono text-xs">
                {projectData?.budget}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight">
              {projectData?.title}
            </h1>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
            <span className="font-mono text-xs font-bold text-cyan-400">
              {projectData?.status} — {projectData?.agentDetails.length}{" "}
              APPLICANTS DETECTED
            </span>
          </div>
        </div>
      </motion.header>

      {/* 2. AGENT DOSSIER CARDS */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
        }}
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {projectData?.agentDetails.map((agent) => (
          <motion.div
            key={agent._id}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{ y: -5, rotateX: 2, rotateY: -2 }}
            className="group relative p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl hover:border-cyan-500/50 transition-all duration-300 overflow-hidden"
          >
            {/* Background Texture */}
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Cpu size={80} />
            </div>

            <div className="flex items-start justify-between mb-6">
              <div className="relative">
                <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-cyan-500/30 p-1">
                  <div className="absolute inset-0 rounded-full border border-cyan-400 animate-[spin_4s_linear_infinite] border-t-transparent border-l-transparent" />
                  <img
                    src={agent.image}
                    alt={agent.name}
                    className="h-full w-full rounded-full bg-slate-800"
                  />
                </div>
                {agent.isActive && (
                  <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-[#020617] bg-emerald-500">
                    <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
                  </div>
                )}
              </div>
              <span className="font-mono text-[10px] text-slate-500 bg-slate-800/50 px-2 py-1 rounded">
                ID: {agent._id}
              </span>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white group-hover:text-cyan-400 transition-colors">
                {agent.name}
              </h3>
              <p className="text-sm text-slate-400 font-mono">{agent.email}</p>
            </div>

            <button
              onClick={() => {
                setSelectedAgent(agent);
                setIsConfirming(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-cyan-600 text-white font-bold text-sm transition-all active:scale-95"
            >
              <ShieldCheck size={18} />
              AUTHORIZE ASSIGNMENT
            </button>
          </motion.div>
        ))}
      </motion.div>

      {/* 3. CONFIRMATION MODAL */}
      <AnimatePresence>
        {isConfirming && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => !isAssigning && setIsConfirming(false)}
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-8 shadow-2xl"
            >
              {success ? (
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="text-center py-10"
                >
                  <div className="mx-auto h-20 w-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                    <UserCheck size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Mission Assigned
                  </h2>
                  <p className="text-slate-400">
                    Handshaking complete. Data synced.
                  </p>
                </motion.div>
              ) : (
                <>
                  <div className="h-12 w-12 bg-cyan-500/10 text-cyan-500 rounded-xl flex items-center justify-center mb-6">
                    <AlertCircle size={28} />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Confirm Solver Assignment?
                  </h2>
                  <p className="text-slate-400 mb-8 leading-relaxed">
                    You are assigning{" "}
                    <span className="text-white font-bold">
                      {selectedAgent?.name}
                    </span>{" "}
                    to this mission. This action will transition the mission to{" "}
                    <span className="text-cyan-400 font-mono">ASSIGNED</span>{" "}
                    state.
                  </p>

                  <div className="flex flex-col gap-3">
                    <button
                      disabled={isAssigning}
                      onClick={handleAuthorize}
                      className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {isAssigning ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          ENCRYPTING ACCESS...
                        </>
                      ) : (
                        "CONFIRM & AUTHORIZE"
                      )}
                    </button>
                    <button
                      disabled={isAssigning}
                      onClick={() => setIsConfirming(false)}
                      className="w-full py-4 text-slate-500 hover:text-white font-medium transition-colors"
                    >
                      Cancel Initialization
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
