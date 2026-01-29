/* eslint-disable @typescript-eslint/no-explicit-any */
// --- Sub-Components for Clean Code ---

import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

export function InputGroup({ label, ...props }: any) {
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={props.id}
        className="text-xs font-semibold uppercase tracking-wider text-slate-500"
      >
        {label}
      </Label>
      <Input
        {...props}
        className="bg-transparent border-slate-300 dark:border-slate-700 focus-visible:ring-cyan-400 focus-visible:border-cyan-400 transition-all duration-200"
      />
    </div>
  );
}
