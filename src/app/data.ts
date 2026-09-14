export interface ProjectLink {
  label: string
  href: string
}

export interface Project {
  id: string
  kicker: string
  title: string
  short: string
  body: string
  tags: string[]
  links: ProjectLink[]
  lenses?: ('hardware' | 'software')[]
  // Lens-specific cuts of this project: a short 2-3 line summary for the
  // inline spec-sheet/editor row, and a longer deep-dive (with its own
  // bullet list) shown behind a dedicated "deep-dive" link, so the hardware
  // and software pages each surface the facts relevant to that angle
  // instead of one shared paragraph.
  hwSummary?: string
  hwDeepDive?: string
  swSummary?: string
  swDeepDive?: string
}

export const projects: Project[] = [
  {
    id: 'synapse',
    kicker: 'Senior Design · FPGA / Applied AI',
    title: 'Synapse.PL / HEAD System',
    short: "FPGA-accelerated Alzheimer's detection, 17s inference on a $269 board.",
    body: `<p>Hardware-Accelerated Explainable Alzheimer's Detection (HEAD) system achieving end-to-end MRI-to-diagnosis inference in 17 seconds on a $269 FPGA platform (Xilinx Zynq-7020 SoC on PYNQ-Z2), versus $3,000-10,000 GPU-equivalent solutions.</p>
      <ul>
        <li>3-person senior design team with two Computer Engineering students; sole contributor for GLCM texture feature extraction: designed a local block 3D Grey-Level Co-occurrence Matrix pipeline extracting 252 Haralick texture features per scan across 13 spatial directions at 3 voxel distances, from an 8-block (2x2x2) decomposition of the hippocampal ROI.</li>
        <li>Implemented the FPGA accelerator in Vitis HLS 2022.1 (C++ with HLS pipeline directives), synthesized to RTL and mapped onto the Zynq-7020 fabric via Vivado: 1.32s bilateral extraction, 100MHz clock (10.95ns actual vs. 15ns constraint), 13% LUT and 22% DSP block utilization.</li>
        <li>Architected an ARM Cortex-A9 to FPGA interface via AXI4-Stream DMA on shared DDR memory, enabling zero-overhead data transfer and full ARM availability during FPGA execution.</li>
        <li>Three-task cascade ML classifier (XGBoost + Optuna) achieving AUC 0.903 (AD vs. CN), 0.803 (CN vs. MCI), 0.779 (Stable vs. Converting MCI) on 3,436 ADNI scans, fusing GLCM features, CSF biomarkers, and clinical metadata.</li>
        <li>Full-stack clinical dashboard in Next.js 16.1 / React 19 / TypeScript: interactive 3D MRI viewer, Grad-CAM heatmap overlays, SHAP-style feature attribution, FPGA vs. CPU benchmark analytics, longitudinal case timeline, one-click PDF report export.</li>
      </ul>`,
    tags: ['Vitis HLS', 'Vivado', 'Zynq-7020', 'XGBoost', 'Optuna', 'Next.js 16', 'TypeScript', 'Tailwind CSS v4'],
    links: [],
    lenses: ['hardware', 'software'],
    hwSummary: "Vitis HLS 2022.1 kernel synthesized to RTL and mapped onto the Zynq-7020 fabric via Vivado, closing timing at 100MHz (10.95ns actual vs. a 15ns constraint) at 13% LUT and 22% DSP utilization. The ARM Cortex-A9 talks to the FPGA over AXI4-Stream DMA on shared DDR, so the 1.32s bilateral GLCM extraction runs entirely in hardware without blocking the ARM core.",
    hwDeepDive: `<p>The hardware brief here was inference speed on commodity silicon: get an MRI scan to a diagnosis fast enough to be clinically useful, on a board that costs less than a night in the hospital it's meant to serve. Vitis HLS let the GLCM feature-extraction pipeline get written in C++ with pipeline directives rather than hand-rolled RTL, then get synthesized down onto the Zynq-7020's programmable logic through Vivado.</p>
      <ul>
        <li>The extraction pipeline itself: an 8-block (2x2x2) decomposition of the hippocampal ROI, computing a local 3D Grey-Level Co-occurrence Matrix per block, pulling 252 Haralick texture features per scan across 13 spatial directions at 3 voxel distances.</li>
        <li>Timing closure landed at 100MHz with a 10.95ns actual path against a 15ns constraint, at 13% LUT and 22% DSP utilization, comfortable headroom on a board with this little silicon to spare.</li>
        <li>The ARM Cortex-A9 talks to the FPGA fabric over AXI4-Stream DMA on shared DDR memory, so the ARM core stays fully available for the ML classifier and dashboard logic while the FPGA is mid-extraction, rather than blocking on it.</li>
        <li>End to end: 1.32s of that pipeline runs in hardware, contributing to a 17-second total inference time on a $269 PYNQ-Z2 board, versus $3,000-10,000 for a GPU-equivalent setup.</li>
      </ul>`,
    swSummary: 'A full-stack clinical dashboard in Next.js 16.1, React 19, and TypeScript wraps the FPGA output: an interactive 3D MRI viewer with Grad-CAM heatmap overlays and SHAP-style feature attribution. FPGA vs. CPU benchmark analytics, a longitudinal case timeline, and one-click PDF report export round it out.',
    swDeepDive: `<p>The application layer's job is turning what the FPGA and the classifier produce into something a clinician can actually read. The three-task cascade ML classifier (XGBoost tuned with Optuna) runs AD vs. CN, CN vs. MCI, and Stable vs. Converting MCI, fusing the GLCM features with CSF biomarkers and clinical metadata, achieving AUC 0.903 / 0.803 / 0.779 respectively across 3,436 ADNI scans.</p>
      <ul>
        <li>The dashboard renders that output as an interactive 3D MRI viewer with Grad-CAM heatmap overlays showing where the model is actually looking, plus SHAP-style feature attribution for the tabular biomarker side.</li>
        <li>A benchmark analytics view puts the FPGA's inference time directly against a CPU baseline, so the hardware acceleration story is visible in the same interface as the diagnosis.</li>
        <li>A longitudinal case timeline tracks a patient's scans over time rather than treating each one as an isolated result.</li>
        <li>Built on Next.js 16.1 / React 19 / TypeScript with Tailwind CSS v4, ending in a one-click PDF report export so a result can leave the browser as something a clinician can file.</li>
      </ul>`,
  },
  {
    id: 'deriv',
    kicker: 'Production Deployed · Trading / AI',
    title: 'Deriv Trading Agent',
    short: 'Autonomous EUR/USD paper-trading agent with real statistical backtesting.',
    body: `<p>End-to-end autonomous paper-trading system for EUR/USD: ingests live 5-minute candle data from Twelve Data, feeds market context and trade history to an LLM for BUY/SELL/HOLD decisions with confidence scores, and executes trades via Deriv's demo API.</p>
      <ul>
        <li>Risk management enforced at both prompt and code level: minimum 0.55 confidence threshold, mandatory 2:1 reward-to-risk ratio, no pyramiding into open positions, automatic closure on stop-loss/take-profit.</li>
        <li>Persistent agent memory: the last 5 trade outcomes feed back into every new decision, explicitly prompting caution after consecutive losses.</li>
        <li>Live dashboard with real-time Supabase subscriptions (replacing 30-second polling), P&amp;L tracking via Recharts, confidence visualization, and row-level security separating public reads from service-role writes.</li>
        <li>Separate statistical validation layer in Python: logistic regression for directional prediction using lagged returns, RSI-14, SMA-20 deviation, and momentum features, trained on 5,000 hours of historical data with a chronological 80/20 split, yielding 52.51% directional accuracy vs. a 46.59% naive baseline.</li>
        <li>Caught and fixed a data-leakage bug that had produced a misleading 95.88% backtest accuracy, then validated the honest result with Wilson confidence intervals.</li>
        <li>61-test Jest/RTL suite across 5 suites (P&amp;L calculations, all 4 Redux reducers, component rendering); one component built strictly test-first via red-green-refactor TDD; a 9-assertion Cypress E2E suite covering the critical user flow.</li>
        <li>Custom Webpack config in next.config.js: SVGR for typed SVG imports, explicit path aliases, and a bundle analyzer.</li>
      </ul>`,
    tags: ['TypeScript', 'Next.js 14', 'Redux Toolkit', 'Jest/RTL', 'Cypress', 'Webpack', 'Python', 'scikit-learn', 'Supabase', 'Recharts'],
    links: [{ label: 'GitHub', href: 'https://github.com/VikramVarkoor/Deriv-Trading-Agent' }, { label: 'Live ↗', href: 'https://deriv-agent.vercel.app' }],
    swSummary: 'A 61-test Jest/RTL suite across 5 suites plus a 9-assertion Cypress E2E test covers the trading flow, with one component built strictly test-first via TDD. Real-time Supabase subscriptions (replacing 30-second polling) with row-level security drive the live dashboard, on a build using a custom Webpack config for typed SVG imports and bundle analysis.',
    swDeepDive: `<p>The software side of an autonomous trading agent has to answer a harder question than "does it work": does it work honestly. Risk management is enforced at both the prompt and code level, a minimum 0.55 confidence threshold, a mandatory 2:1 reward-to-risk ratio, no pyramiding into open positions, and automatic closure on stop-loss or take-profit, plus persistent agent memory where the last 5 trade outcomes feed back into every new decision.</p>
      <ul>
        <li>The live dashboard runs on real-time Supabase subscriptions rather than 30-second polling, with P&amp;L tracking via Recharts and row-level security separating public reads from service-role writes.</li>
        <li>A separate statistical validation layer in Python (logistic regression on lagged returns, RSI-14, SMA-20 deviation, and momentum features, trained on 5,000 hours of historical data with a chronological 80/20 split) is what surfaced the honest number: 52.51% directional accuracy against a 46.59% naive baseline.</li>
        <li>That honest number only exists because a data-leakage bug that had produced a misleading 95.88% backtest accuracy got caught and fixed, then the corrected result got validated with Wilson confidence intervals rather than taken at face value.</li>
        <li>Test coverage: a 61-test Jest/RTL suite across 5 suites (P&amp;L calculations, all 4 Redux reducers, component rendering), one component built strictly test-first via red-green-refactor TDD, and a 9-assertion Cypress E2E suite on the critical flow. The build itself runs on a custom Webpack config in next.config.js, SVGR for typed SVG imports, explicit path aliases, and a bundle analyzer.</li>
      </ul>`,
    lenses: ['software'],
  },
  {
    id: 'lumen',
    kicker: 'Production Deployed · LLM Tooling',
    title: 'Lumen',
    short: 'Multi-model LLM aggregator with a judge agent and live SSE streaming.',
    body: `<p>Multi-agent LLM aggregator with parallel worker execution across 3 models simultaneously (Llama 3.3 70B, Qwen 3 32B, Kimi K2) via a single orchestrated request pipeline.</p>
      <ul>
        <li>Real-time SSE streaming architecture enables concurrent per-agent token delivery, all three model cards populating simultaneously using Promise.all.</li>
        <li>Judge orchestrator agent performs two-step synthesis: Jaccard similarity-based inter-agent agreement scoring (0-100%), then a reconciled answer drawing from all model outputs.</li>
        <li>Automated per-agent benchmarking: 1-10 scoring on accuracy, depth, and clarity, plus a one-line critique per model and winner selection.</li>
        <li>Deployed on Vercel with Supabase Postgres for auth-gated query history, shareable links, and markdown export.</li>
      </ul>`,
    tags: ['Next.js 15', 'TypeScript', 'Supabase', 'Groq API', 'Vercel'],
    links: [{ label: 'GitHub', href: 'https://github.com/VikramVarkoor/Lumen' }, { label: 'Live ↗', href: 'https://lumen-ten-psi.vercel.app/dashboard' }],
    lenses: ['software'],
    swSummary: 'Parallel worker execution queries 3 LLMs simultaneously through one orchestrated pipeline, with real-time SSE streaming so all three model cards populate concurrently via Promise.all. A judge orchestrator agent reconciles the results with Jaccard similarity agreement scoring, backed by auth-gated query history on Supabase Postgres.',
    swDeepDive: `<p>Querying three models at once is easy. Making the results useful together is the actual problem. Lumen runs parallel worker execution across 3 models simultaneously (Llama 3.3 70B, Qwen 3 32B, Kimi K2) through a single orchestrated request pipeline, with real-time SSE streaming so all three model cards populate concurrently via Promise.all rather than waiting on the slowest one.</p>
      <ul>
        <li>A judge orchestrator agent does the reconciliation in two steps: Jaccard similarity-based inter-agent agreement scoring (0-100%) first, then a synthesized answer drawing from all three outputs rather than just picking one.</li>
        <li>Automated per-agent benchmarking scores each model 1-10 on accuracy, depth, and clarity, with a one-line critique and a winner selection, so the comparison isn't just the agreement score in isolation.</li>
        <li>Deployed on Vercel with Supabase Postgres backing auth-gated query history, shareable links, and markdown export, the persistence layer that turns a one-off query into something worth coming back to.</li>
      </ul>`,
  },
  {
    id: 'powerquality',
    kicker: 'Personal Project · Embedded / DSP',
    title: 'Power Quality Spectral Analyzer',
    short: 'Real-time FFT harmonic detection bridging DSP theory and physical hardware.',
    body: `<p>Real-time DSP system for detecting harmonic distortion in AC power signals: an Arduino Uno captures 64-point analog data bursts from a simulated voltage transducer and streams them over Serial to a Python host.</p>
      <ul>
        <li>Python engine applies an FFT (NumPy) to convert each burst from time domain to frequency domain, enabling fundamental frequency identification and Total Harmonic Distortion (THD) calculation.</li>
        <li>Dual-domain live visualization in matplotlib: raw time-domain waveform on the left, frequency spectrum with harmonic peaks highlighted on the right, updating in real time.</li>
        <li>UTF-8 error handling manages asynchronous stream noise from the serial connection, keeping the pipeline stable under noisy communication.</li>
      </ul>`,
    tags: ['Python', 'NumPy FFT', 'Arduino Uno', 'PySerial', 'matplotlib'],
    links: [{ label: 'GitHub', href: 'https://github.com/VikramVarkoor/Power-Quality-Spectral-Analyzer' }],
    lenses: ['hardware'],
    hwSummary: "An Arduino Uno samples 64-point analog bursts from a simulated voltage transducer and streams raw ADC data over Serial (PySerial) to a Python host. There, a NumPy FFT converts each burst to the frequency domain for THD detection, with explicit UTF-8 error handling keeping the serial link stable under real interference.",
    hwDeepDive: `<p>This one's about catching a signal problem at the moment it happens rather than after the fact. An Arduino Uno captures 64-point analog bursts standing in for a voltage transducer reading, and streams them over Serial rather than batching and uploading later, since a real power-quality fault doesn't wait around.</p>
      <ul>
        <li>Each 64-point burst gets run through an FFT (NumPy) on the Python host, converting the raw time-domain samples into a frequency spectrum, which is what lets fundamental frequency and Total Harmonic Distortion (THD) actually get identified rather than eyeballed.</li>
        <li>The live view is dual-domain in matplotlib: the raw waveform on one side, the harmonic-highlighted spectrum on the other, both updating as new bursts arrive.</li>
        <li>Serial links carry noise, so the pipeline includes explicit UTF-8 error handling for the stream, the kind of detail that matters once this connects to anything with a real motor or inverter nearby.</li>
      </ul>`,
  },
  {
    id: 'syncrow',
    kicker: 'Internship · Hardware R&D',
    title: 'Syncrow IoT: Hardware R&D Internship',
    short: '422hr hardware validation internship across 15+ IoT device types.',
    body: `<p>Hardware R&D Intern, Dubai, UAE, May 2025 to September 2025, ~422 hours.</p>
      <ul>
        <li>Structured hardware validation and functional testing of 15+ IoT devices, including Hikvision intercoms (facial recognition, fingerprint, biometric, password modes), radar presence/motion sensors, smart door locks, smart ACs, energy clamps, and multi-mode gateways.</li>
        <li>Designed a standardized 17-step testing procedure: power-up, protocol handshake, network connectivity, latency, backend data validation, UI correctness, edge-case handling, and stress testing.</li>
        <li>Performed regression testing of the Syncrow Analytics dashboard, logging bugs and retesting after fixes via an internal issue tracker.</li>
        <li>Built a structured device catalogue documenting specs, measurement accuracy, reliability ratings, and integration capabilities for 30+ devices.</li>
        <li>Authored validation requirements documentation, working cross-functionally with the product owner and data scientist.</li>
        <li>Worked with the Tuya platform for smart device integration; researched MQTT, ZigBee, and wired vs. wireless IoT architectures.</li>
      </ul>`,
    tags: ['MQTT', 'ZigBee', 'Tuya Platform', 'Hikvision Systems', 'IoT Validation'],
    links: [],
    lenses: ['hardware'],
    hwSummary: '422 hours of hands-on validation across 15+ IoT device types (intercoms, radar sensors, smart locks, ACs, energy clamps, gateways), using a standardized 17-step test procedure from power-up through stress testing. Worked directly with MQTT, ZigBee, and the Tuya platform, building a 30+ device specs and reliability catalogue from hands-on measurement.',
    hwDeepDive: `<p>422 hours, mostly spent finding out where hardware disagrees with its own spec sheet. The core of the role was structured validation and functional testing across 15+ IoT device types, Hikvision intercoms running facial recognition, fingerprint, biometric, and password modes, radar presence and motion sensors, smart door locks, smart ACs, energy clamps, and multi-mode gateways.</p>
      <ul>
        <li>Designed a standardized 17-step testing procedure from scratch: power-up, protocol handshake, network connectivity, latency, backend data validation, UI correctness, edge-case handling, and stress testing, so every device got measured the same way regardless of what it was.</li>
        <li>Ran regression testing on the Syncrow Analytics dashboard itself, logging bugs and retesting after fixes through an internal issue tracker.</li>
        <li>Built a structured device catalogue covering specs, measurement accuracy, reliability ratings, and integration capabilities for 30+ devices, plus validation requirements documentation written cross-functionally with the product owner and data scientist.</li>
        <li>Worked directly with the Tuya platform for smart device integration, and researched MQTT, ZigBee, and wired vs. wireless IoT architectures as part of evaluating what these devices actually needed to talk to each other reliably.</li>
      </ul>`,
  },
  {
    id: 'paperchat',
    kicker: 'Production Deployed · RAG / AI',
    title: 'PaperChat',
    short: 'RAG PDF chatbot running under 80MB RAM on a free-tier backend.',
    body: `<p>Full-stack RAG application where users upload a PDF and chat with it in real time: finds the most relevant sections via semantic search and streams answers token by token with source citations.</p>
      <ul>
        <li>Replaced PyTorch + ChromaDB with fastembed (ONNX runtime, BAAI/bge-small-en-v1.5) + custom NumPy cosine similarity to run the full embedding pipeline under 80MB RAM on Render's free tier, down from ~500MB with PyTorch.</li>
        <li>Batch processing (8 chunks at a time) during indexing to prevent memory spikes: ~500-word chunks with overlap, top 4-5 chunks retrieved per query via 384-dimension cosine similarity.</li>
        <li>SSE streaming delivers responses at ~800 tokens/sec via Groq API, with a sources panel surfacing the exact sections used.</li>
        <li>Next.js 14 App Router frontend on Vercel, FastAPI/Uvicorn backend on Render, full CORS config, zero infrastructure cost, fully live.</li>
      </ul>`,
    tags: ['Next.js 14', 'FastAPI', 'Python', 'fastembed', 'NumPy', 'Groq API', 'Tailwind CSS'],
    links: [{ label: 'GitHub', href: 'https://github.com/VikramVarkoor/PaperChat' }, { label: 'Live ↗', href: 'https://paper-chat-five.vercel.app' }],
    lenses: ['software'],
    swSummary: "Swapped PyTorch and ChromaDB for fastembed (ONNX) and a custom NumPy cosine similarity implementation, dropping the full embedding pipeline from ~500MB to under 80MB RAM on Render's free tier. Batched indexing avoids memory spikes, and responses stream over SSE at ~800 tokens/sec via Groq API with a live sources panel.",
    swDeepDive: `<p>The interesting engineering decision here wasn't the RAG pattern itself, it's what got ripped out to make it fit on a free-tier server. The original PyTorch + ChromaDB stack ran at ~500MB, well past what Render's free tier gives you. Swapping to fastembed (ONNX runtime, BAAI/bge-small-en-v1.5) plus a custom NumPy cosine similarity implementation got the full embedding pipeline under 80MB.</p>
      <ul>
        <li>Indexing batches 8 chunks at a time specifically to avoid memory spikes, with ~500-word chunks and overlap, and retrieves the top 4-5 chunks per query via 384-dimension cosine similarity.</li>
        <li>Responses stream over SSE at roughly 800 tokens/sec via Groq API, with a sources panel that surfaces the exact chunks the answer actually drew from rather than a black-box response.</li>
        <li>Deployment is split: a Next.js 14 App Router frontend on Vercel, a FastAPI/Uvicorn backend on Render, full CORS configuration between them, and zero infrastructure cost end to end.</li>
      </ul>`,
  },
  {
    id: 'pitch',
    kicker: 'Dual-Cloud Deployed · AI / PR Tooling',
    title: 'Pitch Angle Finder',
    short: 'AI PR-angle generator, deployed independently across two clouds.',
    body: `<p>Full-stack AI application (FastAPI backend, Next.js/TypeScript frontend) generating realistic PR pitch angles from a live LLM call, with a system prompt encoding five explicit newsworthiness criteria and structured JSON output validated against a Pydantic schema before reaching the client.</p>
      <ul>
        <li>Diagnosed a live production failure (a deprecated LLM model returning 404s) through direct testing against the deployed API, fixed it, and made the model configurable via environment variable to prevent recurrence.</li>
        <li>Built and shipped a retry mechanism handling two distinct LLM reliability failure modes (incomplete output, malformed JSON), covered by an automated test exercising the real retry path and verified with repeated live production calls.</li>
        <li>Deployed independently to Render and Vercel with git-triggered CI/CD, then shipped a second, fully independent instance to Microsoft Azure (App Service backend, Static Web Apps frontend) with Azure-triggered GitHub Actions CI/CD, running side by side with the original deployment without touching it.</li>
        <li>Diagnosed and resolved four distinct real Azure deployment failures at their actual root cause: free-tier compute and CPU-minute quota limits, a Basic Authentication default blocking publish credentials, and a GitHub OAuth workflow-scope restriction blocking CI/CD, then switched the frontend to a static export to run on Azure's genuine free tier and correctly wired the build-time environment variable so it reliably reaches the live backend.</li>
      </ul>`,
    tags: ['Python', 'FastAPI', 'Pydantic', 'Next.js', 'TypeScript', 'Groq API', 'pytest', 'Render', 'Vercel', 'Azure'],
    links: [{ label: 'GitHub', href: 'https://github.com/VikramVarkoor/pitch-angle-finder' }, { label: 'Live ↗', href: 'https://pitch-angle-finder.vercel.app' }],
  },
  {
    id: 'audit',
    kicker: 'Portfolio Project · AI Governance',
    title: 'AI Audit Risk Analyzer',
    short: '4-agent CrewAI pipeline with a governance sign-off gate.',
    body: `<p>4-agent sequential audit pipeline using CrewAI: Risk Identifier, Internal Controls Specialist, Report Writer, and AI Governance Reviewer, each with a distinct role, goal, and backstory shaping its behavior.</p>
      <ul>
        <li>Governance Reviewer agent acts as the final quality gate: checks generated content for hallucinations, PII leakage, and tone compliance before output is surfaced, directly implementing enterprise responsible-AI principles.</li>
        <li>LangChain handles document ingestion for both PDF and plain-text input; Streamlit provides drag-and-drop upload with real-time spinner feedback during agent execution.</li>
        <li>Uses CrewAI's Process.sequential mode, where each task's output is automatically passed as context to the next agent, eliminating manual state management.</li>
      </ul>`,
    tags: ['Python', 'CrewAI', 'LangChain', 'Gemini API', 'Streamlit'],
    links: [{ label: 'GitHub', href: 'https://github.com/VikramVarkoor/Audit-agent' }],
  },
  {
    id: 'smartmeter',
    kicker: 'Portfolio Project · Data Engineering',
    title: 'Smart Meter Analytics at Scale',
    short: 'PySpark vs. pandas honestly benchmarked from 100k to 10.5M rows.',
    body: `<p>Synthetic IoT data generator simulating 300 devices (HVAC, EV chargers, water heaters, lighting) across a full year at 15-minute intervals: 10,512,000 rows with realistic double-peak daily load curves, weekend uplift multipliers, and 1.5% injected anomalies (theft spikes, dropouts), written as partitioned Parquet for partition pruning.</p>
      <ul>
        <li>Implemented the same 4 analytics queries (peak-window detection, consecutive overload intervals via window functions, weekly anomaly rate tracking, tiered time-of-use cost estimation) in both PySpark and the original pandas/SQLite stack, to directly benchmark distributed vs. single-node processing.</li>
        <li>Benchmark harness at 100k, 1M, and 5M rows: pandas wins by 7-30x at 100k rows (Spark's JVM startup overhead), Spark overtakes on aggregation-heavy queries by 1M rows, and is 8-10x faster at 5M rows on windowed aggregations, while honestly reporting where Spark loses (the interval-detection query stays pandas-favored through 5M rows due to shuffle cost; pandas couldn't run the full 10.5M row set in-memory at all).</li>
        <li>README documents the full pandas-to-Spark conceptual shift: lazy evaluation, DAG execution, the Catalyst optimizer, partition pruning, and when Spark is actually the wrong tool.</li>
      </ul>`,
    tags: ['Python', 'PySpark', 'Spark SQL', 'pandas', 'SQLite', 'NumPy', 'Parquet'],
    links: [{ label: 'GitHub', href: 'https://github.com/VikramVarkoor/Smart-meter-analytics' }],
  },
  {
    id: 'smartbin',
    kicker: 'Hackathon Build · Computer Vision',
    title: 'Smart Bin',
    short: '97% Top-1 waste classifier with closed-loop physical actuation.',
    body: `<p>Autonomous waste segregation system, submitted at the AUS Sharjah Hackathon. Fine-tuned a MobileNet CNN on a custom 12-class waste dataset (battery, biological, cardboard, plastic, metal, glass variants, paper, clothes, shoes, trash), achieving ~97% Top-1 accuracy after 50 training epochs.</p>
      <ul>
        <li>Live inference pipeline uses OpenCV to capture, preprocess, and classify camera frames in real time, at speeds suitable for embedded deployment.</li>
        <li>Classification result drives GPIO-controlled stepper and servo motors to physically redirect the item into the correct bin, closing the loop between inference and actuation.</li>
        <li>Full edge deployment: inference, motor control, and camera feed all run locally on Raspberry Pi with no cloud dependency.</li>
      </ul>`,
    tags: ['Python', 'TensorFlow/Keras', 'OpenCV', 'MobileNet', 'Raspberry Pi GPIO'],
    links: [{ label: 'GitHub', href: 'https://github.com/VikramVarkoor/Smart-Bin' }],
    lenses: ['hardware'],
    hwSummary: 'OpenCV captures and preprocesses camera frames in real time, feeding a MobileNet classifier whose result drives GPIO-controlled stepper and servo motors to physically redirect each item. Inference, motor control, and camera feed all run locally on a Raspberry Pi, closing the loop with no cloud dependency.',
    hwDeepDive: `<p>The interesting part of this one isn't the classifier, it's what happens after it decides. A MobileNet CNN fine-tuned on a custom 12-class waste dataset (battery, biological, cardboard, plastic, metal, glass variants, paper, clothes, shoes, trash) hits about 97% Top-1 accuracy after 50 training epochs, but that number only matters if something physical acts on it.</p>
      <ul>
        <li>OpenCV handles capture and preprocessing of camera frames in real time, at speeds workable for embedded deployment rather than a lab benchmark.</li>
        <li>The classification result drives GPIO-controlled stepper and servo motors that physically redirect the item into the correct bin, actually closing the loop between inference and actuation instead of just logging a label.</li>
        <li>Everything, inference, motor control, camera feed, runs locally on a Raspberry Pi with no cloud round-trip, which matters for a hackathon build meant to work live on a table, not against a server that might be down.</li>
      </ul>`,
  },
  {
    id: 'handsfree',
    kicker: 'Personal Project · HCI / Computer Vision',
    title: 'AI HandsFree OS Controller',
    short: 'Touchless macOS volume control via real-time head-pose tracking.',
    body: `<p>Computer vision HCI tool enabling fully hands-free macOS volume control via real-time head-pose tracking from a standard webcam, no specialized hardware required.</p>
      <ul>
        <li>OpenCV + Haar Cascade Classifier localize the face per frame; horizontal offset from screen center determines lean direction and magnitude, with a configurable deadzone to prevent false triggers from natural head sway.</li>
        <li>Key challenge: macOS accessibility sandboxing blocks standard automation libraries like PyAutoGUI from touching system audio. Bypassed it with a native AppleScript bridge talking directly to Core Audio, achieving reliable control without accessibility permissions.</li>
      </ul>`,
    tags: ['Python', 'OpenCV', 'Haar Cascade', 'AppleScript', 'macOS Core Audio'],
    links: [{ label: 'GitHub', href: 'https://github.com/VikramVarkoor/AI-HandsFree-OS-Controller' }],
  },
  {
    id: 'theft',
    kicker: 'Personal Project · Edge / IoT',
    title: 'Smart Grid Theft Detector',
    short: 'Edge-thresholded non-technical-loss detector with live red-alert visualization.',
    body: `<p>End-to-end non-technical loss (NTL) / power-theft detection prototype. An Arduino Uno with a potentiometer simulating a load transducer implements edge-based anomaly thresholding in C++ firmware, streaming live power/current readings over Serial at 115,200 baud at 5Hz.</p>
      <ul>
        <li>Python dashboard receives the serial stream via PySerial, maintains a rolling real-time plot (matplotlib animation), and switches to a CRITICAL red-alert state when a load spike exceeds the theft threshold.</li>
        <li>Firmware handles thresholding directly on the microcontroller, reducing data volume sent to the host: embedded intelligence by design.</li>
        <li>Companion project to Smart Meter Analytics: this one handles real-time edge alerting, the analytics repo handles historical batch analysis.</li>
      </ul>`,
    tags: ['Python', 'Arduino Uno', 'C++', 'PySerial', 'matplotlib'],
    links: [{ label: 'GitHub', href: 'https://github.com/VikramVarkoor/Smart-Grid-Theft-Detector' }],
  },
  {
    id: 'rgbled',
    kicker: 'Personal Project · PCB Design',
    title: 'USB RGB LED Controller PCB',
    short: 'Full schematic-to-fabrication PCB design for triple-channel RGB control.',
    body: `<p>Compact USB-C and Micro-USB powered RGB LED controller PCB, designed schematic-to-fabrication-ready Gerber files in EasyEDA Pro, exported to Altium Designer format for professional workflow compatibility.</p>
      <ul>
        <li>Triple MOSFET switching architecture (2N7002 N-Channel MOSFETs) gives independent PWM-capable control of red, green, and blue channels with no crosstalk.</li>
        <li>Integrated LDO regulator steps the 5V USB supply down to a stable logic-level voltage, with 10uF decoupling capacitors at the regulator output and power rail to suppress ripple and transient noise.</li>
        <li>Repository includes the full Altium schematic and layout files, a PDF schematic export, a complete BOM, and fabrication-ready Gerbers.</li>
      </ul>`,
    tags: ['EasyEDA Pro', 'Altium Designer', 'KiCad-compatible Gerbers'],
    links: [{ label: 'GitHub', href: 'https://github.com/VikramVarkoor/USB-RGB-LED-Controller-using-EasyEDA' }],
  },
  {
    id: 'rfid',
    kicker: 'Personal Project · Embedded Systems',
    title: 'RFID Access Control System',
    short: 'MFRC522-based access control with interrupt-driven gate logging.',
    body: `<p>RFID-based physical access control system: an MFRC522 reader scans presented cards and compares UIDs against a hardcoded authorized list in firmware, granting or denying access.</p>
      <ul>
        <li>Access granted triggers a green LED sequence and a 90-degree servo rotation to open a gate; unauthorized cards trigger a red LED and buzzer, full multimodal feedback.</li>
        <li>Interrupt-driven gate count logging tracks openings within each 5-minute interval, printing to Serial and auto-resetting at each boundary.</li>
        <li>Full embedded stack: SPI between Arduino and MFRC522, servo PWM, GPIO for LEDs/buzzer, UART Serial logging, all in C++.</li>
      </ul>`,
    tags: ['C++', 'Arduino Uno', 'MFRC522', 'Servo Motor'],
    links: [{ label: 'GitHub', href: 'https://github.com/VikramVarkoor/Card-Reader' }],
  },
  {
    id: 'carbon',
    kicker: 'Portfolio Project · Enterprise / Full-Stack',
    title: 'Carbon Emission & Sustainability Tracker',
    short: 'Enterprise Odoo module for CSR and sustainability KPI tracking.',
    body: `<p>Full-stack enterprise Odoo module for Corporate Social Responsibility and sustainability management, deployable within an existing Odoo ERP environment.</p>
      <ul>
        <li>Structured logging of CSR activities, KPI definitions, and environmental/social impact metrics across multiple projects and sites.</li>
        <li>Automated KPI threshold alerting via cron-scheduled evaluation jobs, no manual intervention required.</li>
        <li>Geospatial dashboard for map-based, site-level sustainability performance comparison across regions.</li>
        <li>Supplier audit and compliance module with risk scoring, audit trail logging, and role-based access control via Odoo security rules.</li>
      </ul>`,
    tags: ['JavaScript', 'Python', 'Odoo Framework', 'PostgreSQL'],
    links: [{ label: 'GitHub', href: 'https://github.com/VikramVarkoor/Carbon-Emission-and-Sustainabillity-tracker-with-image-detection' }],
  },
  {
    id: 'retail',
    kicker: 'Portfolio Project · Data Analytics',
    title: 'Retail Operations Analytics',
    short: 'SQL + Tableau analytics pipeline with interview-ready reasoning.',
    body: `<p>End-to-end retail analytics pipeline on the Sample Superstore dataset (~10,000 rows of US retail orders, 2020-2023). Python ETL layer loads and cleans raw CSV into a normalized SQLite database.</p>
      <ul>
        <li>4 advanced SQL queries: regional profit margin analysis (GROUP BY/HAVING), month-over-month sales growth (LAG window functions), top products by margin (CTEs), and unprofitable repeat customers.</li>
        <li>Tableau Public dashboard with map, time-series, and bar-chart views covering regional performance, sales trends, and product profitability.</li>
        <li>README includes interview-ready talking points on the business reasoning behind each query.</li>
      </ul>`,
    tags: ['Python', 'pandas', 'SQLite', 'SQL Window Functions', 'Tableau Public'],
    links: [{ label: 'GitHub', href: 'https://github.com/VikramVarkoor/Retail-Operations-Analytics' }],
  },
  {
    id: 'envdash',
    kicker: 'Personal Project · APIs / Data Viz',
    title: 'Global Environmental Intelligence Dashboard',
    short: 'Async air-quality dashboard pulling live data for any location.',
    body: `<p>Cloud-integrated air quality monitoring dashboard that asynchronously fetches multi-spectral gas concentration data from the OpenWeatherMap REST API for any queried location.</p>
      <ul>
        <li>Parses JSON payloads with AQI component readings (CO, NO2, O3, PM2.5, PM10), visualized as labeled bar charts with WHO guideline threshold lines.</li>
        <li>Asynchronous HTTP architecture (aiohttp) allows multiple location queries to be fetched concurrently, non-blocking.</li>
      </ul>`,
    tags: ['Python', 'OpenWeatherMap API', 'aiohttp', 'matplotlib'],
    links: [{ label: 'GitHub', href: 'https://github.com/VikramVarkoor/Global-Environmental-Intelligence-Dashboard' }],
  },
  {
    id: 'watersensor',
    kicker: 'Personal Project · IoT / Embedded',
    title: 'Water Sensor: Soil Moisture Monitor',
    short: 'Calibrated analog soil-moisture monitor on Arduino.',
    body: `<p>Arduino-based soil moisture monitoring system: a capacitive soil moisture sensor outputs a raw ADC voltage proportional to humidity, read on an analog pin at 1Hz.</p>
      <ul>
        <li>Calibration routine uses map() and constrain() to convert raw ADC values against known wet/dry references into a normalized 0-100% humidity reading, correcting for sensor non-linearity.</li>
        <li>Readings printed to Serial every second for real-time monitoring and logging via the Arduino IDE serial plotter.</li>
      </ul>`,
    tags: ['C++', 'Arduino Uno', 'Analog ADC'],
    links: [{ label: 'GitHub', href: 'https://github.com/VikramVarkoor/Water-Sensor' }],
  },
]

