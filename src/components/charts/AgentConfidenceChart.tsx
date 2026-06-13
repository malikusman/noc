import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { agentConfidenceSeries } from "@/data/agents";
import { CHART_COLORS, GRID_STROKE, AXIS_TICK, tooltipStyle, tooltipLabelStyle } from "./chartTheme";

const series = [
  { key: "correlation", name: "Event Correlation", color: CHART_COLORS[0] },
  { key: "rootCause", name: "Root Cause Analysis", color: CHART_COLORS[1] },
  { key: "impact", name: "Impact Assessment", color: CHART_COLORS[2] },
  { key: "remediation", name: "Autonomous Remediation", color: CHART_COLORS[5] },
];

export function AgentConfidenceChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={agentConfidenceSeries} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
        <XAxis dataKey="time" tick={AXIS_TICK} tickLine={false} axisLine={false} />
        <YAxis domain={[70, 100]} tick={AXIS_TICK} tickLine={false} axisLine={false} unit="%" />
        <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {series.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.name}
            stroke={s.color}
            strokeWidth={2}
            dot={{ r: 2 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
