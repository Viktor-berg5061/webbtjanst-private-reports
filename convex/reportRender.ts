/**
 * Pure HTML rendering helpers for the private report. No Convex imports — safe
 * to call from tests, scripts and the http.ts handler.
 *
 * Visual direction mirrors the Next.js page (src/app/r/[token]/page.tsx) and
 * the shared CSS (convex/reportCss.ts). Keeping the renderer pure makes it
 * straightforward to test the actual produced HTML.
 */

import { baseReportCss, REPORT_CSS_GUARD } from "./reportCss.ts";

const PUBLIC_SITE = "https://www.webbtjanst.com";

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  })[character] ?? character);
}

function safeAccent(value: unknown): string {
  return typeof value === "string" && HEX_COLOR.test(value) ? value : "#b5631a";
}

function iconCheck(): string {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`;
}
function iconMinus(): string {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
}
function iconGlobe(): string {
  return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><line x1="3" y1="12" x2="21" y2="12"/><path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18"/></svg>`;
}
function iconPhone(): string {
  return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;
}
function iconQuote(): string {
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9c-1.5 1-2 2.5-2 4v3h5v-5H6c0-1 0-2 1-2.5"/><path d="M15 9c-1.5 1-2 2.5-2 4v3h5v-5h-3c0-1 0-2 1-2.5"/></svg>`;
}

export type ReportContent = {
  companyName: string;
  contactName?: string;
  title: string;
  introduction: string;
  observations: string[];
  recommendation: { summary: string; website: string; receptionist: string; pricing: string };
  nextSteps: string[];
  neededFromCustomer: string[];
  disclaimer?: string;
  theme?: { accent?: string };
  highlights?: string[];
  situation?: { headline: string; body: string };
  comparison?: { before: string[]; after: string[] };
  valueFlow?: { stage: string; description: string }[];
  pricingOverview?: {
    tiers: {
      id: string;
      name: string;
      tagline: string;
      recommended: boolean;
      website: string;
      receptionist: string;
      extraMinutes: string;
      maintenance?: string;
      notes?: string;
    }[];
    vatNote: string;
  };
};

type ConceptPayload = {
  id: string;
  name: string;
  artDirection: string;
  blurb: string;
  palette: { bg: string; surface: string; text: string; accent: string; onAccent: string; soft: string };
  hero: { eyebrow: string; title: string; sub: string; cta: string };
  proofs: { label: string; value: string }[];
  projects: { title: string; tag: string }[];
  footer: { phone: string; tagline: string };
};

const CONCEPT_A: ConceptPayload = {
  id: "trust",
  name: "Trygghetsspecialisten",
  artDirection: "High-trust service · serif",
  blurb: "Varm, sanslöst redaktionell. Signalvärdet är trygghet och långsiktighet: certifieringar, referenser och lugn typografi som låter hantverket tala.",
  palette: { bg: "#f7f1e6", surface: "#ffffff", text: "#2a261e", accent: "#8c5a1e", onAccent: "#ffffff", soft: "#efe5d1" },
  hero: { eyebrow: "BYGG &amp; RENOVERING", title: "Hantverket ni kan lita på.", sub: "ROT-avdragsklara entreprenader i Stockholms län sedan 2009.", cta: "Begär kostnadsfri offert" },
  proofs: [{ label: "Projekt", value: "420+" }, { label: "Återkommande kunder", value: "63%" }, { label: "Garantitid", value: "10 år" }],
  projects: [{ title: "Badrumsrenovering · Södermalm", tag: "ROT" }, { title: "Köksbyte · Vasastan", tag: "Totalentreprenad" }, { title: "Tillbyggnad · Bromma", tag: "Bygglov" }],
  footer: { phone: "08-123 45 67", tagline: "Svar inom 24 timmar · personlig kontakt" },
};