export const projectMap: Record<string, Project> = Object.fromEntries(projects.map(p => [p.id, p]))

export const SPOTLIGHT_IDS = ['synapse', 'deriv', 'lumen']

export const ARCHIVE_GROUPS: { label: string; ids: string[] }[] = [
  { label: 'AI & Full-Stack', ids: ['paperchat', 'pitch', 'audit'] },
  { label: 'Data Engineering & Analytics', ids: ['smartmeter', 'retail', 'carbon', 'envdash'] },
  { label: 'Embedded & Hardware', ids: ['syncrow', 'theft', 'smartbin', 'handsfree', 'watersensor', 'rfid', 'rgbled'] },
]

export const HARDWARE_LENS_IDS = ['synapse', 'powerquality', 'smartbin', 'syncrow']
export const SOFTWARE_LENS_IDS = ['synapse', 'deriv', 'lumen', 'paperchat']

export const CHANNEL_ICONS: Record<string, string> = {
  synapse: '<rect x="7" y="7" width="10" height="10" rx="1"/><path d="M7 10H3M7 14H3M17 10h4M17 14h4M10 7V3M14 7V3M10 21v-4M14 21v-4"/>',
  deriv: '<polyline points="3,17 9,11 13,15 21,5" stroke-linecap="round" stroke-linejoin="round"/><polyline points="15,5 21,5 21,11" stroke-linecap="round" stroke-linejoin="round"/>',
  lumen: '<circle cx="12" cy="4.5" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><path d="M12 6.5L6.3 16.4M12 6.5l5.7 9.9M7.5 18h9"/>',
}

