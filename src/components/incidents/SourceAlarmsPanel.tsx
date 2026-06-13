import { useState } from "react";
import { ChevronDown, Layers } from "lucide-react";
import { format } from "date-fns";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { sa1024SourceAlarms } from "@/data/alerts";
import { cn } from "@/lib/utils";

export function SourceAlarmsPanel({ incidentId }: { incidentId: string }) {
  const [open, setOpen] = useState(false);
  const alarms = sa1024SourceAlarms;

  return (
    <div className="rounded-xl border border-slate-200">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Layers className="h-4 w-4 text-slate-400" />
          Source Alarms — {alarms.length} collapsed into this incident
        </span>
        <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="max-h-72 overflow-y-auto border-t border-slate-100 scrollbar-thin">
          {alarms.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-3 border-b border-slate-50 px-4 py-2 text-xs last:border-0"
            >
              <span className="w-24 shrink-0 font-mono text-slate-400">{a.source}</span>
              <span className="flex-1 text-slate-700">{a.alarmType}</span>
              <StatusBadge status={a.severity} className="scale-90" />
              <span className="hidden w-16 shrink-0 font-mono text-slate-400 sm:block">
                {format(new Date(a.timestamp), "HH:mm:ss")}
              </span>
              <span className="hidden shrink-0 rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] text-indigo-500 lg:block">
                → {incidentId}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
