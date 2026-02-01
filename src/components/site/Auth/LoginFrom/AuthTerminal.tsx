/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Mail, Fingerprint, Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CredentialMatrix } from "./CredentialMatrix";

export const AuthTerminal = () => {
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await loginWithCredentials();
  };

  const router = useRouter();

  const loginWithCredentials = async () => {
    try {
      toast.loading("Authenticating...");
      const res: any = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      toast.dismiss();

      if (res?.ok) {
        toast.success("Authentication successful");
        setIsLoading(false);
        // Give a moment for session to settle then navigate
        setTimeout(() => {
          router.refresh();
          router.push("/");
        }, 700);
        return;
      }

      // handle error from next-auth
      const errMsg = res?.error || "Invalid credentials";
      toast.error(errMsg);
    } catch (error: any) {
      toast.error(error?.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const injectCredentials = (role: string) => {
    const credentials: Record<string, any> = {
      ADMIN: { u: "admin@neural.net", p: "root_access_2026" },
      BUYER: { u: "buyer@hq.io", p: "secure_buy_99" },
      SOLVER: { u: "solver@void.run", p: "mission_ready_1" },
    };

    setEmail(credentials[role].u);
    setPassword(credentials[role].p);
    // Trigger a visual "Injection" effect
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 1000);
    // After injection, auto-attempt login
    setTimeout(() => {
      setIsLoading(true);
      loginWithCredentials();
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-10 w-full max-w-md bg-slate-900/40 border border-cyan-500/30 backdrop-blur-xl rounded-2xl p-8 shadow-[0_0_40px_rgba(6,182,212,0.1)]"
    >
      {/* Header with Biometric Visualizer */}
      <div className="flex flex-col items-center mb-8">
        <motion.div
          animate={
            isTyping ? { scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] } : {}
          }
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="p-4 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4"
        >
          <Fingerprint className="w-10 h-10 text-cyan-500" />
        </motion.div>
        <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">
          Neural_Gateway
        </h2>
        <span className="text-[9px] font-mono text-cyan-600 tracking-[0.3em] uppercase">
          Security_Clearance_Req
        </span>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono text-slate-500 ml-1 tracking-widest">
            [USR_IDENTITY]
          </label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-500" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setIsTyping(true)}
              onBlur={() => setIsTyping(false)}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-lg py-3 pl-10 pr-4 text-sm outline-none focus:border-cyan-500/50 transition-all text-slate-200"
              placeholder="IDENTITY_STRING@DOMAIN.COM"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono text-slate-500 ml-1 tracking-widest">
            [SEC_PASSCODE]
          </label>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-500" />
            <input
              type={showPass ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-lg py-3 pl-10 pr-12 text-sm outline-none focus:border-cyan-500/50 transition-all text-slate-200"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-cyan-400"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          disabled={isLoading}
          className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-black font-black uppercase text-xs tracking-[0.2em] rounded-lg transition-all flex items-center justify-center gap-2 group relative overflow-hidden"
        >
          {isLoading ? (
            <span className="animate-pulse">AUTHENTICATING...</span>
          ) : (
            <>
              <Shield size={16} />
              Establish_Connection
            </>
          )}
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>
      </form>

      <CredentialMatrix onInject={injectCredentials} />
    </motion.div>
  );
};
