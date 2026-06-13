import { Calendar, Ticket, Activity, CalendarClock, ArrowDown, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const checks = [
  { label: "Maintenance Calendar", icon: Calendar },
  { label: "Change Tickets", icon: Ticket },
  { label: "OSS Events", icon: Activity },
  { label: "Upgrade Schedules", icon: CalendarClock },
];

export function PlannedVsUnplannedCard() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">
            Planned vs Unplanned Outage Detection
          </h3>
          <Badge variant="success">Prevents false escalations</Badge>
        </div>

        <div className="flex flex-col items-center gap-3 text-center">
          <Step text="CDR Feed Degraded — Detected" tone="warning" />
          <ArrowDown className="h-4 w-4 text-slate-300" />

          <div className="flex flex-wrap items-center justify-center gap-2">
            {checks.map((c) => (
              <span
                key={c.label}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700"
              >
                <c.icon className="h-3.5 w-3.5" />
                {c.label}
                <CheckCircle2 className="h-3 w-3" />
              </span>
            ))}
          </div>
          <ArrowDown className="h-4 w-4 text-slate-300" />

          <Step
            text="Finding: Planned MSC upgrade in progress (Change ticket #CHG-2026-0341)"
            tone="info"
          />
          <ArrowDown className="h-4 w-4 text-slate-300" />

          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">Severity downgraded:</span>
            <Badge variant="critical" className="line-through opacity-60">Critical</Badge>
            <span className="text-slate-400">→</span>
            <Badge variant="success">Low</Badge>
          </div>
          <ArrowDown className="h-4 w-4 text-slate-300" />

          <Step text="Action: Monitor only. No ticket escalation required." tone="success" />
        </div>
      </CardContent>
    </Card>
  );
}

function Step({
  text,
  tone,
}: {
  text: string;
  tone: "warning" | "info" | "success";
}) {
  const toneMap = {
    warning: "border-amber-200 bg-amber-50 text-amber-700",
    info: "border-indigo-200 bg-indigo-50 text-indigo-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  };
  return (
    <div className={`rounded-lg border px-4 py-2 text-sm font-medium ${toneMap[tone]}`}>
      {text}
    </div>
  );
}
