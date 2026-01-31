import { motion } from "framer-motion";

interface ProjectHeaderProps {
  title: string;
  category: string;
  budget: string;
  applicantCount: number;
}

export const ProjectHeader = ({
  title,
  category,
  budget,
  applicantCount,
}: ProjectHeaderProps) => (
  <motion.header
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-6xl mx-auto mb-12 border-b border-slate-800 pb-8 relative"
  >
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight">
          {title}
        </h1>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-cyan-500 font-mono text-xs tracking-widest uppercase">
            {category}
          </span>
          <span className="h-1 w-1 rounded-full bg-slate-700" />
          <span className="text-slate-500 font-mono text-xs">{budget}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 backdrop-blur-md">
        <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
        <span className="font-mono text-xs font-bold text-cyan-400 uppercase">
          OPEN — {applicantCount} Applicant{applicantCount !== 1 ? "s" : ""}{" "}
          Detected
        </span>
      </div>
    </div>
  </motion.header>
);
