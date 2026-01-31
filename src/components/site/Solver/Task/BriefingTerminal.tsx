// components/mission/BriefingTerminal.tsx
"use client";
import { Terminal } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export const BriefingTerminal = ({ description }: { description: string }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(description.slice(0, i));
      i++;
      if (i > description.length) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, [description]);

  return (
    <div className="backdrop-blur-md bg-slate-900/40 border border-slate-800 p-6 rounded-xl relative overflow-hidden">
      <div className="flex items-center gap-2 mb-4 text-slate-500 uppercase text-[10px] tracking-widest">
        <Terminal size={14} className="text-cyan-500" />
        <span>Inbound_Transmission.exe</span>
      </div>
      <p className="text-slate-300 font-mono text-sm leading-relaxed min-h-25">
        {displayedText}
        <motion.span
          animate={{ opacity: [0, 1] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block w-2 h-4 bg-cyan-500 ml-1 align-middle"
        />
      </p>
    </div>
  );
};
