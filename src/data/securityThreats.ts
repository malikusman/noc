import type { SecurityThreat } from "@/types";

export const securityThreats: SecurityThreat[] = [
  {
    id: "THR-20260614-0007",
    type: "DDoS",
    source: "Botnet (geo: Eastern Europe)",
    targetSites: ["Core GW-1", "DXB-M-422"],
    severity: "Critical",
    status: "Mitigated",
    peakTraffic: "2.4 Tbps",
    mitigatedInSeconds: 45,
    offendingIPs: [
      "185.220.101.0/24",
      "45.142.214.0/24",
      "193.32.162.0/24",
      "91.219.236.0/24",
      "194.165.16.0/24",
    ],
    correlationSteps: [
      "Firewall logs ingested — 14,847 events in 3s",
      "Router telemetry correlated — traffic pattern identified",
      "Flow records analyzed — botnet signature matched (confidence: 97%)",
      "Mitigation policy triggered — auto-approved (confidence > 95% threshold)",
      "Offending IP ranges blocked — 847 IPs across 12 ranges",
      "SOC notified — automated alert sent",
    ],
  },
  {
    id: "THR-20260614-0006",
    type: "AnomalousTraffic",
    source: "203.0.113.0/24",
    targetSites: ["RUH-E-145"],
    severity: "Warning",
    status: "Investigating",
  },
  {
    id: "THR-20260613-0005",
    type: "IntrusionAttempt",
    source: "198.51.100.42",
    targetSites: ["Core GW-2"],
    severity: "Warning",
    status: "Resolved",
  },
  {
    id: "THR-20260613-0004",
    type: "DDoS",
    source: "Botnet (geo: South-East Asia)",
    targetSites: ["JED-N-112"],
    severity: "Critical",
    status: "Resolved",
    peakTraffic: "640 Gbps",
    mitigatedInSeconds: 52,
  },
  {
    id: "THR-20260612-0003",
    type: "ConfigExploit",
    source: "Internal (misconfigured ACL)",
    targetSites: ["DAM-K-160"],
    severity: "Low",
    status: "Resolved",
  },
  {
    id: "THR-20260612-0002",
    type: "AnomalousTraffic",
    source: "192.0.2.0/24",
    targetSites: ["AUH-C-051"],
    severity: "Low",
    status: "Resolved",
  },
];

// Traffic time series for the DDoS deep-dive AreaChart (last ~2 hours, 5-min steps).
// Normal baseline ~180 Gbps, then a sharp attack spike toward 2.4 Tbps (2400 Gbps).
export const ddosTrafficSeries = (() => {
  const points: { time: string; normal: number; attack: number }[] = [];
  for (let i = 0; i < 24; i++) {
    const min = i * 5;
    const hh = 12 + Math.floor(min / 60);
    const mm = min % 60;
    const label = `${hh.toString().padStart(2, "0")}:${mm
      .toString()
      .padStart(2, "0")}`;
    const baseline = 170 + Math.round(Math.sin(i / 2) * 12) + (i % 3) * 4;
    let attack = 0;
    // attack ramps from index 14 -> peak at 18 -> mitigated by 20
    if (i >= 14 && i <= 20) {
      const ramp = [220, 540, 1180, 1900, 2400, 1100, 260];
      attack = ramp[i - 14];
    }
    points.push({ time: label, normal: baseline, attack });
  }
  return points;
})();

export const securityKpis = {
  activeThreats: 2,
  eventsAnalyzed24h: 4847,
  mitigationsApplied: 6,
  meanTimeToMitigateSec: 45,
};

export const threatIntelFeed = [
  { time: "14:41 UTC", text: "Botnet C2 beacon blocked — 185.220.101.x", sev: "Critical" as const },
  { time: "14:39 UTC", text: "UDP flood volume crossed 2 Tbps on Core GW-1", sev: "Critical" as const },
  { time: "14:22 UTC", text: "Anomalous east-west traffic on RUH-E-145", sev: "Warning" as const },
  { time: "13:58 UTC", text: "Port scan from 198.51.100.42 (Core GW-2)", sev: "Warning" as const },
  { time: "13:30 UTC", text: "TLS downgrade attempt rejected at edge", sev: "Warning" as const },
  { time: "12:55 UTC", text: "Geo-velocity anomaly flagged (admin login)", sev: "Low" as const },
  { time: "12:10 UTC", text: "ACL misconfig auto-corrected on DAM-K-160", sev: "Low" as const },
  { time: "11:40 UTC", text: "Signature DB updated to ruleset 2026.06.14", sev: "Info" as const },
  { time: "10:25 UTC", text: "Brute-force lockout on jump host (5 attempts)", sev: "Warning" as const },
  { time: "09:15 UTC", text: "Baseline traffic model retrained", sev: "Info" as const },
];

export const blockedRanges = [
  "185.220.101.0/24",
  "45.142.214.0/24",
  "193.32.162.0/24",
  "91.219.236.0/24",
  "194.165.16.0/24",
  "23.129.64.0/24",
  "171.25.193.0/24",
  "104.244.72.0/24",
];

export const socNotifications = [
  { time: "14:41 UTC", channel: "PagerDuty", text: "DDoS mitigation executed — Core GW-1" },
  { time: "14:41 UTC", channel: "Email", text: "SOC escalation: 2.4 Tbps UDP flood mitigated" },
  { time: "14:42 UTC", channel: "Slack #soc-alerts", text: "847 IPs blocked across 12 ranges" },
  { time: "14:43 UTC", channel: "ServiceNow", text: "SEC ticket SEC-2026-0188 auto-created" },
];
