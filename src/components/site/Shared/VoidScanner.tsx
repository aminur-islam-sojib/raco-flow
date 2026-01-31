"use client";
import React from "react";
import { motion } from "framer-motion";
import { Radar, Radio } from "lucide-react";

export const VoidScanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex flex-col items-center justify-center min-h-screen w-full border border-slate-800/50 rounded-3xl bg-slate-900/10 overflow-hidden"
    >
      {/* Background Static/Noise Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://media.giphy.com/media/oEI9uWUPr9WUM/giphy.gif')]" />

      {/* 1. THE RADAR SCANNER */}
      <div className="relative mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="relative z-10 p-8 rounded-full border border-cyan-500/20 bg-cyan-500/5"
        >
          <Radar className="w-16 h-16 text-cyan-500/40" strokeWidth={1} />
        </motion.div>

        {/* Pulsing Sonar Rings */}
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{
              repeat: Infinity,
              duration: 3,
              delay: i,
              ease: "easeOut",
            }}
            className="absolute inset-0 rounded-full border border-cyan-500/30"
          />
        ))}
      </div>

      {/* 2. STATUS TERMINAL */}
      <div className="text-center z-10 px-6">
        <motion.h3
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ repeat: Infinity, duration: 0.15, repeatDelay: 3 }}
          className="text-cyan-500 font-mono text-sm font-black tracking-[0.3em] uppercase mb-3"
        >
          SYSTEM_STATUS: NO_ACTIVE_MISSIONS_DETECTED
        </motion.h3>

        <p className="text-slate-500 font-mono text-[10px] md:text-xs max-w-sm mx-auto leading-relaxed uppercase italic tracking-wider">
          The neural network is currently silent. Stand by for incoming
          transmissions from Buyers or re-verify uplink.
        </p>
      </div>

      {/* HUD Corner Accents */}
      <div className="absolute top-4 left-4 flex gap-1">
        <div className="w-1 h-1 bg-cyan-500/40" />
        <div className="w-4 h-px bg-cyan-500/40" />
      </div>
      <div className="absolute bottom-4 right-4 flex flex-col items-end gap-1">
        <div className="text-[8px] font-mono text-slate-700 tracking-widest uppercase">
          Freq: 2.4ghz_v_link
        </div>
        <Radio size={12} className="text-slate-800" />
      </div>
    </motion.div>
  );
};
