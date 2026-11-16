"use client";

import { useEffect, useState } from "react";
import type { View } from "@/lib/data";
import { usePortfolio } from "../ctx";
import { Box, P, leftM, rightM, topM } from "../iso";

type Station = {
  no: string;
  title: string;
  sub: string;
  to: View;
  gold: boolean;
  badge: [number, number];
  anchor: [number, number];
};

const STATIONS: Station[] = [
  {
    no: "01",
    title: "SOFTWARE & AI PROJECTS",
    sub: "Full-Stack Apps, ML Forecasting & Causal Analytics",
    to: "software",
    gold: false,
    badge: [-592, 168],
    anchor: [-360, 60],
  },
  {
    no: "02",
    title: "HARDWARE & FPGA PROJECTS",
    sub: "Zynq-7020 FPGA, Embedded Systems & IoT R&D",
    to: "hardware",
    gold: true,
    badge: [-592, -392],
    anchor: [-210, -250],
  },
  {
    no: "03",
    title: "EDUCATION & IEEE PAPERS",
    sub: "MSc AI @ Heriot-Watt · BSc EE @ AUD · 3 IEEE Papers",
    to: "research",
    gold: true,
    badge: [208, -372],
    anchor: [262, -236],
  },
  {
    no: "04",
    title: "SKILLS & FULL ARCHIVE",
    sub: "Role-Filtered Tech Stack & Complete Build Registry",
    to: "archive",
    gold: false,
    badge: [206, 232],
    anchor: [230, 150],
  },
];

// Ambient light pools on the floor plane, one per workstation.
const POOLS: { id: string; at: [number, number]; r: number; color: string }[] = [
  { id: "sw", at: [-230, 215], r: 210, color: "var(--cyan)" },
  { id: "hw", at: [-262, -82], r: 215, color: "var(--gold)" },
  { id: "edu", at: [30, -262], r: 205, color: "var(--ok)" },
  { id: "arc", at: [230, 10], r: 205, color: "var(--cyan)" },
];

const BW = 384;
const BH = 60;

function Badge({ s }: { s: Station }) {
  const c = s.gold ? "var(--gold)" : "var(--cyan)";
  const line = s.gold ? "var(--gold-line)" : "var(--cyan-line)";
  const [x, y] = s.badge;
  const from: [number, number] = [
    Math.max(x + 20, Math.min(x + BW - 20, s.anchor[0])),
    s.anchor[1] > y ? y + BH : y,
  ];
  return (
    <g className="hidden md:block">
      <line
        x1={from[0]}
        y1={from[1]}
        x2={s.anchor[0]}
        y2={s.anchor[1]}
        stroke={c}
        strokeWidth="1"
        strokeDasharray="3 4"
      />
      <circle cx={s.anchor[0]} cy={s.anchor[1]} r="4" fill={c} className="pulse" />
      <rect x={x} y={y} width={BW} height={BH} rx="3" fill="var(--surface)" stroke={line} strokeWidth="1.25" />
      <rect x={x} y={y} width="4" height={BH} fill={c} />
      <text x={x + 18} y={y + 25} fontFamily="var(--font-mono)" fontSize="15.5" fontWeight="700" letterSpacing="0.6">
        <tspan fill={c}>{s.no} // </tspan>
        <tspan fill="var(--ink)">{s.title} ↗</tspan>
      </text>
      <text x={x + 18} y={y + 45} fontFamily="var(--font-mono)" fontSize="11.5" fill="var(--muted)">
        {s.sub}
      </text>
    </g>
  );
}

