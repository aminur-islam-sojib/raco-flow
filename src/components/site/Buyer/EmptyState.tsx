import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-slate-800 rounded-3xl"
    >
      <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center mb-6 border border-slate-800">
        <LayoutDashboard className="w-10 h-10 text-slate-700" />
      </div>
      <h2 className="text-2xl font-bold mb-2">No Active Missions</h2>
      <p className="text-slate-500 max-w-xs mb-8">
        Your tactical dashboard is empty. Initiate your first project to begin
        the flow.
      </p>
      <Link href={"/buyer/create"}>
        <Button className="bg-cyan-600 cursor-pointer hover:bg-cyan-500 text-white px-8 h-12 rounded-xl font-bold">
          START FIRST MISSION
        </Button>
      </Link>
    </motion.div>
  );
}
