import { motion } from "framer-motion";
import { Network, Search, Activity, Wrench, CheckCircle2, Loader2, Circle } from "lucide-react";
import { AgentTypeBadge } from "@/components/shared/AgentTypeBadge";
import type { AgentOutput } from "@/types";

const icons = [Network, Search, Activity, Wrench];

const statusIcon = {
  Complete: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
  Running: <Loader2 className="h-4 w-4 animate-spin text-blue-600" />,
  Pending: <Circle className="h-4 w-4 text-slate-300" />,
};

export function AgentWorkflowCards({ outputs }: { outputs: AgentOutput[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      {outputs.map((o, i) => {
        const Icon = icons[i] ?? Network;
        return (
          <motion.div
            key={o.agentName}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col rounded-xl border border-slate-200 bg-white p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-violet-50 p-1.5">
                  <Icon className="h-4 w-4 text-violet-600" />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Agent {i + 1}
                </span>
              </div>
              {statusIcon[o.status]}
            </div>

            <p className="mt-2 text-sm font-semibold text-slate-900">{o.agentName}</p>
            <div className="mt-1.5">
              <AgentTypeBadge type={o.agentType} />
            </div>

            <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-600">{o.summary}</p>

            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px]">
              <span className="text-slate-400">⏱ {o.processingTime}</span>
              <span className="font-medium text-indigo-600">{o.confidence}% conf</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
