"use client";

import { NAV } from "@/lib/data";
import { usePortfolio } from "./ctx";

export function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M10 2.5 12.1 8a3 3 0 0 0 1.9 1.9l5.5 2.1-5.5 2.1a3 3 0 0 0-1.9 1.9L10 21.5 7.9 16A3 3 0 0 0 6 14.1L.5 12 6 9.9A3 3 0 0 0 7.9 8z" />
      <path d="m19.5 1 .9 2.3a1.4 1.4 0 0 0 .8.8l2.3.9-2.3.9a1.4 1.4 0 0 0-.8.8l-.9 2.3-.9-2.3a1.4 1.4 0 0 0-.8-.8L15.5 5l2.3-.9a1.4 1.4 0 0 0 .8-.8z" />
    </svg>
  );
}

export default function TopNav({
  daylight,
  onTheme,
}: {
  daylight: boolean;
  onTheme: (daylight: boolean) => void;
}) {
  const { view, go, openCv, openAssistant } = usePortfolio();

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-line bg-glass px-3 backdrop-blur-md sm:px-4">
      <button
        onClick={() => go("hero")}
        className="flex shrink-0 items-center gap-2"
        aria-label="Vikram Varkoor: back to hero"
      >
        <span className="rounded-[2px] bg-gold px-1.5 py-0.5 font-mono text-[12px] font-bold tracking-wider text-on-accent">
          VIKRAM.V
        </span>
      </button>
      <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-line px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] text-muted xl:flex">
        <span className="pulse h-1.5 w-1.5 rounded-full bg-ok" />
        DUBAI, UAE // SYS_ONLINE
      </span>

      <nav
        aria-label="Views"
        className="min-w-0 flex-1 overflow-x-auto"
      >
        <div className="mx-auto flex w-max items-center gap-0.5">
        {NAV.map((n) => {
          const on = view === n.id;
          return (
            <button
              key={n.id}
              onClick={() => go(n.id)}
              aria-current={on ? "page" : undefined}
              className={`relative shrink-0 px-2.5 py-1.5 text-[13px] font-medium transition-colors ${
                on ? "text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {n.label}
              {on && (
                <span className="absolute inset-x-2.5 bottom-0 h-[2px] bg-cyan" />
              )}
            </button>
          );
        })}
        <button
          onClick={openCv}
          className="shrink-0 px-2.5 py-1.5 text-[13px] font-medium text-muted transition-colors hover:text-ink"
        >
          Classic CV
        </button>
        </div>
      </nav>

      <div
        role="group"
        aria-label="Theme"
        className="hidden shrink-0 items-center rounded-[2px] border border-line font-mono text-[10px] tracking-[0.1em] md:flex"
      >
        <button
          onClick={() => onTheme(false)}
          aria-pressed={!daylight}
          className={`px-2 py-1.5 ${!daylight ? "bg-ink text-canvas" : "text-muted hover:text-ink"}`}
        >
          DARK STUDIO
        </button>
        <button
          onClick={() => onTheme(true)}
          aria-pressed={daylight}
          className={`px-2 py-1.5 ${daylight ? "bg-ink text-canvas" : "text-muted hover:text-ink"}`}
        >
          DAYLIGHT
        </button>
      </div>
      <button
        onClick={() => onTheme(!daylight)}
        aria-label="Toggle theme"
        className="btn shrink-0 md:hidden"
      >
        {daylight ? "DARK" : "DAY"}
      </button>
      <button
        onClick={openAssistant}
        className="btn btn-cyan flex shrink-0 items-center gap-1.5"
        aria-label="Ask AI: open the portfolio assistant"
        title="Ask AI (Cmd/Ctrl + K)"
      >
        <Sparkle className="h-3.5 w-3.5" />
        ASK AI
      </button>
    </header>
  );
}
