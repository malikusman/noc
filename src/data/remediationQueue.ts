import type { RemediationItem } from "@/types";

export const remediationQueue: RemediationItem[] = [
  {
    siteId: "SA-1024",
    incidentName: "Battery Controller Failure",
    severity: "Critical",
    confidence: 94,
    status: "AwaitingApproval",
    aiReasoning:
      "AI Assessment: Thermal and electrical telemetry from SA-1024 indicates battery controller failure. Cross-referenced with Huawei OSS alarm logs, Nokia NetAct backhaul data, and power subsystem readings. Root cause isolated with 94% confidence. Remote restart has 89% historical success rate for this fault type. Estimated restoration time: 8 minutes post-approval.",
    immediateAction: "Restart battery controller remotely via Huawei OSS API",
    fallbackPlan:
      "If remote restart fails after 2 attempts — dispatch field technician with replacement unit",
    escalationPath:
      "Auto-page NOC Lead + Site Manager if unresolved in 30 minutes",
    subscribersAtRisk: 18500,
    revenueExposure: 70400,
    slaBreachIn: "1h 47m",
    workflowStep: 4,
  },
  {
    siteId: "DXB-T-307",
    incidentName: "Backhaul Link Degraded",
    severity: "Warning",
    confidence: 81,
    status: "InProgress",
    aiReasoning:
      "AI Assessment: Microwave backhaul SNR on the Dubai Trade Centre link dropped 11 dB over 40 minutes, consistent with weather-related fading. Redundant path has spare capacity. Confidence 81%. Recommended low-risk reroute is auto-approved per policy; physical realignment scheduled as follow-up.",
    immediateAction: "Reroute subscriber traffic to redundant backhaul path",
    fallbackPlan:
      "If SNR does not recover in 60 minutes — schedule microwave antenna realignment",
    escalationPath: "Notify Transport team if redundant path utilisation > 90%",
    subscribersAtRisk: 22400,
    revenueExposure: 41200,
    slaBreachIn: "No breach — within tolerance",
    workflowStep: 5,
  },
  {
    siteId: "RUH-N-089",
    incidentName: "Config Drift Detected",
    severity: "Low",
    confidence: 77,
    status: "Resolved",
    aiReasoning:
      "AI Assessment: Neighbour-list parameters on RUH-N-089 drifted from the golden configuration after a recent parameter push, causing minor handover failures. Confidence 77%. Low-risk config restoration was auto-approved and executed; drift reconciled.",
    immediateAction: "Restore golden configuration (neighbour list) via Ericsson OSS",
    fallbackPlan: "If drift recurs — lock parameter set and open change request",
    escalationPath: "Notify RAN Optimisation team if handover KPI does not recover",
    subscribersAtRisk: 9300,
    revenueExposure: 8600,
    slaBreachIn: "Resolved",
    workflowStep: 6,
  },
];

export interface RemediationHistoryRow {
  incident: string;
  action: string;
  executedBy: "Agent" | "Human";
  duration: string;
  result: "Success" | "Partial" | "Escalated";
  timestamp: string;
}

export const remediationHistory: RemediationHistoryRow[] = [
  {
    incident: "INC-20260613-0032 — Fiber cut (DAM-K-160)",
    action: "Field technician dispatched + splice",
    executedBy: "Human",
    duration: "2h 14m",
    result: "Success",
    timestamp: "2026-06-13 18:32 UTC",
  },
  {
    incident: "INC-20260613-0028 — Power failure (DXB-M-422)",
    action: "Fuel delivery + generator restart",
    executedBy: "Human",
    duration: "1h 02m",
    result: "Success",
    timestamp: "2026-06-13 10:44 UTC",
  },
  {
    incident: "INC-20260614-0039 — Config drift (RUH-N-089)",
    action: "Auto-restore golden config",
    executedBy: "Agent",
    duration: "0h 04m",
    result: "Success",
    timestamp: "2026-06-14 12:14 UTC",
  },
  {
    incident: "INC-20260612-0015 — Backhaul congestion (AUH-M-093)",
    action: "QoS rebalancing",
    executedBy: "Agent",
    duration: "0h 03m",
    result: "Success",
    timestamp: "2026-06-12 08:33 UTC",
  },
  {
    incident: "INC-20260612-0021 — RRU fault (JED-N-112)",
    action: "RRU swap (sector 2)",
    executedBy: "Human",
    duration: "3h 20m",
    result: "Success",
    timestamp: "2026-06-12 17:25 UTC",
  },
  {
    incident: "INC-20260611-0009 — Cooling fault (RUH-E-145)",
    action: "HVAC technician dispatched",
    executedBy: "Human",
    duration: "1h 47m",
    result: "Success",
    timestamp: "2026-06-11 15:35 UTC",
  },
  {
    incident: "INC-20260611-0004 — Config drift (DAM-H-204)",
    action: "Auto-restore baseline parameters",
    executedBy: "Agent",
    duration: "0h 03m",
    result: "Success",
    timestamp: "2026-06-11 07:18 UTC",
  },
  {
    incident: "INC-20260610-0118 — Fiber cut (DXB-A-340)",
    action: "Field splice team dispatched",
    executedBy: "Human",
    duration: "2h 38m",
    result: "Success",
    timestamp: "2026-06-10 22:08 UTC",
  },
  {
    incident: "INC-20260610-0102 — UPS fault (JED-E-129)",
    action: "UPS battery replacement scheduled",
    executedBy: "Human",
    duration: "4h 05m",
    result: "Partial",
    timestamp: "2026-06-10 16:00 UTC",
  },
  {
    incident: "THR-20260614-0007 — DDoS (Core GW-1)",
    action: "Mitigation policy + IP block (auto)",
    executedBy: "Agent",
    duration: "0h 00m 45s",
    result: "Success",
    timestamp: "2026-06-14 14:41 UTC",
  },
];
