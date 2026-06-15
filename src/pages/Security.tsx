import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ShieldAlert,
  Activity,
  ShieldCheck,
  Timer,
  X,
  CheckCircle2,
  Ban,
  Bell,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { KpiCard } from "@/components/shared/KpiCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrafficSpikeChart } from "@/components/charts/TrafficSpikeChart";
import {
  securityThreats,
  securityKpis,
  threatIntelFeed,
  blockedRanges,
  socNotifications,
} from "@/data/securityThreats";

export default function Security() {
  const [bannerOpen, setBannerOpen] = useState(true);
  const ddos = securityThreats.find((t) => t.type === "DDoS" && t.status === "Mitigated")!;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Security Operations"
        subtitle="DDoS and security incident management — Scorpius correlates firewall logs, router telemetry, and flow records to detect and mitigate attacks autonomously."
      />

      {bannerOpen && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <ShieldAlert className="h-5 w-5 text-amber-600" />
          <span className="text-sm font-medium text-amber-700">Security Posture: Elevated</span>
          <span className="text-sm text-amber-600/80">Active mitigation in progress — botnet traffic detected on core gateways.</span>
          <button onClick={() => setBannerOpen(false)} className="ml-auto rounded p-1 text-amber-600 hover:bg-amber-100">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Active Threats" value={securityKpis.activeThreats} icon={ShieldAlert} accent="red" index={0} />
        <KpiCard label="Events Analyzed (24h)" value={securityKpis.eventsAnalyzed24h} icon={Activity} accent="indigo" index={1} />
        <KpiCard label="Mitigations Applied" value={securityKpis.mitigationsApplied} icon={ShieldCheck} accent="emerald" index={2} />
        <KpiCard label="Mean Time to Mitigate" value={securityKpis.meanTimeToMitigateSec} suffix="s" icon={Timer} accent="blue" index={3} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left 65% */}
        <div className="space-y-6 lg:col-span-8">
          {/* Threat table */}
          <Card className="overflow-hidden">
            <CardHeader><CardTitle>Active & Recent Threats</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Threat ID</TableHead>
                      <TableHead className="hidden sm:table-cell">Type</TableHead>
                      <TableHead className="hidden md:table-cell">Source</TableHead>
                      <TableHead className="hidden md:table-cell">Targets</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead className="hidden sm:table-cell">Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {securityThreats.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell className="font-mono text-xs font-medium text-slate-900">
                          {t.id}
                          <div className="mt-1 sm:hidden"><StatusBadge status={t.status} /></div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell"><Badge variant="secondary">{t.type}</Badge></TableCell>
                        <TableCell className="hidden md:table-cell text-xs text-slate-500">{t.source}</TableCell>
                        <TableCell className="hidden md:table-cell font-mono text-xs text-slate-500">{t.targetSites.join(", ")}</TableCell>
                        <TableCell><StatusBadge status={t.severity} /></TableCell>
                        <TableCell className="hidden sm:table-cell"><StatusBadge status={t.status} /></TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => toast(`Threat ${t.id} details (mocked)`)}>View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* DDoS deep dive */}
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-red-600" /> DDoS Attack Deep Dive — {ddos.id}
              </CardTitle>
              <Badge variant="critical">{ddos.peakTraffic} peak</Badge>
            </CardHeader>
            <CardContent className="space-y-5">
              <TrafficSpikeChart />

              {/* attack details */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Detail label="Start time" value="14:39 UTC" />
                <Detail label="Peak" value={ddos.peakTraffic!} />
                <Detail label="Vector" value="UDP Flood" />
                <Detail label="Source" value="Botnet · E. Europe" />
              </div>

              {/* offending IPs */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Offending IP Ranges</p>
                <div className="flex flex-wrap gap-2">
                  {ddos.offendingIPs!.map((ip) => (
                    <span key={ip} className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600">{ip}</span>
                  ))}
                </div>
              </div>

              {/* correlation steps */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Agent Correlation Steps</p>
                <div className="space-y-2">
                  {ddos.correlationSteps!.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.12 }}
                      className="flex items-center gap-2.5 rounded-lg border border-slate-100 px-3 py-2 text-sm"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-semibold text-emerald-700">{i + 1}</span>
                      <span className="text-slate-600">{step}</span>
                      <CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-emerald-500" />
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <ShieldCheck className="h-6 w-6 text-emerald-600" />
                <span className="text-base font-semibold text-emerald-700">Attack mitigated in 45 seconds</span>
              </div>

              <p className="text-xs italic text-slate-400">
                Auto-approved: Mitigation policy executed autonomously — confidence threshold (95%) exceeded human-approval bypass setting.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right 35% */}
        <div className="space-y-6 lg:col-span-4">
          <Card>
            <CardHeader><CardTitle>Threat Intelligence Feed</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {threatIntelFeed.map((f, i) => (
                <div key={i} className="flex items-start gap-2 border-b border-slate-50 pb-2 text-xs last:border-0">
                  <span className="w-14 shrink-0 font-mono text-slate-400">{f.time}</span>
                  <span className="flex-1 text-slate-600">{f.text}</span>
                  <StatusBadge status={f.sev} className="scale-90" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Ban className="h-4 w-4 text-red-600" /> Blocked IP Ranges</CardTitle></CardHeader>
            <CardContent className="space-y-1.5">
              {blockedRanges.map((r) => (
                <div key={r} className="flex items-center justify-between rounded-md border border-slate-100 px-2.5 py-1.5">
                  <span className="font-mono text-xs text-slate-700">{r}</span>
                  <Badge variant="critical" className="scale-90">Blocked by Scorpius</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="h-4 w-4 text-indigo-600" /> SOC Notification Log</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {socNotifications.map((n, i) => (
                <div key={i} className="rounded-lg border border-slate-100 px-3 py-2 text-xs">
                  <div className="flex items-center justify-between">
                    <Badge variant="info" className="scale-90">{n.channel}</Badge>
                    <span className="font-mono text-slate-400">{n.time}</span>
                  </div>
                  <p className="mt-1 text-slate-600">{n.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}
