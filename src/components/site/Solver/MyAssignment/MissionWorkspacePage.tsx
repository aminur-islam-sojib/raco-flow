// app/mission/[id]/page.tsx
"use client";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { MissionHeader } from "./MissionHeader";
import { SubModuleForm } from "./SubModuleForm";
import { BountyPanel } from "./BountyPanel";
import { TaskCard } from "./TaskCard";

export default function MissionWorkspacePage() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      name: "CORE_ENCRYPTION",
      specs: "RSA-4096 Protocol Implementation",
    },
    { id: 2, name: "FIREWALL_BREACH", specs: "Bypass Layer 7 Security" },
  ]);

  return (
    <main className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-8">
      <MissionHeader title="Operation Void-Runner" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Logic */}
        <aside className="lg:col-span-4 space-y-6">
          <SubModuleForm
            onDeploy={(newTask) => setTasks([...tasks, newTask])}
          />
          <BountyPanel amount="50,000" />
        </aside>

        {/* Timeline Matrix */}
        <section className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-[10px] tracking-[0.3em] uppercase text-slate-500">
              Timeline Matrix
            </h2>
            <span className="text-[10px] text-cyan-500 font-mono">
              ACTIVE_NODES: {tasks.length}
            </span>
          </div>

          <div className="flex flex-col gap-4">
            <AnimatePresence mode="popLayout">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </main>
  );
}
