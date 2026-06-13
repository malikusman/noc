import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { n: 1, label: "Detect" },
  { n: 2, label: "Reason" },
  { n: 3, label: "Recommend" },
  { n: 4, label: "Approve" },
  { n: 5, label: "Execute" },
  { n: 6, label: "Verify" },
];

export function RemediationWorkflow({ activeStep }: { activeStep: number }) {
  return (
    <div>
      <div className="flex items-center">
        {steps.map((s, i) => {
          const done = s.n < activeStep;
          const active = s.n === activeStep;
          const isApprove = s.n === 4;
          return (
            <div key={s.n} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <motion.div
                  animate={active ? { scale: [1, 1.08, 1] } : {}}
                  transition={active ? { repeat: Infinity, duration: 2 } : {}}
                  className={cn(
                    "relative flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold",
                    done && "border-emerald-500 bg-emerald-500 text-white",
                    active && isApprove && "border-indigo-600 bg-indigo-50 text-indigo-600",
                    active && !isApprove && "border-blue-500 bg-blue-50 text-blue-600",
                    !done && !active && "border-slate-200 bg-white text-slate-300"
                  )}
                >
                  {done ? <Check className="h-5 w-5" /> : s.n}
                  {active && isApprove && (
                    <span className="absolute inset-0 animate-ping rounded-full border-2 border-indigo-400 opacity-60" />
                  )}
                </motion.div>
                <span
                  className={cn(
                    "text-xs font-medium",
                    done && "text-emerald-600",
                    active && isApprove && "text-indigo-600",
                    active && !isApprove && "text-blue-600",
                    !done && !active && "text-slate-400"
                  )}
                >
                  {s.label}
                </span>
                {active && isApprove && (
                  <span className="text-[10px] font-medium text-indigo-500">Human Approval Required</span>
                )}
              </div>
              {i < steps.length - 1 && (
                <div className={cn("mx-2 h-0.5 flex-1", s.n < activeStep ? "bg-emerald-400" : "bg-slate-200")} />
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-center text-xs italic text-slate-400">
        Aligned with Ericsson's zero-touch autonomous network model — human authorization required before field actions
      </p>
    </div>
  );
}
