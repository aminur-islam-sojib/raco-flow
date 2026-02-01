"use client";
import { AuthTerminal } from "@/components/site/Auth/LoginFrom/AuthTerminal";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Moving Grid Background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <motion.div
          animate={{ y: [0, -40] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d4_1px,transparent_1px),linear-gradient(to_bottom,#06b6d4_1px,transparent_1px)] bg-size-[80px_80px] opacity-10"
        />
      </div>

      <AnimatePresence>
        <AuthTerminal />
      </AnimatePresence>

      {/* Footer Meta-Data */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-8 font-mono text-[8px] text-slate-600 tracking-[0.4em] uppercase">
        <span>Node: 0x912...A1</span>
        <span>Secure_Handshake: Active</span>
        <span>Neural_Link: Stable</span>
      </div>
    </main>
  );
}
