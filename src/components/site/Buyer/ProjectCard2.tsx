"use client";

import { Project } from "./ProjectList";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Archive,
  CheckCircle2,
  Clock,
  CloudUpload,
  MoreVertical,
  RefreshCw,
  Settings,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

export function ProjectCard2({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const statusConfig = {
    OPEN: "border-cyan-500/30 shadow-cyan-500/10 text-cyan-400",
    ASSIGNED: "border-amber-500/30 shadow-amber-500/10 text-amber-400",
    SUBMITTED: "border-indigo-500/30 shadow-indigo-500/10 text-indigo-400",
    COMPLETED: "border-emerald-500/30 shadow-emerald-500/10 text-emerald-400",
  };

  const timeLeft = formatDistanceToNow(new Date(project.deadline), {
    addSuffix: true,
  });

  console.log(project);

  const confirmUplink = async (taskId: string) => {
    if (!taskId) {
      console.error("❌ No taskId provided");
      return;
    }
    try {
      console.log("📤 Confirming uplink for taskId:", taskId);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/task/confirm`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ taskId }),
        },
      );

      console.log("Response status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API error: ${res.status} ${errorText}`);
      }

      const result = await res.json();
      console.log("✅ Confirmation result:", result);

      // Optional: Trigger a refresh or toast notification here
      if (result.success) {
        console.log("✅ Project status updated to CONFIRMED");
        // Could add: window.location.reload() or call a refresh function
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      console.error("❌ Confirm uplink error:", msg);
    }
  };

  const handleConfirmUplink = (taskId: string) => {
    console.log("click", taskId);
    confirmUplink(taskId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, rotateX: 2, rotateY: -2 }}
      className={`relative group bg-slate-900/40 backdrop-blur-xl border-l-4 ${statusConfig[project.status]} p-6 rounded-xl border border-r-slate-800 border-t-slate-800 border-b-slate-800 overflow-hidden`}
    >
      {/* Decorative Glow */}
      <div
        className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-10 transition-opacity group-hover:opacity-20 ${
          project.status === "OPEN"
            ? "bg-cyan-500"
            : project.status === "ASSIGNED"
              ? "bg-amber-500"
              : "bg-emerald-500"
        }`}
      />

      <div className="flex justify-between items-start mb-4">
        <Badge
          variant="outline"
          className="font-mono text-[10px] tracking-widest border-slate-700 bg-slate-950/50"
        >
          {project.category}
        </Badge>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-500 hover:text-white"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-slate-900 border-slate-800 text-slate-200"
          >
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="w-4 h-4 mr-2" /> Edit Specs
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-red-400">
              <Archive className="w-4 h-4 mr-2" /> Decommission
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors leading-tight">
        {project.title}
      </h3>

      <p className="text-slate-400 text-sm line-clamp-2 mb-6 font-medium leading-relaxed">
        {project.description}
      </p>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-slate-500 font-bold tracking-tighter">
            Bounty
          </span>
          <span className="text-lg font-black text-white flex items-center gap-1">
            <span className="text-cyan-500">$</span>
            {project.budget.toLocaleString()}
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4] animate-pulse ml-2" />
          </span>
        </div>
        <div className="w-px h-8 bg-slate-800" />
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-slate-500 font-bold tracking-tighter">
            Exfil Date
          </span>
          <span className="text-sm font-mono text-slate-200 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-500" /> {timeLeft}
          </span>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800/50 flex gap-2">
        {project.status === "OPEN" && (
          <Link
            href={`/buyer/projects/${project._id}/agents`}
            className="flex-1 bg-cyan-500/10 hover:bg-cyan-500 hover:text-black text-cyan-400 border border-cyan-500/20 font-bold text-xs h-9 text-center flex items-center gap-2 justify-center rounded-md"
          >
            <Users className="w-3.5 h-3.5 mr-2" /> VIEW AGENTS
          </Link>
        )}
        {project.status === "ASSIGNED" && (
          <Link
            href={`/buyer/projects/${project._id}/logs`}
            className="flex-1 flex justify-center items-center rounded-md bg-amber-500/10 hover:bg-amber-500 hover:text-black text-amber-400 border border-amber-500/20 font-bold text-xs h-9"
          >
            <Zap className="w-3.5 h-3.5 mr-2" /> MISSION LOGS
          </Link>
        )}
        {project.status === "COMPLETED" && (
          <Button
            className="flex-1 flex justify-center items-center gap-2 rounded-md 
               bg-emerald-500/10 hover:bg-emerald-500 hover:text-black 
               text-emerald-400 border border-emerald-500/30 
               font-black text-[10px] tracking-widest h-9 
               shadow-[0_0_15px_rgba(16,185,129,0.1)] 
               transition-all duration-300 group"
          >
            {/* Pulsing Success Indicator */}
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>

            <span className="uppercase">Mission Accomplished</span>

            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
            </motion.div>
          </Button>
        )}

        {project.status === "SUBMITTED" && (
          <Button
            onClick={() => handleConfirmUplink(project?._id)}
            className="flex-1 flex justify-center items-center gap-2 rounded-md 
               bg-indigo-500/10 hover:bg-indigo-500/20 
               text-indigo-400 border border-indigo-500/40 
               font-black text-[10px] tracking-[0.2em] h-9 
               shadow-[0_0_15px_rgba(99,102,241,0.1)] 
               transition-all duration-500 group relative overflow-hidden"
          >
            {/* Animated Background Mesh */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(99,102,241,0.05)_50%,transparent_75%)] bg-size-[250%_250%] animate-[gradient_3s_linear_infinite]" />

            {/* Status Icon with Scanning Effect */}
            <div className="relative flex items-center justify-center">
              <CloudUpload className="w-4 h-4 z-10" />
              <motion.div
                className="absolute w-full h-px bg-indigo-400 shadow-[0_0_8px_#6366f1]"
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </div>

            <span className="uppercase italic relative z-10">
              Uplink_Confirmed
            </span>

            {/* Micro-loader icon */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="relative z-10"
            >
              <RefreshCw className="w-3 h-3 opacity-50" />
            </motion.div>
          </Button>
        )}
      </div>
    </motion.div>
  );
}
