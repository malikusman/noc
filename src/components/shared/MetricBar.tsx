import { cn } from "@/lib/utils";

export function MetricBar({
  value,
  max = 100,
  className,
  colorForValue,
}: {
  value: number;
  max?: number;
  className?: string;
  colorForValue?: boolean;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  let color = "bg-indigo-600";
  if (colorForValue) {
    if (pct >= 80) color = "bg-red-500";
    else if (pct >= 60) color = "bg-amber-500";
    else color = "bg-emerald-500";
  }
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-slate-100", className)}>
      <div
        className={cn("h-full rounded-full transition-all", color)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
