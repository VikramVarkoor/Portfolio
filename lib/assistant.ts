// Zero-token, in-browser profile engine. Deterministic keyword retrieval over
// a knowledge base built from lib/data.ts, so it never calls an external API,
// never hits a rate limit, and cannot invent facts that are not on the site.

import {
  ACHIEVEMENTS,
  BUILDS,
  CERTS,
  CONTACT,
  EDUCATION,
  EXPERIENCE,
  LANGUAGES,
  PAPERS,
  ROLES,
  roleCount,
  type Role,
} from "./data";

export type Entry = { id: string; keys: string[]; answer: string };

const list = (items: string[]) => items.map((i) => `· ${i}`).join("\n");

const roleBuilds = (r: Role) =>
  BUILDS.filter((b) => b.roles.includes(r))
    .map((b) => b.name)
    .join(", ");

export const KB: Entry[] = [
  {
    id: "about",
    keys: ["who", "about", "vikram", "summary", "introduce", "background", "profile", "tell me"],
    answer:
      "Vikram Varkoor is an Electrical Engineering graduate (American University in Dubai, May 2026) and MSc Artificial Intelligence student at Heriot-Watt University Dubai. He works across embedded hardware, forecasting models and full-stack LLM systems, and is a co-author of two published IEEE papers with a third under review.",
  },
  {
    id: "contact",
    keys: ["contact", "email", "reach", "hire", "linkedin", "github", "phone", "message", "interview"],
    answer: `Email: ${CONTACT.email}\nGitHub: ${CONTACT.github}\nLinkedIn: ${CONTACT.linkedin}\nThe footer has a one-click email copy button.`,
  },
  {
    id: "availability",
    keys: ["available", "availability", "start", "notice", "location", "dubai", "uae", "relocate", "full-time", "internship", "role", "open to", "visa", "where"],
    answer:
      "Available immediately, based in Dubai, UAE, and open to full-time and internship roles. The MSc runs as evening classes.",
  },
  {
    id: "education",
    keys: ["education", "degree", "university", "msc", "bsc", "masters", "bachelor", "heriot-watt", "heriot", "aud", "study", "studying", "scholarship", "courses", "coursework"],
    answer: list(EDUCATION.map((e) => `${e.degree}, ${e.school} (${e.status}). ${e.note}`)),
  },
  {
    id: "papers",
    keys: ["paper", "papers", "ieee", "publication", "publications", "research", "published", "author", "itec", "ictmod", "journal", "conference"],
    answer:
      list(PAPERS.map((p) => `${p.venueTag}: ${p.title} (${p.status.toLowerCase()})`)) +
      "\nHe is a co-author on the two published papers, not first author.",
  },
  {
    id: "certs",
    keys: ["certificate", "certificates", "certification", "certifications", "certified", "ibm", "coursera", "schneider", "langgraph"],
    answer: list(CERTS.flatMap((c) => c.items.map((i) => `${c.org}: ${i}`))),
  },
  {
    id: "experience",
    keys: ["experience", "internship", "intern", "syncrow", "work", "job", "employment", "iot", "validation", "tuya", "zigbee", "mqtt", "hikvision"],
    answer: `${EXPERIENCE.role}, ${EXPERIENCE.org} (${EXPERIENCE.where}).\n${list(EXPERIENCE.bullets)}`,
  },
  {
    id: "achievements",
    keys: ["award", "awards", "achievement", "achievements", "competition", "hackathon", "khalifa", "won", "prize"],
    answer: list(ACHIEVEMENTS),
  },
  {
    id: "languages",
    keys: ["language", "languages", "speak", "hindi", "english", "kannada", "telugu", "arabic"],
    answer: `Spoken languages: ${LANGUAGES}.`,
  },
  {
    id: "projects",
    keys: ["projects", "builds", "portfolio", "list", "everything", "all projects", "what has he built", "built"],
    answer: `15 verified builds:\n${list(BUILDS.map((b) => `${b.name}: ${b.hook}`))}`,
  },
  {
    id: "role-ai",
    keys: ["llm", "ai engineer", "genai", "agents", "agent", "rag", "langchain", "crewai", "prompt", "generative"],
    answer: `AI / LLM work (${roleCount("ai")} builds): ${roleBuilds("ai")}. Highlights: Lumen streams 3 models concurrently with a Jaccard judge, PaperChat runs RAG in under 80MB of RAM, and the AI Audit analyzer chains 4 CrewAI agents behind a governance reviewer.`,
  },
  {
    id: "role-data",
    keys: ["data scientist", "data science", "analytics", "analyst", "forecasting", "causal", "statistics", "sql", "machine learning", "ml", "dbt", "experiment"],
    answer: `Data and forecasting work (${roleCount("data")} builds): ${roleBuilds("data")}. Highlights: +0.115 pp Criteo lift with 3.4x top-20% uplift, held-out MAE cut 13.7% (NYC taxi) and 44.3% (EU grid), and a dbt-duckdb warehouse over 1,067,371 invoice lines. Weak results are reported as weak.`,
  },
  {
    id: "role-fpga",
    keys: ["fpga", "hardware", "embedded", "rtl", "hls", "vivado", "vitis", "zynq", "verilog", "arduino", "raspberry", "pcb", "electronics", "dsp", "firmware"],
    answer: `Hardware and embedded work (${roleCount("fpga")} builds): ${roleBuilds("fpga")}. Highlight: Synapse.PL, where he was sole designer of a Vitis HLS 3D GLCM accelerator on a Zynq-7020 (1.32 s extraction at 100 MHz, 13% LUT, 22% DSP) feeding a 17 s MRI-to-diagnosis pipeline.`,
  },
  {
    id: "role-fullstack",
    keys: ["full-stack", "fullstack", "full stack", "frontend", "backend", "web", "cloud", "next.js", "nextjs", "react", "typescript", "fastapi", "azure", "vercel", "supabase", "deploy", "ci/cd", "testing", "jest", "cypress"],
    answer: `Full-stack and cloud work (${roleCount("fullstack")} builds): ${roleBuilds("fullstack")}. Highlights: Pitch Angle Finder runs on Render, Vercel and Azure with GitHub Actions CI/CD, and the Deriv agent ships 61 Jest tests plus a 9-assertion Cypress suite.`,
  },
  {
    id: "honesty",
    keys: ["honest", "limits", "limitations", "weakness", "weaknesses", "fail", "failed", "leak", "leakage", "rigor", "rigour", "evaluation"],
    answer:
      "He reports weak results as weak. Examples: no churn model clearly beat the simple recency rule (PR-AUC 0.801 to 0.814), the forecast model does not beat the grid operators' own forecast, and a trading backtest was corrected from a leaky 95.88% to an honest 52.51%. Leak tests are validated by planting a leak and confirming they fail.",
  },
  {
    id: "site",
    keys: ["this site", "website", "how does this work", "assistant", "chatbot", "token", "tokens", "api", "model", "webgpu", "you"],
    answer:
      "This assistant runs entirely in your browser. Answers come from a deterministic profile engine grounded in Vikram's master profile, so there are no API calls, no token limits and no rate limits. You can optionally load a small on-device model (SmolLM2-360M over WebGPU) to rephrase answers: it is cached locally after the first download.",
  },
  ...BUILDS.map<Entry>((b) => ({
    id: `build-${b.id}`,
    keys: [
      b.name.toLowerCase(),
      ...b.name
        .toLowerCase()
        .split(/[^a-z0-9.]+/)
        .filter((w) => w.length > 3 && !["system", "study", "analytics", "analyzer", "suite", "internship", "chatbot", "warehouse", "global", "smart"].includes(w)),
      ...b.id.split("-").filter((w) => w.length > 3),
    ],
    answer: `${b.name}: ${b.hook}\n${list(b.bullets)}${b.github ? `\nRepo: ${b.github}` : ""}${b.live ? `\nLive: ${b.live}` : ""}`,
  })),
];