const CONCEPT_B: ConceptPayload = {
  id: "local",
  name: "Den lokala proffsen",
  artDirection: "Bold local · modern sans",
  blurb: "Tydligt, modigt och mobilvänligt. Stora tryckytor, lokal förankring och en mörk hero som visar att ni är hantverket nära — inte ett callcenter.",
  palette: { bg: "#0f1218", surface: "#181c25", text: "#f4f5f7", accent: "#ffb13d", onAccent: "#1a1206", soft: "#1f242f" },
  hero: { eyebrow: "GÖTEBORG · 30 MIN RUNT STAN", title: "Bygga om? Vi börjar i morgon.", sub: "Lokala snickare, plattsättare och elektriker i samma team.", cta: "Ring 031-555 12 12" },
  proofs: [{ label: "Svarstid", value: "< 30 min" }, { label: "Nöjda kunder", value: "4.9 / 5" }, { label: "Lokala team", value: "6 st" }],
  projects: [{ title: "Fönsterbyte hel hus · Majorna", tag: "1 dag" }, { title: "Kök + vardagsrum · Landala", tag: "3 veckor" }],
  footer: { phone: "031-555 12 12", tagline: "Öppet 07–22 varje dag · riktiga hantverkare" },
};

const CONCEPT_C: ConceptPayload = {
  id: "premium",
  name: "Premium projekten",
  artDirection: "Editorial portfolio · type-driven",
  blurb: "Magasin-känsla där projekten själva är stjärnan. Stora siffror, generös vit yta och ett diskret premium-statement riktat till kräsna beställare.",
  palette: { bg: "#faf8f3", surface: "#faf8f3", text: "#1c1c20", accent: "#9a3324", onAccent: "#ffffff", soft: "#eee7d5" },
  hero: { eyebrow: "SELECTED WORK · 2014—", title: "Detaljerna gör helheten.", sub: "Renoveringar, tillbyggnader och interiör för privatpersoner och arkitektfirmor.", cta: "Se utvalda projekt" },
  proofs: [{ label: "Publicerade projekt", value: "38" }, { label: "Press", value: "Arkitektur N · Residence" }, { label: "Geografi", value: "Mälardalen" }],
  projects: [{ title: "Sekelskiftesvåning · Östermalm", tag: "2024" }, { title: "Ateljé &amp; gästhus · Skåne", tag: "2023" }, { title: "Villa med sjöutsikt · Värmdö", tag: "2023" }],
  footer: { phone: "08-987 65 43", tagline: "Förfrågningar via e-post · svar inom 48 timmar" },
};

