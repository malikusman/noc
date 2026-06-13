import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { SiteStatus, Severity, IncidentStatus } from "@/types";

type AnyStatus = SiteStatus | Severity | IncidentStatus | string;

const map: Record<
  string,
  { variant: "critical" | "warning" | "success" | "info" | "secondary" | "violet"; dot?: boolean }
> = {
  // Site status
  Online: { variant: "success", dot: true },
  Degraded: { variant: "warning", dot: true },
  Offline: { variant: "critical", dot: true },
  Maintenance: { variant: "info" },
  // Severity
  Critical: { variant: "critical" },
  Warning: { variant: "warning" },
  Low: { variant: "success" },
  Info: { variant: "info" },
  // Incident / remediation status
  Investigating: { variant: "info" },
  Remediating: { variant: "warning" },
  Resolved: { variant: "success" },
  Closed: { variant: "secondary" },
  AwaitingApproval: { variant: "warning" },
  InProgress: { variant: "info" },
  Deferred: { variant: "secondary" },
  Mitigated: { variant: "success" },
};

const labelMap: Record<string, string> = {
  AwaitingApproval: "Awaiting Approval",
  InProgress: "In Progress",
};

export function StatusBadge({
  status,
  className,
}: {
  status: AnyStatus;
  className?: string;
}) {
  const cfg = map[status] ?? { variant: "secondary" as const };
  const label = labelMap[status] ?? status;
  return (
    <Badge variant={cfg.variant} className={cn("font-medium", className)}>
      {cfg.dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            status === "Online" && "bg-emerald-500 animate-pulse",
            status === "Degraded" && "bg-amber-500 animate-pulse",
            status === "Offline" && "bg-red-500 animate-pulse"
          )}
        />
      )}
      {label}
    </Badge>
  );
}