/** Slow turn angle in radians, stepped at about 30 fps. Still under reduced motion. */
function useSpin(period = 14000) {
  const [a, setA] = useState(0.5);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let last = 0;
    const tick = (t: number) => {
      if (t - last > 33) {
        last = t;
        setA(((t % period) / period) * Math.PI * 2);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [period]);
  return a;
}

/** Wireframe cube used by the holographic table, turned about its vertical axis. */
function WireCube({ x, y, z, s, a = 0 }: { x: number; y: number; z: number; s: number; a?: number }) {
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  const v = (dx: number, dy: number, dz: number) => {
    const u = (dx - 0.5) * s;
    const w = (dy - 0.5) * s;
    return P(x + s / 2 + u * cos - w * sin, y + s / 2 + u * sin + w * cos, z + dz * s)
      .map((n) => n.toFixed(1))
      .join(",");
  };
  const edges = [
    [0, 0, 0, 1, 0, 0], [1, 0, 0, 1, 1, 0], [1, 1, 0, 0, 1, 0], [0, 1, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 1], [1, 0, 1, 1, 1, 1], [1, 1, 1, 0, 1, 1], [0, 1, 1, 0, 0, 1],
    [0, 0, 0, 0, 0, 1], [1, 0, 0, 1, 0, 1], [1, 1, 0, 1, 1, 1], [0, 1, 0, 0, 1, 1],
  ];
  return (
    <g stroke="var(--cyan)" strokeWidth="1.3" opacity="0.9">
      {edges.map((e, i) => (
        <polyline key={i} points={`${v(e[0], e[1], e[2])} ${v(e[3], e[4], e[5])}`} />
      ))}
    </g>
  );
}

const GOLD = { top: "var(--gold-hi)", left: "var(--gold)", right: "var(--gold-deep)", stroke: "none" };

function Workbench() {
  return (
    <g>
      <Box x={-300} y={-200} w={80} d={10} h={50} />
      <Box x={-300} y={30} w={80} d={10} h={50} />
      <Box x={-304} y={-204} z={50} w={88} d={248} h={6} stroke="var(--gold-line)" />
      {/* oscilloscope A */}
      <Box x={-292} y={-184} z={56} w={50} d={74} h={46} />
      <g transform={rightM(-242, -110, 102)}>
        <rect x="6" y="6" width="44" height="30" fill="#04130a" stroke="var(--line-strong)" />
        <clipPath id="scope-a">
          <rect x="7" y="7" width="42" height="28" />
        </clipPath>
        <g clipPath="url(#scope-a)">
          <path
            className="scope-scroll crt-glow"
            d={
              "M7 21 " +
              Array.from({ length: 64 }, (_, i) => `L${7 + i} ${(21 - 10 * Math.sin((i / 20) * 2 * Math.PI)).toFixed(1)}`).join(" ")
            }
            fill="none"
            stroke="var(--ok)"
            strokeWidth="1.6"
          />
        </g>
        <circle cx="60" cy="12" r="3" fill="var(--gold)" />
        <circle cx="60" cy="26" r="3" fill="var(--ill-hi)" stroke="var(--line-strong)" />
      </g>
      {/* oscilloscope B */}
      <Box x={-292} y={-100} z={56} w={50} d={62} h={38} />
      <g transform={rightM(-242, -38, 94)}>
        <rect x="5" y="5" width="38" height="26" fill="#120d02" stroke="var(--line-strong)" />
        <polyline
          points="7,24 11,24 11,10 17,10 17,24 23,24 23,10 29,10 29,24 35,24 35,10 41,10"
          fill="none"
          stroke="var(--gold)"
          strokeWidth="1.5"
        />
        <circle cx="52" cy="12" r="2.6" fill="var(--cyan)" />
      </g>
      {/* FPGA dev board */}
      <Box x={-290} y={-24} z={56} w={64} d={52} h={3} top="#0f2a22" left="#0a1c17" right="#0a1c17" stroke="var(--gold-line)" />
      <Box x={-272} y={-10} z={59} w={24} d={22} h={4} {...GOLD} />
      <Box x={-240} y={-18} z={59} w={8} d={8} h={6} top="var(--ill-hi)" stroke="none" />
      <Box x={-240} y={10} z={59} w={8} d={12} h={5} top="var(--ill-hi)" stroke="none" />
      {/* status LED on the Zynq board */}
      <g className="blink">
        <circle cx={P(-284, 18, 60)[0]} cy={P(-284, 18, 60)[1]} r="7" fill="var(--gold)" opacity="0.3" />
        <circle cx={P(-284, 18, 60)[0]} cy={P(-284, 18, 60)[1]} r="3" fill="var(--gold-hi)" />
      </g>
    </g>
  );
}

function Terminal() {
  return (
    <g>
      <Box x={-60} y={-300} w={180} d={80} h={50} stroke="var(--gold-line)" />
      {/* books */}
      <Box x={84} y={-292} z={50} w={9} d={40} h={38} top="var(--gold)" left="var(--gold-deep)" right="var(--gold-deep)" stroke="none" />
      <Box x={94} y={-292} z={50} w={9} d={40} h={32} top="var(--cyan)" left="var(--ill-mid)" right="var(--ill-mid)" stroke="none" />
      <Box x={104} y={-292} z={50} w={9} d={40} h={36} top="var(--ill-hi)" stroke="none" />
      {/* CRT */}
      <Box x={-14} y={-294} z={50} w={86} d={50} h={74} />
      <g transform={leftM(-14, -244, 124)}>
        <rect x="8" y="8" width="70" height="50" rx="4" fill="#03140b" stroke="var(--line-strong)" />
        <rect x="8" y="8" width="70" height="50" rx="4" fill="var(--ok)" opacity="0.07" className="pulse" />
        <g stroke="var(--ok)" strokeWidth="2" strokeLinecap="round" className="crt-glow">
          <line x1="14" y1="17" x2="52" y2="17" className="type-line" />
          <line x1="14" y1="25" x2="68" y2="25" opacity="0.8" className="type-line" style={{ animationDelay: "0.5s" }} />
          <line x1="14" y1="33" x2="44" y2="33" opacity="0.8" className="type-line" style={{ animationDelay: "1s" }} />
          <line x1="14" y1="41" x2="60" y2="41" opacity="0.8" className="type-line" style={{ animationDelay: "1.5s" }} />
          <rect x="14" y="46.5" width="7" height="5" stroke="none" fill="var(--ok)" className="blink" />
        </g>
        <circle cx="70" cy="66" r="2" fill="var(--ok)" className="pulse" />
      </g>
      {/* keyboard */}
      <Box x={-4} y={-240} z={50} w={66} d={16} h={3} top="var(--ill-hi)" />
    </g>
  );
}

function ServerRig() {
  const leds = (rows: number) =>
    Array.from({ length: rows }, (_, i) => (
      <g key={i}>
        <rect x="6" y={10 + i * 14} width="48" height="8" fill="var(--ill-dark)" stroke="var(--line)" />
        <rect x="9" y={12.5 + i * 14} width="5" height="3" fill="var(--cyan)" className="pulse" style={{ animationDelay: `-${i * 0.37}s` }} />
        <rect x="17" y={12.5 + i * 14} width="5" height="3" fill={i % 3 ? "var(--cyan)" : "var(--gold)"} className="blink" style={{ animationDelay: `-${i * 0.23}s`, animationDuration: `${1.1 + (i % 3) * 0.6}s` }} />
        <rect x="28" y={12.5 + i * 14} width="22" height="3" fill="var(--line-strong)" />
      </g>
    ));
  return (
    <g>
      <Box x={-300} y={146} w={60} d={60} h={140} />
      <g transform={rightM(-240, 206, 140)}>{leds(8)}</g>
      <Box x={-300} y={212} w={60} d={60} h={116} />
      <g transform={rightM(-240, 272, 116)}>{leds(7)}</g>
      {/* arcade cabinet */}
      <Box x={-226} y={158} w={72} d={72} h={92} stroke="var(--cyan)" sw={1.6} />
      <Box x={-226} y={158} z={92} w={54} d={72} h={64} stroke="var(--cyan)" sw={1.6} />
      <Box x={-226} y={158} z={156} w={60} d={72} h={20} stroke="var(--cyan)" sw={1.6} left="var(--ill-dark)" />
      <g transform={rightM(-172, 230, 150)}>
        <rect x="8" y="2" width="56" height="42" fill="var(--cyan)" fillOpacity="0.22" stroke="var(--cyan)" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect
            key={i}
            x={12 + i * 8.4}
            y="8"
            width="6"
            height="32"
            fill={i === 3 ? "var(--gold)" : "var(--cyan)"}
            className="eq"
            style={{ animationDelay: `-${(i * 0.41) % 1.3}s`, animationDuration: `${1.1 + (i % 3) * 0.25}s` }}
          />
        ))}
      </g>
      <g transform={rightM(-166, 230, 176)}>
        <text x="36" y="14.5" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fontWeight="700" letterSpacing="1.5" fill="var(--gold)">
          PROJECTS
        </text>
      </g>
      {/* control deck */}
      <g transform={topM(-172, 158, 92)}>
        <rect x="0" y="0" width="18" height="72" fill="var(--ill-hi)" stroke="var(--cyan)" />
        <circle cx="9" cy="20" r="4" fill="var(--gold)" />
        <circle cx="9" cy="36" r="4" fill="var(--cyan)" />
        <circle cx="9" cy="52" r="4" fill="var(--ill-dark)" stroke="var(--cyan)" />
      </g>
    </g>
  );
}

