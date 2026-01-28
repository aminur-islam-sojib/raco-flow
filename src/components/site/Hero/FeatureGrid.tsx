import { FileArchive, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-7xl mx-auto px-6 py-20">
      {/* Role-Based Control Card */}
      <div className="md:col-span-2 relative group overflow-hidden rounded-3xl border border-border bg-card p-8">
        <div className="absolute top-0 right-0 p-4 opacity-10 text-primary">
          <ShieldCheck size={120} />
        </div>
        <h3 className="text-2xl font-bold mb-2">Role-Based Control</h3>
        <p className="text-muted-foreground text-sm max-w-62.5">
          Switch between Buyer and Solver interfaces with zero latency.
        </p>
        <div className="mt-6 flex gap-2 p-1 bg-muted rounded-full w-fit border border-border">
          <button className="px-4 py-1.5 rounded-full bg-background text-xs font-bold shadow-sm">
            Buyer
          </button>
          <button className="px-4 py-1.5 rounded-full text-xs font-bold text-muted-foreground">
            Solver
          </button>
        </div>
      </div>

      {/* Secure Delivery Card */}
      <div className="rounded-3xl border border-border bg-card p-8 flex flex-col justify-between group hover:border-primary/50 transition-colors">
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary"
        >
          <FileArchive />
        </motion.div>
        <div>
          <h4 className="font-bold">Secure ZIP</h4>
          <p className="text-xs text-muted-foreground">SHA-256 Verification</p>
        </div>
      </div>

      {/* Live Feed Card */}
      <div className="rounded-3xl border border-border bg-card p-8 overflow-hidden">
        <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-4">
          Live Activity
        </h4>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-2 border-b border-border last:border-0"
            >
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <div className="text-[10px] font-mono opacity-60 uppercase">
                Incoming Req...
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
