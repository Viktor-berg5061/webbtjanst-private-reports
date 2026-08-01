import type { CSSProperties, ReactElement } from "react";

import type { ConceptPreview as ConceptData } from "../../convex/reportContract";

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
  return <details className="rt-concept" style={style} open={index === 0}><summary className="rt-concept-summary"><span className="rt-concept-tag">Koncept {index + 1}</span><h3 className="rt-concept-name">{concept.name}</h3><span className="rt-concept-direction">{concept.artDirection}</span><p className="rt-concept-blurb">{concept.rationale}</p></summary><div className="rt-concept-body"><div className="rt-concept-preview"><p className="rt-concept-eyebrow">{concept.hero.eyebrow}</p><h4>{concept.hero.headline}</h4><p>{concept.hero.subheadline}</p><div className="rt-concept-actions"><span>{concept.hero.primaryCta}</span><span>{concept.hero.secondaryCta}</span></div></div><div className="rt-concept-copy">{concept.sections.map((section) => <article key={section.heading}><h4>{section.heading}</h4><p>{section.body}</p><span className="rt-badge">{section.layout}</span></article>)}</div></div></details>;
}

export function resolveConcepts(input?: ConceptData[]): ConceptData[] {
  return input?.slice(0, 3) ?? [];
}
