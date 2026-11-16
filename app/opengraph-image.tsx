import { ImageResponse } from "next/og";

export const alt = "Vikram Varkoor · Electrical Engineer · MSc AI Student";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Social preview card, rendered once at build time.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#07080B",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          color: "#F5F3EE",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              background: "#E5C17B",
              color: "#07080B",
              padding: "6px 16px",
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            VIKRAM.V
          </div>
          <div style={{ display: "flex", fontSize: 24, letterSpacing: 4, color: "#38BDF8" }}>
            DUBAI, UAE // R&D LAB
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 92, fontWeight: 800, letterSpacing: -3, lineHeight: 1 }}>
            Vikram Varkoor
          </div>
          <div style={{ display: "flex", marginTop: 22, fontSize: 36, color: "#E5C17B" }}>
            Electrical Engineer · MSc AI Student
          </div>
          <div style={{ display: "flex", marginTop: 22, fontSize: 28, color: "#A6A9B3", maxWidth: 980 }}>
            Embedded hardware, forecasting models and full-stack LLM systems. Co-author of two IEEE papers.
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 24, color: "#07080B" }}>
          {["FPGA · ZYNQ-7020", "CAUSAL ML", "FORECASTING", "LLM SYSTEMS"].map((t) => (
            <div key={t} style={{ display: "flex", border: "2px solid #38BDF8", color: "#38BDF8", padding: "6px 14px" }}>
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
