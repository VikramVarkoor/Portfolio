"use client";

import { BUILDS } from "@/lib/data";
import type { Detail } from "./ctx";
import Modal from "./Modal";

export default function DetailModal({
  detail,
  onClose,
}: {
  detail: Detail;
  onClose: () => void;
}) {
  const b = BUILDS.find((x) => x.id === detail.buildId);
  if (!b) return null;
  const title = detail.title ?? b.name;
  const bullets = detail.bullets ?? b.bullets;
  const hardware = b.roles.includes("fpga");

  return (
    <Modal title={`BUILD SPEC // ${b.kind}`} onClose={onClose}>
      <div className="p-5 sm:p-6">
        <h2 className="text-2xl font-extrabold tracking-tight">{title}</h2>
        <p className={`mt-1.5 text-[15px] ${hardware ? "text-gold" : "text-cyan"}`}>
          {b.hook}
        </p>
        <ul className="mt-5 space-y-3">
          {bullets.map((t, i) => (
            <li key={i} className="flex gap-3 text-[14px] leading-relaxed text-muted">
              <span className="mt-[3px] font-mono text-[11px] text-faint">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {b.skills.map((s) => (
            <span key={s} className="chip">
              {s}
            </span>
          ))}
        </div>
        {(b.github || b.live) && (
          <div className="mt-5 flex gap-2 border-t border-line pt-4">
            {b.github && (
              <a className="btn" href={b.github} target="_blank" rel="noreferrer">
                GitHub ↗
              </a>
            )}
            {b.live && (
              <a className="btn btn-cyan" href={b.live} target="_blank" rel="noreferrer">
                Live ↗
              </a>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