function BlueprintTable() {
  return (
    <g>
      {[
        [164, -56],
        [288, -56],
        [164, 68],
        [288, 68],
      ].map(([x, y]) => (
        <Box key={`${x}${y}`} x={x} y={y} w={8} d={8} h={48} />
      ))}
      <Box x={156} y={-64} z={48} w={148} d={148} h={7} stroke="var(--cyan)" sw={1.4} />
      <g transform={topM(156, -64, 55)}>
        <rect x="6" y="6" width="136" height="136" fill="var(--cyan)" fillOpacity="0.14" stroke="var(--cyan)" strokeWidth="1.2" />
        <g stroke="var(--cyan)" strokeWidth="0.6" opacity="0.5">
          {Array.from({ length: 7 }, (_, i) => (
            <g key={i}>
              <line x1={23 + i * 17} y1="6" x2={23 + i * 17} y2="142" />
              <line x1="6" y1={23 + i * 17} x2="142" y2={23 + i * 17} />
            </g>
          ))}
        </g>
        <g fill="none" stroke="var(--cyan)" strokeWidth="1.6">
          <rect x="20" y="20" width="44" height="32" />
          <circle cx="104" cy="40" r="20" />
          <polygon points="26,124 60,78 94,124" />
          <path d="M104 80v44M82 102h44" />
        </g>
      </g>
      <SpinningCubes />
    </g>
  );
}

