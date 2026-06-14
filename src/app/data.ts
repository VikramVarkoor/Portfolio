export const projects = [
  {
    title: 'Synapse.PL — HEAD System',
    description:
      'Hardware-Accelerated Explainable Alzheimer\'s Detection system achieving end-to-end MRI-to-diagnosis inference in 17 seconds on a $269 FPGA platform (Xilinx Zynq-7020), vs $3,000–$10,000 GPU-equivalent solutions. Full-stack clinical dashboard with 3D MRI viewer, Grad-CAM heatmaps, and SHAP attribution.',
    tags: ['Vitis HLS', 'Vivado', 'Zynq-7020', 'XGBoost', 'Next.js', 'TypeScript'],
    accent: 'purple',
    github: null,
    live: null,
    video: '/synapse-demo.mp4',
  },
  {
    title: 'Lumen',
    description:
      'Multi-model LLM orchestration platform with parallel querying across 3 models, a judge agent using Jaccard similarity scoring, and SSE streaming. Production deployed.',
    tags: ['Next.js', 'TypeScript', 'Supabase', 'Groq API', 'Vercel'],
    accent: 'blue',
    github: 'https://github.com/VikramVarkoor/Lumen',
    live: 'https://lumen-ten-psi.vercel.app',
    video: '/lumen-demo.mp4',
  },
  {
    title: 'PaperChat',
    description:
      'RAG-powered document chatbot — upload a PDF and chat with it in real time. Built a custom embedding pipeline using fastembed (ONNX) + NumPy cosine similarity to run the full RAG stack under 80MB RAM on a free-tier backend, down from ~500MB with PyTorch. Streams answers token by token with source citations.',
    tags: ['Next.js', 'FastAPI', 'Python', 'fastembed', 'Groq API', 'RAG', 'Vercel'],
    accent: 'teal',
    github: 'https://github.com/VikramVarkoor/PaperChat',
    live: 'https://paper-chat-five.vercel.app',
    video: '/paperchat-demo.mp4',
  },
  {
    title: 'AI Audit Risk Analyzer',
    description:
      '4-agent sequential pipeline using CrewAI where each agent passes structured output as context to the next. Governance agent performs hallucination detection and PII compliance checks.',
    tags: ['CrewAI', 'LangChain', 'Gemini API', 'Streamlit', 'Python'],
    accent: 'amber',
    github: 'https://github.com/VikramVarkoor/Audit-agent',
    live: null,
  },
  {
    title: 'Smart Bin',
    description:
      'AI-powered smart recycling system that automatically identifies and sorts waste into categories using computer vision. Submitted at AUS Sharjah Hackathon.',
    tags: ['Python', 'Computer Vision', 'ML', 'OpenCV', 'Embedded'],
    accent: 'purple',
    github: 'https://github.com/VikramVarkoor/Smart-Bin',
    live: null,
  },
  {
    title: 'AI HandsFree OS Controller',
    description:
      'HCI tool using Computer Vision and Face Topology for touchless system control. Engineered a native AppleScript bridge to resolve macOS security sandboxing.',
    tags: ['Python', 'OpenCV', 'Face Topology', 'AppleScript', 'HCI'],
    accent: 'teal',
    github: 'https://github.com/VikramVarkoor/AI-HandsFree-OS-Controller',
    live: null,
  },
  {
    title: 'Power Quality Spectral Analyzer',
    description:
      'Real-time DSP tool using Arduino and Python to perform FFT spectral analysis on power signals for harmonic distortion detection and fault monitoring.',
    tags: ['Python', 'Arduino', 'FFT', 'DSP', 'Signal Processing'],
    accent: 'green',
    github: 'https://github.com/VikramVarkoor/Power-Quality-Spectral-Analyzer',
    live: null,
  },
  {
    title: 'Smart Grid Theft Detector',
    description:
      'Prototype smart energy meter using edge computing logic to detect non-technical losses (power theft), with a real-time Python dashboard and automated anomaly alerts.',
    tags: ['Python', 'Edge Computing', 'Anomaly Detection', 'IoT', 'Dashboard'],
    accent: 'blue',
    github: 'https://github.com/VikramVarkoor/Smart-Grid-Theft-Detector',
    live: null,
  },
  {
    title: 'Retail Operations Analytics',
    description:
      'End-to-end analytics pipeline processing 10,000+ rows of retail sales data. Advanced SQL with CTEs, LAG window functions, and a Tableau dashboard covering regional KPIs, MoM growth, and anomaly detection.',
    tags: ['Python', 'SQL', 'Tableau', 'SQLite', 'pandas'],
    accent: 'amber',
    github: 'https://github.com/VikramVarkoor/Retail-Operations-Analytics',
    live: null,
  },
  {
    title: 'Carbon Emission & CSR Tracker',
    description:
      'Odoo-based CSR and sustainability analytics module with KPI monitoring, automated threshold alerts, supplier audit management, and geospatial dashboards for multi-site performance tracking.',
    tags: ['JavaScript', 'Odoo', 'PostgreSQL', 'Geospatial', 'Analytics'],
    accent: 'green',
    github: 'https://github.com/VikramVarkoor/Carbon-Emission-and-Sustainabillity-tracker-with-image-detection',
    live: null,
  },
  {
    title: 'Smart Meter Analytics',
    description:
      'Real-time IoT analytics pipeline simulating 21,840 rows of power consumption data across 5 devices. 4-panel dashboard with load trends, anomaly distribution, weekly patterns, and cost breakdowns.',
    tags: ['Python', 'MQTT', 'pandas', 'Matplotlib', 'Streamlit'],
    accent: 'teal',
    github: 'https://github.com/VikramVarkoor/Smart-meter-analytics',
    live: null,
  },
]

