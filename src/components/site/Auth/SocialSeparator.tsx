export function SocialSeparator() {
  return (
    <div className="relative py-3">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-slate-300 dark:border-slate-800" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-slate-50 dark:bg-[#020617] px-2 text-slate-500">
          Or continue with
        </span>
      </div>
    </div>
  );
}
