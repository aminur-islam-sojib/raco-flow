"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FeatureGrid } from "./FeatureGrid";
import Link from "next/link";

export function HeroSection() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden bg-background transition-colors duration-500">
      {/* Dynamic Background Grid */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center space-y-6 px-6"
      >
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
          Where Complex Visions <br />
          <span className="text-primary drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
            Become Realities
          </span>
        </h1>
        <p className="text-muted-foreground max-w-150 mx-auto text-lg">
          RacoFlow is the high-velocity engine for modern teams to ship complex
          workflows with precision.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href={"/auth"}>
            <Button
              size="lg"
              className="rounded-full px-8 cursor-pointer shadow-[0_0_20px_rgba(34,211,238,0.3)]"
            >
              Get Started
            </Button>
          </Link>
          <Link href={"/solver/marketplace"}>
            <Button size="lg" variant="outline" className="rounded-full px-8">
              View Marketplace
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* 3D Dashboard Mockup with Beam Border */}
      <motion.div
        style={{ y }}
        className="relative mt-16 w-full max-w-5xl group"
      >
        {/* The "Moving Beam" Border */}
        <div className="absolute -inset-px bg-linear-to-r from-transparent via-primary to-transparent rounded-xl opacity-30 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity" />

        <div className="relative rounded-xl border border-border bg-card shadow-2xl overflow-hidden backdrop-blur-md">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/50">
            <div className="w-3 h-3 rounded-full bg-red-500/20" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
            <div className="w-3 h-3 rounded-full bg-green-500/20" />
          </div>
          {/* <div className="aspect-video bg-[url('/mockup.png')] bg-cover opacity-80" /> */}
          <FeatureGrid />
        </div>
      </motion.div>
    </section>
  );
}
