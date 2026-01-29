// components/auth/auth-form.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence, cubicBezier } from "framer-motion";

const contentVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: cubicBezier(0.25, 0.46, 0.45, 0.94) },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.25, ease: cubicBezier(0.17, 0.67, 0.83, 0.67) },
  },
};

export function AuthForm() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Custom Tab Switcher */}
      <div className="relative flex p-1 bg-slate-200/50 dark:bg-slate-800/40 backdrop-blur-md rounded-xl border border-slate-300/50 dark:border-slate-700/50">
        <motion.div
          className="absolute inset-y-1 rounded-lg bg-white dark:bg-[#0f172a] shadow-sm"
          animate={{ x: activeTab === "login" ? "0%" : "100%", width: "50%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        <button
          onClick={() => setActiveTab("login")}
          className={`relative flex-1 py-2 text-sm font-medium z-10 ${activeTab === "login" ? "text-cyan-600 dark:text-cyan-400" : "text-slate-500"}`}
        >
          Login
        </button>
        <button
          onClick={() => setActiveTab("register")}
          className={`relative flex-1 py-2 text-sm font-medium z-10 ${activeTab === "register" ? "text-cyan-600 dark:text-cyan-400" : "text-slate-500"}`}
        >
          Register
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "login" ? (
          <motion.div
            key="login"
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            <LoginForm />
          </motion.div>
        ) : (
          <motion.div
            key="register"
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            <RegisterForm />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Sub-Components for Clean Code ---

<GoogleButton />;

import { GoogleButton } from "./GoogleButton";
import LoginForm from "./LoginFrom/LoginForm";
import RegisterForm from "./RegisterForm/RegisterForm";
