"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const mono = { fontFamily: "var(--font-mono)" };

function Slider({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex justify-between font-mono text-[10px] tracking-[0.1em] text-muted">
        <span>{label}</span>
        <span className="text-cyan">// {display}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
      />
    </label>
  );
}

function Readout({ lines }: { lines: string[] }) {
  return (
    <pre className="whitespace-pre-wrap break-words rounded-[3px] border border-line bg-canvas p-2.5 font-mono text-[10.5px] leading-relaxed text-muted">
      {lines.map((l, i) => (
        <div key={i}>
          <span className="text-ok">&gt;</span> {l}
        </div>
      ))}
    </pre>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return <p className="helper">{children}</p>;
}

/* ------------------------------------------------------------------ */
/* 1. CausalForest decile uplift & 95% CI simulator                    */
/* ------------------------------------------------------------------ */

const ATE = 0.115; // pp, verified Criteo lift
const K = Math.log(0.32) / Math.log(0.8); // top 20% captures 68% of uplift
const gain = (q: number) => 1 - Math.pow(1 - q, K);

export function UpliftSandbox() {
  const [hold, setHold] = useState(28);
  const [bins, setBins] = useState(10);
  const [draws, setDraws] = useState(500);

  const data = useMemo(() => {
    const r = rng(7 + draws);
    const h = hold / 100;
    const se = 0.03 * Math.sqrt(bins / 10) * Math.sqrt((1 / h + 1 / (1 - h)) / 4);
    return Array.from({ length: bins }, (_, i) => {
      const u = ATE * bins * (gain((i + 1) / bins) - gain(i / bins));
      // Percentile bootstrap: draw, sort, read the 2.5% and 97.5% points.
      const s: number[] = [];
      for (let d = 0; d < draws; d++) {
        const z = Math.sqrt(-2 * Math.log(1 - r())) * Math.cos(2 * Math.PI * r());
        s.push(u + z * se);
      }
      s.sort((a, b) => a - b);
      return { u, lo: s[Math.floor(draws * 0.025)], hi: s[Math.ceil(draws * 0.975) - 1] };
    });
  }, [hold, bins, draws]);

  const W = 360;
  const H = 210;
  const L = 38;
  const B = 24;
  const T = 10;
  const yMax = Math.max(...data.map((d) => d.hi)) * 1.05;
  const yMin = Math.min(0, ...data.map((d) => d.lo)) - 0.02;
  const X = (i: number) => L + ((i + 0.5) / bins) * (W - L - 6);
  const Y = (v: number) => T + (1 - (v - yMin) / (yMax - yMin)) * (H - T - B);
  const band =
    data.map((d, i) => `${X(i)},${Y(d.hi)}`).join(" ") +
    " " +
    data
      .map((d, i) => `${X(i)},${Y(d.lo)}`)
      .reverse()
      .join(" ");
  const half = data.reduce((a, d) => a + (d.hi - d.lo) / 2, 0) / bins;
  const ticks = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1].filter((t) => t < yMax);

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="min-h-[190px] flex-1">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Uplift per customer decile with 95 percent confidence band">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={L} x2={W - 6} y1={Y(t)} y2={Y(t)} stroke="var(--line)" />
              <text x={L - 5} y={Y(t) + 3} textAnchor="end" fontSize="8.5" fill="var(--faint)" style={mono}>
                {t.toFixed(1)}
              </text>
            </g>
          ))}
          <line x1={L} x2={W - 6} y1={Y(ATE)} y2={Y(ATE)} stroke="var(--gold)" strokeDasharray="4 3" />
          <text x={W - 8} y={Y(ATE) - 4} textAnchor="end" fontSize="8.5" fill="var(--gold)" style={mono}>
            ATE +0.115 pp
          </text>
          <polygon points={band} fill="var(--gold)" opacity="0.22" />
          <polyline points={data.map((d, i) => `${X(i)},${Y(d.u)}`).join(" ")} fill="none" stroke="var(--cyan)" strokeWidth="2" />
          {data.map((d, i) => (
            <circle key={i} cx={X(i)} cy={Y(d.u)} r="2.8" fill="var(--cyan)" />
          ))}
          {data.map((_, i) =>
            bins <= 12 || i % 2 === 0 ? (
              <text key={i} x={X(i)} y={H - 9} textAnchor="middle" fontSize="8.5" fill="var(--faint)" style={mono}>
                {i + 1}
              </text>
            ) : null,
          )}
          <text x={(W + L) / 2} y={H} textAnchor="middle" fontSize="8.5" fill="var(--faint)" style={mono}>
            CUSTOMER BIN (1 = MOST PERSUADABLE)
          </text>
          <text transform={`translate(9 ${H / 2}) rotate(-90)`} textAnchor="middle" fontSize="8.5" fill="var(--faint)" style={mono}>
            UPLIFT (pp)
          </text>
        </svg>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Slider label="HOLDOUT RATIO" value={hold} display={`${hold}%`} min={10} max={50} step={1} onChange={setHold} />
        <Slider label="CUSTOMER DECILES" value={bins} display={`${bins}`} min={5} max={20} step={1} onChange={setBins} />
        <Slider label="BOOTSTRAP DRAWS" value={draws} display={`${draws}`} min={100} max={2000} step={100} onChange={setDraws} />
      </div>
      <Note>Tip: drag the sliders: smaller holdouts and finer bins widen the gold 95% band, more draws steady it</Note>
      <Readout
        lines={[
          `holdout=${(hold / 100).toFixed(2)} bins=${bins} bootstrap_draws=${draws}`,
          "criteo: 0.309% treated vs 0.194% control = +0.115 pp",
          "top 20% of users capture 68% of uplift (3.4x random)",
          `top bin +${data[0].u.toFixed(3)} pp · 95% CI [${data[0].lo.toFixed(3)}, ${data[0].hi.toFixed(3)}] · mean half-width ±${half.toFixed(3)}`,
        ]}
      />
      <Note>Illustrative curve calibrated to the study&apos;s verified headline numbers</Note>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Rolling-origin backtest comparator                               */
