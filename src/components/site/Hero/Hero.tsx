"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { WorkflowStepper } from "./WorkflowStepper";

export function Hero() {
  const { scrollYProgress } = useScroll();
  const rotateX = useTransform(scrollYProgress, [0, 0.2], [15, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1]);

  return (
    <section className="relative pt-32 pb-20 overflow-hidden flex flex-col items-center">
      {/* Moving Particles/Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 mask-[underline-gradient(to_bottom,white,transparent)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-10 px-6"
      >
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight bg-linear-to-b from-white to-white/40 bg-clip-text text-transparent mb-6">
          Where Complex Visions <br /> Become Delivered Realities.
        </h1>
      </motion.div>

      {/* Floating 3D Dashboard with Moving Beam Border */}
      <motion.div
        style={{ rotateX, scale, perspective: 1000 }}
        className="relative mt-12 w-full max-w-5xl aspect-video rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-3xl overflow-hidden group"
      >
        {/* The Moving Beam Border */}
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-cyanAccent/50 to-transparent w-[200%] -translate-x-full group-hover:animate-beam" />

        <div className="absolute inset-1 bg-midnight rounded-xl overflow-hidden">
          {/* Mockup UI Content Goes Here */}

          <WorkflowStepper />
        </div>
      </motion.div>
    </section>
  );
}
