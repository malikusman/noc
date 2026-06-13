import type { AgentProfile, A2AMessage, AgentAction } from "@/types";

export const agentProfiles: AgentProfile[] = [
  {
    name: "Event Correlation Agent",
    type: "Restricted",
    status: "Active",
    tasksToday: 847,
    avgConfidence: 91,
    humanApprovalRate: 0,
    lastAction: "2026-06-14T14:23:01Z",
    authorizedDomains: ["OSS", "Management Layer"],
    icon: "Network",
    note: "Fully automated — low-risk correlation, no human sign-off required.",
  },
  {
    name: "Root Cause Analysis Agent",
    type: "Restricted",
    status: "Processing",
    tasksToday: 37,
    avgConfidence: 88,
    humanApprovalRate: 12,
    lastAction: "2026-06-14T14:23:03Z",
    authorizedDomains: ["OSS", "Management Layer", "Core Network"],
    icon: "Search",
    note: "Escalates low-confidence diagnoses for human review (~12%).",
  },
  {
    name: "Impact Assessment Agent",
    type: "Restricted",
    status: "Active",
    tasksToday: 37,
    avgConfidence: 94,
    humanApprovalRate: 0,
    lastAction: "2026-06-14T14:23:05Z",
    authorizedDomains: ["BSS", "Management Layer"],
    icon: "Activity",
    note: "Read-only impact scoring — no field actions, no approval needed.",
  },
  {
    name: "Autonomous Remediation Agent",
    type: "Restricted",
    status: "Processing",
    tasksToday: 23,
    avgConfidence: 87,
    humanApprovalRate: 78,
    lastAction: "2026-06-14T14:23:07Z",
    authorizedDomains: ["OSS", "Management Layer", "Core Network", "Security Layer"],
    icon: "Wrench",
    note: "High approval rate — most field dispatch / config changes require a human gate.",
  },
];

export const copilotAgent: AgentProfile = {
  name: "Executive Intelligence Copilot",
  type: "Copilot",
  status: "Idle",
  tasksToday: 14,
  avgConfidence: 96,
  humanApprovalRate: 0,
  lastAction: "2026-06-14T13:10:00Z",
  authorizedDomains: ["OSS", "BSS", "Management Layer"],
  icon: "MessageSquare",
  note: "LLM-based copilot — natural-language read access, no autonomous actions.",
};

// 24h confidence observability series for the 4 agents (one point per ~2h)
export const agentConfidenceSeries = (() => {
  const hours = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];
  const base = {
    correlation: [92, 90, 93, 91, 89, 94, 90, 96, 91, 88, 92, 91],
    rootCause: [86, 84, 88, 90, 79, 88, 85, 94, 81, 77, 89, 88],
    impact: [93, 95, 92, 94, 91, 96, 90, 92, 94, 93, 95, 94],
    remediation: [85, 88, 84, 90, 79, 87, 86, 94, 81, 83, 89, 87],
  };
  return hours.map((h, i) => ({
    time: `${h.toString().padStart(2, "0")}:00`,
    correlation: base.correlation[i],
    rootCause: base.rootCause[i],
    impact: base.impact[i],
    remediation: base.remediation[i],
  }));
})();

