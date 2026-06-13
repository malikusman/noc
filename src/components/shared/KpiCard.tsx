import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const accentMap = {
  indigo: { text: "text-indigo-600", bg: "bg-indigo-50", ring: "text-indigo-600" },
  red: { text: "text-red-600", bg: "bg-red-50", ring: "text-red-600" },
  amber: { text: "text-amber-600", bg: "bg-amber-50", ring: "text-amber-600" },
  emerald: { text: "text-emerald-600", bg: "bg-emerald-50", ring: "text-emerald-600" },
  blue: { text: "text-blue-600", bg: "bg-blue-50", ring: "text-blue-600" },
  violet: { text: "text-violet-600", bg: "bg-violet-50", ring: "text-violet-600" },
};

export type Accent = keyof typeof accentMap;

function useCountUp(target: number, duration = 900, enabled = true) {
  const [value, setValue] = useState(enabled ? 0 : target);
  useEffect(() => {
    if (!enabled) return;
    let frame: number;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) frame = requestAnimationFrame(tick);
      else setValue(target);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, enabled]);
  return value;
}

export function KpiCard({
  label,
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
  sub,
  icon: Icon,
  accent = "indigo",
  countUp = true,
  index = 0,
}: {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  sub?: string;
  icon?: LucideIcon;
  accent?: Accent;
  countUp?: boolean;
  index?: number;
}) {
  const animated = useCountUp(value, 900, countUp);
  const display = countUp
    ? animated.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    : value.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
  const a = accentMap[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
    >
      <Card className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              {label}
            </p>
            <p className={cn("mt-2 text-3xl font-semibold", a.text)}>
              {prefix}
              {display}
              {suffix}
            </p>
            {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
          </div>
          {Icon && (
            <div className={cn("rounded-lg p-2", a.bg)}>
              <Icon className={cn("h-5 w-5", a.text)} />
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
