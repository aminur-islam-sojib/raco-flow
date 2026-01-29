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
  Clock,
  MoreVertical,
  Settings,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const statusConfig = {
    OPEN: "border-cyan-500/30 shadow-cyan-500/10 text-cyan-400",
    ASSIGNED: "border-amber-500/30 shadow-amber-500/10 text-amber-400",
    COMPLETED: "border-emerald-500/30 shadow-emerald-500/10 text-emerald-400",
  };

  const timeLeft = formatDistanceToNow(new Date(project.deadline), {
    addSuffix: true,
  });

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
            className="flex-1 bg-amber-500/10 hover:bg-amber-500 hover:text-black text-amber-400 border border-amber-500/20 font-bold text-xs h-9"
          >
            <Zap className="w-3.5 h-3.5 mr-2" /> MISSION LOGS
          </Link>
        )}
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 border-slate-800 hover:bg-slate-800"
        >
          <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
        </Button>
      </div>
    </motion.div>
  );
}
