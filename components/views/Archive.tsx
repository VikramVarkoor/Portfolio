"use client";

import { useMemo, useState } from "react";
import {
  BUILDS,
  NAV,
  RADAR_AXES,
  ROLES,
  SKILL_ROWS,
  SPOTLIGHT_COUNT,
  roleCount,
  skillCount,
  type Role,
} from "@/lib/data";
import { usePortfolio } from "../ctx";

const mono = { fontFamily: "var(--font-mono)" };

function Radar({ role, onPick }: { role: Role | "all"; onPick: (r: Role) => void }) {
  const R = 78;
  const max = Math.max(...RADAR_AXES.map((a) => roleCount(a.role)));
  // axes: up, right, down, left
  const dir = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ];
  const pts = RADAR_AXES.map((a, i) => {
    const v = (roleCount(a.role) / max) * R;
    return [dir[i][0] * v, dir[i][1] * v];
  });
  return (
    <svg viewBox="-200 -112 400 224" className="h-full w-full" role="group" aria-label="Skill radar: builds per domain">
      {[0.33, 0.66, 1].map((f) => (
        <polygon key={f} points={dir.map((d) => `${d[0] * R * f},${d[1] * R * f}`).join(" ")} fill="none" stroke="var(--line)" />
      ))}
      {dir.map((d, i) => (
        <line key={i} x1="0" y1="0" x2={d[0] * R} y2={d[1] * R} stroke="var(--line)" />
      ))}
      <polygon points={pts.map((p) => p.join(",")).join(" ")} fill="var(--cyan)" fillOpacity="0.16" stroke="var(--cyan)" strokeWidth="1.6" />
      {RADAR_AXES.map((a, i) => {
        const on = role === a.role;
        const d = dir[i];
        const perp = [-d[1], d[0]];
        const far = 104;
        // Clickable wedge covering this axis' quadrant.
        const wedge = `0,0 ${(d[0] + perp[0]) * far},${(d[1] + perp[1]) * far} ${(d[0] - perp[0]) * far},${(d[1] - perp[1]) * far}`;
        const lx = d[0] * (R + 12);
        const ly = d[1] * (R + 16);
        return (
          <g
            key={a.role}
            role="button"
            tabIndex={0}
            aria-pressed={on}
            aria-label={`Filter by ${a.label}: ${roleCount(a.role)} builds`}
            onClick={() => onPick(a.role)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onPick(a.role);
              }
            }}
            style={{ cursor: "pointer", outline: "none" }}
          >
            <polygon points={wedge} fill={on ? "var(--gold)" : "transparent"} fillOpacity={on ? 0.1 : 0} />
            <circle cx={pts[i][0]} cy={pts[i][1]} r={on ? 5.5 : 4} fill={on ? "var(--gold)" : "var(--cyan)"} />
            <text
              x={lx}
              y={ly + (d[1] === 0 ? 4 : d[1] < 0 ? 0 : 8)}
              textAnchor={d[0] > 0 ? "start" : d[0] < 0 ? "end" : "middle"}
              fontSize="9"
              fontWeight="700"
              letterSpacing="0.8"
              fill={on ? "var(--gold)" : "var(--muted)"}
              style={mono}
            >
              {a.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Archive() {
  const { go } = usePortfolio();
  const [role, setRole] = useState<Role | "all">("all");
  const [skill, setSkill] = useState<string | null>(null);
  const [all, setAll] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  const pickRole = (r: Role | "all") => setRole((cur) => (cur === r && r !== "all" ? "all" : r));

  const filtered = useMemo(
    () =>
      BUILDS.filter(
        (b) => (role === "all" || b.roles.includes(role)) && (!skill || b.skills.includes(skill)),
      ),
    [role, skill],
  );
  const filtering = role !== "all" || skill !== null;
  const shown = all || filtering ? filtered : filtered.slice(0, SPOTLIGHT_COUNT);

  return (
    <section className="mx-auto flex max-w-[1500px] flex-col gap-5 p-3 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2 px-1">
        <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">Skills & Build Archive</h1>
        <span className="label">01 // Role lens · 02 // Stack · 03 // Builds</span>
      </div>

      {/* Role filter tabs */}
      <div role="tablist" aria-label="Role filter" className="flex flex-wrap gap-1.5">
        {ROLES.map((r) => {
          const on = role === r.id;
          return (
            <button
              key={r.id}
              role="tab"
              aria-selected={on}
              onClick={() => setRole(r.id)}
              className={`rounded-[2px] border px-3 py-1.5 font-mono text-[11px] font-bold tracking-[0.1em] transition-colors ${
                on ? "border-gold bg-gold text-on-accent" : "border-line-strong text-muted hover:border-ink hover:text-ink"
              }`}
            >
              {r.label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        {/* 7 cols: stack rows */}
        <div className="panel flex flex-col divide-y divide-line lg:col-span-7">
          {SKILL_ROWS.map((row) => {
            const dim = role !== "all" && role !== row.role;
            return (
              <div key={row.title} className={`p-3.5 transition-opacity ${dim ? "opacity-35" : ""}`}>
                <div className="mb-2.5 flex items-center justify-between">
                  <button
                    onClick={() => pickRole(row.role)}
                    className="font-mono text-[11.5px] font-bold tracking-[0.12em] text-ink hover:text-cyan"
                  >
                    {row.title}
                  </button>
                  <span className="label">{roleCount(row.role)} builds</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {row.skills.map((s) => {
                    const on = skill === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setSkill(on ? null : s)}
                        aria-pressed={on}
                        className={`flex items-center gap-1.5 rounded-[2px] border px-2 py-1 font-mono text-[11px] transition-colors ${
                          on
                            ? "border-cyan bg-cyan text-on-accent"
                            : "border-line text-muted hover:border-cyan-line hover:text-ink"
                        }`}
                      >
                        {s}
                        <span className={`text-[10px] font-bold ${on ? "" : "text-cyan"}`}>
                          {String(skillCount(s)).padStart(2, "0")}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
          <p className="helper p-3.5">
            Each chip shows how many of the 15 builds use that skill: click one to filter the registry below
          </p>
        </div>

        {/* 5 cols: radar + metric tiles */}
        <div className="panel flex flex-col p-3.5 lg:col-span-5">
          <div className="label !text-cyan">Interactive 4-Axis Skill Radar</div>
          <div className="min-h-[220px] flex-1">
            <Radar role={role} onPick={pickRole} />
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {RADAR_AXES.map((a) => {
              const on = role === a.role;
              return (
                <button
                  key={a.role}
                  onClick={() => pickRole(a.role)}
                  aria-pressed={on}
                  className={`rounded-[2px] border px-2 py-1.5 text-left transition-colors ${
                    on ? "border-gold bg-gold-soft" : "border-line bg-canvas hover:border-line-strong"
                  }`}
                >
                  <div className={`font-mono text-[18px] font-bold ${on ? "text-gold" : "text-ink"}`}>
                    {String(roleCount(a.role)).padStart(2, "0")}
                  </div>
                  <div className="label !text-[8.5px]">{a.label}</div>
                </button>
              );
            })}
          </div>
          <p className="helper mt-2.5">
            Axis length = builds in that domain: click a quadrant or tile to set the role lens
          </p>
        </div>
      </div>

      {/* Build registry */}
      <div>
        <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2 px-1">
          <h2 className="font-mono text-[13px] font-bold tracking-[0.12em]">
            {filtering
              ? `03 // FILTERED BUILDS (${filtered.length} OF ${BUILDS.length})`
              : all
                ? `03 // ALL ${BUILDS.length} VERIFIED BUILDS`
                : `03 // SPOTLIGHT PROJECTS (TOP ${SPOTLIGHT_COUNT})`}
          </h2>
          <div className="flex items-center gap-3">
            {filtering && (
              <button
                className="btn !py-1"
                onClick={() => {
                  setRole("all");
                  setSkill(null);
                }}
              >
                Clear filters ✕
              </button>
            )}
            <span className="helper">Tip: click any skill chip above to filter builds</span>
          </div>
        </div>

        <ul className="panel divide-y divide-line overflow-hidden">
          {shown.map((b) => {
            const isOpen = open === b.id;
            const idx = BUILDS.indexOf(b) + 1;
            return (
              <li key={b.id}>
                <button
                  onClick={() => setOpen(isOpen ? null : b.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-3 px-3.5 py-3 text-left transition-colors hover:bg-surface2"
                >
                  <span className="w-6 shrink-0 font-mono text-[11px] text-faint">
                    {String(idx).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14.5px] font-bold">{b.name}</span>
                    <span className="block truncate text-[12.5px] text-muted">{b.hook}</span>
                  </span>
                  <span className="chip hidden md:inline">{b.kind}</span>
                  <span className={`font-mono text-sm text-cyan transition-transform ${isOpen ? "rotate-45" : ""}`}>+</span>
                </button>
                {isOpen && (
                  <div className="rise border-t border-line bg-surface2 px-3.5 py-4 sm:pl-[3.4rem]">
                    <ul className="space-y-2">
                      {b.bullets.map((t, i) => (
                        <li key={i} className="flex gap-2.5 text-[13.5px] leading-relaxed text-muted">
                          <span className="text-cyan">·</span>
                          {t}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {b.skills.map((s) => (
                        <span key={s} className="chip">{s}</span>
                      ))}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {b.github && <a className="btn" href={b.github} target="_blank" rel="noreferrer">GitHub ↗</a>}
                      {b.live && <a className="btn" href={b.live} target="_blank" rel="noreferrer">Live ↗</a>}
                      {b.view && (
                        <button className="btn btn-cyan" onClick={() => go(b.view!)}>
                          Open in {NAV.find((n) => n.id === b.view)!.label} ↗
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
          {shown.length === 0 && (
            <li className="px-4 py-6 text-center text-[13.5px] text-muted">
              No build matches that role and skill together. Clear a filter to see more.
            </li>
          )}
        </ul>

        {!filtering && (
          <div className="mt-3 flex justify-center">
            <button className="btn btn-gold !px-4 !py-2" onClick={() => setAll((v) => !v)}>
              {all ? "[ SHOW TOP 6 ONLY ↑ ]" : `[ VIEW ALL ${BUILDS.length} BUILDS ↓ ]`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
