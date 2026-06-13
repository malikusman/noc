import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { incidentVolumeByCategory } from "@/data/analytics";
import { CHART_COLORS, GRID_STROKE, AXIS_TICK, tooltipStyle, tooltipLabelStyle } from "./chartTheme";

const categories = ["Power", "Fiber", "Backhaul", "Hardware", "Config"];

export function IncidentVolumeChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={incidentVolumeByCategory} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
        <XAxis dataKey="week" tick={AXIS_TICK} tickLine={false} axisLine={false} />
        <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} cursor={{ fill: "rgba(79,70,229,0.05)" }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {categories.map((c, i) => (
          <Bar key={c} dataKey={c} stackId="a" fill={CHART_COLORS[i]} radius={i === categories.length - 1 ? [3, 3, 0, 0] : 0} barSize={26} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
