/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChevronDown, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Swal from "sweetalert2";
import { signOut } from "next-auth/react";
export function UserMenu({ user, role }: { user: any; role: string }) {
  const handleLogoutButton = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to Log Out this account!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00BCD4",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Log Out!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await signOut();
      }
    });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 p-1 rounded-full border border-border bg-muted/50 hover:bg-muted transition-colors outline-none">
          <div className="w-8 h-8 rounded-full bg-linear-to-tr from-cyan-500 to-violet-500 flex items-center justify-center text-white font-bold text-xs uppercase">
            {user?.name?.[0] || "U"}
          </div>
          <ChevronDown className="w-4 h-4 opacity-50" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 mt-2 rounded-2xl backdrop-blur-xl border-white/10"
      >
        <DropdownMenuLabel className="flex flex-col">
          <span>{user?.name}</span>
          <Badge
            variant="outline"
            className="w-fit mt-1 text-[10px] uppercase tracking-widest text-cyan-500 border-cyan-500/30"
          >
            {role}
          </Badge>
        </DropdownMenuLabel>
        {/* <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" /> Settings
        </DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogoutButton} className="text-red-500">
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
