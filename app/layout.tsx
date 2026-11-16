import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const jb = JetBrains_Mono({ variable: "--font-jb", subsets: ["latin"] });

const TITLE = "Vikram Varkoor · Electrical Engineer · MSc AI Student";
const DESCRIPTION =
  "Bridging embedded hardware, forecasting models, and full-stack LLM systems. BSc Electrical Engineering graduate, MSc AI student at Heriot-Watt Dubai, and co-author of two IEEE papers.";

// Vercel sets this at build time; local builds fall back to localhost.
const SITE = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: TITLE,
  description: DESCRIPTION,
  authors: [{ name: "Vikram Varkoor", url: "https://github.com/VikramVarkoor" }],
  keywords: ["Vikram Varkoor", "FPGA", "Zynq-7020", "Machine Learning", "Forecasting", "Electrical Engineering", "Dubai"],
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Vikram Varkoor · R&D Lab",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

// Applies the saved theme before first paint to avoid a flash.
const themeScript = `try{if(localStorage.getItem('vv_theme')==='daylight')document.documentElement.classList.add('daylight')}catch(e){}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jb.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
