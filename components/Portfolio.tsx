"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { NAV, type View } from "@/lib/data";
import { PortfolioCtx, type Detail } from "./ctx";
import TopNav from "./TopNav";
import Footer from "./Footer";
import Hero from "./views/Hero";
import LabHub from "./views/LabHub";
import Hardware from "./views/Hardware";
import Software from "./views/Software";
import Research from "./views/Research";
import Archive from "./views/Archive";
import DetailModal from "./DetailModal";
import CvModal from "./CvModal";
import FieldGuide from "./FieldGuide";
import Assistant from "./Assistant";

const VIEW_IDS = NAV.map((n) => n.id);
const GUIDE_KEY = "vv_field_guide_seen";

/** Reads ?view=, falling back to a legacy #hash link. */
function readView(): View {
  const q = new URLSearchParams(window.location.search).get("view") as View | null;
  if (q && VIEW_IDS.includes(q)) return q;
  const h = window.location.hash.replace("#", "") as View;
  return VIEW_IDS.includes(h) ? h : "hero";
}

export default function Portfolio() {
  const [view, setView] = useState<View>("hero");
  const [daylight, setDaylight] = useState(false);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [cv, setCv] = useState(false);
  const [guide, setGuide] = useState(false);
  const [assistant, setAssistant] = useState(false);

  // ?view= keeps refresh, the back button and shareable deep links working.
  useEffect(() => {
    const sync = () => setView(readView());
    sync();
    setDaylight(document.documentElement.classList.contains("daylight"));
    window.addEventListener("popstate", sync);
    window.addEventListener("hashchange", sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("hashchange", sync);
    };
  }, []);

  const go = useCallback((v: View) => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("view") !== v || url.hash) {
      url.searchParams.set("view", v);
      url.hash = "";
      window.history.pushState(null, "", url);
    }
    setView(v);
  }, []);

  // Cmd/Ctrl + K toggles Ask AI from anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setAssistant((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // First visit to the Lab Hub shows the Field Guide once.
  useEffect(() => {
    if (view !== "lab") return;
    try {
      if (!localStorage.getItem(GUIDE_KEY)) setGuide(true);
    } catch {
      /* storage unavailable: skip the guide */
    }
  }, [view]);

  const closeGuide = useCallback(() => {
    try {
      localStorage.setItem(GUIDE_KEY, "1");
    } catch {
      /* ignore */
    }
    setGuide(false);
  }, []);

  const toggleTheme = useCallback((next: boolean) => {
    document.documentElement.classList.toggle("daylight", next);
    try {
      localStorage.setItem("vv_theme", next ? "daylight" : "dark");
    } catch {
      /* ignore */
    }
    setDaylight(next);
  }, []);

  const ctx = useMemo(
    () => ({
      view,
      go,
      openDetail: setDetail,
      openCv: () => setCv(true),
      openGuide: () => setGuide(true),
      openAssistant: () => setAssistant(true),
    }),
    [view, go],
  );

  return (
    <PortfolioCtx.Provider value={ctx}>
      <div className="flex h-dvh flex-col">
        <TopNav daylight={daylight} onTheme={toggleTheme} />
        <main
          id={`view-${view}`}
          key={view}
          className="rise relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden"
        >
          {view === "hero" && <Hero />}
          {view === "lab" && <LabHub />}
          {view === "software" && <Software />}
          {view === "hardware" && <Hardware />}
          {view === "research" && <Research />}
          {view === "archive" && <Archive />}
        </main>
        <Footer />
      </div>

      {detail && <DetailModal detail={detail} onClose={() => setDetail(null)} />}
      {cv && <CvModal onClose={() => setCv(false)} />}
      {guide && view === "lab" && (
        <FieldGuide
          onClose={closeGuide}
          onCv={() => {
            closeGuide();
            setCv(true);
          }}
        />
      )}
      <Assistant open={assistant} onClose={() => setAssistant(false)} />
    </PortfolioCtx.Provider>
  );
}
