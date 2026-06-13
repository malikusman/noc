import { motion } from "framer-motion";
import { Server, GitMerge, FileWarning } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { correlationStats } from "@/data/incidents";

const sources = ["Huawei OSS", "Nokia NetAct", "Power System"];

export function CorrelationFlowBanner() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:justify-between">
          {/* Flow visualization */}
          <div className="flex w-full items-center justify-center gap-3 lg:w-auto">
            {/* sources */}
            <div className="space-y-2">
              {sources.map((s, i) => (
                <motion.div
                  key={s}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600"
                >
                  <Server className="h-3.5 w-3.5 text-slate-400" />
                  {s}
                </motion.div>
              ))}
            </div>

            {/* animated connector */}
            <svg width="60" height="80" className="shrink-0">
              <defs>
                <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill="#4f46e5" />
                </marker>
              </defs>
              {[16, 40, 64].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="52"
                  y2="40"
                  stroke="#a5b4fc"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  markerEnd="url(#arrow)"
                  className="animate-flow-dash"
                />
              ))}
            </svg>

            {/* correlation agent */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-center"
            >
              <GitMerge className="h-5 w-5 text-violet-600" />
              <p className="mt-1 text-xs font-semibold text-violet-700">Event Correlation Agent</p>
              <p className="text-[10px] text-violet-500">37 alarms → 1</p>
            </motion.div>

            {/* arrow */}
            <svg width="44" height="40" className="shrink-0">
              <line x1="0" y1="20" x2="36" y2="20" stroke="#a5b4fc" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arrow)" className="animate-flow-dash" />
            </svg>

            {/* incident */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col items-center rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-center"
            >
              <FileWarning className="h-5 w-5 text-indigo-600" />
              <p className="mt-1 text-xs font-semibold text-indigo-700">1 Incident</p>
              <p className="text-[10px] text-indigo-500">correlated</p>
            </motion.div>
          </div>

          {/* stats */}
          <div className="grid w-full grid-cols-2 gap-4 lg:w-auto lg:grid-cols-4 lg:gap-8">
            <Stat value={correlationStats.rawAlarmsToday.toLocaleString()} label="raw alarms today" />
            <Stat value={`${correlationStats.correlatedIncidents}`} label="correlated incidents" />
            <Stat value={`${correlationStats.noiseReductionPct}%`} label="noise reduction" accent />
            <Stat value={correlationStats.avgCorrelationTime} label="avg correlation time" />
          </div>
        </div>

        <p className="mt-5 border-t border-slate-100 pt-3 text-center text-xs italic text-slate-400">
          Based on TM Forum Intent Management Framework — agents operate within authorized network domains
        </p>
      </CardContent>
    </Card>
  );
}

function Stat({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  return (
    <div className="text-center lg:text-left">
      <p className={`text-2xl font-semibold ${accent ? "text-emerald-600" : "text-slate-900"}`}>{value}</p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  );
}
