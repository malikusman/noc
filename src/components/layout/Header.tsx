import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Search, Bell, Loader2, Activity } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const titles: Record<string, { title: string; crumb: string }> = {
  "/": { title: "NOC Command Center", crumb: "Operations / Overview" },
  "/sites": { title: "Cell Site Management", crumb: "Operations / Sites" },
  "/incidents": { title: "Incident Correlation", crumb: "Intelligence / Incidents" },
  "/remediation": { title: "Autonomous Remediation", crumb: "Operations / Remediation" },
  "/security": { title: "Security Operations", crumb: "Operations / Security" },
  "/agent-observatory": { title: "Agent Observatory", crumb: "Operations / Agents" },
  "/analytics": { title: "Analytics & Reports", crumb: "Operations / Analytics" },
  "/executive": { title: "Executive Intelligence", crumb: "Operations / Executive" },
  "/settings": { title: "Settings", crumb: "Operations / Settings" },
  "/intelligence/downtime": { title: "Downtime Prevention", crumb: "Intelligence / Downtime" },
  "/intelligence/revenue": { title: "Revenue Protection", crumb: "Intelligence / Revenue" },
};

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function Header() {
  const location = useLocation();
  const now = useClock();
  const [diagRunning, setDiagRunning] = useState(false);
  const [syncLabel, setSyncLabel] = useState("just now");

  const meta = titles[location.pathname] ?? {
    title: "Scorpius Networks",
    crumb: "Operations",
  };

  useEffect(() => {
    const id = setInterval(() => setSyncLabel("just now"), 30000);
    return () => clearInterval(id);
  }, []);

  const utc = now.toISOString().slice(11, 19);

  function runDiagnostics() {
    setDiagRunning(true);
    setTimeout(() => {
      setDiagRunning(false);
      toast.success("Full diagnostics complete", {
        description: "847 sites scanned · 3 anomalies flagged · network health 87%",
      });
    }, 2000);
  }

  return (
    <header className="fixed inset-x-0 left-[220px] top-0 z-20 flex h-14 items-center gap-4 border-b border-slate-200 bg-white px-6">
      {/* Left: title + breadcrumb */}
      <div className="min-w-[180px]">
        <h2 className="text-sm font-semibold text-slate-900">{meta.title}</h2>
        <p className="text-[11px] text-slate-400">{meta.crumb}</p>
      </div>

      {/* Center: search */}
      <div className="relative mx-auto hidden w-full max-w-md md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Search sites, incidents, agents…"
          className="pl-9"
          onKeyDown={(e) => {
            if (e.key === "Enter")
              toast("Search is mocked in this demo build");
          }}
        />
      </div>

      {/* Right */}
      <div className="ml-auto flex items-center gap-4">
        <div className="hidden text-right lg:block">
          <p className="font-mono text-xs text-slate-600">{utc} UTC</p>
          <p className="text-[10px] text-slate-400">Last sync: {syncLabel}</p>
        </div>

        <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-semibold text-white">
            3
          </span>
        </button>

        <Button size="sm" onClick={runDiagnostics} disabled={diagRunning}>
          {diagRunning ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Activity className="h-4 w-4" />
          )}
          {diagRunning ? "Running…" : "Run Full Diagnostics"}
        </Button>
      </div>
    </header>
  );
}
