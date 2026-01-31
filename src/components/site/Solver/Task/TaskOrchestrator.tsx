// components/mission/TaskOrchestrator.tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ZipUplink } from "./ZipUplink";

export const TaskOrchestrator = ({ taskId }: { taskId: string }) => {
  return (
    <div className="space-y-6">
      {/* Task Matrix */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="group flex items-center justify-between p-4 bg-slate-900/30 border border-slate-800 hover:border-cyan-500/50 transition-colors rounded-lg"
          >
            <ZipUplink taskId={taskId} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
