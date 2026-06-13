import { useState } from "react";
import { toast } from "sonner";
import {
  Zap,
  ShieldCheck,
  Loader2,
  Users,
  DollarSign,
  Clock,
  Gauge,
  Bot,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { AgentTypeBadge } from "@/components/shared/AgentTypeBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RemediationWorkflow } from "@/components/remediation/RemediationWorkflow";
import { remediationQueue, remediationHistory } from "@/data/remediationQueue";
import { formatCurrency, formatNumber, cn } from "@/lib/utils";

export default function Remediation() {
  const [selectedId, setSelectedId] = useState("SA-1024");
  const [approving, setApproving] = useState(false);
  const [stepOverride, setStepOverride] = useState<Record<string, number>>({});
  const [approved, setApproved] = useState<Record<string, boolean>>({});

  const selected = remediationQueue.find((r) => r.siteId === selectedId)!;
  const activeStep = stepOverride[selected.siteId] ?? selected.workflowStep;

  function approveAndExecute() {
    setApproving(true);
    setTimeout(() => {
      setApproving(false);
      setStepOverride((s) => ({ ...s, [selected.siteId]: 5 }));
      setApproved((a) => ({ ...a, [selected.siteId]: true }));
      toast.success("Remediation approved. Executing.", {
        description:
          "Executing on SA-1024 via Huawei OSS. Work order #WO-20260614-0047 created.",
      });
    }, 2000);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Autonomous Remediation"
        subtitle="Human-in-the-loop remediation workflow — the Scorpius differentiator. Detect → Reason → Recommend → Approve → Execute → Verify."
      />

      {/* Queue */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {remediationQueue.map((r) => {
          const isSel = r.siteId === selectedId;
          return (
            <button key={r.siteId} onClick={() => setSelectedId(r.siteId)} className="text-left">
              <Card className={cn("transition-all", isSel ? "border-indigo-300 ring-2 ring-indigo-100" : "hover:border-slate-300")}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-semibold text-slate-900">{r.siteId}</span>
                    <StatusBadge status={r.severity} />
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{r.incidentName}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs font-medium text-indigo-600">{r.confidence}% Confidence</span>
                    <StatusBadge status={r.status} />
                  </div>
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>

      {/* Selected panel */}
      <Card>
        <CardContent className="space-y-6 p-6">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-lg font-semibold text-slate-900">{selected.siteId}</span>
            <span className="text-slate-600">{selected.incidentName}</span>
            <StatusBadge status={selected.severity} />
            <div className="ml-auto flex items-center gap-2">
              <Badge variant="default" className="bg-indigo-600">{selected.confidence}% Confidence</Badge>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span><AgentTypeBadge type="Restricted" /></span>
                </TooltipTrigger>
                <TooltipContent>
                  Scorpius operates as a restricted AI agent. All field dispatch and configuration changes require explicit human approval before execution.
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* AI Reasoning */}
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-indigo-700">
              <ShieldCheck className="h-3.5 w-3.5" /> AI Assessment
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{selected.aiReasoning}</p>
          </div>

          {/* Workflow */}
          <div className="rounded-xl border border-slate-200 p-5">
            <RemediationWorkflow activeStep={activeStep} />
          </div>

          {/* Action plan + impact */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="space-y-3 lg:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Action Plan</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <PlanCard title="Immediate Action" text={selected.immediateAction} tone="indigo" />
                <PlanCard title="Fallback Plan" text={selected.fallbackPlan} tone="amber" />
                <PlanCard title="Escalation Path" text={selected.escalationPath} tone="slate" />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Impact Summary</p>
              <div className="space-y-2.5 text-sm">
                <ImpactRow icon={Users} label="Subscribers at risk" value={formatNumber(selected.subscribersAtRisk)} />
                <ImpactRow icon={DollarSign} label="Revenue exposure" value={selected.revenueExposure ? `${formatCurrency(selected.revenueExposure)}/day` : "—"} />
                <ImpactRow icon={Clock} label="SLA breach in" value={selected.slaBreachIn} />
                <ImpactRow icon={Gauge} label="Confidence" value={`${selected.confidence}%`} />
                <ImpactRow icon={Bot} label="Agent" value="Autonomous Remediation (Restricted)" />
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-4">
            <Button onClick={approveAndExecute} disabled={approving || approved[selected.siteId] || activeStep > 4}>
              {approving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
              {approved[selected.siteId] || activeStep > 4 ? "Approved & Executing" : approving ? "Executing…" : "Approve & Execute"}
            </Button>
            <Button variant="outline" onClick={() => toast("Field technician dispatch requested (override)")}>
              Override — Dispatch Technician
            </Button>
            <Button variant="ghost" onClick={() => toast("Remediation deferred 30 minutes")}>
              Defer 30 Minutes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle>Remediation History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Incident</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Executed By</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {remediationHistory.map((h, i) => (
                <TableRow key={i}>
                  <TableCell className="text-xs text-slate-600">{h.incident}</TableCell>
                  <TableCell className="text-sm">{h.action}</TableCell>
                  <TableCell>
                    <Badge variant={h.executedBy === "Agent" ? "violet" : "secondary"}>{h.executedBy}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-500">{h.duration}</TableCell>
                  <TableCell>
                    <Badge variant={h.result === "Success" ? "success" : h.result === "Partial" ? "warning" : "critical"}>
                      {h.result}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-400">{h.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function PlanCard({ title, text, tone }: { title: string; text: string; tone: "indigo" | "amber" | "slate" }) {
  const toneMap = {
    indigo: "border-indigo-200 bg-indigo-50",
    amber: "border-amber-200 bg-amber-50",
    slate: "border-slate-200 bg-slate-50",
  };
  return (
    <div className={`rounded-lg border p-3 ${toneMap[tone]}`}>
      <p className="text-xs font-semibold text-slate-700">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-600">{text}</p>
    </div>
  );
}

function ImpactRow({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="flex items-center gap-1.5 text-slate-500">
        <Icon className="h-3.5 w-3.5" /> {label}
      </span>
      <span className="text-right font-medium text-slate-900">{value}</span>
    </div>
  );
}
