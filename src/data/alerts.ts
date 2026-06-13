import type { RawAlarm, Severity } from "@/types";

const sources = [
  "Huawei OSS",
  "Nokia NetAct",
  "Ericsson OSS",
  "Power subsystem",
  "Backhaul",
  "ServiceNow",
];

// The 37 raw alarms that the Event Correlation Agent collapsed into
// INC-20260614-0047 (SA-1024 battery controller failure).
const sa1024AlarmTemplates: { source: string; type: string; sev: Severity }[] = [
  { source: "Power subsystem", type: "Battery controller comms lost", sev: "Critical" },
  { source: "Power subsystem", type: "Rectifier output voltage low", sev: "Critical" },
  { source: "Power subsystem", type: "DC bus undervoltage", sev: "Critical" },
  { source: "Power subsystem", type: "Battery temperature high", sev: "Warning" },
  { source: "Power subsystem", type: "Battery discharge current abnormal", sev: "Warning" },
  { source: "Huawei OSS", type: "NodeB cell out of service", sev: "Critical" },
  { source: "Huawei OSS", type: "Board hardware fault", sev: "Critical" },
  { source: "Huawei OSS", type: "RF unit power down", sev: "Critical" },
  { source: "Huawei OSS", type: "Cell unavailable (sector 1)", sev: "Critical" },
  { source: "Huawei OSS", type: "Cell unavailable (sector 2)", sev: "Critical" },
  { source: "Huawei OSS", type: "Cell unavailable (sector 3)", sev: "Critical" },
  { source: "Huawei OSS", type: "S1 link down", sev: "Critical" },
  { source: "Nokia NetAct", type: "Adjacent site handover failure", sev: "Warning" },
  { source: "Nokia NetAct", type: "Neighbour relation degraded", sev: "Warning" },
  { source: "Backhaul", type: "Transport link loss of signal", sev: "Critical" },
  { source: "Backhaul", type: "Ethernet port down", sev: "Critical" },
  { source: "Backhaul", type: "Sync reference lost", sev: "Warning" },
];

function buildSA1024Alarms(): RawAlarm[] {
  const out: RawAlarm[] = [];
  // 14:23:00 base time, alarms arriving across ~90 seconds
  for (let i = 0; i < 37; i++) {
    const t = sa1024AlarmTemplates[i % sa1024AlarmTemplates.length];
    const sec = (i * 2) % 60;
    const min = 22 + Math.floor((i * 2) / 60);
    out.push({
      id: `ALM-${(100000 + i).toString()}`,
      source: t.source,
      alarmType: t.type,
      siteId: "SA-1024",
      severity: t.sev,
      timestamp: `2026-06-14T14:${min.toString().padStart(2, "0")}:${sec
        .toString()
        .padStart(2, "0")}Z`,
      correlatedTo: "INC-20260614-0047",
    });
  }
  return out;
}

// A few standalone alarms from other sites (not part of the SA-1024 cluster)
const otherAlarms: RawAlarm[] = [
  {
    id: "ALM-100200",
    source: "Backhaul",
    alarmType: "Microwave SNR degraded",
    siteId: "DXB-T-307",
    severity: "Warning",
    timestamp: "2026-06-14T13:55:02Z",
    correlatedTo: "INC-20260614-0044",
  },
  {
    id: "ALM-100201",
    source: "ServiceNow",
    alarmType: "CDR feed degradation (billing)",
    siteId: "JED-S-077",
    severity: "Warning",
    timestamp: "2026-06-14T11:02:00Z",
    correlatedTo: "INC-20260614-0051",
  },
  {
    id: "ALM-100202",
    source: "Ericsson OSS",
    alarmType: "Config mismatch (neighbour list)",
    siteId: "RUH-N-089",
    severity: "Low",
    timestamp: "2026-06-14T12:10:00Z",
    correlatedTo: "INC-20260614-0039",
  },
];

export const rawAlarms: RawAlarm[] = [...buildSA1024Alarms(), ...otherAlarms];

export const sa1024SourceAlarms = rawAlarms.filter(
  (a) => a.correlatedTo === "INC-20260614-0047"
);

// Active alarm breakdown by category (Command Center)
export const alarmBreakdown = [
  { category: "Power", count: 34, color: "#4f46e5" },
  { category: "Fiber", count: 28, color: "#0ea5e9" },
  { category: "Backhaul", count: 22, color: "#10b981" },
  { category: "Hardware", count: 19, color: "#f59e0b" },
  { category: "Config", count: 15, color: "#8b5cf6" },
  { category: "Security", count: 8, color: "#ef4444" },
];
