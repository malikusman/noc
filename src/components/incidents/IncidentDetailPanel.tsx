import { motion } from "framer-motion";
import { format } from "date-fns";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { AgentWorkflowCards } from "./AgentWorkflowCards";
import { A2AMessageLog } from "./A2AMessageLog";
import { SourceAlarmsPanel } from "./SourceAlarmsPanel";
import type { Incident } from "@/types";

export function IncidentDetailPanel({ incident }: { incident: Incident }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25 }}
      className="overflow-hidden"
    >
      <div className="space-y-5 border-t border-slate-100 bg-slate-50/60 p-5">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-sm font-semibold text-slate-900">{incident.id}</span>
          <StatusBadge status={incident.severity} />
          <StatusBadge status={incident.status} />
          <span className="ml-auto font-mono text-xs text-slate-400">
            Opened {format(new Date(incident.timestamp), "dd MMM yyyy · HH:mm")} UTC
          </span>
        </div>

        {/* Agent pipeline */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Agent Pipeline
          </p>
          <AgentWorkflowCards outputs={incident.agentOutputs} />
        </div>

        {/* A2A log */}
        <A2AMessageLog messages={incident.a2aLog} incidentId={incident.id} />

        {/* Source alarms */}
        <SourceAlarmsPanel incidentId={incident.id} />
      </div>
    </motion.div>
  );
}
