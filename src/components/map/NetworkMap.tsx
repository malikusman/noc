import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sites } from "@/data/sites";
import type { CellSite, SiteStatus } from "@/types";
import { cn } from "@/lib/utils";

// Bounding box for the Gulf region covered by the demo sites.
const BOUNDS = { minLng: 38.0, maxLng: 56.0, minLat: 20.0, maxLat: 27.5 };
const W = 820;
const H = 420;
const PAD = 36;

function project(lat: number, lng: number) {
  const x =
    PAD +
    ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * (W - PAD * 2);
  const y =
    PAD +
    ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * (H - PAD * 2);
  return { x, y };
}

const statusColor: Record<SiteStatus, string> = {
  Online: "#10b981",
  Degraded: "#f59e0b",
  Offline: "#ef4444",
  Maintenance: "#0ea5e9",
};

// Decorative, stylised Arabian-peninsula landmass (not geographically exact —
// purely a backdrop so the map reads as a region, fully self-contained / offline).
const LANDMASS =
  "M70,150 C120,110 200,90 280,86 C360,82 430,70 520,92 C600,110 690,120 760,170 " +
  "C780,220 770,300 720,340 C660,380 560,372 470,360 C380,350 300,372 230,350 " +
  "C150,326 96,300 78,250 C66,216 58,182 70,150 Z";

const cities = [
  { name: "Riyadh", lat: 24.71, lng: 46.67 },
  { name: "Dubai", lat: 25.2, lng: 55.27 },
  { name: "Jeddah", lat: 21.54, lng: 39.17 },
  { name: "Dammam", lat: 26.43, lng: 50.1 },
  { name: "Abu Dhabi", lat: 24.45, lng: 54.38 },
  { name: "Sharjah", lat: 25.35, lng: 55.4 },
];

export function NetworkMap() {
  const navigate = useNavigate();
  const [hover, setHover] = useState<CellSite | null>(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full rounded-lg bg-gradient-to-br from-slate-50 to-indigo-50/40"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* subtle graticule */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0 H0 V40" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#grid)" />

        {/* landmass */}
        <path d={LANDMASS} fill="#eef2ff" stroke="#c7d2fe" strokeWidth="1.5" />

        {/* city labels */}
        {cities.map((c) => {
          const { x, y } = project(c.lat, c.lng);
          return (
            <text
              key={c.name}
              x={x + 8}
              y={y - 10}
              className="fill-slate-400"
              fontSize="10"
              fontWeight={500}
            >
              {c.name}
            </text>
          );
        })}

        {/* site pins */}
        {sites.map((s) => {
          const { x, y } = project(s.lat, s.lng);
          const color = statusColor[s.status];
          const alert = s.status === "Offline" || s.status === "Degraded";
          return (
            <g
              key={s.id}
              transform={`translate(${x},${y})`}
              className="cursor-pointer"
              onMouseEnter={() => {
                setHover(s);
                setHoverPos({ x, y });
              }}
              onMouseLeave={() => setHover(null)}
              onClick={() => navigate("/sites")}
            >
              {alert && (
                <circle r="11" fill={color} opacity="0.25">
                  <animate
                    attributeName="r"
                    values="6;16;6"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.35;0;0.35"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
              <circle r="5" fill={color} stroke="#fff" strokeWidth="1.5" />
            </g>
          );
        })}
      </svg>

      {/* hover tooltip */}
      {hover && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-md"
          style={{
            left: `${(hoverPos.x / W) * 100}%`,
            top: `${(hoverPos.y / H) * 100}%`,
          }}
        >
          <p className="font-mono font-semibold text-slate-900">{hover.id}</p>
          <p className="text-slate-500">{hover.name}</p>
          <p className="mt-1 flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: statusColor[hover.status] }}
            />
            <span className="text-slate-600">
              {hover.status} · {hover.activeAlarms} alarms
            </span>
          </p>
        </div>
      )}

      {/* legend */}
      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
        {(Object.keys(statusColor) as SiteStatus[]).map((s) => (
          <span key={s} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: statusColor[s] }}
            />
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
