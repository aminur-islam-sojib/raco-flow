/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useRef } from "react";
import { useInView, motion, useSpring, useTransform } from "framer-motion";

export function Counter({
  value,
  prefix = "",
}: {
  value: number;
  prefix?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(
    spring,
    (current) => `${prefix}${Math.round(current).toLocaleString()}`,
  );

  useEffect(() => {
    if (isInView) spring.set(value);
  }, [isInView, value, spring]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

export function StatCard({ label, value, prefix, icon: Icon }: any) {
  return (
    <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 backdrop-blur-xl group hover:border-cyan-500/50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg bg-slate-950/50 text-cyan-400 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all">
          <Icon size={24} />
        </div>
        <div>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">
            {label}
          </p>
          <h3 className="text-3xl font-bold text-slate-100">
            <Counter value={value} prefix={prefix} />
          </h3>
        </div>
      </div>
    </div>
  );
}