function conceptScreen(c: ConceptPayload): string {
  const navBorder = c.id === "local" ? "1px solid #2a2f3d" : "1px solid rgba(0,0,0,0.06)";
  const heroBg = c.id === "local"
    ? c.palette.bg
    : c.id === "premium"
      ? `linear-gradient(180deg, ${c.palette.bg} 0%, ${c.palette.soft} 100%)`
      : `linear-gradient(180deg, ${c.palette.soft} 0%, ${c.palette.bg} 100%)`;
  const h1Size = c.id === "local" ? 24 : c.id === "premium" ? 30 : 26;
  const h1Weight = c.id === "premium" ? 500 : c.id === "trust" ? 600 : 700;
  const fontFamily = c.id === "premium" || c.id === "trust"
    ? `"Iowan Old Style", Cambria, Georgia, serif`
    : `-apple-system, "Inter", "Helvetica Neue", Arial, sans-serif`;
  const proofBg = c.id === "local" ? c.palette.surface : "#ffffff";
  const proofBorder = c.id === "local" ? "1px solid #2a2f3d" : "1px solid rgba(0,0,0,0.06)";
  const proofValueSize = c.id === "premium" ? 22 : 16;
  const proofValueFamily = c.id === "premium" ? "Iowan Old Style, Georgia, serif" : "inherit";
  const projectBg = c.id === "local" ? c.palette.surface : "#ffffff";
  const projectBorder = c.id === "local" ? "1px solid #2a2f3d" : "1px solid rgba(0,0,0,0.06)";
  const footerBorder = c.id === "local" ? "1px solid #2a2f3d" : "1px solid rgba(0,0,0,0.06)";

  const projectsHtml = c.projects.map((p) =>
    `<div style="background:${projectBg};border:${projectBorder};border-radius:10px;padding:10px 12px;display:flex;align-items:center;justify-content:space-between;gap:10px">
       <span style="font-size:11.5px;font-weight:600;line-height:1.3">${escapeHtml(p.title)}</span>
       <span style="font-size:9px;letter-spacing:0.8px;text-transform:uppercase;color:${c.palette.accent};font-weight:700;padding:3px 7px;border:1px solid ${c.palette.accent}66;border-radius:999px;flex-shrink:0">${escapeHtml(p.tag)}</span>
     </div>`
  ).join("");

  const proofsHtml = c.proofs.map((p) =>
    `<div style="background:${proofBg};border:${proofBorder};border-radius:10px;padding:10px 8px;text-align:center">
       <div style="font-family:${proofValueFamily};font-size:${proofValueSize}px;font-weight:700;color:${c.palette.text};letter-spacing:-0.4px;line-height:1;margin-bottom:4px">${escapeHtml(p.value)}</div>
       <div style="font-size:9px;opacity:0.7;letter-spacing:0.4px">${escapeHtml(p.label)}</div>
     </div>`
  ).join("");

  return `
    <div class="rt-concept-${c.id}" style="width:360px;min-height:560px;background:${c.palette.bg};color:${c.palette.text};font-family:${fontFamily};font-size:13px;line-height:1.45">
      <header style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:${navBorder};background:${c.id === "local" ? c.palette.surface : "transparent"}">
        <span style="display:inline-flex;align-items:center;gap:8px;font-weight:700;font-size:13px;letter-spacing:0.4px">
          <span style="width:22px;height:22px;border-radius:6px;background:${c.palette.accent};color:${c.palette.onAccent};display:inline-grid;place-items:center;font-size:11px;font-weight:700">M</span>
          Mästaren
        </span>
        <span style="display:flex;gap:12px;font-size:10px;opacity:0.75;letter-spacing:0.5px">
          <span>Tjänster</span><span>Projekt</span><span>Kontakt</span>
        </span>
      </header>
      <section style="padding:${c.id === "premium" ? "32px 22px 26px" : "24px 18px 22px"};background:${heroBg};color:${c.palette.text}">
        <span style="display:inline-block;font-size:9px;letter-spacing:1.6px;font-weight:700;color:${c.palette.accent};margin-bottom:10px;text-transform:uppercase">${c.hero.eyebrow}</span>
        <h2 style="font-size:${h1Size}px;font-weight:${h1Weight};line-height:1.12;letter-spacing:-0.4px;margin:0 0 10px;max-width:90%">${escapeHtml(c.hero.title)}</h2>
        <p style="font-size:11.5px;line-height:1.5;margin:0 0 14px;opacity:0.85;max-width:85%">${escapeHtml(c.hero.sub)}</p>
        <span style="display:inline-flex;align-items:center;gap:6px;background:${c.palette.accent};color:${c.palette.onAccent};padding:${c.id === "local" ? "10px 16px" : "8px 14px"};border-radius:999px;font-size:11.5px;font-weight:700;letter-spacing:0.2px;box-shadow:0 4px 12px ${c.palette.accent}55">${escapeHtml(c.hero.cta)}</span>
      </section>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;padding:0 18px;margin-top:-8px">${proofsHtml}</div>
      <section style="padding:20px 18px 6px">
        <p style="font-size:11px;letter-spacing:1.4px;text-transform:uppercase;font-weight:700;opacity:0.6;margin:0 0 10px">Utvalda projekt</p>
        <div style="display:grid;gap:8px">${projectsHtml}</div>
      </section>
      <footer style="margin-top:22px;padding:16px 18px 22px;border-top:${footerBorder};display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:11px;opacity:0.85">
        <span style="font-weight:700;color:${c.palette.accent}">${escapeHtml(c.footer.phone)}</span>
        <span>${escapeHtml(c.footer.tagline)}</span>
      </footer>
    </div>
  `;
}

function conceptCard(c: ConceptPayload, label: string): string {
  const inner = conceptScreen(c);
  return `
    <article class="rt-concept">
      <div class="rt-concept-meta">
        <span class="rt-concept-tag">${escapeHtml(label)} · konceptförslag</span>
        <h3 class="rt-concept-name">${escapeHtml(c.name)}</h3>
        <span class="rt-concept-direction">${escapeHtml(c.artDirection)}</span>
        <p class="rt-concept-blurb">${escapeHtml(c.blurb)}</p>
      </div>
      <div class="rt-concept-frame" aria-label="Miniatyrförhandsvisning av koncept ${escapeHtml(c.name)}">
        <div class="rt-concept-screen">
          <div class="rt-concept-scaler" style="transform:scale(0.86);transform-origin:top left;width:360px;height:560px">${inner}</div>
        </div>
      </div>
    </article>
  `;
}

