"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";

const connections = [
  "M110 160H340L440 260H680L800 140H1050",
  "M180 560H370L490 440H760L900 580H1170",
  "M340 160V350L490 440",
  "M680 260V370L760 440",
  "M800 140V80H980",
  "M900 580V680H1080",
  "M440 260L330 370H100",
];
const nodes = [[110, 160], [340, 160], [680, 260], [1050, 140], [180, 560], [490, 440], [760, 440], [900, 580], [1170, 580]];

/** Decorative ambient motion, independent of scrolling and without image downloads. */
export function AmbientBackground() {
  const [paused, setPaused] = useState(false);
  return (
    <div className="ambient-background pointer-events-none" data-paused={paused}>
      <div className="ambient-background__art" aria-hidden="true">
        <div className="ambient-background__grid" />
        <div className="ambient-background__glow ambient-background__glow--cyan ambient-motion" />
        <div className="ambient-background__glow ambient-background__glow--gold ambient-motion" />
        <svg className="ambient-background__network" viewBox="0 0 1280 800" preserveAspectRatio="xMidYMid slice" fill="none">
          <g stroke="currentColor" strokeWidth="1">
            {connections.map((d) => <path key={d} d={d} opacity=".4" />)}
          </g>
          <g className="ambient-background__signals ambient-motion" stroke="#a5eaf1" strokeWidth="2.5" strokeDasharray="24 208">
            {connections.slice(0, 4).map((d) => <path key={d} d={d} />)}
          </g>
          {nodes.map(([cx, cy], index) => <g key={`${cx}-${cy}`}>
            <circle cx={cx} cy={cy} r="9" stroke="currentColor" opacity=".45" />
            <circle cx={cx} cy={cy} r="3.5" fill={index % 3 === 0 ? "#e5b66e" : "currentColor"} opacity=".9" />
          </g>)}
        </svg>
        <div className="ambient-background__shade" />
      </div>
      <button type="button" className="ambient-background__control pointer-events-auto" onClick={() => setPaused((value) => !value)} aria-pressed={paused} aria-label="Pause background animation">
        {paused ? <Play className="size-3.5" aria-hidden="true" /> : <Pause className="size-3.5" aria-hidden="true" />}
        <span aria-hidden="true">{paused ? "Resume background" : "Pause background"}</span>
      </button>
    </div>
  );
}
