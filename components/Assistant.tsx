"use client";

import { useEffect, useRef, useState } from "react";
import { SUGGESTIONS, answer, retrieve } from "@/lib/assistant";
import { Sparkle } from "./TopNav";

const THINK_MS = 1200;
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

type Msg = { from: "user" | "sys"; text: string; via?: string };

const MODEL = "SmolLM2-360M-Instruct-q4f16_1-MLC";

// Minimal shape of the WebLLM engine that this drawer uses.
type Engine = {
  chat: {
    completions: {
      create: (req: {
        messages: { role: string; content: string }[];
        temperature: number;
        max_tokens: number;
      }) => Promise<{ choices: { message: { content: string | null } }[] }>;
    };
  };
};

export default function Assistant({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      from: "sys",
      text: "Ask AI is online. Ask about Vikram's projects, skills, education or availability. Answers come from his verified profile and run fully in your browser.",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [llm, setLlm] = useState<"off" | "loading" | "ready" | "failed">("off");
  const [progress, setProgress] = useState("");
  const engine = useRef<Engine | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    field.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [msgs, busy]);

  async function loadLlm() {
    if (!("gpu" in navigator)) {
      setLlm("failed");
      setProgress("WebGPU is not available in this browser: staying on the local profile engine.");
      return;
    }
    setLlm("loading");
    try {
      const webllm = await import("@mlc-ai/web-llm");
      engine.current = (await webllm.CreateMLCEngine(MODEL, {
        initProgressCallback: (p: { text: string }) => setProgress(p.text),
      })) as unknown as Engine;
      setLlm("ready");
      setProgress("On-device model ready and cached in IndexedDB.");
    } catch {
      setLlm("failed");
      setProgress("Could not load the on-device model: staying on the local profile engine.");
    }
  }

  async function ask(q: string) {
    const query = q.trim();
    if (!query || busy) return;
    setInput("");
    setMsgs((m) => [...m, { from: "user", text: query }]);
    const grounded = answer(query);
    setBusy(true);

    if (llm === "ready" && engine.current && retrieve(query, 1).length) {
      try {
        const context = retrieve(query, 2)
          .map((e) => e.answer)
          .join("\n\n");
        const res = await engine.current.chat.completions.create({
          messages: [
            {
              role: "system",
              content:
                "You answer questions about Vikram Varkoor for recruiters. Use ONLY the facts in the context. Keep every number exactly as written. Be brief. Never use em dashes.\n\nContext:\n" +
                context,
            },
            { role: "user", content: query },
          ],
          temperature: 0.2,
          max_tokens: 220,
        });
        const text = (res.choices[0]?.message.content ?? "").replaceAll("\u2014", ":").trim();
        setMsgs((m) => [...m, { from: "sys", text: text || grounded, via: text ? "SmolLM2 · on-device" : "profile engine" }]);
      } catch {
        setMsgs((m) => [...m, { from: "sys", text: grounded, via: "profile engine" }]);
      }
      setBusy(false);
      return;
    }
    await wait(THINK_MS);
    setMsgs((m) => [...m, { from: "sys", text: grounded, via: "profile engine" }]);
    setBusy(false);
  }

  return (
    <aside
      aria-label="Ask AI portfolio assistant"
      aria-hidden={!open}
      inert={!open}
      className={`fixed bottom-10 right-0 top-14 z-40 flex w-full max-w-[420px] flex-col border-l border-line-strong bg-glass shadow-2xl backdrop-blur-xl transition-transform duration-300 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <div>
          <div className="flex items-center gap-1.5 font-mono text-[12px] font-bold tracking-[0.12em] text-cyan">
            <Sparkle className="h-3.5 w-3.5" />
            ASK AI · PORTFOLIO ASSISTANT
          </div>
          <div className="label !text-[9px]">Zero-token · in-browser · no rate limits</div>
        </div>
        <button onClick={onClose} className="btn !px-2 !py-1" aria-label="Close assistant">
          ✕
        </button>
      </div>

      <div ref={scroller} className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
        {msgs.map((m, i) => (
          <div key={i} className={m.from === "user" ? "flex justify-end" : ""}>
            <div
              className={`rise max-w-[92%] whitespace-pre-line rounded-[4px] border px-3 py-2 text-[13px] leading-relaxed ${
                m.from === "user"
                  ? "border-cyan-line bg-cyan-soft text-ink"
                  : "border-line bg-surface text-muted"
              }`}
            >
              {m.text}
              {m.via && <div className="label mt-1.5 !text-[8.5px]">via {m.via}</div>}
            </div>
          </div>
        ))}
        {busy && (
          <div className="rise inline-flex items-center gap-2.5 rounded-[4px] border border-cyan-line bg-cyan-soft px-3 py-2 text-[13px] text-muted" role="status">
            <span className="flex gap-1" aria-hidden>
              {[0, 1, 2].map((i) => (
                <span key={i} className="dot h-1.5 w-1.5 rounded-full bg-cyan" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </span>
            Thinking · Searching portfolio knowledge...
          </div>
        )}
      </div>

      <div className="border-t border-line p-3">
        <div className="mb-2.5 flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => ask(s)} disabled={busy} className="chip hover:border-cyan-line hover:text-ink">
              {s}
            </button>
          ))}
        </div>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
        >
          <input
            ref={field}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a project, skill or role fit"
            aria-label="Your question"
            className="min-w-0 flex-1 rounded-[2px] border border-line-strong bg-canvas px-2.5 py-2 font-mono text-[12px] text-ink placeholder:text-faint focus:border-cyan focus:outline-none"
          />
          <button type="submit" className="btn btn-cyan" disabled={busy}>
            Run ↵
          </button>
        </form>
        <div className="mt-2.5 flex items-center justify-between gap-2">
          <p className="helper min-w-0 flex-1 truncate !normal-case" title={progress}>
            {progress || "Optional: rephrase answers with a small on-device model (about 380MB, cached)"}
          </p>
          {llm === "off" && (
            <button onClick={loadLlm} className="btn !py-1 !text-[9.5px]">
              Load WebGPU LLM
            </button>
          )}
          {llm === "loading" && <span className="label pulse">Loading</span>}
          {llm === "ready" && <span className="label !text-ok">LLM on</span>}
        </div>
      </div>
    </aside>
  );
}