function situationDiagram(): string {
  return `
    <svg class="rt-situation-diagram" viewBox="0 0 360 200" role="img" aria-label="Kvalitativ nuläges- och möjlighetsbild">
      <defs>
        <linearGradient id="rt-now" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="var(--rt-border)" stop-opacity="0.85"/>
          <stop offset="100%" stop-color="var(--rt-border)" stop-opacity="0.4"/>
        </linearGradient>
        <linearGradient id="rt-next" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="var(--rt-accent)" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="var(--rt-accent)" stop-opacity="0.55"/>
        </linearGradient>
      </defs>
      <g font-family="-apple-system, Segoe UI, Inter, sans-serif" font-size="11">
        <text x="20" y="28" fill="var(--rt-text-muted)" font-weight="600" letter-spacing="1">IDAG</text>
        <text x="220" y="28" fill="var(--rt-accent-strong)" font-weight="700" letter-spacing="1">MED WEBBTJÄNST</text>
      </g>
      <rect x="20" y="44" width="44" height="100" rx="6" fill="url(#rt-now)"/>
      <rect x="20" y="74" width="32" height="70" rx="6" fill="url(#rt-now)"/>
      <rect x="20" y="104" width="24" height="40" rx="6" fill="url(#rt-now)"/>
      <rect x="220" y="36" width="120" height="108" rx="6" fill="url(#rt-next)"/>
      <rect x="220" y="56" width="120" height="88" rx="6" fill="url(#rt-next)" opacity="0.85"/>
      <rect x="220" y="80" width="120" height="64" rx="6" fill="url(#rt-next)" opacity="0.7"/>
      <path d="M64 84 C 140 60, 220 60, 220 80" fill="none" stroke="var(--rt-accent)" stroke-width="1.4" stroke-dasharray="4 4" opacity="0.7"/>
      <g transform="translate(124 56)">
        <rect x="0" y="0" width="92" height="20" rx="10" fill="var(--rt-surface)" stroke="var(--rt-accent)" stroke-width="1"/>
        <text x="46" y="14" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="10" fill="var(--rt-accent-strong)" font-weight="600">kvalitativ illustration</text>
      </g>
    </svg>
  `;
}

function renderHero(content: ReportContent): string {
  const highlightHtml = (content.highlights && content.highlights.length > 0)
    ? `<ul class="rt-hero-highlights" aria-label="Sammanfattande punkter">${content.highlights.map((h) => `<li class="rt-hero-highlight">${iconCheck()}<span>${escapeHtml(h)}</span></li>`).join("")}</ul>`
    : "";
  const aside = (content.situation || (content.highlights && content.highlights.length > 0))
    ? `<aside class="rt-hero-aside" aria-label="Sammanfattning i korthet">
         <h3>I korthet</h3>
         ${content.situation ? `<p class="rt-hero-pull">&ldquo;${escapeHtml(content.situation.headline)}&rdquo;</p>` : ""}
         ${highlightHtml}
       </aside>`
    : "";
  const metaParts: string[] = [];
  if (content.contactName) metaParts.push(`Upplagd för <strong>${escapeHtml(content.contactName)}</strong> · `);
  metaParts.push("Sammanställd efter vårt samtal");
  return `
    <article class="rt-hero">
      <div class="rt-hero-grid">
        <div>
          <p class="rt-eyebrow">För ${escapeHtml(content.companyName)}</p>
          <h1 class="rt-title">${escapeHtml(content.title)}</h1>
          <p class="rt-meta">${metaParts.join("")}</p>
          <p class="rt-intro">${escapeHtml(content.introduction)}</p>
        </div>
        ${aside}
      </div>
    </article>
  `;
}

