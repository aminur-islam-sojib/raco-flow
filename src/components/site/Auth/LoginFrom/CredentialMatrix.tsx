// components/auth/CredentialMatrix.tsx
"use client";
import { ShieldAlert, User, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

const DEMO_ROLES = [
  {
    role: "ADMIN",
    id: "adm_root",
    icon: ShieldAlert,
    color: "text-red-500",
    border: "border-red-500/30",
  },
  {
    role: "BUYER",
    id: "byr_01",
    icon: Briefcase,
    color: "text-emerald-500",
    border: "border-emerald-500/30",
  },
  {
    role: "SOLVER",
    id: "slv_99",
    icon: User,
    color: "text-cyan-500",
    border: "border-cyan-500/30",
  },
];

export const CredentialMatrix = ({
  onInject,
}: {
  onInject: (role: string) => void;
}) => {
  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="h-px flex-1 bg-slate-800"></span>
        <span className="text-[8px] font-mono text-slate-600 uppercase tracking-[0.3em]">
          Quick_Inject_Auth
        </span>
        <span className="h-px flex-1 bg-slate-800"></span>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-6">
        {DEMO_ROLES.map((item) => (
          <motion.button
            key={item.role}
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(255,255,255,0.03)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onInject(item.role)}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border ${item.border} bg-slate-900/40 transition-all group`}
          >
            <item.icon
              className={`w-4 h-4 mb-1.5 ${item.color} group-hover:drop-shadow-[0_0_8px_currentColor]`}
            />
            <span
              className={`text-[9px] font-black tracking-widest ${item.color}`}
            >
              {item.role}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
