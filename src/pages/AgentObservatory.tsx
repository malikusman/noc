import { motion } from "framer-motion";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Network,
  Search,
  Activity,
  Wrench,
  MessageSquare,
  CheckCircle2,
  X,
  ShieldCheck,
  SlidersHorizontal,
  Filter,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { AgentTypeBadge } from "@/components/shared/AgentTypeBadge";
import { ConfidenceRing } from "@/components/shared/ConfidenceRing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AgentConfidenceChart } from "@/components/charts/AgentConfidenceChart";
import {
  agentProfiles,
  a2aCommLog,
  authMatrix,
  authDomains,
  guardrails,
} from "@/data/agents";
import type { AgentProfile } from "@/types";

const iconMap: Record<string, typeof Network> = {
  Network,
  Search,
  Activity,
  Wrench,
  MessageSquare,
};

const statusTone = {
  Active: "success",
  Processing: "info",
  Idle: "secondary",
} as const;

const guardrailIcon = [ShieldCheck, SlidersHorizontal, Filter];

const msgTypeTone: Record<string, string> = {
  handoff_complete: "text-emerald-400",
  goal_assigned: "text-sky-400",
  context_shared: "text-amber-300",
  commitment_made: "text-violet-400",
  approval_requested: "text-orange-400",
  action_executed: "text-indigo-400",
};

export default function AgentObservatory() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Agent Observatory"
        subtitle="Real-time observability and trust metrics for all autonomous agents running in the Scorpius network."
      />

      {/* Health grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {agentProfiles.map((a, i) => (
          <AgentHealthCard key={a.name} agent={a} index={i} />
        ))}
      </div>

      {/* Confidence timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Observability Timeline — Agent Confidence (24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <AgentConfidenceChart />
        </CardContent>
      </Card>

      {/* A2A comm log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">A2A Communication Log</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-hidden rounded-b-xl bg-slate-900">
            <div className="grid grid-cols-12 gap-2 border-b border-slate-800 px-4 py-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              <span className="col-span-2">Timestamp</span>
              <span className="col-span-2">From</span>
              <span className="col-span-2">To</span>
              <span className="col-span-2">Type</span>
              <span className="col-span-2">Goal</span>
              <span className="col-span-1">State</span>
              <span className="col-span-1 text-right">Latency</span>
            </div>
            <div className="max-h-80 overflow-y-auto scrollbar-dark font-mono text-[11px]">
              {a2aCommLog.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.4) }}
                  className="grid grid-cols-12 items-center gap-2 border-b border-slate-800/60 px-4 py-1.5 last:border-0"
                >
                  <span className="col-span-2 text-slate-500">{format(new Date(m.timestamp), "HH:mm:ss")}</span>
                  <span className="col-span-2 text-sky-400">{m.fromAgent}</span>
                  <span className="col-span-2 text-violet-400">{m.toAgent}</span>
                  <span className={`col-span-2 ${msgTypeTone[m.messageType] ?? "text-slate-300"}`}>{m.messageType}</span>
                  <span className="col-span-2 truncate text-slate-300">{m.goal}</span>
                  <span className="col-span-1 truncate text-emerald-400">{m.state}</span>
                  <span className="col-span-1 text-right text-slate-500">{m.latencyMs}ms</span>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guardrails */}
      <div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {guardrails.map((g, i) => {
            const Icon = guardrailIcon[i];
            return (
              <Card key={g.name}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <Icon className="h-5 w-5 text-emerald-600" />
                    <Badge variant="success"><CheckCircle2 className="h-3 w-3" /> {g.status}</Badge>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{g.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{g.detail}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <p className="mt-3 text-center text-xs italic text-slate-400">
          Guardrails aligned with Ericsson's recommended robustness framework for LLM-based agent systems.
        </p>
      </div>

      {/* Authorization matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Authorization Matrix</CardTitle>
          <p className="text-xs text-slate-500">
            Domain-bounded authorization from the TM Forum IMF model — each agent acts only within explicitly authorized network domains.
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-2 pr-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">Agent</th>
                  {authDomains.map((d) => (
                    <th key={d} className="px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {authMatrix.map((row) => (
                  <tr key={row.agent} className="border-b border-slate-100">
                    <td className="py-2.5 pr-4 font-medium text-slate-700">{row.agent}</td>
                    {authDomains.map((d) => (
                      <td key={d} className="px-3 py-2.5 text-center">
                        {row.domains[d] ? (
                          <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-500" />
                        ) : (
                          <X className="mx-auto h-4 w-4 text-slate-300" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AgentHealthCard({ agent, index }: { agent: AgentProfile; index: number }) {
  const Icon = iconMap[agent.icon] ?? Network;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-violet-50 p-2">
                <Icon className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{agent.name}</p>
                <div className="mt-1 flex items-center gap-2">
                  <AgentTypeBadge type={agent.type} />
                  <Badge variant={statusTone[agent.status]} className="scale-90">{agent.status}</Badge>
                </div>
              </div>
            </div>
            <ConfidenceRing value={agent.avgConfidence} />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-center">
            <Metric label="Tasks today" value={agent.tasksToday.toLocaleString()} />
            <Metric label="Human approval" value={`${agent.humanApprovalRate}%`} />
            <Metric label="Last action" value={format(new Date(agent.lastAction), "HH:mm")} />
          </div>

          {agent.note && <p className="mt-3 text-xs text-slate-500">{agent.note}</p>}

          <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => toast(`Streaming logs for ${agent.name} (mocked)`)}>
            View Logs
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-900">{value}</p>
      <p className="text-[10px] text-slate-400">{label}</p>
    </div>
  );
}
