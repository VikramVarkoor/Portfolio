"use client";

import { useEffect, useRef, useState } from "react";
import { HERO } from "@/lib/data";
import { usePortfolio } from "../ctx";
import IsoChip from "../IsoChip";

export default function Hero() {
  const { go } = usePortfolio();
  const [par, setPar] = useState({ x: 0, y: 0 });
  const touchY = useRef<number | null>(null);
  const left = useRef(false);

  const enter = () => {
    if (left.current) return;
    left.current = true;
    go("lab");
  };

  // Keyboard: the same "scroll down" intent enters the lab.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, [role=dialog]")) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") enter();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      className="relative flex h-full min-h-[600px] flex-col items-center overflow-hidden"
      onWheel={(e) => e.deltaY > 24 && enter()}
      onTouchStart={(e) => (touchY.current = e.touches[0].clientY)}
      onTouchEnd={(e) => {
        if (touchY.current === null) return;
        if (touchY.current - e.changedTouches[0].clientY > 60) enter();
        touchY.current = null;
      }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setPar({
          x: ((e.clientX - r.left) / r.width - 0.5) * 2,
          y: ((e.clientY - r.top) / r.height - 0.5) * 2,
        });
      }}
      onMouseLeave={() => setPar({ x: 0, y: 0 })}
    >
      {/* Stage: 3D-tilting FPGA core */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 top-[34%] sm:top-[32%]"
        style={{ perspective: "1400px" }}
        aria-hidden
      >
        <div
          className="h-full w-full"
          style={{
            transform: `rotateX(${par.y * -5}deg) rotateY(${par.x * 7}deg)`,
            transition: "transform 0.25s ease-out",
          }}
        >
          <IsoChip
            className="mx-auto h-full w-full max-w-[1500px]"
            parallax={par}
          />
        </div>
      </div>
      {/* Vignette keeps the copy legible over the stage */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[55%]"
        style={{
          background:
            "linear-gradient(to bottom, var(--canvas) 30%, transparent)",
        }}
        aria-hidden
      />

      <div className="relative z-10 flex flex-col items-center px-4 pt-[4vh] text-center sm:pt-[5vh]">
        <p className="flex max-w-full items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 font-mono text-[9.5px] tracking-[0.14em] text-muted sm:text-[10.5px]">
          <span className="pulse h-1.5 w-1.5 shrink-0 rounded-full bg-ok" />
          {HERO.availability}
        </p>
        <h1 className="mt-5 font-sans text-[clamp(2.4rem,8.6vw,7rem)] font-extrabold leading-[0.95] tracking-[-0.03em]">
          {HERO.headline}
          <span className="blink text-gold">_</span>
        </h1>
        <p className="mt-4 rounded-full border border-cyan-line bg-cyan-soft px-4 py-1 font-mono text-[11px] tracking-[0.18em] sm:text-[13px]">
          <span className="text-cyan">ELECTRICAL ENGINEER</span>
          <span className="text-faint"> · </span>
          <span className="text-gold">MSc AI STUDENT</span>
        </p>
        <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-muted sm:text-[15.5px]">
          {HERO.byline}
        </p>
      </div>

      <div className="relative z-10 mt-auto flex flex-col items-center gap-2 pb-6">
        <button
          onClick={enter}
          className="rounded-[2px] border border-gold bg-gold px-6 py-3 font-mono text-[13px] font-bold tracking-[0.18em] text-on-accent shadow-[0_0_32px_var(--gold-line)] transition-transform hover:-translate-y-0.5"
        >
          [ ENTER THE LAB ↓ ]
        </button>
        <span className="helper">Scroll down or press ↓ to enter</span>
      </div>

      {/* Corner telemetry */}
      <div
        className="pointer-events-none absolute bottom-4 left-4 hidden font-mono text-[10px] leading-relaxed text-faint lg:block"
        aria-hidden
      >
        <div>PL_CLK 100 MHz · AXI4-DMA ACTIVE</div>
        <div>GLCM 252 FEAT · 1.32 s · LUT 13% · DSP 22%</div>
      </div>
      <div
        className="pointer-events-none absolute bottom-4 right-4 hidden text-right font-mono text-[10px] leading-relaxed text-faint lg:block"
        aria-hidden
      >
        <div>X {par.x.toFixed(3)} · Y {par.y.toFixed(3)}</div>
        <div>ZYNQ-7020 · 25.2048° N 55.2708° E</div>
      </div>
    </section>
  );
}