export const skillsData = [
  { cat: 'AI / ML', items: 'Python · LangChain · CrewAI · RAG · XGBoost · scikit-learn · Prompt Engineering · fastembed / ONNX' },
  { cat: 'Full-Stack', items: 'Next.js · TypeScript · React · Supabase · FastAPI · REST / SSE' },
  { cat: 'Hardware', items: 'FPGA (Vitis HLS, Vivado, Zynq-7020) · Arduino · PCB Design · I2C / SPI / UART' },
  { cat: 'Data', items: 'PySpark · pandas · SQL (window functions) · Tableau · NumPy / FFT' },
  { cat: 'IoT', items: 'MQTT · ZigBee · Tuya Platform · Device Validation' },
]

export const educationRows: { status: string; statusClass: string; venue: string; title: string; note: string; badge: string; badgeHref?: string }[] = [
  {
    status: 'IN PROGRESS',
    statusClass: 'rev',
    venue: 'Heriot-Watt Univ. Dubai',
    title: 'MSc Artificial Intelligence',
    note: 'starting Sep 2026',
    badge: '🎓 Duffin Family Future Shapers Scholarship',
    badgeHref: 'https://www.hw.ac.uk/dubai/study/fees-and-funding/scholarships-and-discounts/the-duffin-family-future-shapers-scholarship',
  },
  {
    status: 'COMPLETED',
    statusClass: 'pub',
    venue: 'American Univ. in Dubai',
    title: 'BSc Electrical Engineering',
    note: 'graduated May 2026',
    badge: '',
  },
]

export const publicationsRows: { status: string; statusClass: string; venue: string; title: string; href?: string }[] = [
  { status: 'PUBLISHED', statusClass: 'pub', venue: 'IEEE ITEC-AP 2025', title: 'Smart EV Charging Frameworks: Grid Integration and Demand-Side Optimization', href: 'https://ieeexplore.ieee.org/abstract/document/11344871' },
  { status: 'PUBLISHED', statusClass: 'pub', venue: 'IEEE ICTMOD 2024', title: 'Leveraging Machine Learning for Sustainable Microprocessor Utilization', href: 'https://ieeexplore.ieee.org/document/10878151/' },
  { status: 'UNDER REVIEW', statusClass: 'rev', venue: 'IEEE (submitted)', title: 'FPGA-Accelerated Edge AI for Clinical Decision Support: Architecture, Implementation and Performance Analysis' },
]
