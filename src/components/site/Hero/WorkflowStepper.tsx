import { useState } from "react";
import { motion } from "framer-motion";

const steps = ["Open", "Assigned", "Completed"];

export function WorkflowStepper() {
  const [status, setStatus] = useState("Open");

  return (
    <div className="py-24 max-w-4xl mx-auto px-6">
      <div className="flex justify-between mb-12 relative">
        {steps.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className="z-10 text-sm font-bold uppercase tracking-widest text-white/50 hover:text-cyanAccent transition-colors"
          >
            {s}
            {status === s && (
              <motion.div
                layoutId="activeStep"
                className="h-1 bg-cyanAccent mt-2 shadow-[0_0_10px_#22d3ee]"
              />
            )}
          </button>
        ))}
        <div className="absolute top-[2.1rem] left-0 w-full h-px bg-white/10" />
      </div>

      <motion.div
        layout
        className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-between"
      >
        <div>
          <motion.h3 layout className="text-2xl font-bold text-white">
            Project #742
          </motion.h3>
          <motion.p layout className="text-white/40">
            Complex ZIP Pipeline Submission
          </motion.p>
        </div>
        <motion.div
          animate={{
            backgroundColor: status === "Completed" ? "#22d3ee" : "#8b5cf6",
            scale: status === "Completed" ? 1.1 : 1,
          }}
          className="px-4 py-1 rounded-full text-midnight font-black text-xs uppercase"
        >
          {status}
        </motion.div>
      </motion.div>
    </div>
  );
}
