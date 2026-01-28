"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { motion } from "framer-motion";

export function BentoGrid() {
  const [view, setView] = useState<"Buyer" | "Solver">("Buyer");

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-6 pb-40">
      {/* Live Request Feed */}
      <div className="md:col-span-2 h-75 rounded-3xl border border-white/10 bg-white/5 p-6 overflow-hidden relative">
        <h4 className="text-white/60 text-sm font-bold mb-4 uppercase tracking-tighter">
          Live Request Feed
        </h4>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              className="p-4 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center"
            >
              <span className="text-white text-sm">
                New Pipeline Submission
              </span>
              <span className="text-cyanAccent text-xs">$2,400.00</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Role-Based Control */}
      <div className="h-75 rounded-3xl border border-white/10 bg-linear-to-br from-violetAccent/20 to-transparent p-6 flex flex-col justify-between">
        <div>
          <h4 className="text-white font-bold text-xl">Dynamic Interface</h4>
          <p className="text-white/40 text-sm">Instant UI context switching.</p>
        </div>
        <div className="flex bg-midnight p-1 rounded-full border border-white/10">
          {["Buyer", "Solver"].map((r) => (
            <button
              key={r}
              onClick={() => setView(r as any)}
              className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${view === r ? "bg-white text-midnight" : "text-white"}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Secure Delivery Card */}
      <div className="md:col-span-3 h-50 rounded-3xl border border-white/10 bg-white/5 flex items-center justify-center gap-12 group">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-16 h-16 bg-cyanAccent/20 rounded-2xl flex items-center justify-center"
        >
          <div className="text-3xl">📦</div>
        </motion.div>
        <div className="text-left">
          <h4 className="text-2xl font-bold text-white">Secure ZIP Delivery</h4>
          <p className="text-white/40">
            Encrypted end-to-end with SHA-256 verification.
          </p>
        </div>
      </div>
    </section>
  );
}
