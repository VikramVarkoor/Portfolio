"use client";

import { Box, P, topM } from "./iso";

export type ChipHotspot = { id: string; label: string };

type Props = {
  className?: string;
  hotspots?: ChipHotspot[];
  active?: string | null;
  onSelect?: (id: string) => void;
  /** 0..1 offsets used for cursor parallax of the chip layer */
  parallax?: { x: number; y: number };
  reach?: number;
  viewBox?: string;
};

// Regions of the die, in top-plane coordinates (-100..100).
const REGIONS: Record<string, { x: number; y: number; w: number; h: number }> =
  {
    pl: { x: -88, y: -88, w: 104, h: 104 },
    dma: { x: 24, y: -88, w: 64, h: 58 },
    ps: { x: 24, y: -22, w: 64, h: 110 },
    io: { x: -88, y: 24, w: 104, h: 64 },
  };

function traces(reach: number) {
  // Orthogonal circuit rails leaving all four chip edges, in floor coords.
  const out: { d: string; gold: boolean; delay: number }[] = [];
  const edge = 118;
  for (let side = 0; side < 4; side++) {
    for (let i = -4; i <= 4; i++) {
      const a = Math.abs(i);
      const o = i * 24;
      const run1 = edge + 40 + a * 22;
      const jog = o + Math.sign(i) * (26 + a * 26);
      const pt = (u: number, v: number): [number, number] =>
        side === 0 ? [u, v] : side === 1 ? [-u, v] : side === 2 ? [v, u] : [v, -u];
      const seq = [pt(edge, o), pt(run1, o), pt(run1, jog), pt(reach, jog)];
      out.push({
        d: "M" + seq.map((p) => p.join(" ")).join(" L"),
        gold: (i + side) % 3 === 0,
        delay: ((a * 0.37 + side * 0.6) % 3.2),
      });
    }
  }
  return out;
}

