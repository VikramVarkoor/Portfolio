"use client";

import { CERTS, EDUCATION, PAPERS, type Paper } from "@/lib/data";
import { usePortfolio } from "../ctx";

const SHEET =
  "@container aspect-[1/1.414] w-full overflow-hidden rounded-[2px] bg-[#fbfaf5] font-serif text-[#161616] shadow-[0_18px_50px_rgba(0,0,0,0.45)] ring-1 ring-black/10 transition-transform duration-200 group-hover:-translate-y-1";

/** Figure 1: a clean block diagram of the system each paper describes. */
function Figure({ blocks }: { blocks: string[] }) {
  const h = 30;
  const gap = 22;
  const H = blocks.length * h + (blocks.length - 1) * gap + 8;
  return (
    <svg viewBox={`0 0 200 ${H}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
      {blocks.map((f, i) => {
        const y = 4 + i * (h + gap);
        return (
          <g key={f}>
            <rect x="26" y={y} width="148" height={h} rx="1.5" fill={i % 2 ? "#eef3f8" : "#fff"} stroke="#161616" strokeWidth="0.9" />
            <text x="100" y={y + h / 2 + 3} textAnchor="middle" fontSize="8.6" fontWeight="600" fontFamily="var(--font-sans)" fill="#161616">
              {f}
            </text>
            <text x="16" y={y + h / 2 + 3} textAnchor="middle" fontSize="7" fontFamily="var(--font-sans)" fill="#161616" opacity="0.6">
              {i + 1}
            </text>
            {i < blocks.length - 1 && (
              <path d={`M100 ${y + h}v${gap - 2}m-3.5-4 3.5 4 3.5-4`} fill="none" stroke="#00629b" strokeWidth="1.1" />
            )}
          </g>
        );
      })}
    </svg>
  );
}

/** Full-aspect A4 sheet. Always paper-coloured, in both themes. */
function Sheet({ p }: { p: Paper }) {
  if (p.image) {
    return (
      <div className={SHEET}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.image}
          alt={`First page of the paper: ${p.title}`}
          loading="lazy"
          className="h-full w-full object-cover object-top"
        />
      </div>
    );
  }
  return (
    <div className={SHEET}>
      <div className="flex h-full flex-col px-[7cqw] pb-[4cqw] pt-[5cqw]">
        <div className="flex items-center justify-between border-b border-[#161616]/40 pb-[1cqw] font-sans text-[1.35cqw] uppercase tracking-[0.08em] text-[#161616]/70">
          <span className="font-bold text-[#00629b]">IEEE</span>
          <span className="max-w-[80%] truncate">{p.venue}</span>
        </div>
        <h3 className="mx-auto mt-[4cqw] max-w-[90%] text-center text-[3.9cqw] font-normal leading-[1.15]">
          {p.title}
        </h3>
        <p className="mt-[2.4cqw] text-center text-[1.95cqw] leading-snug">{p.authors}</p>
        <p className="mt-[0.8cqw] text-center text-[1.6cqw] italic leading-snug text-[#161616]/75">
          {p.affiliation}
        </p>

        <div className="mt-[4cqw] grid min-h-0 flex-1 grid-cols-2 gap-[3.6cqw] text-[1.9cqw] leading-[1.42]">
          <div className="flex min-h-0 flex-col gap-[2cqw]">
            <p className="text-justify font-bold">
              <i>Abstract:</i> {p.abstract}
            </p>
            <p className="text-justify">
              <i className="font-bold">Index Terms:</i> {p.keywords}
            </p>
            <div className="mt-[1cqw] text-center text-[1.75cqw] tracking-[0.08em]">I. CONTRIBUTIONS</div>
            <ol className="flex flex-col gap-[1.3cqw]">
              {p.highlights.map((h, i) => (
                <li key={h} className="flex gap-[1.2cqw] text-justify">
                  <span className="shrink-0">{i + 1})</span>
                  <span>{h}</span>
                </li>
              ))}
            </ol>
            <div className="mt-auto border-t border-[#161616]/40 pt-[1.2cqw] font-sans text-[1.5cqw] leading-[1.4] text-[#161616]/75">
              <span className="font-bold uppercase tracking-[0.08em] text-[#161616]">
                {p.href ? "Cite as: " : "Status: "}
              </span>
              {p.cite}
            </div>
          </div>
          <div className="flex min-h-0 flex-col gap-[1.6cqw]">
            <figure className="flex min-h-0 flex-1 flex-col items-center gap-[1cqw]">
              <div className="min-h-0 w-full flex-1">
                <Figure blocks={p.figure} />
              </div>
              <figcaption className="text-center text-[1.6cqw]">Fig. 1. System architecture overview.</figcaption>
            </figure>
            <div>
              <div className="mb-[0.8cqw] text-center font-sans text-[1.45cqw] uppercase tracking-[0.08em]">
                Table I · Paper at a glance
              </div>
              <table className="w-full border-y border-[#161616]/70 font-sans text-[1.55cqw]">
                <tbody>
                  {p.facts.map(([k, v]) => (
                    <tr key={k} className="border-t border-[#161616]/15 first:border-t-0">
                      <td className="py-[0.55cqw] pr-[1cqw] text-[#161616]/65">{k}</td>
                      <td className="py-[0.55cqw] text-right font-semibold">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-[2cqw] flex items-center justify-between border-t border-[#161616]/30 pt-[1cqw] font-sans text-[1.25cqw] text-[#161616]/60">
          <span>{p.href ? "Cover sheet · full text on IEEE Xplore" : "Cover sheet · manuscript under peer review"}</span>
          <span>1</span>
        </div>
      </div>
    </div>
  );
}

export default function Research() {
  const { openDetail } = usePortfolio();

  return (
    <section className="mx-auto grid grid-cols-1 max-w-[1500px] gap-6 p-3 sm:p-5 lg:grid-cols-[45fr_55fr] lg:items-start">
      {/* Left 45%: locked sticky column */}
      <div className="flex min-w-0 flex-col gap-3 lg:sticky lg:top-5">
        <h1 className="px-1 text-xl font-extrabold tracking-tight sm:text-2xl">
          Education, IEEE Publications & Certifications
        </h1>
        {EDUCATION.map((e) => (
          <article
            key={e.degree}
            className={`panel p-4 ${e.accent === "cyan" ? "border-l-2 !border-l-cyan" : "border-l-2 !border-l-gold"}`}
          >
            <div className={`font-mono text-[10.5px] tracking-[0.12em] ${e.accent === "cyan" ? "text-cyan" : "text-gold"}`}>
              {e.status}
            </div>
            <h2 className="mt-1.5 font-mono text-[17px] font-bold tracking-[0.03em]">{e.degree}</h2>
            <div className="mt-0.5 text-[14px] font-semibold">{e.school}</div>
            <p className="mt-2 text-[13.5px] leading-snug text-muted">{e.note}</p>
            <p className="mt-1.5 text-[12.5px] leading-snug text-faint">{e.detail}</p>
          </article>
        ))}
        <article className="panel p-4">
          <div className="label !text-gold">Industry Certifications</div>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {CERTS.map((c) => (
              <div key={c.org}>
                <div className="text-[13.5px] font-bold">{c.org}</div>
                <ul className="mt-1.5 space-y-1.5">
                  {c.items.map((i) => (
                    <li key={i} className="flex gap-2 text-[12.5px] leading-snug text-muted">
                      <span className="text-ok">✓</span>
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </article>
      </div>

      {/* Right 55%: papers, words on top then the A4 sheet */}
      <div className="flex min-w-0 flex-col gap-10">
        {PAPERS.map((p, i) => {
          const n = String(i + 1).padStart(2, "0");
          const next = String(i + 2).padStart(2, "0");
          const head = (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <span className="chip !border-gold-line !bg-gold-soft !text-gold">{p.venueTag}</span>
                <span className="font-mono text-[10.5px] tracking-[0.1em] text-faint">{p.status}</span>
              </div>
              <h2 className="mt-2 text-[19px] font-extrabold leading-tight tracking-tight">
                {p.venueTag}: {p.shortTitle}
              </h2>
              <p className="mt-1.5 text-[14px] leading-snug text-muted">{p.summary}</p>
              <p className="helper mb-3 mt-2 !text-cyan">
                {p.href ? "Click the page to open the paper on IEEE Xplore ↗" : "Click the page to open the Synapse.PL FPGA specification ↗"}
              </p>
            </>
          );
          return (
            <article key={p.id}>
              {p.href ? (
                <a href={p.href} target="_blank" rel="noopener noreferrer" className="group block" aria-label={`${p.title}: open on IEEE Xplore`}>
                  {head}
                  <Sheet p={p} />
                </a>
              ) : (
                <button
                  onClick={() => openDetail({ buildId: "synapse-pl" })}
                  className="group block w-full text-left"
                  aria-label={`${p.title}: open the Synapse.PL specification`}
                >
                  {head}
                  <Sheet p={p} />
                </button>
              )}
              <p className="mt-4 text-center font-mono text-[10.5px] tracking-[0.14em] text-faint">
                PAPER {n} OF 03 ·{" "}
                {i < PAPERS.length - 1 ? `SCROLL DOWN FOR PAPER ${next} OF 03 ↓` : "END OF PAPERS"}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
