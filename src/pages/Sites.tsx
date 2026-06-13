import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Search, Plus, Activity, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { SiteSignalChart } from "@/components/charts/SiteSignalChart";
import { sites } from "@/data/sites";
import { rawAlarms } from "@/data/alerts";
import type { CellSite } from "@/types";
import { formatNumber } from "@/lib/utils";

const maintenanceLog = [
  { date: "2026-06-10", text: "Preventive battery inspection completed", by: "Field Ops" },
  { date: "2026-05-28", text: "Firmware upgrade to baseband unit", by: "RAN Team" },
  { date: "2026-05-12", text: "Backhaul antenna realignment", by: "Transport" },
  { date: "2026-04-30", text: "Quarterly site audit — passed", by: "QA" },
];

export default function Sites() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [vendor, setVendor] = useState("all");
  const [region, setRegion] = useState("all");
  const [selected, setSelected] = useState<CellSite | null>(null);
  const [diag, setDiag] = useState(false);

  const filtered = useMemo(() => {
    return sites.filter((s) => {
      if (query && !`${s.id} ${s.name}`.toLowerCase().includes(query.toLowerCase())) return false;
      if (status !== "all" && s.status !== status) return false;
      if (vendor !== "all" && s.vendor !== vendor) return false;
      if (region !== "all" && s.region !== region) return false;
      return true;
    });
  }, [query, status, vendor, region]);

  const regions = Array.from(new Set(sites.map((s) => s.region)));
  const siteAlarms = selected
    ? rawAlarms.filter((a) => a.siteId === selected.id).slice(0, 5)
    : [];

  function runDiag() {
    setDiag(true);
    setTimeout(() => {
      setDiag(false);
      toast.success(`Diagnostics complete — ${selected?.id}`, {
        description: "All subsystems polled. Telemetry refreshed.",
      });
    }, 2000);
  }

  return (
    <div>
      <PageHeader
        title="Cell Site Management"
        subtitle="Full inventory of monitored cell sites across the Gulf region with live status and drill-down."
        actions={
          <Button onClick={() => toast("Add Site is mocked in this demo")}>
            <Plus className="h-4 w-4" /> Add Site
          </Button>
        }
      />

      {/* Controls */}
      <Card className="mb-4 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input placeholder="Search site ID or name…" className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <FilterSelect value={status} onChange={setStatus} placeholder="Status" options={["Online", "Degraded", "Offline", "Maintenance"]} />
          <FilterSelect value={vendor} onChange={setVendor} placeholder="Vendor" options={["Huawei", "Nokia", "Ericsson"]} />
          <FilterSelect value={region} onChange={setRegion} placeholder="Region" options={regions} />
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Site ID</TableHead>
              <TableHead>Site Name</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Alarms</TableHead>
              <TableHead>Last Incident</TableHead>
              <TableHead className="text-right">Uptime</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-mono text-xs font-medium text-slate-900">{s.id}</TableCell>
                <TableCell className="text-sm">{s.name}</TableCell>
                <TableCell className="text-sm text-slate-500">{s.region}</TableCell>
                <TableCell><Badge variant="secondary">{s.vendor}</Badge></TableCell>
                <TableCell><StatusBadge status={s.status} /></TableCell>
                <TableCell className="text-right">
                  <span className={s.activeAlarms > 10 ? "font-semibold text-red-600" : s.activeAlarms > 0 ? "text-amber-600" : "text-slate-400"}>
                    {s.activeAlarms}
                  </span>
                </TableCell>
                <TableCell className="font-mono text-xs text-slate-500">
                  {format(new Date(s.lastIncident), "dd MMM HH:mm")}
                </TableCell>
                <TableCell className="text-right text-sm">{s.uptimePercent}%</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => setSelected(s)}>View</Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="py-8 text-center text-sm text-slate-400">
                  No sites match your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Detail Sheet */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-[480px] max-w-[92vw] overflow-y-auto scrollbar-thin p-6">
          {selected && (
            <>
              <SheetHeader>
                <div className="flex items-center justify-between pr-6">
                  <div>
                    <SheetTitle className="font-mono">{selected.id}</SheetTitle>
                    <p className="text-sm text-slate-500">{selected.name}</p>
                  </div>
                  <StatusBadge status={selected.status} />
                </div>
              </SheetHeader>

              <Button className="mt-4 w-full" onClick={runDiag} disabled={diag}>
                {diag ? <Loader2 className="h-4 w-4 animate-spin" /> : <Activity className="h-4 w-4" />}
                {diag ? "Running diagnostics…" : "Run Diagnostics"}
              </Button>

              {/* Location */}
              <div className="mt-5 rounded-lg border border-slate-200 p-3 text-sm">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Location</p>
                <div className="grid grid-cols-2 gap-y-1 text-slate-600">
                  <span>Coordinates</span>
                  <span className="text-right font-mono text-xs">{selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}</span>
                  <span>Region</span>
                  <span className="text-right">{selected.region}</span>
                  <span>Tower type</span>
                  <span className="text-right">{selected.towerType}</span>
                  <span>Vendor</span>
                  <span className="text-right">{selected.vendor}</span>
                </div>
              </div>

              {/* Metric mini-cards */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <MiniMetric label="Uptime" value={`${selected.uptimePercent}%`} />
                <MiniMetric label="Active Alarms" value={`${selected.activeAlarms}`} />
                <MiniMetric label="Subscribers" value={formatNumber(selected.subscribers)} />
                <MiniMetric label="MTTR" value={selected.mttrMinutes ? `${selected.mttrMinutes}m` : "—"} />
              </div>

              {/* Chart */}
              <div className="mt-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Signal & Power — last 24h</p>
                <SiteSignalChart seed={selected.id.length} healthy={selected.status === "Online"} />
              </div>

              {/* Data sources */}
              <div className="mt-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Connected Data Sources</p>
                <div className="flex flex-wrap gap-2">
                  {["Huawei OSS", "Nokia NetAct", "Power subsystem", "Backhaul"].map((d) => (
                    <Badge key={d} variant="secondary">{d}</Badge>
                  ))}
                </div>
              </div>

              {/* Alarms */}
              <div className="mt-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Last 5 Alarms</p>
                {siteAlarms.length ? (
                  <div className="space-y-1.5">
                    {siteAlarms.map((a) => (
                      <div key={a.id} className="flex items-center justify-between rounded-md border border-slate-100 px-2.5 py-1.5 text-xs">
                        <span className="text-slate-700">{a.alarmType}</span>
                        <span className="font-mono text-slate-400">{a.source}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No recent alarms on this site.</p>
                )}
              </div>

              {/* Maintenance log */}
              <div className="mt-5 pb-2">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Maintenance Log</p>
                <div className="space-y-2">
                  {maintenanceLog.map((m, i) => (
                    <div key={i} className="flex gap-3 text-xs">
                      <span className="font-mono text-slate-400">{m.date}</span>
                      <span className="flex-1 text-slate-600">{m.text}</span>
                      <span className="text-slate-400">{m.by}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: string[];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All {placeholder}</SelectItem>
        {options.map((o) => (
          <SelectItem key={o} value={o}>{o}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}
