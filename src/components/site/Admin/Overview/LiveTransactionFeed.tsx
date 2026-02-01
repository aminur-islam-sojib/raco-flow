// components/admin/LiveTransactionFeed.tsx

const EVENTS = [
  {
    id: 1,
    type: "CASH_FLOW",
    msg: "Uplink Payment Secured: $4,200",
    time: "2m ago",
    color: "text-emerald-500",
  },
  {
    id: 2,
    type: "AUTH",
    msg: "User_X88 promoted to Buyer",
    time: "5m ago",
    color: "text-blue-500",
  },
  {
    id: 3,
    type: "ALERT",
    msg: "Failed Node Access: IP 192.168.0.1",
    time: "12m ago",
    color: "text-red-500",
  },
  // ... more events
];

export const LiveTransactionFeed = () => (
  <aside className="bg-slate-900/40 border border-slate-800 rounded-2xl flex flex-col h-150">
    <div className="p-6 border-b border-slate-800">
      <h3 className="text-xs font-black tracking-widest uppercase text-slate-400">
        Live_Tactical_Feed
      </h3>
    </div>
    <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono">
      {EVENTS.map((ev) => (
        <div
          key={ev.id}
          className="p-3 bg-slate-950/50 border border-slate-900 rounded-lg group hover:border-slate-700 transition-colors"
        >
          <div className="flex justify-between items-start mb-1">
            <span
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded border border-current ${ev.color}`}
            >
              [{ev.type}]
            </span>
            <span className="text-[8px] text-slate-600">{ev.time}</span>
          </div>
          <p className="text-[10px] text-slate-300 tracking-tight leading-relaxed">
            {ev.msg}
          </p>
        </div>
      ))}
    </div>
  </aside>
);
