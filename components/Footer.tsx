"use client";

import { useState } from "react";
import { CONTACT } from "@/lib/data";
import { usePortfolio } from "./ctx";

export default function Footer() {
  const { openCv } = usePortfolio();
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
    } catch {
      // Clipboard blocked: fall back to opening the mail client.
      window.location.href = `mailto:${CONTACT.email}`;
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  const link =
    "shrink-0 font-mono text-[11px] tracking-[0.06em] text-muted transition-colors hover:text-ink";

  return (
    <footer className="z-30 flex h-10 shrink-0 items-center gap-4 overflow-x-auto border-t border-line bg-glass px-3 backdrop-blur-md sm:px-4">
      <span className="label hidden shrink-0 lg:inline">Direct contact</span>
      <button
        onClick={copy}
        className="flex shrink-0 items-center gap-2 rounded-[2px] border border-line px-2 py-1 font-mono text-[11px] text-ink hover:border-line-strong"
        aria-label="Copy email address"
      >
        {CONTACT.email}
        <span className={copied ? "text-ok" : "text-gold"}>
          {copied ? "[COPIED]" : "[COPY]"}
        </span>
      </button>
      <span className="flex-1" />
      <a className={link} href={CONTACT.github} target="_blank" rel="noreferrer">
        GitHub ↗
      </a>
      <a className={link} href={CONTACT.linkedin} target="_blank" rel="noreferrer">
        LinkedIn ↗
      </a>
      <a className={link} href={CONTACT.source} target="_blank" rel="noreferrer">
        Portfolio Source ↗
      </a>
      <button className={link} onClick={openCv}>
        Classic CV ↗
      </button>
    </footer>
  );
}