export default function IsoChip({
  className,
  hotspots,
  active,
  onSelect,
  parallax = { x: 0, y: 0 },
  reach = 520,
  viewBox = "-520 -330 1040 640",
}: Props) {
  const rails = traces(reach);
  const H = 44; // hover height of the chip above the floor
  const pins: number[] = [];
  for (let k = -96; k <= 90; k += 12) pins.push(k);

  return (
    <svg
      viewBox={viewBox}
      className={className}
      role="img"
      aria-label="Xilinx Zynq-7020 FPGA system on chip with circuit rails"
    >
      <defs>
        <radialGradient id="chip-fade" cx="50%" cy="52%" r="50%">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="62%" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="chip-mask">
          <rect x="-520" y="-330" width="1040" height="640" fill="url(#chip-fade)" />
        </mask>
        <linearGradient id="gold-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--gold-hi)" />
          <stop offset="55%" stopColor="var(--gold)" />
          <stop offset="100%" stopColor="var(--gold-deep)" />
        </linearGradient>
        <radialGradient id="under-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Floor: tiles and circuit rails */}
      <g
        mask="url(#chip-mask)"
        style={{
          transform: `translate(${parallax.x * -8}px, ${parallax.y * -5}px)`,
          transition: "transform 0.25s ease-out",
        }}
      >
        <g transform={topM(0, 0, 0)}>
          {Array.from({ length: 25 }, (_, i) => {
            const v = -reach + (i * reach * 2) / 24;
            return (
              <g key={i} stroke="var(--line)" strokeWidth="1">
                <line x1={-reach} y1={v} x2={reach} y2={v} />
                <line x1={v} y1={-reach} x2={v} y2={reach} />
              </g>
            );
          })}
          {rails.map((r, i) => (
            <g key={i} fill="none" strokeLinejoin="round">
              <path
                d={r.d}
                stroke={r.gold ? "var(--gold)" : "var(--cyan)"}
                strokeWidth="2"
                opacity="0.38"
              />
              <path
                d={r.d}
                className="flow"
                stroke={r.gold ? "var(--gold-hi)" : "var(--cyan)"}
                strokeWidth="3.2"
                strokeLinecap="round"
                style={{ animationDelay: `-${r.delay}s` }}
              />
            </g>
          ))}
          <rect x="-150" y="-150" width="300" height="300" fill="url(#under-glow)" />
        </g>
      </g>

      {/* Chip body */}
      <g
        style={{
          transform: `translate(${parallax.x * 14}px, ${parallax.y * 9}px)`,
          transition: "transform 0.25s ease-out",
        }}
      >
        <g className="float">
          {/* cyan data columns between floor and chip */}
          {[-70, -35, 0, 35, 70].map((k) => {
            const a = P(118, k, 0);
            const b = P(110, k, H);
            const c = P(k, 118, 0);
            const d = P(k, 110, H);
            return (
              <g key={k} stroke="var(--cyan)" strokeWidth="2" opacity="0.7" className="pulse">
                <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
                <line x1={c[0]} y1={c[1]} x2={d[0]} y2={d[1]} />
              </g>
            );
          })}

          <Box
            x={-118}
            y={-118}
            z={H}
            w={236}
            d={236}
            h={12}
            top="var(--ill-mid)"
            left="var(--ill-dark)"
            right="var(--ill-dark)"
            stroke="var(--gold-line)"
          />
          {/* pins on both visible edges */}
          {pins.map((k) => (
            <g key={k}>
              <Box x={k} y={112} z={H + 12} w={6} d={6} h={5} top="var(--gold-hi)" left="var(--gold)" right="var(--gold-deep)" stroke="none" />
              <Box x={112} y={k} z={H + 12} w={6} d={6} h={5} top="var(--gold-hi)" left="var(--gold)" right="var(--gold-deep)" stroke="none" />
            </g>
          ))}
          <Box
            x={-100}
            y={-100}
            z={H + 12}
            w={200}
            d={200}
            h={14}
            top="url(#gold-top)"
            left="var(--gold)"
            right="var(--gold-deep)"
            stroke="var(--gold-hi)"
          />

          {/* Die artwork, drawn flat on the top plane */}
          <g transform={topM(0, 0, H + 26)}>
            <rect x="-94" y="-94" width="188" height="188" fill="var(--ill-dark)" opacity="0.5" />
            {/* PL fabric: logic cell grid */}
            <g fill="var(--gold)" opacity="0.85">
              {Array.from({ length: 49 }, (_, i) => (
                <rect
                  key={i}
                  x={-84 + (i % 7) * 14}
                  y={-84 + Math.floor(i / 7) * 14}
                  width="10"
                  height="10"
                  opacity={0.45 + ((i * 7) % 5) * 0.11}
                />
              ))}
            </g>
            {/* DMA lanes */}
            <g stroke="var(--cyan)" strokeWidth="3" opacity="0.9">
              {[0, 1, 2, 3, 4].map((i) => (
                <line key={i} x1="28" y1={-80 + i * 11} x2="84" y2={-80 + i * 11} />
              ))}
            </g>
            {/* PS ARM cores */}
            <g fill="var(--gold-hi)">
              <rect x="30" y="-16" width="52" height="44" opacity="0.9" />
              <rect x="30" y="34" width="52" height="44" opacity="0.7" />
            </g>
            <g fill="var(--ill-dark)" opacity="0.55">
              <rect x="36" y="-10" width="40" height="32" />
              <rect x="36" y="40" width="40" height="32" />
            </g>
            {/* IO bank */}
            <g fill="var(--gold)" opacity="0.8">
              {Array.from({ length: 14 }, (_, i) => (
                <rect key={i} x={-84 + (i % 7) * 14} y={32 + Math.floor(i / 7) * 24} width="10" height="18" />
              ))}
            </g>
            <text
              x="-84"
              y="22"
              fontFamily="var(--font-mono)"
              fontSize="13"
              fontWeight="700"
              letterSpacing="2"
              fill="var(--ill-dark)"
            >
              ZYNQ-7020
            </text>

            {/* Hotspots */}
            {hotspots?.map((h) => {
              const r = REGIONS[h.id];
              if (!r) return null;
              const on = active === h.id;
              return (
                <g
                  key={h.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Inspect ${h.label}`}
                  aria-pressed={on}
                  onClick={() => onSelect?.(h.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelect?.(h.id);
                    }
                  }}
                  style={{ cursor: "pointer", outline: "none" }}
                >
                  <rect
                    x={r.x}
                    y={r.y}
                    width={r.w}
                    height={r.h}
                    fill={on ? "var(--cyan)" : "transparent"}
                    fillOpacity={on ? 0.28 : 0}
                    stroke="var(--cyan)"
                    strokeWidth={on ? 3 : 1.5}
                    strokeDasharray={on ? undefined : "5 4"}
                    className={on ? undefined : "pulse"}
                  />
                </g>
              );
            })}
          </g>

          {/* Hotspot callouts in screen space */}
          {hotspots?.map((h) => {
            const r = REGIONS[h.id];
            if (!r) return null;
            const on = active === h.id;
            const [cx, cy] = P(r.x + r.w / 2, r.y + r.h / 2, H + 26);
            const leftSide = cx < 0;
            const tx = leftSide ? cx - 150 : cx + 150;
            const ty = cy - 96;
            const w = h.label.length * 8.2 + 22;
            return (
              <g
                key={h.id}
                onClick={() => onSelect?.(h.id)}
                style={{ cursor: "pointer" }}
                aria-hidden
              >
                <polyline
                  points={`${cx},${cy} ${cx},${ty + 13} ${tx},${ty + 13}`}
                  fill="none"
                  stroke="var(--cyan)"
                  strokeWidth="1"
                  opacity={on ? 1 : 0.55}
                />
                <circle cx={cx} cy={cy} r={on ? 5 : 3.5} fill="var(--cyan)" />
                <rect
                  x={leftSide ? tx - w : tx}
                  y={ty}
                  width={w}
                  height="26"
                  rx="2"
                  fill={on ? "var(--cyan)" : "var(--surface)"}
                  stroke="var(--cyan-line)"
                />
                <text
                  x={leftSide ? tx - w / 2 : tx + w / 2}
                  y={ty + 17}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize="12.5"
                  fontWeight="600"
                  letterSpacing="0.6"
                  fill={on ? "var(--on-accent)" : "var(--cyan)"}
                >
                  {h.label}
                </text>
              </g>
            );
          })}
        </g>
      </g>
    </svg>
  );
}
