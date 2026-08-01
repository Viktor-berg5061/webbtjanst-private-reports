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


export const DEFAULT_CONCEPTS: ConceptPayload[] = [];

/**
 * Inline miniature responsive site. Renders into a 360×560 box that the
 * outer frame scales down to fit. Every CSS rule is scoped under a unique
 * class so it never leaks into the parent report. Concept data is rendered
 * through React only — no unsafe_innerHTML_string, no HTML strings.
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
 * One concept card. The whole card is now a clickable link that opens the
 * full interactive concept site inline (CSS :target, no JavaScript). The
 * mini phone-frame preview stays as a teaser so visitors can see the look
 * before committing.
 */
export function ConceptPreview({ concept }: ConceptProps): ReactElement {
  const label = concept.id === "trust" ? "A" : concept.id === "local" ? "B" : "C";
  const targetId = `cn-${concept.id}`;
  return (
    <a className="rt-concept" href={`#${targetId}`} aria-label={`Öppna koncept ${label} som hel sajt`}>
      <div className="rt-concept-meta">
        <span className="rt-concept-tag">Koncept {label} · konceptförslag</span>
        <h3 className="rt-concept-name">{concept.name}</h3>
        <span className="rt-concept-direction">{concept.artDirection}</span>
        <p className="rt-concept-blurb">{concept.blurb}</p>
      </div>
      <div className="rt-concept-frame" aria-hidden="true">
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
      <span className="rt-concept-open">
        Öppna konceptet som hel sajt
        <IconArrowRight size={16} />
      </span>
    </a>
  );
}

/**
 * Full interactive concept site. Rendered hidden by default; the linked
 * ConceptPreview toggles it to a fullscreen overlay via CSS :target. Mirrors
 * the data of the mini preview but expanded into a real, scrollable site
 * with nav, hero, services, projects and footer.
 */
export function ConceptFullscreen({ concept }: { concept: ConceptPayload }): ReactElement {
  const targetId = `cn-${concept.id}`;
  const accent = concept.palette.accent;
  const onAccent = concept.palette.onAccent;
  const surface = concept.palette.surface;
  const text = concept.palette.text;
  const soft = concept.palette.soft;
  const themeStyle: CSSProperties = {
    background: concept.palette.bg,
    color: text,
    "--co-accent": accent,
    "--co-on-accent": onAccent,
    "--co-surface": surface,
    "--co-text": text,
    "--co-soft": soft,
  } as CSSProperties;
  const fontFamily = concept.id === "premium"
    ? '"Iowan Old Style", Cambria, Georgia, serif'
    : concept.id === "trust"
      ? '"Iowan Old Style", Georgia, serif'
      : '-apple-system, "Inter", "Helvetica Neue", Arial, sans-serif';
  return (
    <section id={targetId} className={`rt-concept-full rt-concept-full--${concept.id}`} style={{ ...themeStyle, fontFamily }}>
      <header className="rt-concept-full-nav">
        <a className="rt-concept-full-back" href="#concepts" aria-label="Tillbaka till rapporten">
          ← Tillbaka till rapporten
        </a>
        <span className="rt-concept-full-brand">
          <span className="rt-concept-full-mark" style={{ background: accent, color: onAccent }} aria-hidden="true">
            {concept.id === "trust" ? "T" : concept.id === "local" ? "L" : "P"}
          </span>
          <span>{concept.name}</span>
        </span>
        <nav className="rt-concept-full-links" aria-label="Konceptnavigering">
          <a href={`#${targetId}-tjanster`}>Tjänster</a>
          <a href={`#${targetId}-projekt`}>Projekt</a>
          <a href={`#${targetId}-kontakt`}>Kontakt</a>
        </nav>
      </header>

      <section className="rt-concept-full-hero">
        <p className="rt-concept-full-eyebrow" style={{ color: accent }}>{concept.hero.eyebrow}</p>
        <h1 className="rt-concept-full-title">{concept.hero.title}</h1>
        <p className="rt-concept-full-sub">{concept.hero.sub}</p>
        <a className="rt-concept-full-cta" href={`#${targetId}-kontakt`} style={{ background: accent, color: onAccent }}>
          {concept.hero.cta}
        </a>
      </section>

      <section className="rt-concept-full-proofs" id={`${targetId}-tjanster`}>
        <div className="rt-concept-full-proofs-grid">
          {concept.proofs.map((p) => (
            <div className="rt-concept-full-proof" key={p.label}>
              <span className="rt-concept-full-proof-value" style={{ color: accent }}>{p.value}</span>
              <span className="rt-concept-full-proof-label">{p.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rt-concept-full-projects" id={`${targetId}-projekt`}>
        <h2 className="rt-concept-full-h2">Utvalda projekt</h2>
        <ul className="rt-concept-full-project-list">
          {concept.projects.map((p, i) => (
            <li key={p.title} className="rt-concept-full-project">
              <span className="rt-concept-full-project-num" style={{ color: accent }} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="rt-concept-full-project-title">{p.title}</span>
              <span className="rt-concept-full-project-tag" style={{ background: accent, color: onAccent }}>{p.tag}</span>
            </li>
          ))}
        </ul>
      </section>

      <footer className="rt-concept-full-footer" id={`${targetId}-kontakt`}>
        <p className="rt-concept-full-footer-tag">{concept.footer.tagline}</p>
        <a className="rt-concept-full-footer-phone" href={`tel:${concept.footer.phone.replace(/[^0-9+]/g, "")}`}>
          {concept.footer.phone}
        </a>
      </footer>
    </section>
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
