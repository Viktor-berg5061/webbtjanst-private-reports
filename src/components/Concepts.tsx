import type { CSSProperties, ReactElement } from "react";

import type { ConceptPreview as ConceptData } from "../../convex/reportContract";
import { displayConceptLayoutLabel, displayCopy } from "../../convex/reportContract";

export type ConceptPayload = ConceptData;

function isHex(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

export function ConceptPreview({ concept, index }: { concept: ConceptData; index: number }): ReactElement {
  const style = {
    "--rt-concept-bg": isHex(concept.palette.background) ? concept.palette.background : "#f7f1e6",
    "--rt-concept-surface": isHex(concept.palette.surface) ? concept.palette.surface : "#ffffff",
    "--rt-concept-text": isHex(concept.palette.text) ? concept.palette.text : "#2a261e",
    "--rt-concept-accent": isHex(concept.palette.accent) ? concept.palette.accent : "#8c5a1e",
    "--rt-concept-muted": isHex(concept.palette.muted) ? concept.palette.muted : "#6b6258",
    "--rt-concept-on-accent": isHex(concept.palette.onAccent) ? concept.palette.onAccent : "#ffffff",
  } as CSSProperties;
  const name = displayCopy(concept.name);
  const navigation = displayCopy(concept.mobile.navigation);
  const previewSections = concept.sections.map((section, sectionIndex) => <article className="rt-preview-section" key={section.heading}><span className="rt-preview-kicker">{String(sectionIndex + 1).padStart(2, "0")} · {displayConceptLayoutLabel(section.layout)}</span><h5>{displayCopy(section.heading)}</h5><p>{displayCopy(section.body)}</p></article>);
  return <details className="rt-concept" style={style} open={index === 0}><summary className="rt-concept-summary"><span className="rt-concept-tag">Koncept {index + 1}</span><h3 className="rt-concept-name">{name}</h3><span className="rt-concept-direction">{displayCopy(concept.artDirection)}</span><p className="rt-concept-blurb">{displayCopy(concept.rationale)}</p></summary><div className="rt-concept-body"><div className="rt-concept-preview"><div className="rt-preview-devices"><div className="rt-preview-browser" aria-label={`Webbvy för ${name}`}><div className="rt-preview-browser-bar"><span className="rt-preview-dots" aria-hidden="true"><i /><i /><i /></span><span className="rt-preview-address">{navigation}</span></div><div className="rt-preview-site"><header className="rt-preview-nav"><strong>{name}</strong><span>{navigation}</span></header><div className="rt-preview-hero"><p className="rt-concept-eyebrow">{displayCopy(concept.hero.eyebrow)}</p><h4>{displayCopy(concept.hero.headline)}</h4><p>{displayCopy(concept.hero.subheadline)}</p><div className="rt-concept-actions"><span>{displayCopy(concept.hero.primaryCta)}</span><span>{displayCopy(concept.hero.secondaryCta)}</span></div></div><div className="rt-preview-sections">{previewSections}</div></div></div><div className="rt-preview-mobile" aria-label={`Mobilvy för ${name}`}><div className="rt-preview-mobile-bar"><span>{navigation}</span><span aria-hidden="true">☰</span></div><div className="rt-preview-mobile-screen"><p className="rt-concept-eyebrow">{displayCopy(concept.hero.eyebrow)}</p><h4>{displayCopy(concept.hero.headline)}</h4><p>{displayCopy(concept.hero.subheadline)}</p><span className="rt-preview-mobile-action">{displayCopy(concept.mobile.primaryAction)}</span>{concept.proofItems.slice(0, 2).map((proof) => <div className="rt-preview-mobile-proof" key={proof.label}><strong>{displayCopy(proof.value)}</strong><span>{displayCopy(proof.label)}</span></div>)}</div></div></div><div className="rt-concept-proofs">{concept.proofItems.map((proof) => <div key={proof.label}><strong>{displayCopy(proof.value)}</strong><span>{displayCopy(proof.label)}</span></div>)}</div></div><div className="rt-concept-copy"><p><strong>Mobil:</strong> {navigation} · {displayCopy(concept.mobile.primaryAction)}</p>{concept.sections.map((section) => <article key={section.heading}><h4>{displayCopy(section.heading)}</h4><p>{displayCopy(section.body)}</p><span className="rt-badge">{displayConceptLayoutLabel(section.layout)}</span></article>)}<h4>Avvägningar</h4><ul>{concept.tradeoffs.map((tradeoff) => <li key={tradeoff}>{displayCopy(tradeoff)}</li>)}</ul></div></div></details>;
}

export function resolveConcepts(input?: ConceptData[]): ConceptData[] {
  return input?.slice(0, 3) ?? [];
}
