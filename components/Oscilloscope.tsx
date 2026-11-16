"use client";

import { useEffect, useRef, useState } from "react";

const N = 64; // samples per burst
const K0 = 4; // fundamental lands on FFT bin 4

function fit(c: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = c.clientWidth;
  const h = c.clientHeight;
  if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) {
    c.width = Math.round(w * dpr);
    c.height = Math.round(h * dpr);
  }
  const ctx = c.getContext("2d")!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h };
}

/** Live burst waveform plus a real 64-point DFT computed every frame. */
export default function Oscilloscope() {
  const wave = useRef<HTMLCanvasElement>(null);
  const fft = useRef<HTMLCanvasElement>(null);
  const [thd, setThd] = useState(0);

  useEffect(() => {
    let raf = 0;
    let last = 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const frame = (ms: number) => {
      const t = reduce ? 0 : ms / 1000;
      const css = getComputedStyle(document.documentElement);
      const cyan = css.getPropertyValue("--cyan").trim();
      const gold = css.getPropertyValue("--gold").trim();
      const grid = css.getPropertyValue("--line").trim();
      const faint = css.getPropertyValue("--faint").trim();

      // Harmonic amplitudes drift slowly so THD visibly moves.
      const a3 = 0.16 + 0.1 * Math.sin(t * 0.7);
      const a5 = 0.09 + 0.05 * Math.sin(t * 0.43 + 1);
      const a7 = 0.04 + 0.03 * Math.sin(t * 0.9 + 2);
      const phase = t * 2.4;
      const x: number[] = [];
      for (let n = 0; n < N; n++) {
        const th = (2 * Math.PI * K0 * n) / N + phase;
        const noise = Math.sin(n * 12.9898 + t * 40) * 0.015;
        x.push(
          Math.sin(th) + a3 * Math.sin(3 * th) + a5 * Math.sin(5 * th) + a7 * Math.sin(7 * th) + noise,
        );
      }
      // 64-point DFT, bins 0..31
      const mag: number[] = [];
      for (let k = 0; k < N / 2; k++) {
        let re = 0;
        let im = 0;
        for (let n = 0; n < N; n++) {
          const a = (2 * Math.PI * k * n) / N;
          re += x[n] * Math.cos(a);
          im -= x[n] * Math.sin(a);
        }
        mag.push((2 * Math.hypot(re, im)) / N);
      }
      const harm = Math.hypot(mag[3 * K0], mag[5 * K0], mag[7 * K0]);
      const thdNow = (harm / mag[K0]) * 100;

      if (wave.current) {
        const { ctx, w, h } = fit(wave.current);
        ctx.clearRect(0, 0, w, h);
        ctx.strokeStyle = grid;
        ctx.lineWidth = 1;
        for (let i = 1; i < 8; i++) {
          ctx.beginPath();
          ctx.moveTo((w * i) / 8, 0);
          ctx.lineTo((w * i) / 8, h);
          ctx.stroke();
        }
        for (let i = 1; i < 4; i++) {
          ctx.beginPath();
          ctx.moveTo(0, (h * i) / 4);
          ctx.lineTo(w, (h * i) / 4);
          ctx.stroke();
        }
        ctx.strokeStyle = cyan;
        ctx.lineWidth = 1.8;
        ctx.shadowColor = cyan;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        x.forEach((v, n) => {
          const px = (n / (N - 1)) * w;
          const py = h / 2 - v * h * 0.33;
          if (n === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.fillStyle = cyan;
        x.forEach((v, n) => {
          if (n % 4) return;
          ctx.fillRect((n / (N - 1)) * w - 1.5, h / 2 - v * h * 0.33 - 1.5, 3, 3);
        });
      }

      if (fft.current) {
        const { ctx, w, h } = fit(fft.current);
        ctx.clearRect(0, 0, w, h);
        const bw = w / 32;
        const base = h - 14;
        mag.forEach((m, k) => {
          const isH = k === 3 * K0 || k === 5 * K0 || k === 7 * K0;
          const bh = Math.max(1.5, Math.min(1, m) * (base - 6));
          ctx.fillStyle = k === K0 ? cyan : isH ? gold : grid;
          ctx.fillRect(k * bw + 1, base - bh, bw - 2, bh);
        });
        ctx.fillStyle = faint;
        ctx.font = "9px monospace";
        ctx.textAlign = "center";
        [
          [K0, "f0"],
          [3 * K0, "3rd"],
          [5 * K0, "5th"],
          [7 * K0, "7th"],
        ].forEach(([k, l]) => ctx.fillText(l as string, (k as number) * bw + bw / 2, h - 3));
      }

      if (ms - last > 250) {
        last = ms;
        setThd(thdNow);
      }
      if (!reduce) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="panel flex flex-col p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="label !text-gold">Oscilloscope Telemetry Bus</span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted">
          <span className="pulse h-1.5 w-1.5 rounded-full bg-ok" /> LIVE
        </span>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-3">
        <div>
          <div className="mb-1 flex justify-between font-mono text-[10px] text-muted">
            <span>100 MHz CLK · 64-SAMPLE BURST</span>
          </div>
          <canvas ref={wave} className="h-24 w-full rounded-[3px] border border-line bg-canvas" aria-label="Live burst waveform" />
        </div>
        <div>
          <div className="mb-1 flex justify-between font-mono text-[10px] text-muted">
            <span>64-PT FFT · HARMONICS</span>
            <span className="text-gold">THD {thd.toFixed(1)}%</span>
          </div>
          <canvas ref={fft} className="h-24 w-full rounded-[3px] border border-line bg-canvas" aria-label="Live 64-point FFT spectrum" />
        </div>
      </div>
      <p className="helper mt-2">
        Simulated signal, real math: each frame runs a 64-point DFT and recomputes THD from the gold harmonic bins
      </p>
    </div>
  );
}
