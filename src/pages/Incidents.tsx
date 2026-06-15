import { useState, Fragment } from "react";
import { AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CorrelationFlowBanner } from "@/components/incidents/CorrelationFlowBanner";
import { IncidentDetailPanel } from "@/components/incidents/IncidentDetailPanel";
import { PlannedVsUnplannedCard } from "@/components/incidents/PlannedVsUnplannedCard";
import { incidents } from "@/data/incidents";
import { formatCurrency, formatNumber, cn } from "@/lib/utils";

export default function Incidents() {
  const [openId, setOpenId] = useState<string | null>("INC-20260614-0047");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Incident Correlation"
        subtitle="Multi-vendor alarm correlation — the Event Correlation Agent collapses thousands of raw alarms into a handful of actionable incidents."
      />

      <CorrelationFlowBanner />

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Incident ID</TableHead>
                <TableHead className="hidden sm:table-cell">Root Cause</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead className="hidden md:table-cell text-right">Sites</TableHead>
                <TableHead className="hidden md:table-cell text-right">Alarms ↓</TableHead>
                <TableHead className="hidden lg:table-cell text-right">Subscribers</TableHead>
                <TableHead className="hidden lg:table-cell text-right">Revenue Risk</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents.map((inc) => {
                const isOpen = openId === inc.id;
                return (
                  <Fragment key={inc.id}>
                    <TableRow className={cn(isOpen && "bg-indigo-50/40")}>
                      <TableCell className="font-mono text-xs font-medium text-slate-900">
                        {inc.id}
                        {/* On mobile, show severity + status inline */}
                        <div className="mt-1 flex items-center gap-1.5 sm:hidden">
                          <StatusBadge status={inc.severity} />
                          <StatusBadge status={inc.status} />
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm">{inc.rootCause}</TableCell>
                      <TableCell className="hidden sm:table-cell"><StatusBadge status={inc.severity} /></TableCell>
                      <TableCell className="hidden md:table-cell text-right text-sm">{inc.sitesAffected}</TableCell>
                      <TableCell className="hidden md:table-cell text-right">
                        <span className="font-mono text-xs text-slate-500">{inc.rawAlarmsCount} → 1</span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-right text-sm">{formatNumber(inc.subscribersImpacted)}</TableCell>
                      <TableCell className="hidden lg:table-cell text-right text-sm">
                        {inc.revenueRisk ? `${formatCurrency(inc.revenueRisk)}/day` : "—"}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell"><StatusBadge status={inc.status} /></TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant={isOpen ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setOpenId(isOpen ? null : inc.id)}
                        >
                          Analyze
                          <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={9} className="p-0">
                        <AnimatePresence initial={false}>
                          {isOpen && <IncidentDetailPanel incident={inc} />}
                        </AnimatePresence>
                      </TableCell>
                    </TableRow>
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      <PlannedVsUnplannedCard />
    </div>
  );
}
