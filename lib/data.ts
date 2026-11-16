// Single source of truth for all portfolio copy. Every number here is taken
// from Vikram Varkoor's Master Profile. Do not add claims that are not in it.

export type View =
  | "hero"
  | "lab"
  | "software"
  | "hardware"
  | "research"
  | "archive";

export const NAV: { id: View; label: string }[] = [
  { id: "hero", label: "Hero" },
  { id: "lab", label: "Lab Hub" },
  { id: "software", label: "Software" },
  { id: "hardware", label: "Hardware" },
  { id: "research", label: "Education & Papers" },
  { id: "archive", label: "Skills & Archive" },
];

export const CONTACT = {
  email: "vvikram0301@gmail.com",
  github: "https://github.com/VikramVarkoor",
  linkedin: "https://linkedin.com/in/vikram-varkoor",
  source: "https://github.com/VikramVarkoor",
  live: "https://vikramvarkoor.vercel.app",
  cvPdf: "/Vikram_Varkoor_CV.pdf",
};

export const HERO = {
  availability:
    "AVAILABLE IMMEDIATELY · DUBAI, UAE · OPEN TO FULL-TIME & INTERNSHIP ROLES",
  role: "ELECTRICAL ENGINEER · MSc AI STUDENT",
  headline: "VIKRAM VARKOOR",
  byline:
    "Bridging embedded hardware, forecasting models, and full-stack LLM systems. BSc Electrical Engineering graduate, MSc AI student at Heriot-Watt Dubai, and co-author of two IEEE papers.",
};

/* ------------------------------------------------------------------ */
/* Roles and skills                                                    */
/* ------------------------------------------------------------------ */

export type Role = "ai" | "data" | "fpga" | "fullstack";

export const ROLES: { id: Role | "all"; label: string }[] = [
  { id: "all", label: "ALL ROLES" },
  { id: "ai", label: "AI / LLM ENGINEER" },
  { id: "data", label: "DATA SCIENTIST" },
  { id: "fpga", label: "FPGA & EMBEDDED" },
  { id: "fullstack", label: "FULL-STACK CLOUD" },
];

export const RADAR_AXES: { role: Role; label: string }[] = [
  { role: "ai", label: "AI / LLM" },
  { role: "data", label: "CAUSAL DATA" },
  { role: "fullstack", label: "FULL-STACK" },
  { role: "fpga", label: "FPGA / RTL" },
];

