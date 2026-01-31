// components/mission/ChrononsCountdown.tsx
"use client";
import { useEffect, useState } from "react";

export const ChronosCountdown = ({ deadline }: { deadline: string }) => {
  const [timeLeft, setTimeLeft] = useState({ h: "00", m: "00", s: "00" });

  useEffect(() => {
    const timer = setInterval(() => {
      const target = new Date(deadline).getTime();
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) return clearInterval(timer);

      setTimeLeft({
        h: Math.floor(distance / (1000 * 60 * 60))
          .toString()
          .padStart(2, "0"),
        m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
          .toString()
          .padStart(2, "0"),
        s: Math.floor((distance % (1000 * 60)) / 1000)
          .toString()
          .padStart(2, "0"),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  return (
    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-lg font-mono">
      <span className="text-[10px] text-cyan-500 uppercase tracking-[0.3em] block mb-1">
        Time to Extraction
      </span>
      <div className="text-3xl font-black text-amber-500 flex gap-1">
        <span>{timeLeft.h}</span>
        <span className="animate-pulse text-slate-700">:</span>
        <span>{timeLeft.m}</span>
        <span className="animate-pulse text-slate-700">:</span>
        <span>{timeLeft.s}</span>
      </div>
    </div>
  );
};