// 20 A2A messages for the Observatory communication log (newest last)
export const a2aCommLog: A2AMessage[] = [
  { timestamp: "2026-06-14T14:23:07Z", fromAgent: "REMEDIATION_AGENT", toAgent: "NOC_OPERATOR", messageType: "approval_requested", goal: "restart_battery_controller", state: "awaiting_human_approval", latencyMs: 1400 },
  { timestamp: "2026-06-14T14:23:05Z", fromAgent: "IMPACT_AGENT", toAgent: "REMEDIATION_AGENT", messageType: "commitment_made", goal: "recommend_remediation", state: "escalate_if_unresolved_in_10m", latencyMs: 900 },
  { timestamp: "2026-06-14T14:23:03Z", fromAgent: "ROOT_CAUSE_AGENT", toAgent: "IMPACT_AGENT", messageType: "handoff_complete", goal: "assess_subscriber_impact", state: "handoff_complete", latencyMs: 2100 },
  { timestamp: "2026-06-14T14:23:01Z", fromAgent: "CORRELATION_AGENT", toAgent: "ROOT_CAUSE_AGENT", messageType: "handoff_complete", goal: "determine_root_cause", state: "handoff_complete", latencyMs: 1200 },
  { timestamp: "2026-06-14T13:55:03Z", fromAgent: "ROOT_CAUSE_AGENT", toAgent: "REMEDIATION_AGENT", messageType: "goal_assigned", goal: "reroute_backhaul_traffic", state: "in_progress", latencyMs: 1900 },
  { timestamp: "2026-06-14T13:55:01Z", fromAgent: "CORRELATION_AGENT", toAgent: "ROOT_CAUSE_AGENT", messageType: "handoff_complete", goal: "determine_root_cause", state: "handoff_complete", latencyMs: 1000 },
  { timestamp: "2026-06-14T12:10:02Z", fromAgent: "ROOT_CAUSE_AGENT", toAgent: "REMEDIATION_AGENT", messageType: "action_executed", goal: "restore_golden_config", state: "resolved", latencyMs: 1300 },
  { timestamp: "2026-06-14T12:10:01Z", fromAgent: "CORRELATION_AGENT", toAgent: "ROOT_CAUSE_AGENT", messageType: "handoff_complete", goal: "determine_root_cause", state: "handoff_complete", latencyMs: 600 },
  { timestamp: "2026-06-14T11:02:04Z", fromAgent: "IMPACT_AGENT", toAgent: "REMEDIATION_AGENT", messageType: "action_executed", goal: "suppress_false_escalation", state: "monitor_only", latencyMs: 700 },
  { timestamp: "2026-06-14T11:02:03Z", fromAgent: "ROOT_CAUSE_AGENT", toAgent: "IMPACT_AGENT", messageType: "context_shared", goal: "verify_planned_change", state: "matched_CHG-2026-0341", latencyMs: 1600 },
  { timestamp: "2026-06-14T11:02:01Z", fromAgent: "CORRELATION_AGENT", toAgent: "ROOT_CAUSE_AGENT", messageType: "handoff_complete", goal: "classify_degradation", state: "handoff_complete", latencyMs: 800 },
  { timestamp: "2026-06-14T10:40:02Z", fromAgent: "SECURITY_AGENT", toAgent: "SOC_OPERATOR", messageType: "action_executed", goal: "block_offending_ranges", state: "847_ips_blocked", latencyMs: 450 },
  { timestamp: "2026-06-14T10:40:01Z", fromAgent: "SECURITY_AGENT", toAgent: "SECURITY_AGENT", messageType: "context_shared", goal: "match_botnet_signature", state: "confidence_0.97", latencyMs: 300 },
  { timestamp: "2026-06-14T09:15:03Z", fromAgent: "CORRELATION_AGENT", toAgent: "ROOT_CAUSE_AGENT", messageType: "handoff_complete", goal: "determine_root_cause", state: "handoff_complete", latencyMs: 1100 },
  { timestamp: "2026-06-14T09:15:01Z", fromAgent: "ROOT_CAUSE_AGENT", toAgent: "IMPACT_AGENT", messageType: "goal_assigned", goal: "assess_subscriber_impact", state: "in_progress", latencyMs: 1700 },
  { timestamp: "2026-06-14T08:30:02Z", fromAgent: "ROOT_CAUSE_AGENT", toAgent: "REMEDIATION_AGENT", messageType: "action_executed", goal: "apply_qos_rebalancing", state: "resolved", latencyMs: 1500 },
  { timestamp: "2026-06-14T08:30:01Z", fromAgent: "CORRELATION_AGENT", toAgent: "ROOT_CAUSE_AGENT", messageType: "handoff_complete", goal: "determine_root_cause", state: "handoff_complete", latencyMs: 700 },
  { timestamp: "2026-06-14T07:15:02Z", fromAgent: "ROOT_CAUSE_AGENT", toAgent: "REMEDIATION_AGENT", messageType: "action_executed", goal: "restore_baseline_config", state: "resolved", latencyMs: 1200 },
  { timestamp: "2026-06-14T07:15:01Z", fromAgent: "CORRELATION_AGENT", toAgent: "ROOT_CAUSE_AGENT", messageType: "handoff_complete", goal: "determine_root_cause", state: "handoff_complete", latencyMs: 500 },
  { timestamp: "2026-06-14T06:50:01Z", fromAgent: "CORRELATION_AGENT", toAgent: "CORRELATION_AGENT", messageType: "context_shared", goal: "dedupe_alarm_storm", state: "noise_reduced_94pct", latencyMs: 400 },
];

