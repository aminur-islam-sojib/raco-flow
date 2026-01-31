"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldAlert, Map, ChevronLeft, Terminal } from "lucide-react";

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 overflow-hidden relative">
      {/* Background Static Noise Effect */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://media.giphy.com/media/oEI9uWUPr9WUM/giphy.gif')] bg-cover" />

      {/* Main 404 Display */}
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative inline-block"
        >
          {/* Glitchy Text Layers */}
          <h1 className="text-[12rem] md:text-[16rem] font-black leading-none tracking-tighter text-slate-900 border-text">
            404
          </h1>
          <motion.div
            animate={{ x: [-2, 2, -1, 0], opacity: [0.8, 1, 0.9] }}
            transition={{ repeat: Infinity, duration: 0.1, repeatDelay: 2 }}
            className="absolute inset-0 flex items-center justify-center text-cyan-500/20 text-[12rem] md:text-[16rem] font-black leading-none tracking-tighter"
          >
            404
          </motion.div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
            <div className="flex items-center justify-center gap-4 text-cyan-500 drop-shadow-[0_0_15px_#06b6d4]">
              <ShieldAlert
                size={48}
                strokeWidth={1}
                className="animate-pulse"
              />
            </div>
          </div>
        </motion.div>

        {/* Tactical Messaging */}
        <div className="mt-8 space-y-4">
          <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tight text-slate-100">
            Sector_Not_Found
          </h2>
          <div className="flex flex-col items-center gap-2">
            <p className="text-slate-500 font-mono text-xs uppercase tracking-widest max-w-md mx-auto leading-relaxed">
              The coordinate you are attempting to reach is outside of
              authorized parameters. The signal has been lost in the{" "}
              <span className="text-cyan-600">Deep_Void</span>.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex flex-col md:flex-row items-center justify-center gap-4"
        >
          <Link href="/">
            <button className="group relative px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-black font-black uppercase text-[10px] tracking-[0.2em] transition-all flex items-center gap-2 rounded-sm overflow-hidden">
              <ChevronLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Return_to_Extraction_Point
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </Link>

          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 border border-slate-800 hover:border-cyan-500/50 text-slate-400 hover:text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 rounded-sm"
          >
            <Terminal size={14} />
            Re-Scan_Frequency
          </button>
        </motion.div>
      </div>

      {/* HUD Corner Elements */}
      <div className="absolute top-10 left-10 border-l border-t border-slate-800 w-12 h-12 opacity-50" />
      <div className="absolute top-10 right-10 border-r border-t border-slate-800 w-12 h-12 opacity-50" />
      <div className="absolute bottom-10 left-10 border-l border-b border-slate-800 w-12 h-12 opacity-50" />
      <div className="absolute bottom-10 right-10 border-r border-b border-slate-800 w-12 h-12 opacity-50" />

      <div className="absolute bottom-6 right-6 flex items-center gap-4 opacity-20 font-mono text-[8px] text-slate-500 tracking-[0.5em] uppercase">
        <Map size={12} />
        Coord: 0,0,0,0
      </div>
    </div>
  );
};

export default NotFound;
