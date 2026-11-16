"use client";

import Modal from "./Modal";

const STEPS = [
  {
    label: "Click Stations to Explore",
    icon: (
      <path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10m0-1.5a1.5 1.5 0 0 1 3 0V10m0-.5a1.5 1.5 0 0 1 3 0V14a6 6 0 0 1-6 6h-.6a5 5 0 0 1-4-2L5 14.5a1.5 1.5 0 0 1 2.4-1.8L9 14" />
    ),
  },
  {
    label: "Tab + Enter for Keyboard Nav",
    icon: (
      <>
        <rect x="3" y="7" width="18" height="10" rx="1.5" />
        <path d="M7 12h7m0 0-2.5-2.5M14 12l-2.5 2.5M17.5 9.5v5" />
      </>
    ),
  },
  {
    label: "Ask AI Anything · Cmd/Ctrl + K",
    icon: (
      <>
        <path d="M4 5h16v11H9l-5 4z" />
        <path d="M8 9h8M8 12h5" />
      </>
    ),
  },
];

export default function FieldGuide({
  onClose,
  onCv,
}: {
  onClose: () => void;
  onCv: () => void;
}) {
  return (
    <Modal title="FIELD GUIDE // QUICK START" onClose={onClose}>
      <div className="px-6 py-7 text-center">
        <h2 className="font-mono text-xl font-bold tracking-[0.08em]">
          FIELD GUIDE <span className="text-gold">// QUICK START</span>
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-[14px] text-muted">
          Select a station to explore Vikram Varkoor&apos;s hardware-AI lab
          environment.
        </p>
        <div className="mx-auto mt-6 grid max-w-md grid-cols-3 gap-3">
          {STEPS.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-2.5">
              <span className="flex h-12 w-12 items-center justify-center rounded-md border border-line-strong bg-surface2">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6 text-cyan"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {s.icon}
                </svg>
              </span>
              <span className="text-[12.5px] leading-snug text-muted">{s.label}</span>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          autoFocus
          className="mt-7 rounded-[2px] border border-cyan bg-cyan-soft px-8 py-2.5 font-mono text-sm font-bold tracking-[0.2em] text-cyan transition-colors hover:bg-cyan hover:text-on-accent"
        >
          ENTER LAB
        </button>
        <div className="mt-4">
          <button
            onClick={onCv}
            className="text-[13px] text-muted underline underline-offset-4 hover:text-ink"
          >
            Skip to Classic View
          </button>
        </div>
      </div>
    </Modal>
  );
}
