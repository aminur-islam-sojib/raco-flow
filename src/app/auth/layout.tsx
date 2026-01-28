// components/auth/auth-layout.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Zap, Shield, Workflow } from "lucide-react";

const features = [
  { title: "Secure ZIP Submissions", icon: <Shield className="w-5 h-5" /> },
  { title: "Role-Based Workflow", icon: <Workflow className="w-5 h-5" /> },
  { title: "Electric Speed", icon: <Zap className="w-5 h-5" /> },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((prev) => (prev + 1) % features.length),
      3000,
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-500">
      {/* Left Side: Branding & Carousel (Hidden on Mobile) */}
      <div className="relative hidden w-0 flex-1 lg:block bg-linear-to-br from-[#020617] via-[#0f172a] to-[#1e293b]">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="relative z-10 flex h-full flex-col p-12 text-white">
          <div className="flex items-center gap-2 text-2xl font-bold tracking-tight text-cyan-400">
            <div className="h-8 w-8 rounded-lg bg-cyan-400" />
            RacoFlow
          </div>

          <div className="mt-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex items-center gap-3 text-2xl font-medium"
              >
                <span className="text-cyan-400">{features[index].icon}</span>
                {features[index].title}
              </motion.div>
            </AnimatePresence>
            <p className="mt-4 text-slate-400 max-w-md">
              The enterprise-grade engine for modern problem solvers and
              high-velocity workflows.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto w-full max-w-md"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
