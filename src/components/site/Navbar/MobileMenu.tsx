// components/navbar/MobileMenu.tsx
"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { ArrowRight, X } from "lucide-react";
import { NavItem } from "@/components/Types/nav";

interface MobileMenuProps {
  navItems: NavItem[];
  setIsOpen: (open: boolean) => void;
}

// Stagger variants for the container and children
const containerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 10 },
};

export function MobileMenu({ navItems, setIsOpen }: MobileMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-60 bg-background/80 backdrop-blur-2xl md:hidden"
    >
      {/* Close Header */}
      <div className="flex justify-end p-6">
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 rounded-full bg-muted border border-border"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <motion.nav
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="flex flex-col items-center justify-center space-y-8 h-[70vh]"
      >
        {navItems.map((item) => (
          <motion.div key={item.href} variants={itemVariants}>
            <Link
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="text-3xl font-bold tracking-tighter hover:text-cyan-500 transition-colors"
            >
              {item.label}
            </Link>
          </motion.div>
        ))}

        {/* Separator Line */}
        <motion.div variants={itemVariants} className="w-12 h-px bg-border" />

        {/* Bottom Actions */}
        <motion.div variants={itemVariants} className="w-full px-12 space-y-4">
          <Button
            className="w-full rounded-2xl bg-cyan-500 text-midnight font-bold py-6 group"
            onClick={() => setIsOpen(false)}
          >
            Get Started
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-center text-xs text-muted-foreground uppercase tracking-widest font-semibold">
            RacoFlow Enterprise
          </p>
        </motion.div>
      </motion.nav>

      {/* Futuristic Background Decoration */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-linear-to-t from-cyan-500/10 to-transparent pointer-events-none" />
    </motion.div>
  );
}
