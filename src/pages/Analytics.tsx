import { toast } from "sonner";
import { FileDown } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IncidentVolumeChart } from "@/components/charts/IncidentVolumeChart";
import { MTTRTrendChart } from "@/components/charts/MTTRTrendChart";
import { AutoResolutionChart } from "@/components/charts/AutoResolutionChart";
import { VendorDistributionChart } from "@/components/charts/VendorDistributionChart";
import { analyticsSummary } from "@/data/analytics";

export default function Analytics() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics & Reports"
        subtitle="Network operations performance — incident trends, MTTR improvement, and the impact of autonomous operations."
        actions={
          <div className="flex items-center gap-2">
            <Select defaultValue="30">
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => toast.success("Report exported", { description: "Analytics report exported to PDF." })}>
              <FileDown className="h-4 w-4" /> Export PDF
            </Button>
          </div>
        }
      />

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Stat label="Total Incidents" value={analyticsSummary.totalIncidents.toLocaleString()} />
        <Stat label="Auto-Resolved" value={`${analyticsSummary.autoResolved.toLocaleString()}`} sub={`${analyticsSummary.autoResolvedPct}%`} accent="emerald" />
        <Stat label="Avg MTTR" value={`${analyticsSummary.avgMttrMin} min`} sub={`↓${analyticsSummary.mttrReductionPct}%`} accent="indigo" />
        <Stat label="Cost Avoidance" value={analyticsSummary.costAvoidance} accent="emerald" />
        <Stat label="SLA Compliance" value={`${analyticsSummary.slaCompliancePct}%`} accent="indigo" />
      </div>

      {/* Chart grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Incident Volume by Category</CardTitle></CardHeader>
          <CardContent><IncidentVolumeChart /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>MTTR — Before vs After Scorpius</CardTitle></CardHeader>
          <CardContent><MTTRTrendChart /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Auto-Resolution Rate</CardTitle></CardHeader>
          <CardContent><AutoResolutionChart /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Incident Distribution by Vendor</CardTitle></CardHeader>
          <CardContent><VendorDistributionChart /></CardContent>
        </Card>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: "emerald" | "indigo";
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
        <p className="mt-1.5 text-2xl font-semibold text-slate-900">{value}</p>
        {sub && (
          <p className={`mt-0.5 text-xs font-medium ${accent === "emerald" ? "text-emerald-600" : "text-indigo-600"}`}>{sub}</p>
        )}
      </CardContent>
    </Card>
  );
}