function renderSituation(content: ReportContent): string {
  if (!content.situation) return "";
  return `
    <section class="rt-section" aria-labelledby="rt-sit">
      <div class="rt-situation">
        <div>
          <p class="rt-eyebrow">Nuläge &amp; möjlighet</p>
          <h2 class="rt-situation-headline">${escapeHtml(content.situation.headline)}</h2>
          <p class="rt-situation-body">${escapeHtml(content.situation.body)}</p>
        </div>
        ${situationDiagram()}
      </div>
    </section>
  `;
}

function renderObservations(items: string[]): string {
  if (items.length === 0) return "";
  const cards = items.slice(0, 6).map((item, i) =>
    `<li class="rt-observation">
       <span class="rt-observation-num" aria-hidden="true">
         <span>Observation</span>
         <strong>${String(i + 1).padStart(2, "0")}</strong>
       </span>
       <p class="rt-observation-body">${escapeHtml(item)}</p>
       <span class="rt-observation-icon" aria-hidden="true">${iconQuote()}</span>
     </li>`
  ).join("");
  return `
    <section class="rt-section" aria-labelledby="rt-obs">
      <header class="rt-section-head">
        <div>
          <p class="rt-section-eyebrow">Det vi ser</p>
          <h2 class="rt-section-title" id="rt-obs">Tre saker vi tar med oss från samtalet</h2>
        </div>
        <p class="rt-section-aside">Kvalitativa observationer — inte marknadssiffror.</p>
      </header>
      <ol class="rt-observations">${cards}</ol>
    </section>
  `;
}

function renderComparison(comparison: { before: string[]; after: string[] } | undefined): string {
  if (!comparison || (comparison.before.length === 0 && comparison.after.length === 0)) return "";
  const beforeItems = comparison.before.map((b) =>
    `<li class="rt-comparison-item">${iconMinus()}<span>${escapeHtml(b)}</span></li>`
  ).join("");
  const afterItems = comparison.after.map((a) =>
    `<li class="rt-comparison-item">${iconCheck()}<span>${escapeHtml(a)}</span></li>`
  ).join("");
  return `
    <section class="rt-section" aria-labelledby="rt-cmp">
      <header class="rt-section-head">
        <div>
          <p class="rt-section-eyebrow">Vad som ändras</p>
          <h2 class="rt-section-title" id="rt-cmp">Från dagens situation till ett tydligare upplägg</h2>
        </div>
      </header>
      <div class="rt-comparison">
        <article class="rt-comparison-card" data-side="before">
          <span class="rt-comparison-label">${iconMinus()} Idag</span>
          <ul class="rt-comparison-list">${beforeItems}</ul>
        </article>
        <article class="rt-comparison-card" data-side="after">
          <span class="rt-comparison-label">${iconCheck()} Med Webbtjänst</span>
          <ul class="rt-comparison-list">${afterItems}</ul>
        </article>
      </div>
    </section>
  `;
}

function renderRecommendation(content: ReportContent): string {
  const r = content.recommendation;
  return `
    <section class="rt-section" aria-labelledby="rt-reco">
      <header class="rt-section-head">
        <div>
          <p class="rt-section-eyebrow">Vår rekommendation</p>
          <h2 class="rt-section-title" id="rt-reco">Webbplats och AI-receptionist som hör ihop</h2>
        </div>
        <p class="rt-section-aside">Kombinationen är vald utifrån er situation, inte en standard.</p>
      </header>
      <div class="rt-card" style="padding:0">
        <div style="padding:clamp(24px,4vw,36px)">
          <p class="rt-reco-summary">${escapeHtml(r.summary)}</p>
        </div>
        <div class="rt-features" style="padding:0 clamp(24px,4vw,36px) clamp(24px,4vw,36px)">
          <article class="rt-feature">
            <span class="rt-feature-icon" aria-hidden="true">${iconGlobe()}</span>
            <h3>Webbplats</h3>
            <p>${escapeHtml(r.website)}</p>
          </article>
          <article class="rt-feature">
            <span class="rt-feature-icon" aria-hidden="true">${iconPhone()}</span>
            <h3>AI-receptionist</h3>
            <p>${escapeHtml(r.receptionist)}</p>
          </article>
        </div>
      </div>
    </section>
  `;
}

