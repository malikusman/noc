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
import { alarmBreakdown } from "@/data/alerts";
import { GRID_STROKE, AXIS_TICK, tooltipStyle, tooltipLabelStyle } from "./chartTheme";

export function AlarmSummaryChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        layout="vertical"
        data={alarmBreakdown}
        margin={{ top: 4, right: 28, left: 8, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} horizontal={false} />
        <XAxis type="number" tick={AXIS_TICK} tickLine={false} axisLine={false} />
        <YAxis
          type="category"
          dataKey="category"
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={false}
          width={72}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          labelStyle={tooltipLabelStyle}
          cursor={{ fill: "rgba(79,70,229,0.05)" }}
        />
        <Bar dataKey="count" name="Active alarms" radius={[0, 4, 4, 0]} barSize={18}>
          {alarmBreakdown.map((d) => (
            <Cell key={d.category} fill={d.color} />
          ))}
          <LabelList dataKey="count" position="right" style={{ fill: "#475569", fontSize: 12 }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
