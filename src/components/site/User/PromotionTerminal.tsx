"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { FeatureUplink } from "./FeatureUplink";
import { ClearanceHeader } from "./ClearanceHeader";
import { AuthorizationModule } from "./AuthorizationModule";
import { SuccessOverlay } from "./SuccessOverlay";

export default function PromotionPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [status, setStatus] = useState<"IDLE" | "PROCESSING" | "GRANTED">(
    "IDLE",
  );
  const [error, setError] = useState<string>("");

  const handlePromotion = async () => {
    if (!session?.user?.id) {
      setError("User session not found. Please log in.");
      return;
    }

    setStatus("PROCESSING");
    setError("");

    console.log("Client /promote - session.user.id:", session.user.id);

    try {
      const res = await fetch("/api/admin/promote", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ targetUserId: session.user.id }),
      });

      console.log("Client /promote - Response status:", res.status);

      if (res.ok) {
        setStatus("GRANTED");
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.log("Client /promote - Error data:", errorData);
        setError(
          errorData.error || "Failed to promote user. Please try again.",
        );
        setStatus("IDLE");
      }
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Network error. Please try again.",
      );
      setStatus("IDLE");
    }
  };

  if (sessionStatus === "loading") {
    return (
      <main className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-emerald-500">Loading...</div>
      </main>
    );
  }

  if (sessionStatus === "unauthenticated") {
    return (
      <main className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-red-500">Not authenticated. Please log in.</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#020617] text-slate-200 flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background Decorative Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent pointer-events-none" />

      <AnimatePresence mode="wait">
        {status !== "GRANTED" ? (
          <motion.div
            key="terminal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-0 bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl"
          >
            {/* Left Column: Visual & Features (Desktop Only Side) */}
            <div className="lg:col-span-5 p-8 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-900/20">
              <div className="mb-8">
                <h2 className="text-emerald-500 font-mono text-[10px] tracking-[0.4em] uppercase mb-2">
                  Authority_Expansion
                </h2>
                <h1 className="text-3xl font-black italic tracking-tighter uppercase">
                  Buyer <br />
                  <span className="text-slate-500">Clearance</span>
                </h1>
              </div>
              <FeatureUplink />
            </div>

            {/* Right Column: Interaction Zone */}
            <div className="lg:col-span-7 p-8 md:p-12 flex flex-col items-center justify-center bg-linear-to-br from-transparent to-emerald-500/5">
              <ClearanceHeader currentRank="Solver" />

              <div className="my-10">
                <AuthorizationModule
                  onAuthorize={handlePromotion}
                  isProcessing={status === "PROCESSING"}
                />
              </div>

              {error && (
                <div className="text-center text-red-500 text-sm mb-4">
                  {error}
                </div>
              )}

              <div className="text-center">
                <p className="text-[9px] text-slate-500 uppercase tracking-widest leading-relaxed max-w-xs">
                  Note: Elevating clearance will modify your account permissions
                  to <span className="text-emerald-500">PROCURER_LEVEL_01</span>
                  .
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <SuccessOverlay key="success" />
        )}
      </AnimatePresence>
    </main>
  );
}
