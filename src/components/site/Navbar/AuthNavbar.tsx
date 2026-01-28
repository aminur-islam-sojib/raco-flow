"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "../Shared/ThemeToggle";

export function AuthNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-100 px-6 py-4 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        {/* Back to Home with Hover Effect */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="group gap-2 rounded-full text-muted-foreground hover:text-cyan-500 hover:bg-cyan-500/5 transition-all"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline font-medium">Back to Home</span>
            </Button>
          </Link>
        </motion.div>

        {/* Minimal Logo / Brand Trigger */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 lg:hidden" // Only shows on mobile where Left Panel is hidden
        >
          <div className="h-6 w-6 rounded bg-cyan-600 dark:bg-cyan-400" />
          <span className="font-black tracking-tighter text-foreground">
            RACOFLOW
          </span>
        </motion.div>

        {/* Utility Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="h-8 w-px bg-border mx-2 hidden sm:block" />
          <ThemeToggle />
          <Link href="/help">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-dashed border-border hover:border-cyan-500 transition-colors"
            >
              Help
            </Button>
          </Link>
        </motion.div>
      </div>
    </nav>
  );
}
