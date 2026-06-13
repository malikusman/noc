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
import { mttrTrend } from "@/data/analytics";
import { GRID_STROKE, AXIS_TICK, tooltipStyle, tooltipLabelStyle } from "./chartTheme";

export function MTTRTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={mttrTrend} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
        <XAxis dataKey="week" tick={AXIS_TICK} tickLine={false} axisLine={false} />
        <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} unit="m" />
        <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line
          type="monotone"
          dataKey="before"
          name="Before Scorpius"
          stroke="#f59e0b"
          strokeWidth={2}
          strokeDasharray="6 4"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="after"
          name="After Scorpius"
          stroke="#4f46e5"
          strokeWidth={2.5}
          dot={{ r: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