export const SKILL_ROWS: { role: Role; title: string; skills: string[] }[] = [
  {
    role: "ai",
    title: "01 // AI & LLM",
    skills: [
      "Groq LLMs",
      "Multi-Agent",
      "SSE Streaming",
      "RAG",
      "CrewAI",
      "LangChain",
      "OpenCV",
      "YOLOv8n / ONNX",
    ],
  },
  {
    role: "data",
    title: "02 // DATA & FORECASTING",
    skills: [
      "Python",
      "SQL",
      "pandas",
      "LightGBM",
      "DuckDB",
      "pytest",
      "Bootstrap CIs",
      "dbt",
      "PySpark",
    ],
  },
  {
    role: "fpga",
    title: "03 // HARDWARE & FPGA",
    skills: [
      "C++",
      "Arduino",
      "Vitis HLS",
      "Vivado",
      "Zynq-7020",
      "Raspberry Pi",
      "FFT / DSP",
      "MQTT / ZigBee",
    ],
  },
  {
    role: "fullstack",
    title: "04 // FULL-STACK & CLOUD",
    skills: [
      "Next.js",
      "TypeScript",
      "Vercel",
      "FastAPI",
      "Supabase",
      "GitHub Actions",
      "Azure",
      "Jest / Cypress",
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Complete build registry (15 verified builds)                        */
/* ------------------------------------------------------------------ */

export type Build = {
  id: string;
  name: string;
  kind: string;
  hook: string;
  roles: Role[];
  skills: string[];
  bullets: string[];
  github?: string;
  live?: string;
  view?: View;
};

export const BUILDS: Build[] = [
  {
    id: "ad-measurement",
    name: "Ad Measurement Study",
    kind: "CAUSAL ANALYTICS",
    hook: "Causal uplift and bootstrap pipeline across 16.1M experiment users.",
    roles: ["data"],
    skills: ["Python", "pandas", "Bootstrap CIs", "FastAPI", "pytest", "SQL"],
    bullets: [
      "Six randomized experiments covering 16.1M users, pooled with a random-effects model: risk ratio 1.32 (1.18 to 1.48).",
      "Criteo conversion 0.309% treated vs 0.194% control: +0.115 pp absolute lift.",
      "CausalForest uplift ranking: the top 20% of users capture 68% of the uplift (3.4x a random 20%). Hillstrom reported as weak at 25%.",
      "2,000-draw bootstrap confidence intervals, a FastAPI scoring service, 39 automated tests with CI, and a machine-verified findings summary.",
    ],
    github: "https://github.com/VikramVarkoor/Ad-Measurement-Study",
    view: "software",
  },
  {
    id: "synapse-pl",
    name: "Synapse.PL / HEAD System",
    kind: "FPGA · EDGE AI",
    hook: "17-second MRI Alzheimer's screening on a $269 Zynq-7020 FPGA.",
    roles: ["fpga", "fullstack"],
    skills: [
      "Vitis HLS",
      "Vivado",
      "Zynq-7020",
      "C++",
      "Python",
      "Next.js",
      "TypeScript",
    ],
    bullets: [
      "3-person senior design team (AUD EECE 498/499). End-to-end MRI-to-diagnosis inference in 17 s on a $269 PYNQ-Z2 board.",
      "Sole designer of the local block 3D GLCM extraction: 252 Haralick texture features per scan across 13 directions and 3 voxel distances.",
      "Vitis HLS 2022.1 accelerator synthesized to RTL: 1.32 s bilateral extraction, 100 MHz clock, 13% LUT and 22% DSP utilization.",
      "ARM Cortex-A9 to FPGA link over AXI4-Stream DMA, plus the Next.js 16.1 clinical dashboard frontend.",
      "Team cascade classifier (built by teammates on these features): AUC 0.903 AD vs CN on 3,436 ADNI scans. Research prototype, not clinically validated.",
    ],
    view: "hardware",
  },
  {
    id: "forecast-harness",
    name: "Forecast Harness",
    kind: "TIME-SERIES FORECASTING",
    hook: "Leak-guarded LightGBM forecasting across 30 NYC taxi zones and 10 EU grids.",
    roles: ["data"],
    skills: [
      "Python",
      "LightGBM",
      "DuckDB",
      "pandas",
      "pytest",
      "Bootstrap CIs",
      "Vercel",
    ],
    bullets: [
      "Day-ahead hourly forecasts for 30 NYC taxi zones and 10 European countries, scored once on 28 held-out days.",
      "Held-out MAE 13.7% lower on taxi pickups (31.38 vs 36.37) and 44.3% lower on European load (423 vs 759 MW) than a simple baseline.",
      "Held-out guard and a leak test shown to fail on planted leaks, so held-out days cannot be tuned on.",
      "Honest limits: does not beat the grid operators' own forecast (468 MW), and that is reported on the live site.",
      "94 automated pytest tests and a static results site generated from the results files.",
    ],
    github: "https://github.com/VikramVarkoor/Forecast-harness",
    live: "https://forecast-harness.vercel.app",
    view: "software",
  },
  {
    id: "lumen",
    name: "Lumen Multi-Model Aggregator",
    kind: "LLM ORCHESTRATION",
    hook: "Concurrent SSE streaming across 3 LLMs with Jaccard consensus synthesis.",
    roles: ["ai", "fullstack"],
    skills: [
      "Next.js",
      "TypeScript",
      "Supabase",
      "Groq LLMs",
      "SSE Streaming",
      "Multi-Agent",
      "Vercel",
    ],
    bullets: [
      "3 worker agents in parallel (Llama 3.3 70B, Qwen 3 32B, Kimi K2) through one orchestrated request pipeline.",
      "Real-time SSE streaming: all three model cards populate at once via Promise.all.",
      "Judge agent scores inter-agent agreement with Jaccard similarity (0 to 100%), then writes one reconciled answer.",
      "Built-in 1 to 10 scoring per agent on accuracy, depth and clarity, with auth-gated history on Supabase.",
    ],
    github: "https://github.com/VikramVarkoor/Lumen",
    view: "software",
  },
  {
    id: "churn-clv-dbt",
    name: "Churn-CLV-DBT Warehouse",
    kind: "ANALYTICS ENGINEERING",
    hook: "dbt-duckdb warehouse with RFM k-means (ARI 0.955) and 245-day BG/NBD CLV.",
    roles: ["data"],
    skills: [
      "dbt",
      "DuckDB",
      "SQL",
      "Python",
      "pandas",
      "LightGBM",
      "pytest",
      "Bootstrap CIs",
      "Groq LLMs",
    ],
    bullets: [
      "Warehouse over 1,067,371 invoice lines and 5,942 customers, with staging, intermediate and mart layers driven by one cutoff_date variable.",
      "Wrote the brief and ground rules, directed an AI coding agent for the pipeline code, then ran it on real data and verified every fix.",
      "Rewrote the RFM and k-means segmentation from scratch in a notebook: k=4, silhouette 0.376, bootstrap ARI 0.955.",
      "Leakage guard implemented twice (dbt singular test and pytest) and validated by planting a leak.",
      "Honest result: no churn model clearly beat the simple recency rule (PR-AUC 0.801 to 0.814), reported as such.",
    ],
    github: "https://github.com/VikramVarkoor/Churn-CLV-DBT",
    view: "software",
  },
  {
    id: "syncrow",
    name: "Syncrow IoT R&D Internship",
    kind: "HARDWARE VALIDATION",
    hook: "17-step hardware validation protocol across 15+ smart devices.",
    roles: ["fpga"],
    skills: ["MQTT / ZigBee"],
    bullets: [
      "422-hour Hardware R&D internship in Dubai, May to August 2025.",
      "Validated 15+ IoT devices: Hikvision biometric intercoms, radar presence sensors, smart locks, smart ACs, energy clamps and multi-mode gateways.",
      "Designed a standardized 17-step test procedure from power-up and protocol handshake to stress testing.",
      "Built a 30+ device catalogue and authored validation requirements with the product owner and data scientist.",
      "Worked with Tuya, MQTT and ZigBee, and regression-tested the Syncrow Analytics dashboard.",
    ],
    view: "hardware",
  },
  {
    id: "deriv-agent",
    name: "Deriv Trading Agent",
    kind: "AGENT · FULL-STACK",
    hook: "Autonomous EUR/USD paper-trading agent with code-level risk rules.",
    roles: ["fullstack", "ai", "data"],
    skills: [
      "Next.js",
      "TypeScript",
      "Supabase",
      "Groq LLMs",
      "Jest / Cypress",
      "Python",
      "Vercel",
    ],
    bullets: [
      "LLM makes BUY / SELL / HOLD calls on live 5-minute candles, executed on Deriv's demo API. Paper trading only.",
      "Risk rules at prompt and code level: 0.55 minimum confidence, 2:1 reward-to-risk, no pyramiding.",
      "Found and fixed a data leak that had inflated a backtest to 95.88%: honest result 52.51% vs a 46.59% baseline.",
      "61 Jest tests across 5 suites and a 9-assertion Cypress end-to-end suite.",
    ],
    github: "https://github.com/VikramVarkoor/Deriv-Trading-Agent",
    live: "https://deriv-agent.vercel.app",
  },
  {
    id: "paperchat",
    name: "PaperChat RAG Chatbot",
    kind: "RAG",
    hook: "Chat with any PDF: streamed, cited answers in under 80MB of RAM.",
    roles: ["ai", "fullstack"],
    skills: [
      "RAG",
      "Next.js",
      "FastAPI",
      "Groq LLMs",
      "SSE Streaming",
      "Python",
      "Vercel",
    ],
    bullets: [
      "Upload a PDF, ask questions, get token-streamed answers with the exact source sections.",
      "Replaced PyTorch and ChromaDB with fastembed (ONNX runtime) and NumPy cosine similarity: about 500MB down to under 80MB RAM.",
      "Batch indexing of 8 chunks at a time, top 4 to 5 chunks retrieved per query.",
      "Next.js on Vercel and FastAPI on Render at zero infrastructure cost.",
    ],
    github: "https://github.com/VikramVarkoor/PaperChat",
    live: "https://paper-chat-five.vercel.app",
  },
  {
    id: "pitch-angle-finder",
    name: "Pitch Angle Finder",
    kind: "LLM APP · CLOUD",
    hook: "Full-stack LLM pitch generator deployed on Render, Vercel and Azure.",
    roles: ["ai", "fullstack"],
    skills: [
      "FastAPI",
      "Next.js",
      "TypeScript",
      "Groq LLMs",
      "GitHub Actions",
      "Azure",
      "pytest",
      "Python",
      "Vercel",
    ],
    bullets: [
      "FastAPI backend and Next.js frontend, with structured JSON validated against a Pydantic schema.",
      "Retry path for two LLM failure modes (incomplete output, malformed JSON), covered by an automated test.",
      "Second independent deployment on Azure App Service and Static Web Apps with GitHub Actions CI/CD.",
      "Resolved four real deployment failures at their root cause, from Azure quota caps to an OAuth workflow-scope block.",
    ],
    github: "https://github.com/VikramVarkoor/pitch-angle-finder",
    live: "https://pitch-angle-finder.vercel.app",
  },
  {
    id: "ai-audit",
    name: "AI Audit Risk Analyzer",
    kind: "MULTI-AGENT",
    hook: "4-agent CrewAI audit chain with a governance reviewer as final gate.",
    roles: ["ai"],
    skills: ["CrewAI", "LangChain", "Multi-Agent", "Python"],
    bullets: [
      "Sequential pipeline: Risk Identifier, Internal Controls Specialist, Report Writer, AI Governance Reviewer.",
      "Reviewer agent checks output for ungrounded claims, PII leakage and tone before release.",
      "LangChain ingestion for PDF and text, Gemini API, Streamlit drag-and-drop UI.",
    ],
  },
  {
    id: "smart-meter",
    name: "Smart Meter Analytics",
    kind: "DATA ENGINEERING",
    hook: "PySpark vs pandas benchmark on a 10.5M-row synthetic smart meter set.",
    roles: ["data"],
    skills: ["PySpark", "pandas", "SQL", "Python"],
    bullets: [
      "Synthetic generator: 300 devices, one year at 15-minute intervals, 10,512,000 rows as partitioned Parquet.",
      "Same 4 analytics queries in PySpark and in pandas / SQLite.",
      "Spark is 8 to 10x faster at 5M rows on windowed aggregations: pandas wins at small sizes, and that is documented.",
    ],
    github: "https://github.com/VikramVarkoor/Smart-meter-analytics",
  },
  {
    id: "retail-analytics",
    name: "Retail Operations Analytics",
    kind: "BI · REPORTING",
    hook: "SQL, Tableau and a reconciled Excel workbook over 9,994 order lines.",
    roles: ["data"],
    skills: ["SQL", "pandas", "Python"],
    bullets: [
      "Python ETL into a normalized SQLite database: 9,994 simulated order lines, 4 regions, 2020 to 2023.",
      "Window functions and CTEs for margins, month-over-month growth and unprofitable repeat customers.",
      "Excel rebuild reconciled to SQL totals for all four regions, plus a Tableau Public dashboard.",
      "Caught that Customer ID is not a unique key before reporting any per-customer figure.",
    ],
  },
  {
    id: "env-dashboard",
    name: "Global Environmental Intelligence",
    kind: "ASYNC DATA",
    hook: "Async air quality dashboard with WHO guideline thresholds.",
    roles: ["data", "fullstack"],
    skills: ["Python"],
    bullets: [
      "Pulls CO, NO2, O3, PM2.5 and PM10 from the OpenWeatherMap REST API for any location.",
      "aiohttp requests load multiple locations concurrently.",
      "One chart per pollutant with WHO guideline lines.",
    ],
  },
  {
    id: "smart-bin",
    name: "Smart Recycling Bin",
    kind: "EDGE VISION",
    hook: "Offline Raspberry Pi waste sorting with YOLOv8n ONNX and servo gates.",
    roles: ["fpga", "ai"],
    skills: ["Raspberry Pi", "YOLOv8n / ONNX", "OpenCV", "Python"],
    bullets: [
      "Khalifa University sustainability competition: Top 5 of 50+ teams. Group project.",
      "Contributed to the hardware build and the YOLOv8n waste classifier exported to ONNX.",
      "About 97% Top-1 accuracy on a 12-class waste dataset (dataset accuracy, not field accuracy).",
      "Camera, inference and GPIO stepper and servo gates all run on the Pi with no cloud dependency.",
    ],
    view: "hardware",
  },
  {
    id: "spectral-suite",
    name: "Spectral Analyzer & Embedded IoT Suite",
    kind: "EMBEDDED · DSP",
    hook: "Real-time AC harmonic and THD analyzer via 64-point FFT, plus Arduino builds.",
    roles: ["fpga"],
    skills: ["Arduino", "C++", "FFT / DSP", "Python"],
    bullets: [
      "Power Quality Spectral Analyzer: Arduino Uno streams 64-point bursts of a simulated AC signal, NumPy FFT finds the fundamental and THD.",
      "Smart Grid Theft Detector: on-device anomaly thresholding in C++ firmware, streaming at 115,200 baud and 5 Hz to a live Python alert dashboard.",
      "RFID Access Control: MFRC522 reader over SPI, servo gate, interrupt-driven open counts.",
      "Soil Moisture Monitor: capacitive sensor with ADC calibration to a 0 to 100% reading.",
    ],
    view: "hardware",
  },
];

export const SPOTLIGHT_COUNT = 6;

export function skillCount(skill: string): number {
  return BUILDS.filter((b) => b.skills.includes(skill)).length;
}

export function roleCount(role: Role): number {
  return BUILDS.filter((b) => b.roles.includes(role)).length;
}

/* ------------------------------------------------------------------ */
/* Software cards                                                      */
/* ------------------------------------------------------------------ */

export type SoftwareId = "ad" | "forecast" | "lumen" | "dbt";

export type SoftwareProject = {
  id: SoftwareId;
  buildId: string;
  no: string;
  tag: string;
  title: string;
  hook: string;
  kpis: [{ value: string; label: string }, { value: string; label: string }];
  stack: string[];
  sandbox: string;
};

export const SOFTWARE: SoftwareProject[] = [
  {
    id: "ad",
    buildId: "ad-measurement",
    no: "01",
    tag: "CAUSAL ML",
    title: "AD MEASUREMENT STUDY",
    hook: "Causal uplift & 2,000-draw bootstrap pipeline across 16.1M users (3.4x top-20%).",
    kpis: [
      { value: "+0.115 pp", label: "Criteo Lift" },
      { value: "3.4x", label: "Top-20% Uplift" },
    ],
    stack: ["Python", "CausalForest", "Bootstrap", "FastAPI"],
    sandbox: "CausalForest Decile Uplift & 95% CI Simulator",
  },
  {
    id: "forecast",
    buildId: "forecast-harness",
    no: "02",
    tag: "DATA SCIENTIST",
    title: "FORECAST HARNESS",
    hook: "Leak-guarded LightGBM forecasting across 30 NYC taxi zones & 10 EU grids.",
    kpis: [
      { value: "-13.7%", label: "NYC Taxi MAE" },
      { value: "-44.3%", label: "EU Grid MAE" },
    ],
    stack: ["LightGBM", "DuckDB", "pytest", "Vercel"],
    sandbox: "Rolling-Origin Backtest Comparator",
  },
  {
    id: "lumen",
    buildId: "lumen",
    no: "03",
    tag: "AI FULL-STACK",
    title: "LUMEN AGGREGATOR",
    hook: "Concurrent SSE streaming across 3 LLMs with Jaccard consensus synthesis.",
    kpis: [
      { value: "3x SSE", label: "Parallel Workers" },
      { value: "0-100%", label: "Jaccard Judge" },
    ],
    stack: ["Next.js", "Supabase", "Groq", "SSE"],
    sandbox: "3x Concurrent LLM Fan-Out + Live SSE Race",
  },
  {
    id: "dbt",
    buildId: "churn-clv-dbt",
    no: "04",
    tag: "ANALYTICS",
    title: "CHURN-CLV-DBT",
    hook: "dbt-duckdb warehouse with RFM k-means (ARI 0.955) & 245-day BG/NBD CLV.",
    kpis: [
      { value: "ARI 0.955", label: "RFM Stability" },
      { value: "245-Day", label: "BG/NBD CLV" },
    ],
    stack: ["dbt", "DuckDB", "SQL", "PyMC-Marketing"],
    sandbox: "dbt-duckdb Lineage DAG + SQL Inspector",
  },
];

export const BENCHMARKS = [
  { value: "16.1M", label: "Experiment Users" },
  { value: "1.06M", label: "dbt Invoice Rows" },
  { value: "0 Leaks", label: "Guarded Splits" },
];

/* ------------------------------------------------------------------ */
/* Hardware cards                                                      */
/* ------------------------------------------------------------------ */

export type HardwareId = "synapse" | "pqa" | "bin" | "syncrow";

export type HardwareProject = {
  id: HardwareId;
  buildId: string;
  title: string;
  stats: [string, string];
  hook: string;
  bullets?: string[];
};

export const HARDWARE: HardwareProject[] = [
  {
    id: "synapse",
    buildId: "synapse-pl",
    title: "SYNAPSE.PL / HEAD SYSTEM",
    stats: ["17s Inference", "$269 Board"],
    hook: "17-second MRI Alzheimer's screening on a $269 Zynq-7020 FPGA.",
  },
  {
    id: "pqa",
    buildId: "spectral-suite",
    title: "POWER QUALITY ANALYZER",
    stats: ["64-Pt FFT", "Harmonic THD"],
    hook: "Real-time AC harmonic and THD distortion analyzer via 64-point FFT.",
    bullets: [
      "Arduino Uno captures 64-point analog bursts from a simulated voltage transducer and streams them over Serial.",
      "NumPy FFT converts each burst to the frequency domain to find the fundamental and compute Total Harmonic Distortion.",
      "Live dual-domain view: raw waveform beside the spectrum with harmonic peaks highlighted.",
      "UTF-8 error handling keeps the plot stable on noisy asynchronous serial streams.",
      "Signal source is simulated: no claims about real mains measurements.",
    ],
  },
  {
    id: "bin",
    buildId: "smart-bin",
    title: "SMART RECYCLING BIN",
    stats: ["Top 5/50", "~97% YOLOv8n"],
    hook: "Offline Raspberry Pi waste sorting with YOLOv8n ONNX and servo gates.",
  },
  {
    id: "syncrow",
    buildId: "syncrow",
    title: "SYNCROW IOT R&D",
    stats: ["422 Hours", "15+ Devices"],
    hook: "17-step hardware validation protocol across 15+ smart devices.",
  },
];

export type Hotspot = {
  id: string;
  label: string;
  title: string;
  text: string;
};

export const HOTSPOTS: Hotspot[] = [
  {
    id: "pl",
    label: "PL 3D GLCM",
    title: "Programmable Logic · 3D GLCM Accelerator",
    text: "Vitis HLS 2022.1 core extracting 252 Haralick features: 1.32 s bilateral extraction at 100 MHz using 13% LUT and 22% DSP.",
  },
  {
    id: "dma",
    label: "AXI4-DMA",
    title: "AXI4-Stream DMA Bridge",
    text: "Moves voxel blocks between the ARM and the fabric over shared DDR memory, leaving the ARM free while the FPGA runs.",
  },
  {
    id: "ps",
    label: "PS ARM",
    title: "Processing System · ARM Cortex-A9",
    text: "Runs pre-processing and the team's cascade classifier: AUC 0.903 AD vs CN on 3,436 ADNI scans, 17 s end to end.",
  },
  {
    id: "io",
    label: "IOT / UART",
    title: "IoT & Serial Bench",
    text: "The Arduino, Raspberry Pi and IoT side: 64-point FFT bursts over UART, plus MQTT, ZigBee and Tuya device validation at Syncrow.",
  },
];

/* ------------------------------------------------------------------ */
/* Education, certifications, papers                                   */
/* ------------------------------------------------------------------ */

export const EDUCATION = [
  {
    degree: "MSc ARTIFICIAL INTELLIGENCE",
    status: "STUDENT · STARTED SEP 2026",
    school: "Heriot-Watt University Dubai",
    note: "Duffin Family Future Shapers & Postgraduate Merit Scholar.",
    detail:
      "Semester 1: AI and Intelligent Agents, Intelligent Robotics, Biologically Inspired Computation, Data Mining and Machine Learning.",
    accent: "cyan" as const,
  },
  {
    degree: "BSc ELECTRICAL ENGINEERING",
    status: "GRADUATED MAY 2026",
    school: "American University in Dubai",
    note: "Hardware-AI integration, FPGA development, DSP, microprocessors, embedded systems.",
    detail:
      "Coursework: Communication Systems, Digital Signal Processing, Systems & Controls, Microprocessors, Embedded Systems, Electromagnetics.",
    accent: "gold" as const,
  },
];

export const CERTS = [
  {
    org: "IBM · Coursera",
    items: [
      "Develop Generative AI Applications: Get Started (Aug 2026, 100%)",
      "Agentic AI with LangChain and LangGraph (Aug 2026, 100%)",
    ],
  },
  {
    org: "Schneider Electric University",
    items: [
      "Electric Vehicles: Smarter Energy Management",
      "Power Factor and Harmonics",
      "Battery Safety and Environmental Concerns",
    ],
  },
];

export type Paper = {
  id: string;
  venueTag: string;
  shortTitle: string;
  title: string;
  authors: string;
  venue: string;
  status: string;
  summary: string;
  abstract: string;
  keywords: string;
  href?: string;
  figure: string[];
  /** Real page-1 scan. When set, the sheet shows this image. */
  image?: string;
  affiliation: string;
  /** Citation or status note printed at the foot of the cover sheet. */
  cite: string;
  highlights: string[];
  facts: [string, string][];
};

export const PAPERS: Paper[] = [
  {
    id: "itec",
    venueTag: "IEEE ITEC-AP 2025",
    shortTitle: "Smart EV Charging Frameworks",
    title:
      "Holistic Framework for Smart EV Charging: Renewable Integration, Standardization, and UAE Case Study",
    authors:
      "Zainab Alblooshi, Maryam Almarzooqi, Vikram Varkoor, Essa Almatrooshi, Muhammad Fahad Zia",
    venue:
      "2025 IEEE Transportation Electrification Conference and Expo, Asia-Pacific (ITEC Asia-Pacific)",
    status: "PUBLISHED · CO-AUTHOR",
    summary:
      "A review of smart EV charging infrastructure: grid-tied, standalone and hybrid architectures, solar and storage integration, and a UAE case study.",
    abstract:
      "Reviews electric vehicle charging systems, how they integrate with renewable sources, and what they do to the existing grid. Compares grid-tied, standalone and hybrid architectures, and looks at smart stations paired with solar PV and battery storage. Time-of-use pricing, demand response and vehicle-to-grid are assessed for efficiency and grid stability, alongside equitable access to charging.",
    keywords:
      "Electric vehicles, smart charging, renewable integration, vehicle-to-grid, demand response",
    href: "https://ieeexplore.ieee.org/abstract/document/11344871",
    figure: ["SOLAR PV", "BATTERY STORAGE", "SMART CHARGER", "GRID / V2G"],
    affiliation: "Presented at ITEC Asia-Pacific · Singapore · 25 to 28 November 2025",
    cite: 'Z. Alblooshi, M. Almarzooqi, V. Varkoor, E. Almatrooshi and M. F. Zia, "Holistic Framework for Smart EV Charging: Renewable Integration, Standardization, and UAE Case Study," 2025 IEEE Transportation Electrification Conference and Expo, Asia-Pacific (ITEC Asia-Pacific), Singapore, 2025.',
    highlights: [
      "Compares grid-tied, standalone and hybrid charging architectures.",
      "Assesses smart stations paired with solar PV and battery storage.",
      "Weighs time-of-use pricing, demand response and vehicle-to-grid for grid stability.",
      "Closes with a UAE case study and a discussion of equitable access to charging.",
    ],
    facts: [
      ["Venue", "IEEE ITEC Asia-Pacific 2025"],
      ["Location", "Singapore"],
      ["Dates", "25 to 28 Nov 2025"],
      ["Paper type", "Review with case study"],
      ["Role", "Co-author"],
      ["Status", "Published on IEEE Xplore"],
    ],
  },
  {
    id: "ictmod",
    venueTag: "IEEE ICTMOD 2024",
    shortTitle: "Microprocessor & ML Integration",
    title:
      "Leveraging Machine Learning for Sustainable Microprocessor Utilization",
    authors: "Fadl Balkis, Vikram Varkoor, Abdulrahman Ahli, Mervat Madi",
    venue:
      "2024 IEEE International Conference on Technology Management, Operations and Decisions (ICTMOD)",
    status: "PUBLISHED · CO-AUTHOR",
    summary:
      "How machine learning and microprocessor hardware combine to improve speed and energy efficiency, with a look at emerging compute paradigms.",
    abstract:
      "Examines how advances in machine learning pair with microprocessor hardware to raise speed and energy efficiency, reviewing recent studies and promising approaches to open challenges. Also surveys quantum, neuromorphic and photonic computing and 3D stacking, and where each could work with machine learning to push microprocessor performance further.",
    keywords:
      "Microprocessors, machine learning, energy efficiency, neuromorphic computing, 3D stacking",
    href: "https://ieeexplore.ieee.org/document/10878151/",
    figure: ["WORKLOAD", "ML POLICY", "MICROPROCESSOR", "ENERGY / SPEED"],
    image: "/papers/ictmod-2024-p1.png",
    affiliation: "Electrical Engineering Dept., American University in Dubai, UAE",
    cite: "",
    highlights: [],
    facts: [],
  },
  {
    id: "fpga",
    venueTag: "IEEE UNDER REVIEW",
    shortTitle: "FPGA-Accelerated Edge AI for Clinical Decision Support",
    title:
      "FPGA-Accelerated Edge AI for Clinical Decision Support: Architecture, Implementation and Performance Analysis",
    authors: "Vikram Varkoor and the Synapse.PL senior design team",
    venue: "Submitted to IEEE · currently under peer review",
    status: "UNDER REVIEW · NOT YET PUBLISHED",
    summary:
      "The Synapse.PL system paper: an HLS GLCM accelerator on a Zynq-7020 feeding an explainable Alzheimer's screening pipeline.",
    abstract:
      "Describes a hardware-accelerated explainable Alzheimer's detection system on a $269 Zynq-7020 platform. A 3D GLCM accelerator written in Vitis HLS extracts 252 Haralick texture features in 1.32 s at 100 MHz, linked to the ARM core over AXI4-Stream DMA. End-to-end MRI-to-diagnosis inference takes 17 s, and the team's cascade classifier reaches AUC 0.903 on 3,436 ADNI scans.",
    keywords:
      "FPGA, high-level synthesis, GLCM, edge AI, clinical decision support",
    figure: ["MRI ROI", "PL · 3D GLCM (HLS)", "AXI4-STREAM DMA", "PS ARM · CLASSIFIER"],
    affiliation: "Electrical Engineering Dept., American University in Dubai, UAE",
    cite: "Manuscript submitted to IEEE and currently under peer review. It is not yet published, so citation details will follow acceptance. Click this sheet to open the full Synapse.PL specification.",
    highlights: [
      "A 3D GLCM accelerator in Vitis HLS extracts 252 Haralick texture features in 1.32 s at 100 MHz.",
      "The programmable logic streams features to the ARM core over AXI4-Stream DMA.",
      "MRI to diagnosis takes 17 s end to end on a $269 Zynq-7020 board.",
      "The team's cascade classifier reaches AUC 0.903 on 3,436 ADNI scans.",
    ],
    facts: [
      ["Platform", "Zynq-7020 SoC ($269)"],
      ["Accelerator", "3D GLCM · Vitis HLS"],
      ["Clock", "100 MHz"],
      ["Features", "252 Haralick"],
      ["Extraction", "1.32 s"],
      ["End to end", "17 s"],
      ["AUC", "0.903 (team classifier)"],
      ["Status", "Under peer review"],
    ],
  },
];

export const EXPERIENCE = {
  role: "Hardware R&D Intern",
  org: "Syncrow IoT",
  where: "Dubai, UAE · May 2025 to August 2025 · ~422 hours",
  bullets: [
    "Validated and functionally tested 15+ IoT devices including Hikvision intercoms, radar presence sensors, smart door locks, smart ACs, energy clamps and multi-mode gateways.",
    "Designed a standardized 17-step IoT device testing procedure covering power-up, protocol handshake, connectivity, latency, backend data validation and stress testing.",
    "Built a structured catalogue of 30+ devices and authored validation requirements for the Syncrow Analytics platform.",
    "Worked with the Tuya platform and researched MQTT, ZigBee, and wired vs wireless architectures.",
  ],
};

export const ACHIEVEMENTS = [
  "Khalifa Sustainability Competition: Top 5 of 50 teams",
  "AUS Sharjah Tourism Innovation Competition: Shortlisted (invited teams only)",
  "Postgraduate Merit Scholarship and Duffin Family Future Shapers Scholarship, Heriot-Watt Dubai",
];

export const LANGUAGES =
  "English (fluent) · Hindi (native) · Kannada (fluent) · Telugu (conversational)";
