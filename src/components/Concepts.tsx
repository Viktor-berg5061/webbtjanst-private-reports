import type { ReactElement } from "react";
import type { CSSProperties } from "react";

import { IconArrowRight, IconCalendar, IconPhone, IconShield } from "./icons";

/**
 * Three concept previews. Each preview is a structured payload — palette,
 * hero copy, project samples and a footer tagline — that both the Next.js
 * renderer and the Convex inline renderer turn into a miniature responsive
 * site inside a phone-shaped device frame. No HTML strings are interpolated
 * anywhere; everything renders through React (Next) or escapes safely through
 * a tagged template (Convex).
 *
 * The three art directions:
 *   A) Trygghets­specialisten — high-trust service, serif headlines, warm
 *      neutrals, certifications and long-form content signals.
 *   B) Den lokala proffsen — bold modern, strong contrast, mobile-first,
 *      big tap targets, dark hero band.
 *   C) Premium projekten — editorial portfolio, type-driven, gradient
 *      portfolio strip, project numbers.
 */

export type ConceptPayload = {
  id: string;
  name: string;
  artDirection: string;
  blurb: string;
  palette: {
    bg: string;
    surface: string;
    text: string;
    accent: string;
    onAccent: string;
    soft: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    sub: string;
    cta: string;
  };
  proofs: { label: string; value: string }[];
  projects: { title: string; tag: string }[];
  footer: { phone: string; tagline: string };
};

export const CONCEPT_A: ConceptPayload = {
  id: "trust",
  name: "Trygghets­specialisten",
  artDirection: "High-trust service · serif",
  blurb:
    "Varm, sanslöst redaktionell. Signalvärdet är trygghet och långsiktighet: certifieringar, referenser och lugn typografi som låter hantverket tala.",
  palette: {
    bg: "#f7f1e6",
    surface: "#ffffff",
    text: "#2a261e",
    accent: "#8c5a1e",
    onAccent: "#ffffff",
    soft: "#efe5d1",
  },
  hero: {
    eyebrow: "BYGG &amp; RENOVERING",
    title: "Hantverket ni kan lita på.",
    sub: "ROT-avdragsklara entreprenader i Stockholms län sedan 2009.",
    cta: "Begär kostnadsfri offert",
  },
  proofs: [
    { label: "Projekt", value: "420+" },
    { label: "Återkommande kunder", value: "63%" },
    { label: "Garantitid", value: "10 år" },
  ],
  projects: [
    { title: "Badrumsrenovering · Södermalm", tag: "ROT" },
    { title: "Köksbyte · Vasastan", tag: "Totalentreprenad" },
    { title: "Tillbyggnad · Bromma", tag: "Bygglov" },
  ],
  footer: { phone: "08-123 45 67", tagline: "Svar inom 24 timmar · personlig kontakt" },
};

export const CONCEPT_B: ConceptPayload = {
  id: "local",
  name: "Den lokala proffsen",
  artDirection: "Bold local · modern sans",
  blurb:
    "Tydligt, modigt och mobilvänligt. Stora tryckytor, lokal förankring och en mörk hero som visar att ni är hantverket nära — inte ett callcenter.",
  palette: {
    bg: "#0f1218",
    surface: "#181c25",
    text: "#f4f5f7",
    accent: "#ffb13d",
    onAccent: "#1a1206",
    soft: "#1f242f",
  },
  hero: {
    eyebrow: "GÖTEBORG · 30 MIN RUNT STAN",
    title: "Bygga om? Vi börjar i morgon.",
    sub: "Lokala snickare, plattsättare och elektriker i samma team.",
    cta: "Ring 031-555 12 12",
  },
  proofs: [
    { label: "Svarstid", value: "< 30 min" },
    { label: "Nöjda kunder", value: "4.9 / 5" },
    { label: "Lokala team", value: "6 st" },
  ],
  projects: [
    { title: "Fönsterbyte hel hus · Majorna", tag: "1 dag" },
    { title: "Kök + vardagsrum · Landala", tag: "3 veckor" },
  ],
  footer: { phone: "031-555 12 12", tagline: "Öppet 07–22 varje dag · riktiga hantverkare" },
};

export const CONCEPT_C: ConceptPayload = {
  id: "premium",
  name: "Premium projekten",
  artDirection: "Editorial portfolio · type-driven",
  blurb:
    "Magasin-känsla där projekten själva är stjärnan. Stora siffror, generös vit yta och ett diskret premium-statement riktat till kräsna beställare.",
  palette: {
    bg: "#faf8f3",
    surface: "#faf8f3",
    text: "#1c1c20",
    accent: "#9a3324",
    onAccent: "#ffffff",
    soft: "#eee7d5",
  },
  hero: {
    eyebrow: "SELECTED WORK · 2014—",
    title: "Detaljerna gör helheten.",
    sub: "Renoveringar, tillbyggnader och interiör för privatpersoner och arkitektfirmor.",
    cta: "Se utvalda projekt",
  },
  proofs: [
    { label: "Publicerade projekt", value: "38" },
    { label: "Press", value: "Arkitektur N · Residence" },
    { label: "Geografi", value: "Mälardalen" },
  ],
  projects: [
    { title: "Sekelskiftesvåning · Östermalm", tag: "2024" },
    { title: "Ateljé &amp; gästhus · Skåne", tag: "2023" },
    { title: "Villa med sjöutsikt · Värmdö", tag: "2023" },
  ],
  footer: { phone: "08-987 65 43", tagline: "Förfrågningar via e-post · svar inom 48 timmar" },
};

