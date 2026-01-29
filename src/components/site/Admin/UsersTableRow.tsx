import { useTransition } from "react";
import { motion } from "framer-motion";
import { TableBody, TableCell } from "@/components/ui/table";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, UserPlus } from "lucide-react";
    
import { User } from "./AdminUsersPage";

export function UserTableRow({ user, index, onPromote }: { user: User; index: number; onPromote: (id: string) => Promise<void> }) {
  const [isPending, startTransition] = useTransition();

  const handlePromote = () => {
    if (!user.id) return;
    startTransition(async () => {
      await onPromote(user.id!);
    });
  };

  return (
    <motion.tr
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group border-white/5 hover:bg-white/[0.03] transition-colors duration-200"
    >
      <TableCell className="py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
            <img 
              src={user.image || `https://ui-avatars.com/api/?name=${user.name || 'User'}&background=random`} 
              alt={user.name || 'User'} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-slate-200">{user.name || 'Unknown User'}</span>
            <span className="text-xs text-slate-500 font-mono">{user.email || 'No Email'}</span>
          </div>
        </div>
      </TableCell>
      
      <TableCell>
        <AnimatePresence mode="wait">
          <motion.div
            key={user.role}
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -5, opacity: 0 }}
          >
            <RoleBadge role={user.role || 'user'} />
          </motion.div>
        </AnimatePresence>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-amber-400'}`} />
          <span className="text-xs uppercase tracking-widest font-bold text-slate-400">
            {user.status || 'Unknown'}
          </span>
        </div>
      </TableCell>

      <TableCell className="text-slate-500 font-mono text-xs">
        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
      </TableCell>

      <TableCell className="text-right">
        {(user.role || 'user') === 'user' && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handlePromote}
            disabled={isPending}
            className="bg-cyan-500/10 border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 transition-all"
          >
            {isPending ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <UserPlus className="w-3 h-3 mr-2" />}
            Promote
          </Button>
        )}
      </TableCell>
    </motion.tr>
  );
}

const RoleBadge = ({ role }: { role: string }) => {
  const configs = {
    admin: "bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_15px_-5px_rgba(168,85,247,0.4)]",
    buyer: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    solver: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    user: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  };

  return (
    <Badge className={`capitalize font-medium border ${configs[role as keyof typeof configs]}`}>
      {role}
    </Badge>
  );
};