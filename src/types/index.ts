export type SiteStatus = "Online" | "Degraded" | "Offline" | "Maintenance";
export type Severity = "Critical" | "Warning" | "Low" | "Info";
export type IncidentStatus =
  | "Investigating"
  | "Remediating"
  | "Resolved"
  | "Closed";
export type ThreatType =
  | "DDoS"
  | "AnomalousTraffic"
  | "IntrusionAttempt"
  | "ConfigExploit";
export type Vendor = "Huawei" | "Nokia" | "Ericsson";
export type AgentType = "Restricted" | "Copilot";
export type AgentStatus = "Active" | "Idle" | "Processing";
export type A2AMessageType =
  | "handoff_complete"
  | "goal_assigned"
  | "context_shared"
  | "commitment_made"
  | "approval_requested"
  | "action_executed";

export interface CellSite {
  id: string;
  name: string;
  region: string;
  vendor: Vendor;
  status: SiteStatus;
  activeAlarms: number;
  lastIncident: string;
  uptimePercent: number;
  towerType: string;
  /** Geographic coordinates for the network map */
  lat: number;
  lng: number;
  subscribers: number;
  mttrMinutes: number;
}

export interface AgentOutput {
  agentName: string;
  agentType: AgentType;
  status: "Complete" | "Running" | "Pending";
  summary: string;
  processingTime: string;
  confidence: number;
}

export interface A2AMessage {
  timestamp: string;
  fromAgent: string;
  toAgent: string;
  messageType: A2AMessageType;
  goal: string;
  state: string;
  latencyMs: number;
}

export interface Incident {
  id: string;
  siteId: string;
  rootCause: string;
  severity: Severity;
  sitesAffected: number;
  rawAlarmsCount: number;
  subscribersImpacted: number;
  revenueRisk: number;
  status: IncidentStatus;
  timestamp: string;
  agentOutputs: AgentOutput[];
  a2aLog: A2AMessage[];
}

export interface AgentProfile {
  name: string;
  type: AgentType;
  status: AgentStatus;
  tasksToday: number;
  avgConfidence: number;
  humanApprovalRate: number;
  lastAction: string;
  authorizedDomains: string[];
  icon: string;
  note?: string;
}

export interface SecurityThreat {
  id: string;
  type: ThreatType;
  source: string;
  targetSites: string[];
  severity: Severity;
  status: string;
  peakTraffic?: string;
  mitigatedInSeconds?: number;
  offendingIPs?: string[];
  correlationSteps?: string[];
}

export interface RemediationItem {
  siteId: string;
  incidentName: string;
  severity: Severity;
  confidence: number;
  status: "AwaitingApproval" | "InProgress" | "Resolved" | "Deferred";
  aiReasoning: string;
  immediateAction: string;
  fallbackPlan: string;
  escalationPath: string;
  subscribersAtRisk: number;
  revenueExposure: number;
  slaBreachIn: string;
  workflowStep: number; // 1-6
}

export interface RawAlarm {
  id: string;
  source: string;
  alarmType: string;
  siteId: string;
  severity: Severity;
  timestamp: string;
  correlatedTo?: string;
}

export interface AgentAction {
  timestamp: string;
  agentName: string;
  agentType: AgentType;
  siteId: string;
  action: string;
  result: "Success" | "Pending" | "Escalated";
}
