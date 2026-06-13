// All analytics chart data — stable hardcoded values, 2026-dated.

// Network Health Trend (Command Center) — 30 days, availability % + MTTR minutes
export const networkHealthTrend = (() => {
  const out: { day: string; availability: number; mttr: number }[] = [];
  for (let d = 0; d < 30; d++) {
    const day = `Jun ${d + 1}`;
    const availability = +(98.6 + Math.sin(d / 4) * 0.7 - (d === 13 ? 1.4 : 0)).toFixed(2);
    const mttr = Math.round(72 - d * 0.8 + Math.cos(d / 3) * 6 + (d === 13 ? 22 : 0));
    out.push({ day, availability, mttr });
  }
  return out;
})();

// Incident Volume by Category — 8 weeks, grouped bars
export const incidentVolumeByCategory = [
  { week: "W1", Power: 9, Fiber: 7, Backhaul: 5, Hardware: 4, Config: 6 },
  { week: "W2", Power: 8, Fiber: 6, Backhaul: 6, Hardware: 5, Config: 4 },
  { week: "W3", Power: 11, Fiber: 8, Backhaul: 4, Hardware: 3, Config: 5 },
  { week: "W4", Power: 7, Fiber: 9, Backhaul: 7, Hardware: 4, Config: 3 },
  { week: "W5", Power: 10, Fiber: 6, Backhaul: 5, Hardware: 6, Config: 4 },
  { week: "W6", Power: 6, Fiber: 7, Backhaul: 8, Hardware: 4, Config: 6 },
  { week: "W7", Power: 9, Fiber: 5, Backhaul: 6, Hardware: 5, Config: 4 },
  { week: "W8", Power: 8, Fiber: 8, Backhaul: 5, Hardware: 3, Config: 5 },
];

// MTTR Before vs After Scorpius — 12 weeks
export const mttrTrend = (() => {
  const out: { week: string; before: number; after: number }[] = [];
  for (let w = 0; w < 12; w++) {
    out.push({
      week: `W${w + 1}`,
      before: 180 - w * 1.2,
      after: Math.round(132 - w * 7 + (w > 9 ? 0 : 0)),
    });
  }
  // pin the endpoints to the headline numbers (180 -> 47)
  out[0].after = 132;
  out[11].after = 47;
  out[0].before = 180;
  out[11].before = 168;
  return out;
})();

// Auto-Resolution Rate — 12 weeks, 34% -> 68%
export const autoResolutionTrend = (() => {
  const out: { week: string; rate: number }[] = [];
  for (let w = 0; w < 12; w++) {
    out.push({ week: `W${w + 1}`, rate: Math.round(34 + (68 - 34) * (w / 11)) });
  }
  return out;
})();

// Incident Distribution by Vendor — pie
export const vendorDistribution = [
  { name: "Huawei", value: 42, color: "#4f46e5" },
  { name: "Nokia", value: 31, color: "#0ea5e9" },
  { name: "Ericsson", value: 27, color: "#10b981" },
];

export const analyticsSummary = {
  totalIncidents: 1847,
  autoResolved: 1249,
  autoResolvedPct: 67.6,
  avgMttrMin: 47,
  mttrReductionPct: 63,
  costAvoidance: "$2.4M",
  slaCompliancePct: 99.2,
};

// Monthly highlights (Command Center bottom row)
export const monthlyHighlights = {
  incidents: 147,
  autoResolved: 82,
  mttrReductionPct: 63,
};