export const DEFAULT_CONCEPTS: ConceptPayload[] = [CONCEPT_A, CONCEPT_B, CONCEPT_C];

/**
 * Inline miniature responsive site. Renders into a 360×560 box that the
 * outer frame scales down to fit. Every CSS rule is scoped under a unique
 * class so it never leaks into the parent report. Concept data is rendered
 * through React only — no dangerouslySetInnerHTML, no HTML strings.
 */
function ConceptScreen({ concept }: { concept: ConceptPayload }): ReactElement {
  const scopeId = `rt-concept-${concept.id}`;
  const styles: Record<string, CSSProperties> = {
    root: {
      width: 360,
      minHeight: 560,
      background: concept.palette.bg,
      color: concept.palette.text,
      fontFamily: concept.id === "premium"
        ? '"Iowan Old Style", Cambria, Georgia, serif'
        : concept.id === "trust"
          ? '"Iowan Old Style", Georgia, serif'
          : '-apple-system, "Inter", "Helvetica Neue", Arial, sans-serif',
      fontSize: 13,
      lineHeight: 1.45,
    },
    nav: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 18px",
      borderBottom: concept.id === "local" ? "1px solid #2a2f3d" : "1px solid rgba(0,0,0,0.06)",
      background: concept.id === "local" ? concept.palette.surface : "transparent",
    },
    logo: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      fontWeight: 700,
      fontSize: 13,
      letterSpacing: 0.4,
    },
    logoMark: {
      width: 22,
      height: 22,
      borderRadius: 6,
      background: concept.palette.accent,
      color: concept.palette.onAccent,
      display: "inline-grid",
      placeItems: "center",
      fontSize: 11,
      fontWeight: 700,
    },
    navLinks: {
      display: "flex",
      gap: 12,
      fontSize: 10,
      opacity: 0.75,
      letterSpacing: 0.5,
    },
    hero: {
      padding: concept.id === "premium" ? "32px 22px 26px" : "24px 18px 22px",
      background: concept.id === "local"
        ? concept.palette.bg
        : concept.id === "premium"
          ? `linear-gradient(180deg, ${concept.palette.bg} 0%, ${concept.palette.soft} 100%)`
          : `linear-gradient(180deg, ${concept.palette.soft} 0%, ${concept.palette.bg} 100%)`,
      color: concept.palette.text,
    },
    eyebrow: {
      display: "inline-block",
      fontSize: 9,
      letterSpacing: 1.6,
      fontWeight: 700,
      color: concept.palette.accent,
      marginBottom: 10,
      textTransform: "uppercase",
    },
    h1: {
      fontSize: concept.id === "local" ? 24 : concept.id === "premium" ? 30 : 26,
      fontWeight: concept.id === "premium" ? 500 : concept.id === "trust" ? 600 : 700,
      lineHeight: 1.12,
      letterSpacing: -0.4,
      margin: "0 0 10px",
      maxWidth: "90%",
    },
    sub: {
      fontSize: 11.5,
      lineHeight: 1.5,
      margin: "0 0 14px",
      opacity: 0.85,
      maxWidth: "85%",
    },
    cta: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      background: concept.palette.accent,
      color: concept.palette.onAccent,
      padding: concept.id === "local" ? "10px 16px" : "8px 14px",
      borderRadius: 999,
      fontSize: 11.5,
      fontWeight: 700,
      letterSpacing: 0.2,
      boxShadow: `0 4px 12px ${concept.palette.accent}55`,
    },
    proofs: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 6,
      padding: "0 18px",
      marginTop: -8,
    },
    proofCard: {
      background: concept.id === "local" ? concept.palette.surface : "#ffffff",
      border: concept.id === "local" ? "1px solid #2a2f3d" : "1px solid rgba(0,0,0,0.06)",
      borderRadius: 10,
      padding: "10px 8px",
      textAlign: "center",
    },
    proofValue: {
      fontFamily: concept.id === "premium" ? "Iowan Old Style, Georgia, serif" : "inherit",
      fontSize: concept.id === "premium" ? 22 : 16,
      fontWeight: 700,
      color: concept.palette.text,
      letterSpacing: -0.4,
      lineHeight: 1,
      marginBottom: 4,
    },
    proofLabel: {
      fontSize: 9,
      opacity: 0.7,
      letterSpacing: 0.4,
    },
    section: {
      padding: "20px 18px 6px",
    },
    sectionTitle: {
      fontSize: 11,
      letterSpacing: 1.4,
      textTransform: "uppercase",
      fontWeight: 700,
      opacity: 0.6,
      margin: "0 0 10px",
    },
    projectList: {
      display: "grid",
      gap: 8,
    },
    project: {
      background: concept.id === "local" ? concept.palette.surface : "#ffffff",
      border: concept.id === "local" ? "1px solid #2a2f3d" : "1px solid rgba(0,0,0,0.06)",
      borderRadius: 10,
      padding: "10px 12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
    },
    projectTitle: {
      fontSize: 11.5,
      fontWeight: 600,
      lineHeight: 1.3,
    },
    projectTag: {
      fontSize: 9,
      letterSpacing: 0.8,
      textTransform: "uppercase",
      color: concept.palette.accent,
      fontWeight: 700,
      padding: "3px 7px",
      border: `1px solid ${concept.palette.accent}66`,
      borderRadius: 999,
      flexShrink: 0,
    },
    footer: {
      marginTop: 22,
      padding: "16px 18px 22px",
      borderTop: concept.id === "local" ? "1px solid #2a2f3d" : "1px solid rgba(0,0,0,0.06)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8,
      fontSize: 11,
      opacity: 0.85,
    },
    footerPhone: {
      fontWeight: 700,
      color: concept.palette.accent,
    },
  };
  return (
    <div className={scopeId} style={styles.root}>
      <header style={styles.nav}>
        <span style={styles.logo}>
          <span style={styles.logoMark}>M</span>
          <span>Mästaren</span>
        </span>
        <span style={styles.navLinks}>
          <span>Tjänster</span>
          <span>Projekt</span>
          <span>Kontakt</span>
        </span>
      </header>

      <section style={styles.hero}>
        <span style={styles.eyebrow}>{concept.hero.eyebrow}</span>
        <h1 style={styles.h1}>{concept.hero.title}</h1>
        <p style={styles.sub}>{concept.hero.sub}</p>
        <span style={styles.cta}>
          {concept.hero.cta}
          <IconArrowRight size={12} aria-hidden={true} />
        </span>
      </section>

      <div style={styles.proofs}>
        {concept.proofs.map((p) => (
          <div key={`${p.label}-${p.value}`} style={styles.proofCard}>
            <div style={styles.proofValue}>{p.value}</div>
            <div style={styles.proofLabel}>{p.label}</div>
          </div>
        ))}
      </div>

      <section style={styles.section}>
        <p style={styles.sectionTitle}>Utvalda projekt</p>
        <div style={styles.projectList}>
          {concept.projects.map((proj) => (
            <div key={proj.title} style={styles.project}>
              <span style={styles.projectTitle}>{proj.title}</span>
              <span style={styles.projectTag}>{proj.tag}</span>
            </div>
          ))}
        </div>
      </section>

      <footer style={styles.footer}>
        <span style={styles.footerPhone}>{concept.footer.phone}</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <IconShield size={12} aria-hidden={true} />
          {concept.footer.tagline}
        </span>
      </footer>
    </div>
  );
}

