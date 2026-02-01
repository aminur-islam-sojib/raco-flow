/* eslint-disable @typescript-eslint/no-explicit-any */
// components/auth/RegisterTerminal.tsx
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  UserPlus,
  Lock,
  User,
  AtSign,
  ArrowRight,
  Briefcase,
  Zap,
} from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ROLES = [
  {
    id: "user",
    label: "User",
    icon: User,
    color: "text-slate-400",
    border: "border-slate-800",
    bg: "bg-slate-500/5",
  },
  {
    id: "solver",
    label: "Solver",
    icon: Zap,
    color: "text-cyan-400",
    border: "border-cyan-500/30",
    bg: "bg-cyan-500/5",
  },
  {
    id: "buyer",
    label: "Buyer",
    icon: Briefcase,
    color: "text-emerald-400",
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/5",
  },
];

export const RegisterTerminal = () => {
  const [role, setRole] = useState("user");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Dynamically change theme based on role
  const getThemeColor = () => {
    if (role === "solver") return "text-cyan-500";
    if (role === "buyer") return "text-emerald-500";
    return "text-slate-400";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative z-10 w-full max-w-lg bg-slate-900/40 border border-slate-800 backdrop-blur-xl rounded-2xl p-8 shadow-2xl"
    >
      {/* Role Selector: Clearance Level */}
      <div className="mb-8">
        <label className="text-[10px] font-mono text-slate-500 ml-1 tracking-[0.3em] uppercase mb-4 block">
          [SELECT_CLEARANCE_LEVEL]
        </label>
        <div className="grid grid-cols-3 gap-3">
          {ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRole(r.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-300 ${
                role === r.id
                  ? `${r.border} ${r.bg} scale-105 shadow-[0_0_15px_rgba(0,0,0,0.2)]`
                  : "border-slate-800 opacity-50 grayscale hover:grayscale-0 hover:opacity-100"
              }`}
            >
              <r.icon
                size={18}
                className={role === r.id ? r.color : "text-slate-600"}
              />
              <span
                className={`text-[9px] font-black uppercase mt-2 tracking-widest ${role === r.id ? r.color : "text-slate-600"}`}
              >
                {r.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Header */}
      <div className="mb-8 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <UserPlus
            className={`${getThemeColor()} w-6 h-6 transition-colors`}
          />
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">
            Init_{role}_Identity
          </h2>
        </div>
        <p className="text-[9px] font-mono text-slate-500 tracking-[0.3em] uppercase">
          Neural_Link // Protocol_{role}_v.2
        </p>
      </div>

      <form
        className="space-y-5"
        onSubmit={async (e) => {
          e.preventDefault();
          setIsLoading(true);
          toast.loading("Registering account...");
          try {
            const res: any = await signIn("credentials", {
              redirect: false,
              email: formData.email,
              password: formData.password,
              name: formData.username,
              role,
              isRegister: "true",
            });
            toast.dismiss();
            if (res?.ok) {
              toast.success("Registration successful");
              setTimeout(() => {
                router.push("/");
              }, 600);
              return;
            }
            toast.error(res?.error || "Registration failed");
          } catch (err: any) {
            toast.dismiss();
            toast.error(err?.message || "Registration failed");
          } finally {
            setIsLoading(false);
          }
        }}
      >
        <div className="space-y-1">
          <label className="text-[10px] font-mono text-slate-500 ml-1 tracking-widest uppercase">
            [Alias_ID]
          </label>
          <div className="relative group">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-500" />
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full bg-slate-950/50 border border-slate-800 rounded-lg py-3 pl-10 text-sm outline-none focus:border-slate-600 transition-all text-slate-200"
              placeholder={`Enter ${role} name...`}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-mono text-slate-500 ml-1 tracking-widest uppercase">
            [Comm_Uplink]
          </label>
          <div className="relative group">
            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-500" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full bg-slate-950/50 border border-slate-800 rounded-lg py-3 pl-10 text-sm outline-none focus:border-slate-600 transition-all text-slate-200"
              placeholder="id@network.com"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-mono text-slate-500 ml-1 tracking-widest uppercase">
            [Sec_Phrase]
          </label>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-500" />
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full bg-slate-950/50 border border-slate-800 rounded-lg py-3 pl-10 text-sm outline-none focus:border-slate-600 transition-all text-slate-200"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 bg-transparent border font-black uppercase text-xs tracking-[0.2em] rounded-lg transition-all flex items-center justify-center gap-2 group 
              ${
                role === "solver"
                  ? "border-cyan-500/50 text-cyan-500 hover:bg-cyan-500 hover:text-black shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                  : role === "buyer"
                    ? "border-emerald-500/50 text-emerald-500 hover:bg-emerald-500 hover:text-black shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                    : "border-slate-500/50 text-slate-400 hover:bg-slate-500 hover:text-white"
              }`}
          >
            {isLoading ? "Registering..." : `Confirm_${role}_Sync`}
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
          Node connected //{" "}
          <a
            href="/login"
            className="text-slate-400 hover:text-white underline"
          >
            Return_to_Login
          </a>
        </p>
      </div>
    </motion.div>
  );
};