/* ------------------------------------------------------------------ */

const SETS = {
  taxi: { label: "NYC Taxi (30 Zones)", unit: "trips/hr", model: 31.38, base: 36.37, losses: [9, 21], seed: 11, wins: "26 of 28", pct: "-13.7%" },
  grid: { label: "EU Grid Load (10 Countries)", unit: "MW", model: 423, base: 759, losses: [16], seed: 29, wins: "27 of 28", pct: "-44.3%" },
} as const;

type SetId = keyof typeof SETS;

// Simulated leak: error falls 88.7% below the baseline (36.37 to about 4.12 MAE on taxi).
const LEAK_RATIO = 0.1133;

function series(id: SetId) {
  const s = SETS[id];
  const r = rng(s.seed);
  const ratio = s.model / s.base;
  const base: number[] = [];
  const model: number[] = [];
  for (let i = 0; i < 28; i++) {
    const b = 1 + 0.16 * Math.sin((i / 7) * 2 * Math.PI) + (r() - 0.5) * 0.22;
    const k = (s.losses as readonly number[]).includes(i) ? 1.07 : ratio * (0.9 + r() * 0.16);
    base.push(b);
    model.push(b * k);
  }
  const mean = (a: number[]) => a.reduce((x, y) => x + y, 0) / a.length;
  const sb = s.base / mean(base);
  const sm = s.model / mean(model);
  return { base: base.map((v) => v * sb), model: model.map((v) => v * sm) };
}