export const publications = [
  {
    badge: 'IEEE ITEC-AP 2025',
    title: 'Smart EV Charging Frameworks: Grid Integration and Demand-Side Optimization',
    venue: 'International Transportation Electrification Conference -- Asia Pacific',
    accent: 'purple',
  },
  {
    badge: 'IEEE ICTMOD 2024',
    title: 'Microprocessor and ML Integration: Embedded AI Pipeline Design for Edge Applications',
    venue: 'International Conference on Technology and Management of Operations & Decisions',
    accent: 'blue',
  },
]

export const skills = [
  { category: 'AI & ML', items: ['Python', 'CrewAI', 'LangChain', 'Gemini API', 'Groq', 'OpenAI', 'TensorFlow/Keras', 'XGBoost', 'Prompt Engineering', 'RAG', 'fastembed', 'ONNX Runtime'] },
  { category: 'Data', items: ['SQL (CTEs, Window Functions)', 'pandas', 'NumPy', 'Tableau', 'ETL Pipelines', 'SQLite', 'matplotlib/seaborn'] },
  { category: 'Full Stack', items: ['Next.js', 'TypeScript', 'React', 'Supabase', 'PostgreSQL', 'REST APIs', 'SSE', 'Vercel', 'FastAPI', 'Render', 'Streamlit'] },
  { category: 'Hardware', items: ['FPGA (Zynq-7020, Vitis HLS, Vivado)', 'Arduino', 'Raspberry Pi', 'ESP32', 'MQTT', 'ZigBee', 'PCB Design (EasyEDA)'] },
  { category: 'DevOps', items: ['Git', 'GitHub', 'Vercel', 'Docker (basic)', 'GitHub Actions'] },
]

export const experience = [
  {
    title: 'Hardware R&D Intern',
    company: 'Syncrow IoT',
    location: 'Dubai, UAE',
    duration: 'May 2025 – Sep 2025',
    hours: '~422 hours',
    bullets: [
      'Conducted structured hardware validation and functional testing of 15+ IoT devices including smart door locks, smart ACs, energy clamps, radar sensors, and multi-mode gateways',
      'Designed a standardized 17-step IoT device testing procedure covering power-up, protocol handshake, latency, edge case handling, and stress testing',
      'Worked with embedded communication protocols including MQTT, ZigBee, and wired/wireless IoT architectures',
      'Built a structured device catalogue documenting technical specifications, measurement accuracy, and reliability ratings for 30+ devices',
      'Authored validation requirements documentation working cross-functionally with the product owner and data scientist',
    ],
  },
]
