/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/mission/SubModuleForm.tsx
import { Cpu, Zap } from "lucide-react";
import { motion } from "framer-motion";

export const SubModuleForm = ({
  onDeploy,
}: {
  onDeploy: (task: any) => void;
}) => (
  <div className="backdrop-blur-md bg-slate-900/40 border border-cyan-500/20 p-6 rounded-xl shadow-2xl">
    <h3 className="flex items-center gap-2 text-cyan-400 font-bold mb-4 uppercase text-sm tracking-widest">
      <Cpu size={16} /> Initialize Sub-Module
    </h3>
    <div className="space-y-4">
      <InputGroup
        label="Task Designation"
        placeholder="e.g., DECRYPT_NODE_01"
      />
      <InputGroup
        label="Technical Specs"
        placeholder="Define parameters..."
        isTextArea
      />
      <motion.button
        whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(6,182,212,0.4)" }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded flex items-center justify-center gap-2 transition-all"
      >
        <Zap size={18} fill="currentColor" /> DEPLOY MODULE
      </motion.button>
    </div>
  </div>
);

const InputGroup = ({ label, placeholder, isTextArea = false }: any) => (
  <div>
    <label className="text-[10px] uppercase text-slate-500 mb-1 block tracking-widest">
      {label}
    </label>
    {isTextArea ? (
      <textarea
        className="w-full bg-[#020617] border border-slate-700 p-2 rounded focus:border-cyan-500 outline-none h-24 text-sm transition-all"
        placeholder={placeholder}
      />
    ) : (
      <input
        className="w-full bg-[#020617] border border-slate-700 p-2 rounded focus:border-cyan-500 outline-none text-sm transition-all"
        placeholder={placeholder}
      />
    )}
  </div>
);
