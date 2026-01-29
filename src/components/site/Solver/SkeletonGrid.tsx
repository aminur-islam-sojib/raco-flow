export function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-64 rounded-sm border border-slate-800 bg-slate-900/20 animate-pulse"
        />
      ))}
    </div>
  );
}