function renderValueFlow(stages: { stage: string; description: string }[] | undefined): string {
  if (!stages || stages.length === 0) return "";
  const steps = stages.map((s, i) =>
    `<div class="rt-flow-step">
       <span class="rt-flow-num">Steg ${i + 1}</span>
       <span class="rt-flow-stage">${escapeHtml(s.stage)}</span>
       <p class="rt-flow-desc">${escapeHtml(s.description)}</p>
     </div>`
  ).join("");
  return `
    <section class="rt-section" aria-labelledby="rt-flow">
      <div class="rt-flow" style="--rt-flow-steps:${stages.length}">
        <p class="rt-eyebrow">Så hänger det ihop</p>
        <h3 class="rt-section-title" style="margin:8px 0 24px;max-width:32ch">Webbplats och AI-receptionist i ett sammanhängande flöde</h3>
        <div class="rt-flow-track">${steps}</div>
      </div>
    </section>
  `;
}

function renderConcepts(): string {
  const concepts: ConceptPayload[] = [CONCEPT_A, CONCEPT_B, CONCEPT_C];
  const cards = concepts.map((c, i) => conceptCard(c, `Koncept ${String.fromCharCode(65 + i)}`)).join("");
  return `
    <section class="rt-section" aria-labelledby="rt-concepts">
      <header class="rt-section-head">
        <div>
          <p class="rt-section-eyebrow">Tre koncept att utgå från</p>
          <h2 class="rt-section-title" id="rt-concepts">Tänkbara riktningar för er webbplats</h2>
        </div>
        <p class="rt-section-aside">Konceptförslag — inte färdiga leveranser.</p>
      </header>
      <div class="rt-concepts">${cards}</div>
    </section>
  `;
}

function renderPricing(overview: ReportContent["pricingOverview"]): string {
  if (!overview || overview.tiers.length === 0) return "";
  const tiersHtml = overview.tiers.map((t) => `
    <article class="rt-tier" data-recommended="${t.recommended ? "true" : "false"}">
      <header class="rt-tier-head">
        <div>
          <h4 class="rt-tier-name">${escapeHtml(t.name)}</h4>
          <p class="rt-tier-tagline">${escapeHtml(t.tagline)}</p>
        </div>
        ${t.recommended ? `<span class="rt-tier-recommended" aria-label="Rekommenderad nivå för er">Er rekommendation</span>` : ""}
      </header>
      <dl class="rt-tier-rows">
        <div class="rt-tier-row"><dt>Webbplats / setup</dt><dd>${escapeHtml(t.website)}</dd></div>
        <div class="rt-tier-row"><dt>AI-receptionist</dt><dd>${escapeHtml(t.receptionist)}</dd></div>
        <div class="rt-tier-row"><dt>Extra minut</dt><dd>${escapeHtml(t.extraMinutes)}</dd></div>
        ${t.maintenance ? `<div class="rt-tier-row"><dt>Underhåll (valfritt)</dt><dd>${escapeHtml(t.maintenance)}</dd></div>` : ""}
      </dl>
      ${t.notes ? `<p class="rt-tier-notes">${escapeHtml(t.notes)}</p>` : ""}
    </article>
  `).join("");
  return `
    <section class="rt-section" aria-labelledby="rt-pricing">
      <div class="rt-pricing">
        <header class="rt-pricing-head">
          <p class="rt-eyebrow">Prisbild · hela utbudet</p>
          <h3 id="rt-pricing-title" class="rt-pricing-title">Tre nivåer för webbplats och AI-receptionist</h3>
          <p class="rt-pricing-vat">${escapeHtml(overview.vatNote)}</p>
          <p class="rt-pricing-vat" style="margin-top:4px">Den mittersta nivån (Tillväxt) är markerad som rekommenderad för just er.</p>
        </header>
        <div class="rt-tier-grid">${tiersHtml}</div>
        <p class="rt-pricing-note">Priser anges exklusive moms. Tillval som underhåll, extraminuter och premiumfunktioner kan läggas till eller tas bort — inget är obligatoriskt utöver den rekommenderade nivån för just ert företag.</p>
      </div>
    </section>
  `;
}

