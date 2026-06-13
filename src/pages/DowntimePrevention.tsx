import { useNavigate } from "react-router-dom";
import { TrendingDown, Battery, Cable, AlertTriangle, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { KpiCard } from "@/components/shared/KpiCard";
import { MetricBar } from "@/components/shared/MetricBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AutoResolutionChart } from "@/components/charts/AutoResolutionChart";
import { predictiveRisk } from "@/data/executive";

const predictions = [
  { issue: "Battery controller end-of-life", sites: 12, window: "Next 30 days", icon: Battery, severity: "Critical" as const },
  { issue: "Backhaul links over 85% utilisation", sites: 3, window: "Next 14 days", icon: Cable, severity: "Warning" as const },
  { issue: "Recurring configuration drift", sites: 7, window: "Ongoing", icon: AlertTriangle, severity: "Low" as const },
];

export default function DowntimePrevention() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Downtime Prevention"
        subtitle="Predictive intelligence — Scorpius forecasts failures before they cause outages, recommending pre-emptive action."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard label="Predicted Failures (30d)" value={22} icon={TrendingDown} accent="amber" index={0} />
        <KpiCard label="Outages Prevented (MTD)" value={31} icon={Battery} accent="emerald" index={1} />
        <KpiCard label="Downtime Avoided" value={184} suffix=" hrs" icon={Cable} accent="indigo" index={2} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Predicted Failure Modes</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {predictions.map((p) => (
              <div key={p.issue} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                <div className="rounded-lg bg-slate-100 p-2"><p.icon className="h-4 w-4 text-slate-600" /></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">{p.issue}</p>
                  <p className="text-xs text-slate-400">{p.sites} sites · {p.window}</p>
                </div>
                <Badge variant={p.severity === "Critical" ? "critical" : p.severity === "Warning" ? "warning" : "success"}>{p.severity}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Auto-Resolution Trend</CardTitle></CardHeader>
          <CardContent><AutoResolutionChart /></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Sites at Risk — Next 30 Days</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate("/executive")}>
            Ask Scorpius <ArrowRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {predictiveRisk.slice(0, 6).map((r) => (
            <div key={r.siteId} className="flex items-center gap-3">
              <span className="w-24 shrink-0 font-mono text-xs font-medium text-slate-900">{r.siteId}</span>
              <span className="hidden flex-1 text-xs text-slate-500 sm:block">{r.factor}</span>
              <MetricBar value={r.riskScore} colorForValue className="w-32" />
              <span className="w-9 text-right text-xs font-semibold text-slate-700">{r.riskScore}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