function SpinningCubes() {
  const a = useSpin();
  return (
    <g className="float">
      <WireCube x={190} y={-30} z={84} s={34} a={a} />
      <WireCube x={248} y={24} z={100} s={22} a={-a * 2} />
    </g>
  );
}

const ART: Record<string, () => React.ReactElement> = {
  "01": ServerRig,
  "02": Workbench,
  "03": Terminal,
  "04": BlueprintTable,
};

// Circuit rails on the floor plane, from the central hub to each station.
const RAILS: Record<string, string[]> = {
  "01": ["M0 0 L0 196 L-150 196", "M-12 0 L-12 184 L-150 184"],
  "02": ["M0 0 L0 -80 L-212 -80", "M-12 0 L-12 -68 L-212 -68"],
  "03": ["M0 0 L30 0 L30 -216", "M0 -12 L42 -12 L42 -216"],
  "04": ["M0 0 L90 0 L90 10 L152 10", "M0 12 L78 12 L78 22 L152 22"],
};

export default function LabHub() {
  const { go, openGuide } = usePortfolio();
  // Paint back to front.
  const order = ["02", "03", "01", "04"].map((n) => STATIONS.find((s) => s.no === n)!);

  return (
    <section className="relative flex h-full min-h-[560px] flex-col">
      <div className="z-10 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 pt-4 sm:px-6">
        <div>
          <h1 className="font-mono text-[13px] font-bold tracking-[0.14em] sm:text-[15px]">
            VIKRAM VARKOOR <span className="text-faint">//</span> R&D LAB{" "}
            <span className="text-faint">//</span>{" "}
            <span className="text-cyan">INTERACTIVE LAB HUB</span>
          </h1>
          <p className="helper mt-1">
            Select a station: each workstation opens one section of the portfolio
          </p>
        </div>
        <button onClick={openGuide} className="btn btn-gold">
          Field Guide [?]
        </button>
      </div>

      <div className="relative min-h-0 flex-1">
        <svg
          viewBox="-600 -410 1200 720"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid meet"
          role="group"
          aria-label="Isometric lab floorplan with four workstations"
        >
          <defs>
            <radialGradient id="lab-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0.16" />
              <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0" />
            </radialGradient>
            {POOLS.map((p) => (
              <radialGradient key={p.id} id={`pool-${p.id}`}>
                <stop offset="0%" stopColor={p.color} stopOpacity="0.42" />
                <stop offset="55%" stopColor={p.color} stopOpacity="0.14" />
                <stop offset="100%" stopColor={p.color} stopOpacity="0" />
              </radialGradient>
            ))}
          </defs>

          {/* Floor */}
          <g transform={topM(0, 0, 0)}>
            <rect x="-330" y="-330" width="660" height="660" fill="var(--surface)" stroke="var(--line-strong)" />
            <rect x="-330" y="-330" width="660" height="660" fill="url(#lab-glow)" />
            <clipPath id="floor-clip">
              <rect x="-330" y="-330" width="660" height="660" />
            </clipPath>
            {/* Ambient light pools under each workstation */}
            <g clipPath="url(#floor-clip)">
              {POOLS.map((p, i) => (
                <circle
                  key={p.id}
                  cx={p.at[0]}
                  cy={p.at[1]}
                  r={p.r}
                  fill={`url(#pool-${p.id})`}
                  className="pulse"
                  style={{ animationDuration: "5s", animationDelay: `-${i * 1.2}s` }}
                />
              ))}
            </g>
            <g stroke="var(--line)" strokeWidth="1">
              {Array.from({ length: 14 }, (_, i) => {
                const v = -330 + (i + 1) * 44;
                return (
                  <g key={i}>
                    <line x1="-330" y1={v} x2="330" y2={v} />
                    <line x1={v} y1="-330" x2={v} y2="330" />
                  </g>
                );
              })}
            </g>
            {STATIONS.map((s) =>
              RAILS[s.no].map((d, i) => (
                <g key={s.no + i} fill="none" strokeLinejoin="round">
                  <path d={d} stroke={s.gold ? "var(--gold)" : "var(--cyan)"} strokeWidth="2" opacity="0.4" />
                  <path
                    d={d}
                    className="flow"
                    stroke={s.gold ? "var(--gold-hi)" : "var(--cyan)"}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    style={{ animationDelay: `-${i * 1.1 + Number(s.no) * 0.5}s` }}
                  />
                </g>
              )),
            )}
            {/* hub node */}
            <circle r="34" fill="var(--surface2)" stroke="var(--cyan)" strokeWidth="1.5" />
            <circle r="20" fill="none" stroke="var(--gold)" strokeWidth="1.5" className="pulse" />
            <circle r="7" fill="var(--cyan)" />
          </g>

          {/* Low back walls */}
          <g fill="var(--surface2)" stroke="var(--line-strong)" opacity="0.75">
            <polygon points={[P(-330, -330, 0), P(-330, 330, 0), P(-330, 330, 46), P(-330, -330, 46)].map((p) => p.join(",")).join(" ")} />
            <polygon points={[P(-330, -330, 0), P(330, -330, 0), P(330, -330, 46), P(-330, -330, 46)].map((p) => p.join(",")).join(" ")} />
          </g>

          {order.map((s) => {
            const Art = ART[s.no];
            return (
              <g
                key={s.no}
                className={`station ${s.gold ? "gold" : ""}`}
                role="link"
                tabIndex={0}
                aria-label={`${s.no}: ${s.title}. ${s.sub}`}
                onClick={() => go(s.to)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    go(s.to);
                  }
                }}
              >
                <Art />
                <Badge s={s} />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Small screens: the SVG badges are too small to read, so list them */}
      <div className="grid grid-cols-2 gap-2 px-3 pb-3 md:hidden">
        {STATIONS.map((s) => (
          <button
            key={s.no}
            onClick={() => go(s.to)}
            className={`rounded-[3px] border bg-surface px-2.5 py-2 text-left font-mono text-[10.5px] font-bold leading-snug tracking-wide ${
              s.gold ? "border-gold-line" : "border-cyan-line"
            }`}
          >
            <span className={s.gold ? "text-gold" : "text-cyan"}>{s.no} // </span>
            {s.title} ↗
          </button>
        ))}
      </div>
    </section>
  );
}
