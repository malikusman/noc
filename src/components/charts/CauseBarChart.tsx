import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LabelList,
} from "recharts";
import { causeBreakdown } from "@/data/executive";
import { GRID_STROKE, AXIS_TICK, tooltipStyle, tooltipLabelStyle } from "./chartTheme";

export function CauseBarChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart layout="vertical" data={causeBreakdown} margin={{ top: 4, right: 32, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} horizontal={false} />
        <XAxis type="number" tick={AXIS_TICK} tickLine={false} axisLine={false} />
        <YAxis type="category" dataKey="cause" tick={AXIS_TICK} tickLine={false} axisLine={false} width={120} />
        <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} cursor={{ fill: "rgba(79,70,229,0.05)" }} />
        <Bar dataKey="count" name="Incidents" radius={[0, 4, 4, 0]} barSize={18}>
          {causeBreakdown.map((d) => (
            <Cell key={d.cause} fill={d.color} />
          ))}
          <LabelList dataKey="count" position="right" style={{ fill: "#475569", fontSize: 12 }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
