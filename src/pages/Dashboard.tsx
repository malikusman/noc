import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Activity,
  AlarmClock,
  Radio,
  Bot,
  CheckCircle2,
  Clock,
  TrendingUp,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { KpiCard } from "@/components/shared/KpiCard";
import { AgentTypeBadge } from "@/components/shared/AgentTypeBadge";
import { MetricBar } from "@/components/shared/MetricBar";
import { NetworkHealthChart } from "@/components/charts/NetworkHealthChart";
import { AlarmSummaryChart } from "@/components/charts/AlarmSummaryChart";
import { NetworkMap } from "@/components/map/NetworkMap";
import { autonomousActions } from "@/data/agents";
import { topSitesAtRisk, TOTAL_SITES } from "@/data/sites";
import { monthlyHighlights } from "@/data/analytics";
import { useInitialLoad } from "@/hooks/useInitialLoad";
import { cn } from "@/lib/utils";

const resultBadge = {
  Success: "success",
  Pending: "warning",
  Escalated: "critical",
} as const;

export default function Dashboard() {
  const navigate = useNavigate();
  const loading = useInitialLoad();

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Network Health Score" value={87} suffix="%" icon={Activity} accent="indigo" index={0} />
        <KpiCard label="Active Alarms" value={142} icon={AlarmClock} accent="red" sub="+12 from yesterday" index={1} />
        <KpiCard label="Sites Down" value={3} icon={Radio} accent="amber" sub={`of ${TOTAL_SITES} monitored`} index={2} />
        <KpiCard label="Autonomous Actions Today" value={23} icon={Bot} accent="emerald" index={3} />
      </div>

      {/* Map */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-indigo-600" />
            Live Network Map — Gulf Region
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate("/sites")}>
            View all sites <ArrowRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? <Skeleton className="h-[360px] w-full" /> : <NetworkMap />}
        </CardContent>
      </Card>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left 60% */}
        <div className="space-y-6 lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Network Health Trend</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-[260px] w-full" /> : <NetworkHealthChart />}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Autonomous Actions Feed</CardTitle>
              <AgentTypeBadge type="Restricted" />
            </CardHeader>
            <CardContent className="space-y-0">
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {autonomousActions.map((a, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 py-2.5"
                    >
                      <span className="w-16 shrink-0 font-mono text-xs text-slate-400">
                        {a.timestamp}
                      </span>
                      <span className="hidden shrink-0 sm:block">
                        <Badge variant="violet" className="text-[10px]">
                          {a.agentName.replace(" Agent", "")}
                        </Badge>
                      </span>
                      <span className="w-20 shrink-0 font-mono text-xs text-slate-500">
                        {a.siteId}
                      </span>
                      <span className="flex-1 truncate text-sm text-slate-700">
                        {a.action}
                      </span>
                      <Badge variant={resultBadge[a.result]} className="shrink-0 text-[10px]">
                        {a.result}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 40% */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Active Alarm Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-[260px] w-full" /> : <AlarmSummaryChart />}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top 5 Sites at Risk</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topSitesAtRisk.map((s) => (
                <div key={s.id} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <span className="font-mono text-xs font-medium text-slate-900">{s.id}</span>
                      <span className="ml-2 text-xs text-slate-400">{s.location}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => navigate("/remediation")}>
                      Investigate
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500">{s.riskType}</p>
                  <div className="flex items-center gap-2">
                    <MetricBar value={s.riskScore} colorForValue className="flex-1" />
                    <span className={cn(
                      "w-9 text-right text-xs font-semibold",
                      s.riskScore >= 80 ? "text-red-600" : s.riskScore >= 60 ? "text-amber-600" : "text-emerald-600"
                    )}>
                      {s.riskScore}%
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-600" /> Monthly Highlights
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-2xl font-semibold text-slate-900">{monthlyHighlights.incidents}</p>
              <p className="text-xs text-slate-400">incidents</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-emerald-600">{monthlyHighlights.autoResolved}</p>
              <p className="text-xs text-slate-400">auto-resolved</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-indigo-600">{monthlyHighlights.mttrReductionPct}%</p>
              <p className="text-xs text-slate-400">MTTR ↓</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Multi-Vendor Coverage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {["Huawei OSS", "Nokia NetAct", "Ericsson OSS"].map((v) => (
              <div key={v} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2">
                <span className="text-sm text-slate-700">{v}</span>
                <Badge variant="success">
                  <CheckCircle2 className="h-3 w-3" /> Connected
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/incidents")}>
              <Clock className="h-4 w-4" /> View All Incidents
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => toast.success("NOC report generated", { description: "Monthly NOC summary exported to PDF." })}>
              <Activity className="h-4 w-4" /> Generate NOC Report
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => toast.success("Exported to ServiceNow", { description: "3 active incidents synced to ServiceNow." })}>
              <ArrowRight className="h-4 w-4" /> Export to ServiceNow
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
