// components/promotion/AuthorizationModule.tsx
"use client";
import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Loader2 } from "lucide-react";

interface AuthorizationModuleProps {
  onAuthorize: () => void;
  isProcessing?: boolean;
}

export const AuthorizationModule: React.FC<AuthorizationModuleProps> = ({
  onAuthorize,
  isProcessing = false,
}) => {
  const holdTimeout = useRef<number | null>(null);

  const startHold = () => {
    if (isProcessing) return;
    // trigger after 1200ms hold
    holdTimeout.current = window.setTimeout(() => {
      holdTimeout.current = null;
      onAuthorize();
    }, 1200);
  };

  const cancelHold = () => {
    if (holdTimeout.current) {
      clearTimeout(holdTimeout.current);
      holdTimeout.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (holdTimeout.current) clearTimeout(holdTimeout.current);
    };
  }, []);

  return (
    <div className="relative group">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full scale-50 group-hover:scale-100 transition-transform duration-700 opacity-50" />

      <motion.button
        onPointerDown={startHold}
        onPointerUp={cancelHold}
        onPointerLeave={cancelHold}
        onPointerCancel={cancelHold}
        onMouseDown={startHold}
        onMouseUp={cancelHold}
        onTouchStart={startHold}
        onTouchEnd={cancelHold}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") startHold();
        }}
        onKeyUp={(e) => {
          if (e.key === " " || e.key === "Enter") cancelHold();
        }}
        disabled={isProcessing}
        className="relative z-10 w-40 h-40 rounded-full border-2 border-emerald-500/30 flex flex-col items-center justify-center bg-slate-950 hover:border-emerald-500 transition-all duration-300"
        tabIndex={0}
        role="button"
      >
        {isProcessing ? (
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        ) : (
          <>
            <div className="p-3 mb-2 rounded-full bg-emerald-500/10 text-emerald-500">
              <Lock size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
              Hold to Authorize
            </span>
          </>
        )}
      </motion.button>
    </div>
  );
};

export default AuthorizationModule;
