"use client";

import { useState } from "react";
import { HARDWARE, HOTSPOTS, type HardwareId } from "@/lib/data";
import { usePortfolio } from "../ctx";
import IsoChip from "../IsoChip";
import Oscilloscope from "../Oscilloscope";

const mono = { fontFamily: "var(--font-mono)" };

function Block({ x, w, label, gold }: { x: number; w: number; label: string; gold?: boolean }) {
  return (
    <g>
      <rect
        x={x}
        y="18"
        width={w}
        height="34"
        rx="2"
        fill={gold ? "var(--gold-soft)" : "var(--cyan-soft)"}
        stroke={gold ? "var(--gold-line)" : "var(--cyan-line)"}
      />
      <text x={x + w / 2} y="39" textAnchor="middle" fontSize="10" fontWeight="600" fill={gold ? "var(--gold)" : "var(--cyan)"} style={mono}>
        {label}
      </text>
    </g>
  );
}

function Arrow({ x }: { x: number }) {
  return (
    <g fill="none">
      <path d={`M${x} 35h12m-4-4 4 4-4 4`} stroke="var(--faint)" strokeWidth="1.2" />
      <path d={`M${x - 2} 35h14`} className="sig" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

const SCHEMATIC: Record<HardwareId, React.ReactElement> = {
  synapse: (
    <svg viewBox="0 0 320 70" className="h-full w-full" aria-hidden>
      <Block x={2} w={48} label="MRI" />
      <Arrow x={54} />
      <Block x={70} w={74} label="PL 3D GLCM" gold />
      <Arrow x={148} />
      <Block x={164} w={62} label="AXI4-DMA" gold />
      <Arrow x={230} />
      <Block x={246} w={72} label="PS ARM · Dx" />
      <text x="107" y="12" textAnchor="middle" fontSize="8.5" fill="var(--faint)" style={mono}>1.32 s · 100 MHz</text>
      <text x="282" y="12" textAnchor="middle" fontSize="8.5" fill="var(--faint)" style={mono}>17 s total</text>
      <text x="107" y="66" textAnchor="middle" fontSize="8.5" fill="var(--faint)" style={mono}>252 Haralick features</text>
    </svg>
  ),
  pqa: (
    <svg viewBox="0 0 320 70" className="h-full w-full" aria-hidden>
      <path
        d={
          "M4 35 " +
          Array.from({ length: 60 }, (_, i) => {
            const th = (i / 59) * Math.PI * 6;
            const v = Math.sin(th) + 0.25 * Math.sin(3 * th) + 0.12 * Math.sin(5 * th);
            return `L${(4 + i * 2.3).toFixed(1)} ${(35 - v * 20).toFixed(1)}`;
          }).join(" ")
        }
        fill="none"
        stroke="var(--cyan)"
        strokeWidth="1.6"
      />
      <path d="M150 35h14m-4-4 4 4-4 4" fill="none" stroke="var(--faint)" strokeWidth="1.2" />
      <path d="M146 35h18" className="sig" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" />
      {Array.from({ length: 16 }, (_, k) => {
        const h = k === 2 ? 50 : k === 6 ? 16 : k === 10 ? 9 : k === 14 ? 5 : 2;
        const hot = k === 6 || k === 10 || k === 14;
        return (
          <rect key={k} x={174 + k * 9} y={60 - h} width="6" height={h} fill={k === 2 ? "var(--cyan)" : hot ? "var(--gold)" : "var(--line-strong)"} />
        );
      })}
      <text x="246" y="12" textAnchor="middle" fontSize="8.5" fill="var(--faint)" style={mono}>f0 · 3rd · 5th · 7th</text>
    </svg>
  ),
  bin: (
    <svg viewBox="0 0 320 70" className="h-full w-full" aria-hidden>
      <Block x={2} w={62} label="PI CAMERA" />
      <Arrow x={68} />
      <Block x={84} w={96} label="YOLOv8n · ONNX" gold />
      <Arrow x={184} />
      {["PLASTIC", "METAL", "PAPER"].map((l, i) => (
        <g key={l}>
          <rect x={202 + i * 40} y="14" width="34" height="42" rx="2" fill="none" stroke="var(--line-strong)" />
          <path d={`M${206 + i * 40} 24h26`} stroke="var(--gold)" strokeWidth="2.5" transform={`rotate(${i === 1 ? -24 : 0} ${219 + i * 40} 24)`} />
          <text x={219 + i * 40} y="49" textAnchor="middle" fontSize="6.5" fill="var(--faint)" style={mono}>{l}</text>
        </g>
      ))}
      <text x="132" y="12" textAnchor="middle" fontSize="8.5" fill="var(--faint)" style={mono}>12 classes · offline</text>
    </svg>
  ),
  syncrow: (
    <svg viewBox="0 0 320 70" className="h-full w-full" aria-hidden>
      <path d="M12 30h296" stroke="var(--line-strong)" strokeWidth="1.5" />
      <path d="M12 21h296" className="sig" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" />
      {Array.from({ length: 17 }, (_, i) => (
        <g key={i}>
          <circle cx={12 + i * 18.5} cy="30" r="5.5" fill="var(--gold)" />
          <text x={12 + i * 18.5} y="33" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="var(--on-accent)" style={mono}>
            {i + 1}
          </text>
        </g>
      ))}
      <text x="12" y="56" fontSize="8.5" fill="var(--faint)" style={mono}>POWER-UP</text>
      <text x="160" y="56" textAnchor="middle" fontSize="8.5" fill="var(--faint)" style={mono}>MQTT · ZIGBEE · TUYA HANDSHAKE</text>
      <text x="308" y="56" textAnchor="end" fontSize="8.5" fill="var(--faint)" style={mono}>STRESS</text>
    </svg>
  ),
};

export default function Hardware() {
  const { openDetail, go } = usePortfolio();
  const [hot, setHot] = useState("pl");
  const active = HOTSPOTS.find((h) => h.id === hot)!;

  return (
    <section className="mx-auto grid grid-cols-1 max-w-[1700px] gap-4 p-3 sm:p-4 lg:h-full lg:min-h-[640px] lg:grid-cols-[45fr_55fr]">
      {/* Left 45%: silicon viewport + oscilloscope */}
      <div className="flex min-h-0 min-w-0 flex-col gap-3">
        <div className="panel flex min-h-[380px] flex-1 flex-col overflow-hidden lg:min-h-0">
          <div className="flex items-center justify-between gap-2 border-b border-line px-3 py-2">
            <span className="label !text-gold">Xilinx Zynq-7020 SoC · Silicon Viewport</span>
            <button onClick={() => go("lab")} className="btn !py-1">← Lab</button>
          </div>
          <div className="relative min-h-0 flex-1">
            <IsoChip
              className="absolute inset-0 h-full w-full"
              hotspots={HOTSPOTS}
              active={hot}
              onSelect={setHot}
              reach={440}
              viewBox="-370 -250 740 460"
            />
          </div>
          <div className="border-t border-line px-3 py-2.5" aria-live="polite">
            <div className="font-mono text-[11.5px] font-bold tracking-wide text-cyan">
              {active.title}
            </div>
            <p className="mt-1 text-[13px] leading-snug text-muted">{active.text}</p>
            <p className="helper mt-1.5">
              Click a subsystem hotspot: each maps to a block of the Synapse.PL data path
            </p>
          </div>
        </div>
        <Oscilloscope />
      </div>

      {/* Right 55%: 2x2 visual-first cards */}
      <div className="flex min-h-0 min-w-0 flex-col gap-3">
        <div className="flex items-baseline justify-between gap-3 px-1">
          <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">
            Hardware & FPGA Projects
          </h1>
          <span className="label hidden sm:inline">02 // Case study viewer</span>
        </div>
        <div className="grid min-h-0 flex-1 gap-3 sm:grid-cols-2 lg:grid-rows-2">
          {HARDWARE.map((p) => (
            <article
              key={p.id}
              className="panel group flex flex-col p-4 transition-colors hover:border-gold-line"
            >
              <div className="flex flex-wrap gap-1.5">
                {p.stats.map((s) => (
                  <span key={s} className="chip !border-gold-line !bg-gold-soft !text-gold">
                    {s}
                  </span>
                ))}
              </div>
              <h2 className="mt-3 font-mono text-[15px] font-bold tracking-[0.04em]">
                {p.title}
              </h2>
              <p className="mt-1.5 text-[14px] leading-snug text-muted">{p.hook}</p>
              <div className="my-3 min-h-[70px] flex-1 rounded-[3px] border border-line bg-canvas p-2">
                {SCHEMATIC[p.id]}
              </div>
              <button
                onClick={() =>
                  openDetail({ buildId: p.buildId, title: p.bullets ? "Power Quality Spectral Analyzer" : undefined, bullets: p.bullets })
                }
                className="btn btn-gold self-start"
              >
                View Details ↗
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
