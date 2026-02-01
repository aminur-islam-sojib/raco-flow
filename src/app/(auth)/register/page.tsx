import { RegisterTerminal } from "@/components/site/Auth/RegisterForm/RegisterTerminal";

export default function RegisterPage() {
  return (
    <main className="min-h-screen w-full bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Re-use the background grid from Login for consistency */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size-[40px_40px]" />

      <RegisterTerminal />
    </main>
  );
}
