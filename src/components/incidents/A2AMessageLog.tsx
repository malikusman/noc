import { useState } from "react";
import { ChevronDown, Terminal } from "lucide-react";
import { format } from "date-fns";
import type { A2AMessage } from "@/types";
import { cn } from "@/lib/utils";

const stateKey: Record<string, string> = {
  handoff_complete: "state",
  goal_assigned: "state",
  context_shared: "state",
  commitment_made: "commitment",
  approval_requested: "state",
  action_executed: "state",
};

export function A2AMessageLog({
  messages,
  incidentId,
}: {
  messages: A2AMessage[];
  incidentId: string;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-2.5 text-left"
      >
        <span className="flex items-center gap-2 text-xs font-semibold text-slate-200">
          <Terminal className="h-3.5 w-3.5 text-emerald-400" />
          A2A Message Log — Agent-to-Agent Protocol
        </span>
        <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="space-y-3 px-4 pb-4 font-mono text-[11px] leading-relaxed scrollbar-dark">
          {messages.map((m, i) => (
            <div key={i}>
              <span className="text-slate-500">
                [{format(new Date(m.timestamp), "HH:mm:ss")} UTC]
              </span>{" "}
              <span className="text-sky-400">{m.fromAgent}</span>
              <span className="text-slate-500"> → </span>
              <span className="text-violet-400">{m.toAgent}</span>
              <div className="pl-4 text-slate-300">
                <div>
                  <span className="text-slate-500">goal:</span> "{m.goal}"
                </div>
                <div>
                  <span className="text-slate-500">context:</span>{" "}
                  <span className="text-amber-300">
                    {`{ incident_id: "${incidentId}", msg_type: "${m.messageType}" }`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">{stateKey[m.messageType] ?? "state"}:</span>{" "}
                  <span className="text-emerald-400">"{m.state}"</span>
                  <span className="ml-3 text-slate-600">latency={m.latencyMs}ms</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
