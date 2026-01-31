/* eslint-disable @typescript-eslint/no-explicit-any */
// app/solver/assignments/page.tsx
"use client";
import { motion, MotionValue } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  Key,
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
} from "react";

export default function MissionSelectionHub({
  myAssignments,
}: {
  myAssignments: any;
}) {
  return (
    <div className="min-h-screen bg-[#020617] p-8">
      <h2 className="text-cyan-500 font-mono text-xs tracking-[0.5em] uppercase mb-8">
        Active_Duty_Roster
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myAssignments.map(
          (project: {
            _id: Key | null | undefined;
            title:
              | string
              | number
              | bigint
              | boolean
              | ReactElement<unknown, string | JSXElementConstructor<any>>
              | Iterable<ReactNode>
              | ReactPortal
              | Promise<
                  | string
                  | number
                  | bigint
                  | boolean
                  | ReactPortal
                  | ReactElement<unknown, string | JSXElementConstructor<any>>
                  | Iterable<ReactNode>
                  | null
                  | undefined
                >
              | MotionValue<number>
              | MotionValue<string>
              | null
              | undefined;
            description:
              | string
              | number
              | bigint
              | boolean
              | ReactElement<unknown, string | JSXElementConstructor<any>>
              | Iterable<ReactNode>
              | ReactPortal
              | Promise<
                  | string
                  | number
                  | bigint
                  | boolean
                  | ReactPortal
                  | ReactElement<unknown, string | JSXElementConstructor<any>>
                  | Iterable<ReactNode>
                  | null
                  | undefined
                >
              | null
              | undefined;
            budget:
              | string
              | number
              | bigint
              | boolean
              | ReactElement<unknown, string | JSXElementConstructor<any>>
              | Iterable<ReactNode>
              | ReactPortal
              | Promise<
                  | string
                  | number
                  | bigint
                  | boolean
                  | ReactPortal
                  | ReactElement<unknown, string | JSXElementConstructor<any>>
                  | Iterable<ReactNode>
                  | null
                  | undefined
                >
              | null
              | undefined;
          }) => (
            <motion.div
              key={project._id}
              layoutId={`card-${project._id}`}
              className="group relative bg-slate-900/20 border border-slate-800 p-6 rounded-lg hover:border-cyan-500/50 transition-all duration-500"
            >
              <div className="flex justify-between items-start mb-4">
                <motion.h3
                  layoutId={`title-${project._id}`}
                  className="text-xl font-bold text-slate-100 group-hover:text-cyan-400"
                >
                  {project.title}
                </motion.h3>
                <span className="px-2 py-1 text-[8px] border border-cyan-500/50 text-cyan-400 rounded bg-cyan-500/5 animate-pulse">
                  ASSIGNED
                </span>
              </div>

              <div className="mb-6">
                <p className="text-slate-500 text-xs line-clamp-2 font-mono">
                  {project.description}
                </p>
              </div>

              <div className="flex justify-between items-center border-t border-slate-800/50 pt-4">
                <div className="text-amber-500 font-mono font-bold">
                  {project.budget}{" "}
                  <span className="text-[10px] text-slate-600">CR</span>
                </div>
                <Link href={`/solver/assignments/${project._id}`}>
                  <motion.button
                    whileHover={{ x: 5 }}
                    className="flex items-center cursor-pointer gap-2 text-cyan-500 text-[10px] font-bold uppercase tracking-widest"
                  >
                    View Terminal <ChevronRight size={14} />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ),
        )}
      </div>
    </div>
  );
}