// Extra aliases for builds whose common names differ from their titles.
const ALIAS: Record<string, string[]> = {
  "build-synapse-pl": ["synapse", "alzheimer", "alzheimer's", "mri", "glcm", "head system", "senior design"],
  "build-ad-measurement": ["uplift", "criteo", "causalforest", "ad measurement", "advertising", "ads"],
  "build-forecast-harness": ["forecast", "taxi", "electricity", "lightgbm", "backtest"],
  "build-churn-clv-dbt": ["churn", "clv", "lifetime value", "rfm", "segmentation", "duckdb"],
  "build-deriv-agent": ["trading", "deriv", "eur/usd", "forex"],
  "build-smart-bin": ["bin", "recycling", "waste", "yolo", "yolov8n"],
  "build-spectral-suite": ["spectral", "fft", "thd", "harmonic", "power quality", "rfid", "theft", "soil"],
  "build-paperchat": ["paperchat", "pdf", "document chat"],
  "build-lumen": ["lumen", "aggregator", "jaccard", "sse", "multi-model"],
  "build-ai-audit": ["audit", "governance"],
  "build-smart-meter": ["smart meter", "pyspark", "spark"],
  "build-retail-analytics": ["retail", "tableau", "excel"],
  "build-env-dashboard": ["environmental", "air quality", "pollution", "weather"],
  "build-pitch-angle-finder": ["pitch", "pr pitch"],
};
for (const e of KB) if (ALIAS[e.id]) e.keys.push(...ALIAS[e.id]);

function score(q: string, tokens: string[], e: Entry): number {
  let s = 0;
  for (const k of e.keys) {
    if (k.includes(" ") || /[^a-z0-9]/.test(k)) {
      if (q.includes(k)) s += 3;
    } else if (tokens.includes(k)) {
      s += 2;
    } else if (k.length >= 5 && tokens.some((t) => t.length >= 5 && (t.startsWith(k) || k.startsWith(t)))) {
      s += 1;
    }
  }
  return e.id.startsWith("build-") ? s * 1.2 : s;
}

export function retrieve(query: string, n = 3): Entry[] {
  const q = query.toLowerCase();
  const tokens = q.split(/[^a-z0-9.+#/-]+/).filter(Boolean);
  return KB.map((e) => ({ e, s: score(q, tokens, e) }))
    .filter((x) => x.s >= 2)
    .sort((a, b) => b.s - a.s)
    .slice(0, n)
    .map((x) => x.e);
}

export const SUGGESTIONS = [
  "Who is Vikram?",
  "What did he build on the FPGA?",
  "Show the data science work",
  "Which LLM projects has he shipped?",
  "Is he available, and where?",
  "How do I contact him?",
];

export function answer(query: string): string {
  const hits = retrieve(query, 1);
  if (hits.length) return hits[0].answer;
  return `I can only answer from Vikram's verified profile, and I did not find a match for that. Try one of these topics: ${ROLES.slice(1)
    .map((r) => r.label.toLowerCase())
    .join(", ")}, education, IEEE papers, certifications, the Syncrow internship, a project by name, or contact details.`;
}
