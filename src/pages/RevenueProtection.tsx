import { DollarSign, TrendingUp, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { KpiCard } from "@/components/shared/KpiCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MTTRTrendChart } from "@/components/charts/MTTRTrendChart";
import { incidents } from "@/data/incidents";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function RevenueProtection() {
  const atRisk = incidents
    .filter((i) => i.revenueRisk > 0)
    .sort((a, b) => b.revenueRisk - a.revenueRisk)
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Revenue Protection"
        subtitle="Quantifying the financial impact of network incidents — and the revenue Scorpius protects through faster resolution."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard label="Revenue at Risk (Active)" value={111600} prefix="$" icon={DollarSign} accent="red" index={0} />
        <KpiCard label="Revenue Protected (MTD)" value={2400000} prefix="$" icon={ShieldCheck} accent="emerald" index={1} />
        <KpiCard label="Avg Cost / Hour Down" value={4200} prefix="$" icon={TrendingUp} accent="indigo" index={2} />
      </div>

      <Card>
        <CardHeader><CardTitle>MTTR Reduction → Revenue Protected</CardTitle></CardHeader>
        <CardContent><MTTRTrendChart /></CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Top Incidents by Revenue Risk</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-5 py-2">Incident</th>
                <th className="px-3 py-2">Root Cause</th>
                <th className="px-3 py-2 text-right">Subscribers</th>
                <th className="px-3 py-2 text-right">Revenue Risk / day</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {atRisk.map((i) => (
                <tr key={i.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-5 py-2.5 font-mono text-xs font-medium text-slate-900">{i.id}</td>
                  <td className="px-3 py-2.5 text-slate-600">{i.rootCause}</td>
                  <td className="px-3 py-2.5 text-right">{formatNumber(i.subscribersImpacted)}</td>
                  <td className="px-3 py-2.5 text-right font-semibold text-red-600">{formatCurrency(i.revenueRisk)}</td>
                  <td className="px-3 py-2.5">
                    <Badge variant={i.status === "Resolved" || i.status === "Closed" ? "success" : "warning"}>{i.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
