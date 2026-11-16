"use client";

import {
  ACHIEVEMENTS,
  BUILDS,
  CERTS,
  CONTACT,
  EDUCATION,
  EXPERIENCE,
  HERO,
  LANGUAGES,
  PAPERS,
  SKILL_ROWS,
} from "@/lib/data";
import Modal from "./Modal";

const CV_BUILDS = ["synapse-pl", "ad-measurement", "forecast-harness", "lumen", "churn-clv-dbt", "pitch-angle-finder"];

function H({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-2 mt-6 border-b border-[#141518]/25 pb-1 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#141518]">
      {children}
    </h3>
  );
}

export default function CvModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="CLASSIC CV // ONE-PAGE VIEW" onClose={onClose} wide>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-2.5">
        <span className="helper">Plain, printable, and free of animation</span>
        <div className="flex gap-2">
          <button className="btn" onClick={() => window.print()}>
            Print / Save PDF
          </button>
          <a className="btn btn-gold" href={CONTACT.cvPdf} download="Vikram_Varkoor_CV.pdf">
            Download PDF ↗
          </a>
        </div>
      </div>
      <div className="bg-surface2 p-3 sm:p-6">
        <div id="cv-sheet" className="mx-auto max-w-[820px] bg-[#fbfaf5] px-6 py-8 text-[#141518] shadow-xl sm:px-12 sm:py-10">
          <h2 className="text-3xl font-extrabold tracking-tight">Vikram Varkoor</h2>
          <p className="mt-1 font-mono text-[11.5px] tracking-[0.1em] text-[#141518]/70">
            {HERO.role} · DUBAI, UAE
          </p>
          <p className="mt-2 text-[12.5px] text-[#141518]/80">
            {CONTACT.email} · github.com/VikramVarkoor · linkedin.com/in/vikram-varkoor · vikramvarkoor.vercel.app
          </p>
          <p className="mt-4 text-[13.5px] leading-relaxed">{HERO.byline} Available immediately for full-time and internship roles.</p>

          <H>Education</H>
          {EDUCATION.map((e) => (
            <div key={e.degree} className="mb-2.5">
              <div className="flex flex-wrap justify-between gap-x-4 text-[13.5px]">
                <strong>
                  {e.degree}, {e.school}
                </strong>
                <span className="font-mono text-[11px] text-[#141518]/70">{e.status}</span>
              </div>
              <p className="text-[12.5px] leading-snug text-[#141518]/80">
                {e.note} {e.detail}
              </p>
            </div>
          ))}

          <H>Experience</H>
          <div className="flex flex-wrap justify-between gap-x-4 text-[13.5px]">
            <strong>
              {EXPERIENCE.role}, {EXPERIENCE.org}
            </strong>
            <span className="font-mono text-[11px] text-[#141518]/70">{EXPERIENCE.where}</span>
          </div>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-[12.5px] leading-snug text-[#141518]/85">
            {EXPERIENCE.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>

          <H>Selected Projects</H>
          {CV_BUILDS.map((id) => {
            const b = BUILDS.find((x) => x.id === id)!;
            return (
              <div key={id} className="mb-3">
                <div className="text-[13.5px]">
                  <strong>{b.name}</strong>
                  <span className="text-[#141518]/70"> · {b.skills.slice(0, 5).join(", ")}</span>
                </div>
                <ul className="mt-1 list-disc space-y-0.5 pl-5 text-[12.5px] leading-snug text-[#141518]/85">
                  {b.bullets.slice(0, 3).map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            );
          })}

          <H>Publications</H>
          <ul className="list-disc space-y-1 pl-5 text-[12.5px] leading-snug text-[#141518]/85">
            {PAPERS.map((p) => (
              <li key={p.id}>
                {p.title}. {p.venue}. <em>{p.href ? "Co-author." : "Under review."}</em>
              </li>
            ))}
          </ul>

          <H>Skills</H>
          <div className="space-y-1 text-[12.5px] leading-snug">
            {SKILL_ROWS.map((r) => (
              <p key={r.title}>
                <strong>{r.title.replace(/^\d+ \/\/ /, "")}:</strong> {r.skills.join(", ")}
              </p>
            ))}
          </div>

          <H>Certifications & Achievements</H>
          <ul className="list-disc space-y-1 pl-5 text-[12.5px] leading-snug text-[#141518]/85">
            {CERTS.map((c) => (
              <li key={c.org}>
                {c.org}: {c.items.join("; ")}
              </li>
            ))}
            {ACHIEVEMENTS.map((a) => (
              <li key={a}>{a}</li>
            ))}
            <li>Languages: {LANGUAGES}</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}
