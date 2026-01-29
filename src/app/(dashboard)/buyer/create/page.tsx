import CreateProjectPage from "@/components/site/Buyer/CreateProjectPage";

export default function CreatePage() {
  return (
    <div className="p-6 lg:p-12">
      <h1 className="text-4xl font-black tracking-tighter uppercase italic">
        Launch <span className="text-cyan-500">Project</span>
      </h1>
      <p className="text-slate-500 font-mono text-sm mt-1">
        RacoFlow Command Center v2.0
      </p>

      <CreateProjectPage />
    </div>
  );
}
