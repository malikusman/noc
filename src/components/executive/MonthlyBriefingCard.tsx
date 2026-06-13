import { BarChart3, CheckCircle2, Search, Wrench } from "lucide-react";
import { AgentTypeBadge } from "@/components/shared/AgentTypeBadge";
import { monthlyBriefing as b } from "@/data/executive";

export function MonthlyBriefingCard() {
  return (
    <div className="rounded-xl border border-slate-200 border-l-4 border-l-indigo-600 bg-white p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{b.title}</h3>
          <p className="text-xs text-slate-400">{b.generatedBy}</p>
        </div>
        <AgentTypeBadge type="Copilot" />
      </div>

      <div className="mt-5 space-y-5">
        {/* Volume */}
        <Section icon={BarChart3} title="Volume">
          <p className="text-sm text-slate-700">
            <span className="font-semibold">{b.volume.total}</span> incidents detected
          </p>
          <ul className="mt-1 space-y-0.5 pl-4 text-sm text-slate-500">
            <li>├─ {b.volume.critical} Critical</li>
            <li>├─ {b.volume.warning} Warning</li>
            <li>└─ {b.volume.low} Low</li>
          </ul>
        </Section>

        {/* Resolution */}
        <Section icon={CheckCircle2} title="Resolution">
          <p className="text-sm text-slate-700">
            <span className="font-semibold">{b.resolution.autoResolved}</span> automatically resolved ({b.resolution.autoResolvedPct}% auto-resolution)
          </p>
          <p className="text-sm text-slate-500">MTTR reduced {b.resolution.mttrReductionPct}% vs same period last year</p>
        </Section>

        {/* Root causes */}
        <Section icon={Search} title="Top Root Causes">
          <ol className="space-y-0.5 text-sm text-slate-600">
            {b.topRootCauses.map((c, i) => (
              <li key={c.cause}>
                <span className="text-slate-400">{i + 1}.</span> {c.cause} — <span className="font-medium text-slate-700">{c.count}</span> incidents
              </li>
            ))}
          </ol>
        </Section>

        {/* Recommendations */}
        <Section icon={Wrench} title="Recommended Improvements">
          <ul className="space-y-2 text-sm text-slate-700">
            {b.recommendations.map((r) => (
              <li key={r.text}>
                <span className="text-indigo-600">→</span> {r.text}
                <p className="pl-4 text-xs text-slate-400">({r.detail})</p>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof BarChart3;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-slate-100 pt-4 first:border-0 first:pt-0">
      <p className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-900">
        <Icon className="h-4 w-4 text-indigo-600" /> {title}
      </p>
      {children}
    </div>
  );
}
