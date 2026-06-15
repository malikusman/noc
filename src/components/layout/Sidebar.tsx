import { NavLink, useLocation } from "react-router-dom";
import {
  TrendingDown,
  Link2,
  DollarSign,
  Home,
  Radio,
  Bot,
  Shield,
  Brain,
  BarChart3,
  MessageSquare,
  Settings,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const intelligence = [
  { to: "/intelligence/downtime", label: "Downtime Prevention", icon: TrendingDown },
  { to: "/incidents", label: "Incident Correlation", icon: Link2 },
  { to: "/intelligence/revenue", label: "Revenue Protection", icon: DollarSign },
];

const operations = [
  { to: "/", label: "Overview", icon: Home, end: true },
  { to: "/sites", label: "Cell Site Management", icon: Radio },
  { to: "/remediation", label: "Autonomous Remediation", icon: Bot },
  { to: "/security", label: "Security Operations", icon: Shield },
  { to: "/agent-observatory", label: "Agent Observatory", icon: Brain },
  { to: "/analytics", label: "Analytics & Reports", icon: BarChart3 },
  { to: "/executive", label: "Executive Intelligence", icon: MessageSquare },
  { to: "/settings", label: "Settings", icon: Settings },
];

function NavItem({
  to,
  label,
  icon: Icon,
  end,
  onClose,
}: {
  to: string;
  label: string;
  icon: typeof Home;
  end?: boolean;
  onClose?: () => void;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClose}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
          isActive
            ? "bg-indigo-50 font-medium text-indigo-600"
            : "text-slate-600 hover:bg-slate-100"
        )
      }
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{label}</span>
    </NavLink>
  );
}

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex w-[220px] flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out",
        open ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0"
      )}
    >
      {/* Brand */}
      <div className="flex h-14 items-center gap-2 border-b border-slate-200 px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600">
          <Shield className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1 leading-tight">
          <p className="text-sm font-semibold text-slate-900">Scorpius</p>
          <p className="text-[10px] uppercase tracking-wide text-slate-400">Networks</p>
        </div>
        {/* Close button — mobile only */}
        <button
          className="flex items-center justify-center rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 md:hidden"
          onClick={onClose}
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 scrollbar-thin">
        <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Intelligence
        </p>
        {intelligence.map((i) => (
          <NavItem key={i.to} {...i} onClose={onClose} />
        ))}

        <div className="my-3 border-t border-slate-100" />

        <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Operations
        </p>
        {operations.map((i) => (
          <NavItem key={i.to} {...i} onClose={onClose} />
        ))}
      </nav>

      {/* Footer */}
      <div className="space-y-3 border-t border-slate-200 p-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="font-medium text-slate-600">All Systems Nominal</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
            AR
          </div>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-xs font-medium text-slate-900">Ahmed Al-Rashid</p>
            <p className="text-[10px] text-slate-400">NOC Lead</p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-medium text-violet-700">
          <Shield className="h-3 w-3" />
          Restricted Agent Mode
        </div>
      </div>
    </aside>
  );
}
