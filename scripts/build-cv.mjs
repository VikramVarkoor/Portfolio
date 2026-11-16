// Builds public/Vikram_Varkoor_CV.pdf from lib/data.ts.
// Single page, single column, real selectable text (ATS friendly).
// Usage: npm run cv   (needs Node 22.18+ and Google Chrome or Chromium)

import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  ACHIEVEMENTS,
  BUILDS,
  CERTS,
  CONTACT,
  EDUCATION,
  EXPERIENCE,
  HERO,
  LANGUAGES,
  PAPERS,
  SKILL_ROWS,
} from "../lib/data.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "public", "Vikram_Varkoor_CV.pdf");

const PROJECTS = ["synapse-pl", "ad-measurement", "forecast-harness", "lumen", "churn-clv-dbt"];
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const strip = (u) => u.replace(/^https?:\/\//, "");

const projects = PROJECTS.map((id) => {
  const b = BUILDS.find((x) => x.id === id);
  return `<div class="item"><div class="row"><b>${esc(b.name)}</b><span>${esc(b.skills.slice(0, 5).join(", "))}</span></div>
  <ul>${b.bullets.slice(0, 2).map((t) => `<li>${esc(t)}</li>`).join("")}</ul></div>`;
}).join("");

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Vikram Varkoor · CV</title>
<style>
@page { size: A4; margin: 10mm 12mm; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font: 8.6pt/1.32 Helvetica, Arial, sans-serif; color: #111; }
h1 { font-size: 20pt; letter-spacing: -0.3pt; }
.sub { margin-top: 1pt; font-size: 8.6pt; color: #333; }
.contact { margin-top: 2pt; color: #222; }
.summary { margin-top: 5pt; }
h2 { margin: 7pt 0 3pt; padding-bottom: 1.5pt; border-bottom: 0.7pt solid #111; font-size: 9pt; text-transform: uppercase; }
.row { display: flex; justify-content: space-between; gap: 10pt; }
.row span { color: #444; text-align: right; }
.item { margin-bottom: 3pt; }
ul { padding-left: 11pt; }
li { margin-top: 0.6pt; }
p { margin-top: 1pt; }
a { color: inherit; text-decoration: none; }
</style></head><body>
<h1>Vikram Varkoor</h1>
<div class="sub">${esc(HERO.role)} · Dubai, UAE</div>
<div class="contact">${esc(CONTACT.email)} · ${esc(strip(CONTACT.github))} · ${esc(strip(CONTACT.linkedin))}</div>
<p class="summary">${esc(HERO.byline)} Available immediately for full-time and internship roles.</p>

<h2>Education</h2>
${EDUCATION.map((e) => `<div class="item"><div class="row"><b>${esc(e.degree)}, ${esc(e.school)}</b><span>${esc(e.status)}</span></div><p>${esc(e.note)}</p></div>`).join("")}

<h2>Experience</h2>
<div class="row"><b>${esc(EXPERIENCE.role)}, ${esc(EXPERIENCE.org)}</b><span>${esc(EXPERIENCE.where)}</span></div>
<ul>${EXPERIENCE.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>

<h2>Selected Projects</h2>
${projects}

<h2>Publications</h2>
<ul>${PAPERS.map((p) => `<li>${esc(p.title)}. ${esc(p.venue)}. ${p.href ? "Co-author." : "Under review."}</li>`).join("")}</ul>

<h2>Skills</h2>
${SKILL_ROWS.map((r) => `<p><b>${esc(r.title.replace(/^\d+ \/\/ /, ""))}:</b> ${esc(r.skills.join(", "))}</p>`).join("")}

<h2>Certifications and Achievements</h2>
<ul>${CERTS.map((c) => `<li>${esc(c.org)}: ${esc(c.items.join("; "))}</li>`).join("")}
${ACHIEVEMENTS.map((a) => `<li>${esc(a)}</li>`).join("")}
<li>Languages: ${esc(LANGUAGES)}</li></ul>
</body></html>`;

const candidates = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);
const chrome = candidates.find((p) => existsSync(p));
if (!chrome) {
  console.error("No Chrome or Chromium found. Set CHROME_PATH to a Chromium-based browser.");
  process.exit(1);
}

const tmp = mkdtempSync(join(tmpdir(), "vv-cv-"));
const page = join(tmp, "cv.html");
writeFileSync(page, html);
execFileSync(
  chrome,
  ["--headless=new", "--disable-gpu", "--no-pdf-header-footer", `--user-data-dir=${join(tmp, "profile")}`, `--print-to-pdf=${out}`, `file://${page}`],
  { stdio: "ignore" },
);
rmSync(tmp, { recursive: true, force: true });
console.log(`Wrote ${out}`);
