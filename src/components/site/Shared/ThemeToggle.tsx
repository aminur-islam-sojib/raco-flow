// components/theme-toggle.tsx
"use client";

import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering after mount
  // defer state update to avoid synchronous setState warning
  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);
  if (!mounted) return null;

  const handleThemeToggle = () => {
    const currentTheme = resolvedTheme || theme || "light";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };

  return (
    <button
      onClick={handleThemeToggle}
      className="    p-3 rounded-full bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-300 dark:border-slate-700 hover:border-cyan-400 transition-colors"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={resolvedTheme === "dark" ? "dark" : "light"}
          initial={{ y: -10, opacity: 0, rotate: -45 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 10, opacity: 0, rotate: 45 }}
          transition={{ duration: 0.2 }}
        >
          {resolvedTheme === "dark" ? (
            <Sun className="h-5 w-5 text-cyan-400" />
          ) : (
            <Moon className="h-5 w-5 text-slate-700" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
