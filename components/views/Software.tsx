"use client";

import { useState } from "react";
import { BENCHMARKS, BUILDS, SOFTWARE, type SoftwareId } from "@/lib/data";
import { usePortfolio } from "../ctx";
import { DbtSandbox, ForecastSandbox, LumenSandbox, UpliftSandbox } from "../Sandboxes";

const SANDBOX: Record<SoftwareId, () => React.ReactElement> = {
  ad: UpliftSandbox,
  forecast: ForecastSandbox,
  lumen: LumenSandbox,
  dbt: DbtSandbox,
};

export default function Software() {
  const { openDetail, go } = usePortfolio();
  const [active, setActive] = useState<SoftwareId>("ad");
  const proj = SOFTWARE.find((p) => p.id === active)!;
  const Sandbox = SANDBOX[active];

  return (
    <section className="mx-auto grid grid-cols-1 max-w-[1700px] gap-4 p-3 sm:p-4 lg:h-full lg:min-h-[700px] lg:grid-cols-[38fr_62fr]">
      {/* Left 38%: full-height model sandbox */}
      <div className="flex min-h-0 min-w-0 flex-col gap-3">
        <div className="panel flex min-h-[560px] flex-1 flex-col overflow-hidden border-cyan-line lg:min-h-0">
          <div className="flex items-center justify-between gap-2 border-b border-line px-3 py-2">
            <span className="label !text-cyan">Interactive Model Sandbox</span>
            <span className="truncate font-mono text-[10px] text-muted">
              [ SELECTED: {proj.title} ]
            </span>
          </div>
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-3">
            <h2 className="mb-2 text-[14px] font-bold leading-snug">{proj.sandbox}</h2>
            <div className="min-h-0 flex-1" key={active}>
              <Sandbox />
            </div>
          </div>
        </div>
        <div className="panel p-3">
          <div className="label mb-2">Verified Engineering Benchmarks</div>
          <div className="grid grid-cols-3 gap-2">
            {BENCHMARKS.map((b) => (
              <div key={b.label} className="rounded-[3px] border border-line bg-canvas px-2.5 py-2">
                <div className="font-mono text-[17px] font-bold text-ink">{b.value}</div>
                <div className="label !text-[9px]">{b.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right 62%: 2x2 KPI cards */}
      <div className="flex min-h-0 min-w-0 flex-col gap-3">
        <div className="flex items-baseline justify-between gap-3 px-1">
          <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">
            Software & AI Projects
          </h1>
          <button onClick={() => go("lab")} className="btn !py-1">← Lab</button>
        </div>
        <div className="grid min-h-0 flex-1 gap-3 sm:grid-cols-2 lg:grid-rows-2">
          {SOFTWARE.map((p) => {
            const on = p.id === active;
            const b = BUILDS.find((x) => x.id === p.buildId)!;
            return (
              <article
                key={p.id}
                className={`panel flex flex-col p-4 transition-colors ${
                  on ? "border-cyan-line bg-surface2" : "hover:border-line-strong"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10.5px] tracking-[0.1em] text-faint">
                    {p.no} [{p.tag}]
                  </span>
                  <button
                    onClick={() => setActive(p.id)}
                    aria-pressed={on}
                    className={`font-mono text-[10.5px] tracking-[0.08em] ${
                      on ? "text-cyan" : "text-muted underline-offset-4 hover:text-ink hover:underline"
                    }`}
                  >
                    {on ? "● ACTIVE IN SANDBOX" : "[ LOAD SANDBOX ]"}
                  </button>
                </div>
                <h2 className="mt-2.5 font-mono text-[16px] font-bold tracking-[0.04em]">
                  {p.title}
                </h2>
                <p className="mt-1.5 text-[14px] leading-snug text-muted">{p.hook}</p>
                <div className="my-3 grid flex-1 grid-cols-2 gap-2">
                  {p.kpis.map((k, i) => (
                    <div
                      key={k.label}
                      className={`flex flex-col justify-center rounded-[3px] border px-3 py-2.5 ${
                        i === 0 ? "border-cyan-line bg-cyan-soft" : "border-line bg-canvas"
                      }`}
                    >
                      <div className={`font-mono text-[clamp(1.05rem,1.7vw,1.6rem)] font-bold leading-tight ${i === 0 ? "text-cyan" : "text-ink"}`}>
                        {k.value}
                      </div>
                      <div className="label mt-0.5">{k.label}</div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {p.stack.map((s) => (
                    <span key={s} className="chip">{s}</span>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-2 border-t border-line pt-3">
                  {b.github && (
                    <a className="btn" href={b.github} target="_blank" rel="noreferrer">GitHub ↗</a>
                  )}
                  {b.live && (
                    <a className="btn" href={b.live} target="_blank" rel="noreferrer">Live ↗</a>
                  )}
                  <button className="btn btn-cyan" onClick={() => openDetail({ buildId: p.buildId })}>
                    View Details ↗
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