// Agent x network-domain authorization matrix (IMF model)
export const authDomains = [
  "OSS",
  "BSS",
  "Management Layer",
  "Core Network",
  "Security Layer",
] as const;

export const authMatrix: { agent: string; domains: Record<string, boolean> }[] = [
  {
    agent: "Event Correlation Agent",
    domains: { OSS: true, BSS: false, "Management Layer": true, "Core Network": false, "Security Layer": false },
  },
  {
    agent: "Root Cause Analysis Agent",
    domains: { OSS: true, BSS: false, "Management Layer": true, "Core Network": true, "Security Layer": false },
  },
  {
    agent: "Impact Assessment Agent",
    domains: { OSS: false, BSS: true, "Management Layer": true, "Core Network": false, "Security Layer": false },
  },
  {
    agent: "Autonomous Remediation Agent",
    domains: { OSS: true, BSS: false, "Management Layer": true, "Core Network": true, "Security Layer": true },
  },
  {
    agent: "Executive Intelligence Copilot",
    domains: { OSS: true, BSS: true, "Management Layer": true, "Core Network": false, "Security Layer": false },
  },
];

// Autonomous Actions Feed (Command Center) — 10 recent agent actions
export const autonomousActions: AgentAction[] = [
  { timestamp: "14:23 UTC", agentName: "Autonomous Remediation Agent", agentType: "Restricted", siteId: "SA-1024", action: "Recommended battery controller restart", result: "Pending" },
  { timestamp: "14:10 UTC", agentName: "Autonomous Remediation Agent", agentType: "Restricted", siteId: "DXB-T-307", action: "Rerouted backhaul to redundant path", result: "Success" },
  { timestamp: "13:42 UTC", agentName: "Event Correlation Agent", agentType: "Restricted", siteId: "Core GW-1", action: "Collapsed 14,847 events → 1 DDoS incident", result: "Success" },
  { timestamp: "13:05 UTC", agentName: "Autonomous Remediation Agent", agentType: "Restricted", siteId: "RUH-N-089", action: "Auto-restored golden config", result: "Success" },
  { timestamp: "12:48 UTC", agentName: "Impact Assessment Agent", agentType: "Restricted", siteId: "DAM-K-160", action: "Scored fiber-cut impact (38.6k subs)", result: "Success" },
  { timestamp: "12:10 UTC", agentName: "Root Cause Analysis Agent", agentType: "Restricted", siteId: "JED-S-077", action: "Matched CDR degradation to CHG-2026-0341", result: "Success" },
  { timestamp: "11:30 UTC", agentName: "Autonomous Remediation Agent", agentType: "Restricted", siteId: "AUH-M-093", action: "Applied QoS rebalancing", result: "Success" },
  { timestamp: "10:40 UTC", agentName: "Autonomous Remediation Agent", agentType: "Restricted", siteId: "Core GW-1", action: "Blocked 847 IPs across 12 ranges", result: "Success" },
  { timestamp: "09:15 UTC", agentName: "Event Correlation Agent", agentType: "Restricted", siteId: "JED-E-129", action: "Correlated 18 alarms → UPS fault", result: "Success" },
  { timestamp: "08:30 UTC", agentName: "Root Cause Analysis Agent", agentType: "Restricted", siteId: "AUH-M-093", action: "Diagnosed backhaul congestion", result: "Success" },
];

export const guardrails = [
  { name: "Human Feedback Gate", status: "Enabled", detail: "All field dispatch & config changes require human sign-off" },
  { name: "Confidence Threshold", status: "85% min", detail: "Minimum confidence before any autonomous action" },
  { name: "Output Filtering", status: "Active", detail: "Agent outputs validated against safety + policy filters" },
];