function renderSteps(items: string[]): string {
  if (items.length === 0) return "";
  const steps = items.map((s) =>
    `<li class="rt-step"><span class="rt-step-num" aria-hidden="true"></span><p class="rt-step-body">${escapeHtml(s)}</p></li>`
  ).join("");
  return `
    <section class="rt-section" aria-labelledby="rt-steps">
      <header class="rt-section-head">
        <div>
          <p class="rt-section-eyebrow">Så går det till</p>
          <h2 class="rt-section-title" id="rt-steps">Fyra steg från samtal till första samtal via er nya lösning</h2>
        </div>
      </header>
      <ol class="rt-steps">${steps}</ol>
    </section>
  `;
}

function renderNeeds(items: string[]): string {
  if (items.length === 0) return "";
  const needs = items.map((n) =>
    `<li class="rt-need"><span class="rt-need-check" aria-hidden="true">✓</span><p class="rt-need-body">${escapeHtml(n)}</p></li>`
  ).join("");
  return `
    <section class="rt-section" aria-labelledby="rt-needs">
      <header class="rt-section-head">
        <div>
          <p class="rt-section-eyebrow">Vad vi behöver från er</p>
          <h2 class="rt-section-title" id="rt-needs">Material och beslut för att kunna börja bygga</h2>
        </div>
      </header>
      <ul class="rt-needs">${needs}</ul>
    </section>
  `;
}

/**
 * Build the full HTML body for a private report. Returns just the HTML
 * string; the caller is responsible for setting the response status and
 * CSP/security headers. Safe for both the Convex http handler and tests.
 */
export function renderReportHtml(content: ReportContent): string {
  const accent = safeAccent(content.theme?.accent);
  const disclaimer = content.disclaimer
    ? `<p class="rt-disclaimer">${escapeHtml(content.disclaimer)}</p>`
    : "";
  return `<!doctype html><html lang="sv"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><meta name="color-scheme" content="light dark"><title>${escapeHtml(content.title)} | Webbtjänst</title><style>${baseReportCss(accent)}\n/* guard:${REPORT_CSS_GUARD} */</style></head><body><main class="shell"><header class="rt-header"><a class="rt-brand" href="${PUBLIC_SITE}" rel="noopener"><span class="rt-brand-mark" aria-hidden="true">W</span><span>Webbtjänst</span></a><span class="rt-tag"><span class="rt-tag-dot" aria-hidden="true"></span>Personlig sammanställning</span></header>${renderHero(content)}${renderSituation(content)}${renderObservations(content.observations ?? [])}${renderComparison(content.comparison)}${renderRecommendation(content)}${renderValueFlow(content.valueFlow)}${renderConcepts()}${renderPricing(content.pricingOverview)}${renderSteps(content.nextSteps ?? [])}${renderNeeds(content.neededFromCustomer ?? [])}${disclaimer}<footer class="rt-footer"><span>Webbtjänst · personlig sammanställning</span><a href="${PUBLIC_SITE}" rel="noopener">Läs mer om Webbtjänst →</a></footer></main></body></html>`;
}

/**
 * Build the generic 404 HTML for invalid, expired or revoked capability URLs.
 * The page must return exactly the same shape for every not-found case to
 * avoid leaking which kind of failure occurred.
 */
export function renderNotFoundHtml(): string {
  return `<!doctype html><html lang="sv"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><title>Sidan kan inte visas | Webbtjänst</title><style>${baseReportCss("#b5631a")}</style></head><body><main class="shell"><header class="rt-header"><span class="rt-brand"><span class="rt-brand-mark" aria-hidden="true">W</span><span>Webbtjänst</span></span><span class="rt-tag"><span class="rt-tag-dot" aria-hidden="true"></span>Länken kunde inte visas</span></header><section class="rt-notice"><p class="rt-eyebrow">Webbtjänst</p><h1>Sidan kan inte visas</h1><p>Länken är felaktig, har gått ut eller har återkallats. Av säkerhetsskäl visar vi inte mer information.</p><p>Kontakta oss om du behöver en ny länk — vi skickar en ny personlig sammanställning direkt.</p><a class="rt-notice-cta" href="${PUBLIC_SITE}" rel="noopener">Besök webbtjanst.com</a></section></main></body></html>`;
}

export { escapeHtml, safeAccent, PUBLIC_SITE };
