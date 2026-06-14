import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ComposableMap, Geographies, Geography, Marker, Line } from "react-simple-maps";
import topology from "world-atlas/countries-110m.json";
import { sites } from "@/data/sites";
import type { CellSite, SiteStatus } from "@/types";

const statusColor: Record<SiteStatus, string> = {
  Online: "#10b981",
  Degraded: "#f59e0b",
  Offline: "#ef4444",
  Maintenance: "#0ea5e9",
};

// Core network node (where backhaul/topology converges) — central Gulf.
const CORE: [number, number] = [49.5, 25.2];

// Gulf-region country ISO numeric ids in world-atlas (highlight these).
const GULF_IDS = new Set([
  "682", // Saudi Arabia
  "784", // UAE
  "634", // Qatar
  "414", // Kuwait
  "048", // Bahrain
  "512", // Oman
  "364", // Iran
  "368", // Iraq
]);

export function NetworkMap() {
  const navigate = useNavigate();
  const [hover, setHover] = useState<CellSite | null>(null);

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 to-slate-800">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ center: [48.5, 24.2], scale: 1700 }}
          width={820}
          height={420}
          style={{ width: "100%", height: "auto" }}
        >
          {/* subtle ocean grid */}
          <defs>
            <pattern id="oceanGrid" width="28" height="28" patternUnits="userSpaceOnUse">
              <path d="M28 0 H0 V28" fill="none" stroke="#1e293b" strokeWidth="0.6" />
            </pattern>
            <filter id="pinGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect x={0} y={0} width={820} height={420} fill="url(#oceanGrid)" />

          <Geographies geography={topology}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isGulf = GULF_IDS.has(String(geo.id));
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: {
                        fill: isGulf ? "#334155" : "#1e293b",
                        stroke: isGulf ? "#475569" : "#27354a",
                        strokeWidth: 0.5,
                        outline: "none",
                      },
                      hover: {
                        fill: isGulf ? "#3b4860" : "#1e293b",
                        outline: "none",
                      },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {/* topology arcs: each site → core node */}
          {sites.map((s) => (
            <Line
              key={`line-${s.id}`}
              from={[s.lng, s.lat]}
              to={CORE}
              stroke={s.status === "Offline" ? "#ef4444" : "#475569"}
              strokeWidth={s.status === "Offline" ? 1 : 0.5}
              strokeOpacity={s.status === "Offline" ? 0.6 : 0.25}
              strokeLinecap="round"
            />
          ))}

          {/* core node */}
          <Marker coordinates={CORE}>
            <g>
              <circle r={7} fill="#4f46e5" opacity={0.25} />
              <circle r={3.5} fill="#818cf8" stroke="#fff" strokeWidth={1} />
              <text textAnchor="middle" y={-11} fill="#a5b4fc" fontSize={9} fontWeight={600}>
                Core GW-1
              </text>
            </g>
          </Marker>

          {/* site pins */}
          {sites.map((s) => {
            const color = statusColor[s.status];
            const alert = s.status === "Offline" || s.status === "Degraded";
            return (
              <Marker
                key={s.id}
                coordinates={[s.lng, s.lat]}
                onMouseEnter={() => setHover(s)}
                onMouseLeave={() => setHover(null)}
                onClick={() => navigate("/sites")}
                style={{ default: { cursor: "pointer" } }}
              >
                {alert && (
                  <circle r={5} fill={color} opacity={0.3}>
                    <animate attributeName="r" values="4;12;4" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle r={3.6} fill={color} stroke="#fff" strokeWidth={1.2} filter="url(#pinGlow)" />
              </Marker>
            );
          })}
        </ComposableMap>
      </div>

      {/* hover tooltip */}
      {hover && (
        <div className="pointer-events-none absolute left-3 top-3 rounded-lg border border-slate-700 bg-slate-900/95 px-3 py-2 text-xs shadow-lg backdrop-blur">
          <p className="font-mono font-semibold text-white">{hover.id}</p>
          <p className="text-slate-400">{hover.name}</p>
          <p className="mt-1 flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: statusColor[hover.status] }} />
            <span className="text-slate-300">
              {hover.status} · {hover.activeAlarms} alarms · {hover.region}
            </span>
          </p>
        </div>
      )}

      {/* legend */}
      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
        {(Object.keys(statusColor) as SiteStatus[]).map((s) => (
          <span key={s} className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: statusColor[s] }} />
            {s}
          </span>
        ))}
        <span className="ml-auto text-slate-400">{sites.length} sites · click a pin to inspect</span>
      </div>
    </div>
  );
}