export function ForecastSandbox() {
  const [id, setId] = useState<SetId>("taxi");
  const [days, setDays] = useState(28);
  const [leak, setLeak] = useState(false);
  const s = SETS[id];
  const clean = useMemo(() => series(id), [id]);
  // A leaked target-window feature lets the model "see" the answer, so its
  // error collapses to a sliver of the baseline's.
  const full = useMemo(() => {
    if (!leak) return clean;
    const raw = clean.base.map((v, i) => v * (0.86 + ((i * 7) % 5) * 0.07));
    const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);
    const k = (LEAK_RATIO * sum(clean.base)) / sum(raw);
    return { base: clean.base, model: raw.map((v) => v * k) };
  }, [clean, leak]);
  const base = full.base.slice(0, days);
  const model = full.model.slice(0, days);
  const mean = (a: number[]) => a.reduce((x, y) => x + y, 0) / a.length;
  const mb = mean(base);
  const mm = mean(model);
  const wins = model.filter((v, i) => v < base[i]).length;
  const verified = days === 28 && !leak;
  const lineC = leak ? "var(--bad)" : "var(--cyan)";

  const W = 360;
  const H = 200;
  const L = 38;
  const B = 22;
  const T = 10;
  const yMax = Math.max(...full.base, ...full.model) * 1.08;
  const X = (i: number) => L + (i / 27) * (W - L - 8);
  const Y = (v: number) => T + (1 - v / yMax) * (H - T - B);
  const fmt = (v: number) => (id === "taxi" ? v.toFixed(2) : v.toFixed(0));

  return (
    <div className="flex h-full flex-col gap-3">
      <div role="group" aria-label="Dataset" className="grid grid-cols-2 gap-2">
        {(Object.keys(SETS) as SetId[]).map((k) => (
          <button
            key={k}
            onClick={() => setId(k)}
            aria-pressed={id === k}
            className={`btn !text-[10px] ${id === k ? "btn-cyan" : ""}`}
          >
            {SETS[k].label}
          </button>
        ))}
      </div>
      <button
        role="switch"
        aria-checked={leak}
        onClick={() => setLeak((v) => !v)}
        className={`flex items-center justify-between gap-3 rounded-[3px] border px-2.5 py-2 text-left font-mono text-[10.5px] font-bold tracking-[0.1em] transition-colors ${
          leak ? "border-bad bg-bad-soft text-bad" : "border-line-strong text-muted hover:text-ink"
        }`}
      >
        <span>[ SIMULATE DATA LEAK ]</span>
        <span className="flex items-center gap-2">
          {leak ? "LEAK PLANTED" : "GUARD ACTIVE"}
          <span className={`relative h-4 w-8 rounded-full transition-colors ${leak ? "bg-bad" : "bg-line-strong"}`}>
            <span className={`absolute top-0.5 h-3 w-3 rounded-full bg-canvas transition-all ${leak ? "left-[18px]" : "left-0.5"}`} />
          </span>
        </span>
      </button>
      {!leak && (
        <Note>Flip the switch to plant a target-window leak and watch the error collapse to a number too good to be true</Note>
      )}
      {leak && (
        <div role="alert" className="rise rounded-[3px] border border-bad bg-bad-soft px-2.5 py-2 font-mono text-[10.5px] font-bold leading-snug tracking-[0.08em] text-bad">
          ⚠ LEAK DETECTED & BLOCKED BY HELD-OUT GUARD
          <span className="mt-0.5 block font-normal tracking-normal">
            The leak test fails the run, so this score is rejected and never reported.
          </span>
        </div>
      )}
      <div className="min-h-[170px] flex-1">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Daily mean absolute error: LightGBM against the simple baseline">
          {[0.25, 0.5, 0.75, 1].map((f) => (
            <g key={f}>
              <line x1={L} x2={W - 8} y1={Y(yMax * f * 0.9)} y2={Y(yMax * f * 0.9)} stroke="var(--line)" />
              <text x={L - 5} y={Y(yMax * f * 0.9) + 3} textAnchor="end" fontSize="8.5" fill="var(--faint)" style={mono}>
                {(yMax * f * 0.9).toFixed(0)}
              </text>
            </g>
          ))}
          <polyline points={full.base.map((v, i) => `${X(i)},${Y(v)}`).join(" ")} fill="none" stroke="var(--line-strong)" strokeDasharray="3 3" />
          <polyline points={full.model.map((v, i) => `${X(i)},${Y(v)}`).join(" ")} fill="none" stroke="var(--line-strong)" />
          <rect x={X(0) - 3} y={T} width={X(days - 1) - X(0) + 6} height={H - T - B} fill="var(--cyan)" opacity="0.06" />
          <polyline points={base.map((v, i) => `${X(i)},${Y(v)}`).join(" ")} fill="none" stroke="var(--gold)" strokeWidth="1.6" strokeDasharray="4 3" />
          <polyline points={model.map((v, i) => `${X(i)},${Y(v)}`).join(" ")} fill="none" stroke={lineC} strokeWidth="2" />
          {model.map((v, i) =>
            v >= base[i] ? <circle key={i} cx={X(i)} cy={Y(v)} r="3.5" fill="none" stroke="var(--gold)" strokeWidth="1.5" /> : null,
          )}
          <text x={L + 4} y={T + 9} fontSize="8.5" fill={lineC} style={mono}>{leak ? "LEAKED MODEL" : "LIGHTGBM"}</text>
          <text x={L + 80} y={T + 9} fontSize="8.5" fill="var(--gold)" style={mono}>SIMPLE BASELINE</text>
          <text x={(W + L) / 2} y={H - 4} textAnchor="middle" fontSize="8.5" fill="var(--faint)" style={mono}>
            HELD-OUT DAY 1 TO 28 · DAILY MAE ({s.unit})
          </text>
        </svg>
      </div>
      <Slider label="HELD-OUT DAYS SCORED" value={days} display={`${days} days`} min={7} max={28} step={1} onChange={setDays} />
      <Note>Tip: shrink the window to see how a short test flatters or hurts a model: circles mark days the baseline won</Note>
      <div className="grid grid-cols-3 gap-2">
        {[
          { v: fmt(mm), l: leak ? "Leaked MAE" : "LightGBM MAE", c: leak ? "text-bad" : "text-cyan" },
          { v: fmt(mb), l: "Baseline MAE", c: "text-gold" },
          { v: `${(((mm - mb) / mb) * 100).toFixed(1)}%`, l: "MAE change", c: leak ? "text-bad" : "text-ink" },
        ].map((k) => (
          <div key={k.l} className="rounded-[3px] border border-line bg-canvas px-2 py-1.5">
            <div className={`font-mono text-[15px] font-bold ${k.c}`}>{k.v}</div>
            <div className="label !text-[9px]">{k.l}</div>
          </div>
        ))}
      </div>
      <Readout
        lines={
          leak
            ? [
                `dataset=${id} window=${days}d wins=${wins}/${days}`,
                "SIMULATED LEAK: target-window feature planted (illustrative)",
                "leak test: FAIL · run rejected · score not reported",
              ]
            : [
                `dataset=${id} window=${days}d wins=${wins}/${days}`,
                verified
                  ? `VERIFIED 28-day result: ${s.pct} MAE, model wins ${s.wins} days`
                  : "partial window of an illustrative daily series (28d totals are verified)",
                "leak guard: PASS · 94 pytest checks passing · held-out days scored once",
              ]
        }
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Lumen: 3x concurrent fan-out + live SSE race                     */
/* ------------------------------------------------------------------ */

const MODELS = [
  {
    name: "Llama 3.3 70B",
    text: "An FPGA runs the feature extraction in parallel hardware so the edge device gets low latency and low power without a cloud GPU",
  },
  {
    name: "Qwen 3 32B",
    text: "The FPGA gives parallel hardware for feature extraction which means low latency and low power on a cheap edge device",
  },
  {
    name: "Kimi K2",
    text: "Use an FPGA when you need deterministic low latency at the edge and want parallel feature extraction at low power and cost",
  },
];

function jaccard(a: string, b: string) {
  const A = new Set(a.toLowerCase().split(/\W+/).filter(Boolean));
  const Bs = new Set(b.toLowerCase().split(/\W+/).filter(Boolean));
  let inter = 0;
  A.forEach((w) => Bs.has(w) && inter++);
  return inter / (A.size + Bs.size - inter);
}

export function LumenSandbox() {
  const [prog, setProg] = useState([0, 0, 0]);
  const [ms, setMs] = useState([0, 0, 0]);
  const [run, setRun] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Each run gets fresh per-model token rates, like a real race.
    const speed = MODELS.map(() => 0.018 + Math.random() * 0.03);
    const start = performance.now();
    const p = [0, 0, 0];
    setProg([0, 0, 0]);
    setMs([0, 0, 0]);
    const lat = [0, 0, 0];
    timer.current = setInterval(() => {
      const now = performance.now() - start;
      let moving = false;
      for (let i = 0; i < 3; i++) {
        if (p[i] < 1) {
          p[i] = Math.min(1, p[i] + speed[i] * (0.6 + Math.random() * 0.8));
          lat[i] = Math.round(now);
          moving = true;
        }
      }
      setProg([...p]);
      setMs([...lat]);
      if (!moving && timer.current) clearInterval(timer.current);
    }, 70);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [run]);

  const done = prog.every((v) => v >= 1);
  const pair = [jaccard(MODELS[0].text, MODELS[1].text), jaccard(MODELS[0].text, MODELS[2].text), jaccard(MODELS[1].text, MODELS[2].text)];
  const agree = Math.round((pair.reduce((a, b) => a + b, 0) / 3) * 100);
  const winner = done ? ms.indexOf(Math.min(...ms)) : -1;

  return (
    <div className="flex h-full flex-col gap-3">
      <svg viewBox="0 0 360 96" className="w-full shrink-0" role="img" aria-label="Fan-out: one query to three workers, then a judge, then one answer">
        <g fontSize="9" style={mono} fontWeight="600">
          <rect x="2" y="34" width="54" height="28" rx="2" fill="var(--surface2)" stroke="var(--line-strong)" />
          <text x="29" y="52" textAnchor="middle" fill="var(--ink)">QUERY</text>
          {MODELS.map((m, i) => {
            const y = 6 + i * 32;
            const live = prog[i] > 0 && prog[i] < 1;
            return (
              <g key={m.name}>
                <path d={`M56 48 C80 48 76 ${y + 10} 100 ${y + 10}`} fill="none" stroke="var(--cyan)" strokeWidth="1.3" className={live ? "pulse" : undefined} opacity={prog[i] > 0 ? 1 : 0.35} />
                <rect x="100" y={y} width="96" height="20" rx="2" fill="var(--cyan-soft)" stroke="var(--cyan-line)" />
                <text x="148" y={y + 13.5} textAnchor="middle" fill="var(--cyan)">{m.name}</text>
                <path d={`M196 ${y + 10} C222 ${y + 10} 218 48 242 48`} fill="none" stroke="var(--gold)" strokeWidth="1.3" opacity={prog[i] >= 1 ? 1 : 0.25} />
              </g>
            );
          })}
          <rect x="242" y="34" width="50" height="28" rx="2" fill="var(--gold-soft)" stroke="var(--gold-line)" />
          <text x="267" y="52" textAnchor="middle" fill="var(--gold)">JUDGE</text>
          <path d="M292 48h14" stroke="var(--gold)" strokeWidth="1.3" opacity={done ? 1 : 0.25} />
          <rect x="306" y="34" width="52" height="28" rx="2" fill="var(--surface2)" stroke={done ? "var(--ok)" : "var(--line-strong)"} />
          <text x="332" y="52" textAnchor="middle" fill={done ? "var(--ok)" : "var(--faint)"}>ANSWER</text>
        </g>
      </svg>

      <div className="rounded-[3px] border border-line bg-canvas px-2.5 py-1.5 font-mono text-[11px] text-muted">
        <span className="text-faint">PROMPT:</span> Why use an FPGA for edge inference?
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-around gap-2.5">
        {MODELS.map((m, i) => {
          const words = m.text.split(" ");
          const shown = words.slice(0, Math.round(prog[i] * words.length)).join(" ");
          return (
            <div key={m.name}>
              <div className="flex items-baseline justify-between font-mono text-[10.5px]">
                <span className={winner === i ? "text-ok" : "text-ink"}>
                  {m.name} {winner === i && "· FIRST"}
                </span>
                <span className="text-muted">{ms[i]} ms</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-[1px] bg-surface2">
                <div className="h-full bg-cyan transition-[width] duration-75" style={{ width: `${prog[i] * 100}%` }} />
              </div>
              <p className="mt-1 min-h-[2.6em] text-[11.5px] leading-snug text-muted">
                {shown}
                {prog[i] < 1 && <span className="blink text-cyan">▍</span>}
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <button onClick={() => setRun((r) => r + 1)} className="btn btn-cyan">
          ▶ Re-run race
        </button>
        <div className="flex-1">
          <div className="flex justify-between font-mono text-[10px] text-muted">
            <span>JACCARD AGREEMENT</span>
            <span className="text-gold">{done ? `${agree}%` : "judging…"}</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-[1px] bg-surface2">
            <div className="h-full bg-gold transition-[width] duration-500" style={{ width: done ? `${agree}%` : "0%" }} />
          </div>
        </div>
      </div>
      <Note>Tip: re-run to race the three streams: the judge scores word-set overlap across the answers once all finish</Note>
      <Readout
        lines={[
          `Promise.all([llama, qwen, kimi]) · ${done ? "3/3 streams closed" : "streaming…"}`,
          `pairwise jaccard: ${pair.map((p) => p.toFixed(2)).join(" · ")}`,
          "in-browser replay: timings are simulated, no API calls",
        ]}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4. dbt-duckdb lineage DAG + SQL inspector                           */
/* ------------------------------------------------------------------ */

const NODES = [
  {
    id: "src",
    name: "raw.online_retail_ii",
    kind: "SOURCE",
    note: "1,067,371 invoice lines · 5,942 customers",
    sql: `-- sources.yml
sources:
  - name: raw
    tables:
      - name: online_retail_ii   # UCI Online Retail II
-- audit before modelling:
--   22.77% rows missing customer_id
--   3,457 negative-quantity write-offs`,
  },
  {
    id: "stg",
    name: "stg_invoices",
    kind: "STAGING",
    note: "typed, de-duplicated, leak-filtered",
    sql: `select
  invoice_no,
  customer_id,
  cast(invoice_date as timestamp) as invoice_date,
  quantity * unit_price            as line_revenue
from {{ source('raw', 'online_retail_ii') }}
where customer_id is not null
  and invoice_date < '{{ var("cutoff_date") }}'
qualify row_number() over (
  partition by invoice_no, stock_code, quantity
  order by invoice_date) = 1`,
  },
  {
    id: "int",
    name: "int_rfm_features",
    kind: "INTERMEDIATE",
    note: "RFM at cutoff · k-means k=4 · ARI 0.955",
    sql: `select
  customer_id,
  '{{ var("cutoff_date") }}'::date          as cutoff_date,
  date_diff('day', max(invoice_date),
            '{{ var("cutoff_date") }}'::date) as recency_days,
  count(distinct invoice_no)                 as frequency,
  sum(line_revenue)                          as monetary
from {{ ref('stg_invoices') }}
group by 1
-- k-means on these: silhouette 0.376,
-- bootstrap ARI 0.955 (0.890 to 0.991)`,
  },
  {
    id: "mart",
    name: "mart_clv_245d",
    kind: "MART",
    note: "BG/NBD + Gamma-Gamma · 245-day horizon",
    sql: `{{ config(
    materialized='incremental',
    incremental_strategy='delete+insert',
    unique_key=['customer_id', 'cutoff_date']) }}

select
  f.customer_id,
  f.cutoff_date,
  s.segment,
  c.expected_purchases_245d,   -- BG/NBD
  c.clv_245d                   -- Gamma-Gamma
from {{ ref('int_rfm_features') }} f
join {{ ref('int_segments') }}     s using (customer_id, cutoff_date)
join {{ ref('int_clv_scores') }}   c using (customer_id, cutoff_date)`,
  },
  {
    id: "test",
    name: "assert_no_future_invoices",
    kind: "TEST",
    note: "leak guard: fails on a planted leak",
    sql: `-- dbt singular test: must return zero rows
select *
from {{ ref('stg_invoices') }}
where invoice_date >= '{{ var("cutoff_date") }}'
-- mirrored by a pytest check, and validated
-- by planting a leak and watching both fail`,
  },
];

export function DbtSandbox() {
  const [sel, setSel] = useState("int");
  const node = NODES.find((n) => n.id === sel)!;
  return (
    <div className="flex h-full flex-col gap-3">
      <ol className="flex flex-col">
        {NODES.map((n, i) => {
          const on = sel === n.id;
          const test = n.kind === "TEST";
          return (
            <li key={n.id} className="flex flex-col">
              {i > 0 && (
                <span
                  className={`ml-5 h-3 w-px ${test ? "border-l border-dashed border-gold-line" : "bg-cyan-line"}`}
                  aria-hidden
                />
              )}
              <button
                onClick={() => setSel(n.id)}
                aria-pressed={on}
                className={`flex items-center gap-2.5 rounded-[3px] border px-2.5 py-1.5 text-left transition-colors ${
                  on
                    ? test
                      ? "border-gold bg-gold-soft"
                      : "border-cyan bg-cyan-soft"
                    : "border-line bg-canvas hover:border-line-strong"
                }`}
              >
                <span className={`w-[78px] shrink-0 font-mono text-[9px] tracking-[0.12em] ${test ? "text-gold" : "text-cyan"}`}>
                  {n.kind}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-mono text-[12px] font-bold">{n.name}</span>
                  <span className="block truncate text-[11px] text-muted">{n.note}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <Note>Tip: click any node to inspect its SQL: the lineage runs source to mart, with the leak test on the side</Note>
      <div className="flex min-h-[150px] flex-1 flex-col overflow-hidden rounded-[3px] border border-line bg-canvas">
        <div className="flex justify-between border-b border-line px-2.5 py-1 font-mono text-[10px] text-muted">
          <span>SQL INSPECTOR // {node.name}</span>
          <span className="text-faint">dbt-duckdb</span>
        </div>
        <pre className="min-h-0 flex-1 overflow-auto p-2.5 font-mono text-[10.5px] leading-relaxed text-muted">
          {node.sql}
        </pre>
      </div>
      <Note>Representative SQL: the full models live in the repo</Note>
    </div>
  );
}
