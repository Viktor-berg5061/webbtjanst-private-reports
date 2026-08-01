import type { CSSProperties, ReactElement } from "react";

import type {
  ConceptPreview as ConceptData,
  EvidenceLedgerEntry,
  OfferComponent,
  OfferPrice,
  PersonalReportV2Content,
  Visualization,
} from "../../convex/reportContract";
import {
  displayClassificationLabel,
  displayConceptLayoutLabel,
  displayCopy,
  displayServiceName,
  displayVisualizationLabel,
} from "../../convex/reportContract";

import { ReportHero } from "./ReportHero";

function EvidenceBadge({ classification }: { classification: string }): ReactElement {
  return <span className="rt-badge">{displayClassificationLabel(classification)}</span>;
}

function EvidenceRefs({ ids }: { ids: string[] }): ReactElement {
  return <p className="rt-evidence-ref">Underlag: {ids.length > 0 ? ids.map((id) => <code key={id}>{id}</code>) : "inget explicit underlag angivet"}</p>;
}

function EvidenceLedger({ entries }: { entries: EvidenceLedgerEntry[] }): ReactElement {
  return (
    <section className="rt-section" aria-labelledby="rt-evidence">
      <header className="rt-section-head"><div><p className="rt-section-eyebrow">Evidens</p><h2 className="rt-section-title" id="rt-evidence">Vad uppgifterna bygger på</h2></div><p className="rt-section-aside">Källor och antaganden hålls synliga.</p></header>
      <ol className="rt-evidence-list">
        {entries.map((entry) => (
          <li className="rt-evidence-item" key={entry.id}>
            <div className="rt-evidence-head"><code>{entry.id}</code><EvidenceBadge classification={entry.classification} /></div>
            <h3>{displayCopy(entry.claim)}</h3>
            <p>{displayCopy(entry.explanation)}</p>
            <p className="rt-evidence-source">{displayCopy(entry.sourceLabel)}{entry.asOf ? ` · ${displayCopy(entry.asOf)}` : ""}{entry.sourceUrl ? ` · ${entry.sourceUrl}` : ""}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Situation({ content }: { content: PersonalReportV2Content }): ReactElement {
  return (
    <section className="rt-section" aria-labelledby="rt-situation">
      <div className="rt-situation"><div><p className="rt-eyebrow">Nuläge</p><h2 className="rt-situation-headline" id="rt-situation">{displayCopy(content.currentSituation.summary)}</h2><div className="rt-v2-stack">
        {content.currentSituation.gaps.map((gap) => <article className="rt-card rt-gap" key={gap.title}><h3>{displayCopy(gap.title)}</h3><p>{displayCopy(gap.description)}</p><EvidenceRefs ids={gap.evidenceIds} /></article>)}
      </div></div></div>
    </section>
  );
}

function Opportunities({ content }: { content: PersonalReportV2Content }): ReactElement | null {
  if (content.opportunities.length === 0) return null;
  return (
    <section className="rt-section" aria-labelledby="rt-opportunities">
      <header className="rt-section-head"><div><p className="rt-section-eyebrow">Möjligheter</p><h2 className="rt-section-title" id="rt-opportunities">Vad som kan förbättras</h2></div></header>
      <div className="rt-v2-grid">{content.opportunities.map((opportunity) => <article className="rt-card" key={opportunity.title}><h3>{displayCopy(opportunity.title)}</h3><p><strong>Så fungerar det:</strong> {displayCopy(opportunity.mechanism)}</p><p><strong>Potentiell effekt:</strong> {displayCopy(opportunity.potentialImpact)}</p><p><strong>Rekommenderad åtgärd:</strong> {displayCopy(opportunity.recommendedAction)}</p><EvidenceRefs ids={opportunity.evidenceIds} /></article>)}</div>
    </section>
  );
}

function VisualizationCard({ visualization }: { visualization: Visualization }): ReactElement {
  const numericValues = visualization.data.flatMap((datum) => datum.value === undefined ? [] : [datum.value]);
  const max = Math.max(...numericValues, 1);
  return (
    <article className="rt-card rt-visualization">
      <div className="rt-visual-head"><div><h3>{displayCopy(visualization.title)}</h3><p>{displayCopy(visualization.description)}</p></div><span className="rt-badge">{displayVisualizationLabel(visualization.type)}</span></div>
      <ul className="rt-visual-list">{visualization.data.map((datum) => <li className="rt-visual-row" key={datum.label}><span>{displayCopy(datum.label)}</span><span className="rt-visual-value">{displayCopy(datum.displayValue)} <EvidenceBadge classification={datum.kind} /></span>{visualization.type === "bar" && datum.value !== undefined ? <span className="rt-visual-bar"><span style={{ width: `${Math.max(0, Math.min(100, datum.value / max * 100))}%` }} /></span> : null}</li>)}</ul>
      <EvidenceRefs ids={visualization.evidenceIds} />
    </article>
  );
}

function Visualizations({ content }: { content: PersonalReportV2Content }): ReactElement | null {
  if (content.visualizations.length === 0) return null;
  return <section className="rt-section" aria-labelledby="rt-visualizations"><header className="rt-section-head"><div><p className="rt-section-eyebrow">Visualiseringar</p><h2 className="rt-section-title" id="rt-visualizations">Mönster utan påhittade marknadstal</h2></div></header><div className="rt-v2-grid">{content.visualizations.map((visualization) => <VisualizationCard key={visualization.title} visualization={visualization} />)}</div></section>;
}

function Journey({ content }: { content: PersonalReportV2Content }): ReactElement | null {
  if (content.customerJourney.length === 0) return null;
  return <section className="rt-section" aria-labelledby="rt-journey"><header className="rt-section-head"><div><p className="rt-section-eyebrow">Kundresa</p><h2 className="rt-section-title" id="rt-journey">Från nuläge till nästa steg</h2></div></header><div className="rt-journey">{content.customerJourney.map((stage, index) => <article className="rt-journey-step" key={stage.stage}><span className="rt-flow-num">Steg {index + 1}</span><h3>{displayCopy(stage.stage)}</h3><p><strong>Idag:</strong> {displayCopy(stage.currentExperience)}</p><p><strong>Möjligt läge:</strong> {displayCopy(stage.futureExperience)}</p><EvidenceRefs ids={stage.evidenceIds} /></article>)}</div></section>;
}

function isHex(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

function ConceptCard({ concept, index }: { concept: ConceptData; index: number }): ReactElement {
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
  return (
    <details className="rt-concept" style={style} open={index === 0}>
      <summary className="rt-concept-summary"><span className="rt-concept-tag">Koncept {index + 1}</span><h3 className="rt-concept-name">{name}</h3><span className="rt-concept-direction">{displayCopy(concept.artDirection)}</span><p className="rt-concept-blurb">{displayCopy(concept.rationale)}</p></summary>
      <div className="rt-concept-body"><div className="rt-concept-preview"><div className="rt-preview-devices"><div className="rt-preview-browser" aria-label={`Webbvy för ${name}`}><div className="rt-preview-browser-bar"><span className="rt-preview-dots" aria-hidden="true"><i /><i /><i /></span><span className="rt-preview-address">{navigation}</span></div><div className="rt-preview-site"><header className="rt-preview-nav"><strong>{name}</strong><span>{navigation}</span></header><div className="rt-preview-hero"><p className="rt-concept-eyebrow">{displayCopy(concept.hero.eyebrow)}</p><h4>{displayCopy(concept.hero.headline)}</h4><p>{displayCopy(concept.hero.subheadline)}</p><div className="rt-concept-actions"><span>{displayCopy(concept.hero.primaryCta)}</span><span>{displayCopy(concept.hero.secondaryCta)}</span></div></div><div className="rt-preview-sections">{previewSections}</div></div></div><div className="rt-preview-mobile" aria-label={`Mobilvy för ${name}`}><div className="rt-preview-mobile-bar"><span>{navigation}</span><span aria-hidden="true">☰</span></div><div className="rt-preview-mobile-screen"><p className="rt-concept-eyebrow">{displayCopy(concept.hero.eyebrow)}</p><h4>{displayCopy(concept.hero.headline)}</h4><p>{displayCopy(concept.hero.subheadline)}</p><span className="rt-preview-mobile-action">{displayCopy(concept.mobile.primaryAction)}</span>{concept.proofItems.slice(0, 2).map((proof) => <div className="rt-preview-mobile-proof" key={proof.label}><strong>{displayCopy(proof.value)}</strong><span>{displayCopy(proof.label)}</span></div>)}</div></div></div><div className="rt-concept-proofs">{concept.proofItems.map((proof) => <div key={proof.label}><strong>{displayCopy(proof.value)}</strong><span>{displayCopy(proof.label)}</span><EvidenceRefs ids={proof.evidenceIds} /></div>)}</div></div><div className="rt-concept-copy"><p><strong>Mobil:</strong> {navigation} · {displayCopy(concept.mobile.primaryAction)}</p>{concept.sections.map((section) => <article key={section.heading}><h4>{displayCopy(section.heading)}</h4><p>{displayCopy(section.body)}</p><span className="rt-badge">{displayConceptLayoutLabel(section.layout)}</span></article>)}<h4>Avvägningar</h4><ul>{concept.tradeoffs.map((tradeoff) => <li key={tradeoff}>{displayCopy(tradeoff)}</li>)}</ul></div></div>
    </details>
  );
}

function Concepts({ content }: { content: PersonalReportV2Content }): ReactElement {
  return <section className="rt-section" aria-labelledby="rt-concepts"><header className="rt-section-head"><div><p className="rt-section-eyebrow">Koncept</p><h2 className="rt-section-title" id="rt-concepts">Tre öppningsbara riktningar</h2></div><p className="rt-section-aside">Strukturerade förslag från analysagenten.</p></header><div className="rt-concepts">{content.conceptPreviews.map((concept, index) => <ConceptCard concept={concept} index={index} key={concept.id} />)}</div></section>;
}

function Price({ price }: { price: OfferPrice | null }): ReactElement { return <>{price ? displayCopy(price.display) : "Inte angivet"}</>; }

function OfferComponentCard({ component, label }: { component: OfferComponent; label: string }): ReactElement {
  return <article className="rt-offer-component"><header><p className="rt-eyebrow">{displayCopy(label)}</p><h3>{displayServiceName(component.service)} · {displayCopy(component.tier)}</h3></header><dl className="rt-tier-rows"><div className="rt-tier-row"><dt>Engångspris</dt><dd><Price price={component.oneTimePrice} /></dd></div><div className="rt-tier-row"><dt>Månadspris</dt><dd><Price price={component.monthlyPrice} /></dd></div></dl><ul className="rt-needs">{component.includedItems.map((item) => <li className="rt-need" key={item}><span className="rt-need-check">✓</span><span className="rt-need-body">{displayCopy(item)}</span></li>)}</ul></article>;
}

function Offer({ content }: { content: PersonalReportV2Content }): ReactElement {
  const offer = content.recommendedOffer;
  return <section className="rt-section" aria-labelledby="rt-offer"><header className="rt-section-head"><div><p className="rt-section-eyebrow">Rekommenderat erbjudande</p><h2 className="rt-section-title" id="rt-offer">Datadrivet upplägg för just detta underlag</h2></div></header><div className="rt-card rt-offer"><p className="rt-reco-summary">{displayCopy(offer.rationale)}</p><div className="rt-v2-grid">{offer.components.map((component) => <OfferComponentCard component={component} label="Rekommenderad komponent" key={`${component.service}-${component.tier}`} />)}</div><div className="rt-offer-totals"><div><span>Engångstotal</span><strong><Price price={offer.oneTimeTotal} /></strong></div><div><span>Återkommande per månad</span><strong><Price price={offer.recurringMonthlyTotal} /></strong></div></div>{offer.assumptions.length > 0 ? <div className="rt-assumptions"><h3>Antaganden</h3><ul>{offer.assumptions.map((assumption) => <li key={assumption.text}><EvidenceBadge classification={assumption.classification} /><span>{displayCopy(assumption.text)}</span><EvidenceRefs ids={assumption.evidenceIds} /></li>)}</ul></div> : null}{offer.optionalAddOns.length > 0 ? <details className="rt-offer-details"><summary>Valfria tillägg ({offer.optionalAddOns.length})</summary>{offer.optionalAddOns.map((component) => <OfferComponentCard component={component} label="Valfritt tillägg" key={`${component.service}-${component.tier}`} />)}</details> : null}{offer.alternatives.length > 0 ? <details className="rt-offer-details"><summary>Alternativ ({offer.alternatives.length})</summary>{offer.alternatives.map((alternative) => <div key={`${alternative.service}-${alternative.tier}`}><OfferComponentCard component={alternative} label="Alternativ" /><p>{displayCopy(alternative.rationale)}</p></div>)}</details> : null}</div></section>;
}

function StringList({ id, eyebrow, title, items }: { id: string; eyebrow: string; title: string; items: string[] }): ReactElement | null {
  if (items.length === 0) return null;
  return <section className="rt-section" aria-labelledby={id}><header className="rt-section-head"><div><p className="rt-section-eyebrow">{displayCopy(eyebrow)}</p><h2 className="rt-section-title" id={id}>{displayCopy(title)}</h2></div></header><ul className="rt-needs">{items.map((item) => <li className="rt-need" key={item}><span className="rt-need-check">✓</span><span className="rt-need-body">{displayCopy(item)}</span></li>)}</ul></section>;
}

export function V2Report({ content }: { content: PersonalReportV2Content }): ReactElement {
  return <>
    <ReportHero companyName={displayCopy(content.companyProfile.companyName)} contactName={content.companyProfile.contactName ? displayCopy(content.companyProfile.contactName) : undefined} title={`${displayCopy(content.companyProfile.companyName)} · personlig analys`} introduction={`${displayCopy(content.companyProfile.industry)} i ${displayCopy(content.companyProfile.location)}. Målgrupp: ${displayCopy(content.companyProfile.audience)}.`} highlights={content.companyProfile.brandTraits.map(displayCopy)} />
    <Situation content={content} />
    <EvidenceLedger entries={content.evidenceLedger} />
    <Opportunities content={content} />
    <Visualizations content={content} />
    <Journey content={content} />
    <Concepts content={content} />
    <Offer content={content} />
    <StringList id="rt-steps" eyebrow="Nästa steg" title="Så kan arbetet gå vidare" items={content.nextSteps} />
    <StringList id="rt-needs" eyebrow="Underlag" title="Vad vi behöver från er" items={content.neededFromCustomer} />
    <p className="rt-disclaimer">{displayCopy(content.disclaimer)}</p>
  </>;
}
