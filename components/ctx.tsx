"use client";

import { createContext, useContext } from "react";
import type { View } from "@/lib/data";

export type Detail = { buildId: string; title?: string; bullets?: string[] };

export type Ctx = {
  view: View;
  go: (v: View) => void;
  openDetail: (d: Detail) => void;
  openCv: () => void;
  openGuide: () => void;
  openAssistant: () => void;
};

export const PortfolioCtx = createContext<Ctx | null>(null);

export function usePortfolio(): Ctx {
  const c = useContext(PortfolioCtx);
  if (!c) throw new Error("usePortfolio must be used inside <Portfolio>");
  return c;
}
