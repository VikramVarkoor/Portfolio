# Vikram Varkoor · Architectural AI & FPGA Portfolio

Next.js App Router + TypeScript + Tailwind CSS v4. No backend, no API keys, no platform lock-in.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static production build
```

## Structure

| Path | What it holds |
|---|---|
| `lib/data.ts` | Every piece of copy and every number on the site. Edit here first. |
| `lib/assistant.ts` | Zero-token in-browser profile engine behind `ASK AI` (Cmd/Ctrl + K). |
| `components/Portfolio.tsx` | Shell: `?view=` routing (`hero`, `lab`, `software`, `hardware`, `research`, `archive`), theme, modals. |
| `components/views/` | One file per view: Hero, LabHub, Software, Hardware, Research, Archive. |
| `components/iso.tsx`, `IsoChip.tsx` | Isometric SVG toolkit and the Zynq-7020 chip. |
| `components/Sandboxes.tsx` | The four Software sandboxes. |
| `components/Oscilloscope.tsx` | Canvas scope with a real 64-point DFT and THD readout. |
| `app/globals.css` | Design tokens for Dark Studio and Daylight Blueprint (`html.daylight`). |

## Notes

- Theme choice is saved in `localStorage` as `vv_theme`. The Field Guide shows once, gated by `vv_field_guide_seen`.
- The sandboxes are illustrative simulators calibrated to verified headline numbers, and each one says so on screen.
- The optional on-device LLM (`@mlc-ai/web-llm`, SmolLM2-360M) only downloads if a visitor clicks "Load WebGPU LLM".
- Copy rule: no em-dashes anywhere in UI text. Use `·`, `:` or `//`.
- Classic CV PDF lives at `public/Vikram_Varkoor_CV.pdf`. Regenerate it from `lib/data.ts` with `npm run cv` (needs Google Chrome installed).
- `public/papers/ictmod-2024-p1.png` is page 1 of the ICTMOD 2024 paper. The other two sheets are cover sheets drawn from `PAPERS` in `lib/data.ts`.
