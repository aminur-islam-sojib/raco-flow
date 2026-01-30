// components/AssignmentModal.tsx
import { motion, AnimatePresence } from "framer-motion";
import { UserCheck, AlertCircle, Loader2 } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  isAssigning: boolean;
  isSuccess: boolean;
  agentName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const AssignmentModal = ({
  isOpen,
  isAssigning,
  isSuccess,
  agentName,
  onClose,
  onConfirm,
}: ModalProps) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => !isAssigning && onClose()}
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-8 shadow-2xl"
        >
          {isSuccess ? (
            <div className="text-center py-10">
              <div className="mx-auto h-20 w-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                <UserCheck size={40} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Mission Assigned
              </h2>
              <p className="text-slate-400">
                Handshaking complete. Data synced.
              </p>
            </div>
          ) : (
            <>
              <div className="h-12 w-12 bg-cyan-500/10 text-cyan-500 rounded-xl flex items-center justify-center mb-6">
                <AlertCircle size={28} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Confirm Solver Assignment?
              </h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                You are assigning{" "}
                <span className="text-white font-bold">{agentName}</span> to
                this mission. This action will transition the mission to{" "}
                <span className="text-cyan-400 font-mono uppercase tracking-tighter">
                  Assigned
                </span>{" "}
                state.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  disabled={isAssigning}
                  onClick={onConfirm}
                  className="w-full flex cursor-pointer items-center justify-center gap-2 py-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all disabled:opacity-50"
                >
                  {isAssigning ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    "CONFIRM & AUTHORIZE"
                  )}
                </button>
                {!isAssigning && (
                  <button
                    onClick={onClose}
                    className="w-full py-2 cursor-pointer text-slate-500 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </>
          )}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