type ConceptProps = {
  concept: ConceptPayload;
  /** Index used to compute the scale factor to fit the screen container. */
  index: number;
};

/**
 * One concept card. Renders the miniature site inside a phone-shaped frame
 * and scales it down to fit. The frame uses CSS only — no iframes — so it
 * is fully CSP-safe and works under the strict Convex inline renderer.
 */
export function ConceptPreview({ concept }: ConceptProps): ReactElement {
  return (
    <article className="rt-concept">
      <div className="rt-concept-meta">
        <span className="rt-concept-tag">Koncept {concept.id === "trust" ? "A" : concept.id === "local" ? "B" : "C"} · konceptförslag</span>
        <h3 className="rt-concept-name">{concept.name}</h3>
        <span className="rt-concept-direction">{concept.artDirection}</span>
        <p className="rt-concept-blurb">{concept.blurb}</p>
      </div>
      <div className="rt-concept-frame" aria-label={`Miniatyrförhandsvisning av koncept ${concept.name}`}>
        <div className="rt-concept-screen">
          <div
            className="rt-concept-scaler"
            style={{
              transform: "scale(0.86)",
              transformOrigin: "top left",
              width: 360,
              height: 560,
            }}
          >
            <ConceptScreen concept={concept} />
          </div>
        </div>
      </div>
    </article>
  );
}

/** Returns a list of concept payloads, falling back to the built-in set. */
export function resolveConcepts(input?: ConceptPayload[]): ConceptPayload[] {
  if (!input || input.length === 0) return DEFAULT_CONCEPTS;
  return input.slice(0, 3);
}

/** Inline SVG placeholder for the three concept icons used in the
 *  recommendation section. */
export function ConceptBadgeIcon({ id }: { id: string }): ReactElement {
  if (id === "trust") return <IconShield size={20} />;
  if (id === "local") return <IconPhone size={20} />;
  return <IconCalendar size={20} />;
}
