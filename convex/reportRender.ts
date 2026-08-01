/** Pure, CSP-safe HTML renderer for legacy and personal_report_v2 content. */

import { baseReportCss, REPORT_CSS_GUARD } from "./reportCss.ts";
import {
  displayClassificationLabel,
  displayConceptLayoutLabel,
  displayCopy,
  displayServiceName,
  displayVisualizationLabel,
  isPersonalReportV2Content,
} from "./reportContract.ts";
import type {
  ConceptPreview,
  EvidenceLedgerEntry,
  LegacyPricingTier,
  LegacyReportContent,
  OfferComponent,
  OfferPrice,
  PersonalReportV2Content,
  ReportContent,
  Visualization,
} from "./reportContract";

export type { ReportContent } from "./reportContract";

export const PUBLIC_SITE = "https://www.webbtjanst.com";
const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  })[character] ?? character);
}

function safeColor(value: unknown, fallback: string): string {
  return typeof value === "string" && HEX_COLOR.test(value) ? value : fallback;
}

function customerCopy(value: string): string {
  return escapeHtml(displayCopy(value));
}

function iconCheck(): string {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`;
}

function iconMinus(): string {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
}

function iconGlobe(): string {
  return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><line x1="3" y1="12" x2="21" y2="12"/><path d="M12 3a14 14 0 0 0 0 18a14 14 0 0 0 0-18"/></svg>`;
}

function iconPhone(): string {
  return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2a19.79 19.79 0 0 1-8.63-3.07a19.5 19.5 0 0 1-6-6a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72a12.84 12.84 0 0 0 .7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45a12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;
}

function badge(label: string): string {
  return `<span class="rt-badge">${escapeHtml(label)}</span>`;
}

function evidenceRefs(ids: string[]): string {
  return ids.length > 0
    ? `<p class="rt-evidence-ref">Underlag: ${ids.map((id) => `<code>${escapeHtml(id)}</code>`).join(" ")}</p>`
    : `<p class="rt-evidence-ref">Underlag: inget explicit underlag angivet</p>`;
}

function renderHero(title: string, companyName: string, contactName: string | undefined, introduction: string, highlights: string[] = []): string {
  const highlightHtml = highlights.length > 0
    ? `<ul class="rt-hero-highlights" aria-label="Sammanfattande punkter">${highlights.map((item) => `<li class="rt-hero-highlight">${iconCheck()}<span>${customerCopy(item)}</span></li>`).join("")}</ul>`
    : "";
  return `<article class="rt-hero"><div class="rt-hero-grid"><div><p class="rt-eyebrow">För ${customerCopy(companyName)}</p><h1 class="rt-title">${customerCopy(title)}</h1><p class="rt-meta">${contactName ? `Upplagd för <strong>${customerCopy(contactName)}</strong> · ` : ""}Sammanställd efter vårt samtal</p><p class="rt-intro">${customerCopy(introduction)}</p></div>${highlightHtml ? `<aside class="rt-hero-aside" aria-label="Sammanfattning i korthet"><h3>I korthet</h3>${highlightHtml}</aside>` : ""}</div></article>`;
}

function renderLegacyRecommendation(recommendation: LegacyReportContent["recommendation"]): string {
  return `<section class="rt-section" aria-labelledby="rt-reco"><header class="rt-section-head"><div><p class="rt-section-eyebrow">Rekommendation</p><h2 class="rt-section-title" id="rt-reco">Förslag utifrån underlaget</h2></div></header><div class="rt-card" style="padding:0"><div style="padding:clamp(24px,4vw,36px)"><p class="rt-reco-summary">${customerCopy(recommendation.summary)}</p></div><div class="rt-features" style="padding:0 clamp(24px,4vw,36px) clamp(24px,4vw,36px)"><article class="rt-feature">${iconGlobe()}<h3>Webbplats</h3><p>${customerCopy(recommendation.website)}</p></article><article class="rt-feature">${iconPhone()}<h3>AI-receptionist</h3><p>${customerCopy(recommendation.receptionist)}</p></article><article class="rt-feature"><span class="rt-feature-icon" aria-hidden="true">${iconCheck()}</span><h3>Prisbild</h3><p>${customerCopy(recommendation.pricing)}</p></article></div></div></section>`;
}

function renderListSection(id: string, eyebrow: string, title: string, items: string[]): string {
  if (items.length === 0) return "";
  return `<section class="rt-section" aria-labelledby="${id}"><header class="rt-section-head"><div><p class="rt-section-eyebrow">${customerCopy(eyebrow)}</p><h2 class="rt-section-title" id="${id}">${customerCopy(title)}</h2></div></header><ul class="rt-needs">${items.map((item) => `<li class="rt-need"><span class="rt-need-check" aria-hidden="true">${iconCheck()}</span><p class="rt-need-body">${customerCopy(item)}</p></li>`).join("")}</ul></section>`;
}

function renderLegacyPricing(overview: { tiers: LegacyPricingTier[]; vatNote: string } | undefined): string {
  if (!overview || overview.tiers.length === 0) return "";
  return `<section class="rt-section" aria-labelledby="rt-pricing"><div class="rt-pricing"><header class="rt-pricing-head"><p class="rt-eyebrow">Prisbild</p><h3 id="rt-pricing-title" class="rt-pricing-title">Tillgängliga nivåer</h3><p class="rt-pricing-vat">${customerCopy(overview.vatNote)}</p></header><div class="rt-tier-grid">${overview.tiers.map((tier) => renderLegacyTier(tier)).join("")}</div></div></section>`;
}

function renderLegacyTier(tier: LegacyPricingTier): string {
  return `<article class="rt-tier" data-recommended="${tier.recommended ? "true" : "false"}"><header class="rt-tier-head"><div><h4 class="rt-tier-name">${customerCopy(tier.name)}</h4><p class="rt-tier-tagline">${customerCopy(tier.tagline)}</p></div>${tier.recommended ? badge("Rekommenderad nivå") : ""}</header><dl class="rt-tier-rows"><div class="rt-tier-row"><dt>Webbplats / setup</dt><dd>${customerCopy(tier.website)}</dd></div><div class="rt-tier-row"><dt>AI-receptionist</dt><dd>${customerCopy(tier.receptionist)}</dd></div><div class="rt-tier-row"><dt>Extra minut</dt><dd>${customerCopy(tier.extraMinutes)}</dd></div>${tier.maintenance ? `<div class="rt-tier-row"><dt>Underhåll</dt><dd>${customerCopy(tier.maintenance)}</dd></div>` : ""}</dl>${tier.notes ? `<p class="rt-tier-notes">${customerCopy(tier.notes)}</p>` : ""}</article>`;
}

function renderEvidenceLedger(entries: EvidenceLedgerEntry[]): string {
  return `<section class="rt-section" aria-labelledby="rt-evidence"><header class="rt-section-head"><div><p class="rt-section-eyebrow">Evidens</p><h2 class="rt-section-title" id="rt-evidence">Vad uppgifterna bygger på</h2></div><p class="rt-section-aside">Källor och antaganden hålls synliga.</p></header><ol class="rt-evidence-list">${entries.map((entry) => `<li class="rt-evidence-item"><div class="rt-evidence-head"><code>${escapeHtml(entry.id)}</code>${badge(displayClassificationLabel(entry.classification))}</div><h3>${customerCopy(entry.claim)}</h3><p>${customerCopy(entry.explanation)}</p><p class="rt-evidence-source">${customerCopy(entry.sourceLabel)}${entry.asOf ? ` · ${customerCopy(entry.asOf)}` : ""}${entry.sourceUrl ? ` · ${escapeHtml(entry.sourceUrl)}` : ""}</p></li>`).join("")}</ol></section>`;
}

function renderSituationV2(content: PersonalReportV2Content): string {
  return `<section class="rt-section" aria-labelledby="rt-situation"><div class="rt-situation"><div><p class="rt-eyebrow">Nuläge</p><h2 class="rt-situation-headline" id="rt-situation">${customerCopy(content.currentSituation.summary)}</h2><div class="rt-v2-stack">${content.currentSituation.gaps.map((gap) => `<article class="rt-card rt-gap"><h3>${customerCopy(gap.title)}</h3><p>${customerCopy(gap.description)}</p>${evidenceRefs(gap.evidenceIds)}</article>`).join("")}</div></div></div></section>`;
}

function renderOpportunities(content: PersonalReportV2Content): string {
  if (content.opportunities.length === 0) return "";
  return `<section class="rt-section" aria-labelledby="rt-opportunities"><header class="rt-section-head"><div><p class="rt-section-eyebrow">Möjligheter</p><h2 class="rt-section-title" id="rt-opportunities">Vad som kan förbättras</h2></div></header><div class="rt-v2-grid">${content.opportunities.map((opportunity) => `<article class="rt-card"><h3>${customerCopy(opportunity.title)}</h3><p><strong>Så fungerar det:</strong> ${customerCopy(opportunity.mechanism)}</p><p><strong>Potentiell effekt:</strong> ${customerCopy(opportunity.potentialImpact)}</p><p><strong>Rekommenderad åtgärd:</strong> ${customerCopy(opportunity.recommendedAction)}</p>${evidenceRefs(opportunity.evidenceIds)}</article>`).join("")}</div></section>`;
}

function renderVisualization(visualization: Visualization): string {
  const numericValues = visualization.data.flatMap((datum) => datum.value === undefined ? [] : [datum.value]);
  const max = numericValues.length > 0 ? Math.max(...numericValues, 1) : 1;
  const data = visualization.data.map((datum) => {
    const bar = visualization.type === "bar" && datum.value !== undefined
      ? `<span class="rt-visual-bar"><span style="width:${Math.max(0, Math.min(100, datum.value / max * 100))}%"></span></span>`
      : "";
    return `<li class="rt-visual-row"><span>${customerCopy(datum.label)}</span><span class="rt-visual-value">${customerCopy(datum.displayValue)} ${badge(displayClassificationLabel(datum.kind))}</span>${bar}</li>`;
  }).join("");
  return `<article class="rt-card rt-visualization"><div class="rt-visual-head"><div><h3>${customerCopy(visualization.title)}</h3><p>${customerCopy(visualization.description)}</p></div>${badge(displayVisualizationLabel(visualization.type))}</div><ul class="rt-visual-list">${data}</ul>${evidenceRefs(visualization.evidenceIds)}</article>`;
}

function renderVisualizations(content: PersonalReportV2Content): string {
  if (content.visualizations.length === 0) return "";
  return `<section class="rt-section" aria-labelledby="rt-visualizations"><header class="rt-section-head"><div><p class="rt-section-eyebrow">Visualiseringar</p><h2 class="rt-section-title" id="rt-visualizations">Mönster utan påhittade marknadstal</h2></div></header><div class="rt-v2-grid">${content.visualizations.map(renderVisualization).join("")}</div></section>`;
}

function renderJourney(content: PersonalReportV2Content): string {
  if (content.customerJourney.length === 0) return "";
  return `<section class="rt-section" aria-labelledby="rt-journey"><header class="rt-section-head"><div><p class="rt-section-eyebrow">Kundresa</p><h2 class="rt-section-title" id="rt-journey">Från nuläge till nästa steg</h2></div></header><div class="rt-journey">${content.customerJourney.map((stage, index) => `<article class="rt-journey-step"><span class="rt-flow-num">Steg ${index + 1}</span><h3>${customerCopy(stage.stage)}</h3><div><p><strong>Idag:</strong> ${customerCopy(stage.currentExperience)}</p><p><strong>Möjligt läge:</strong> ${customerCopy(stage.futureExperience)}</p></div>${evidenceRefs(stage.evidenceIds)}</article>`).join("")}</div></section>`;
}

function renderConcept(concept: ConceptPreview, index: number): string {
  const background = safeColor(concept.palette.background, "#f7f1e6");
  const surface = safeColor(concept.palette.surface, "#ffffff");
  const text = safeColor(concept.palette.text, "#2a261e");
  const accent = safeColor(concept.palette.accent, "#8c5a1e");
  const muted = safeColor(concept.palette.muted, "#6b6258");
  const onAccent = safeColor(concept.palette.onAccent, "#ffffff");
  const name = customerCopy(concept.name);
  const navigation = customerCopy(concept.mobile.navigation);
  const sections = concept.sections.map((section, sectionIndex) => `<article class="rt-preview-section"><span class="rt-preview-kicker">${String(sectionIndex + 1).padStart(2, "0")} · ${customerCopy(displayConceptLayoutLabel(section.layout))}</span><h5>${customerCopy(section.heading)}</h5><p>${customerCopy(section.body)}</p></article>`).join("");
  const proofs = concept.proofItems.map((proof) => `<div><strong>${customerCopy(proof.value)}</strong><span>${customerCopy(proof.label)}</span>${evidenceRefs(proof.evidenceIds)}</div>`).join("");
  const browserPreview = `<div class="rt-preview-browser" aria-label="Webbvy för ${name}"><div class="rt-preview-browser-bar"><span class="rt-preview-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="rt-preview-address">${navigation}</span></div><div class="rt-preview-site"><header class="rt-preview-nav"><strong>${name}</strong><span>${navigation}</span></header><div class="rt-preview-hero"><p class="rt-concept-eyebrow">${customerCopy(concept.hero.eyebrow)}</p><h4>${customerCopy(concept.hero.headline)}</h4><p>${customerCopy(concept.hero.subheadline)}</p><div class="rt-concept-actions"><span>${customerCopy(concept.hero.primaryCta)}</span><span>${customerCopy(concept.hero.secondaryCta)}</span></div></div><div class="rt-preview-sections">${sections}</div></div></div>`;
  const mobilePreview = `<div class="rt-preview-mobile" aria-label="Mobilvy för ${name}"><div class="rt-preview-mobile-bar"><span>${navigation}</span><span aria-hidden="true">☰</span></div><div class="rt-preview-mobile-screen"><p class="rt-concept-eyebrow">${customerCopy(concept.hero.eyebrow)}</p><h4>${customerCopy(concept.hero.headline)}</h4><p>${customerCopy(concept.hero.subheadline)}</p><span class="rt-preview-mobile-action">${customerCopy(concept.mobile.primaryAction)}</span>${concept.proofItems.slice(0, 2).map((proof) => `<div class="rt-preview-mobile-proof"><strong>${customerCopy(proof.value)}</strong><span>${customerCopy(proof.label)}</span></div>`).join("")}</div></div>`;
  return `<details class="rt-concept" style="--rt-concept-bg:${background};--rt-concept-surface:${surface};--rt-concept-text:${text};--rt-concept-accent:${accent};--rt-concept-muted:${muted};--rt-concept-on-accent:${onAccent}"${index === 0 ? " open" : ""}><summary class="rt-concept-summary"><span class="rt-concept-tag">Koncept ${index + 1}</span><h3 class="rt-concept-name">${name}</h3><span class="rt-concept-direction">${customerCopy(concept.artDirection)}</span><p class="rt-concept-blurb">${customerCopy(concept.rationale)}</p></summary><div class="rt-concept-body"><div class="rt-concept-preview"><div class="rt-preview-devices">${browserPreview}${mobilePreview}</div><div class="rt-concept-proofs">${proofs}</div></div><div class="rt-concept-copy"><p><strong>Mobil:</strong> ${navigation} · ${customerCopy(concept.mobile.primaryAction)}</p>${concept.sections.map((section) => `<article><h4>${customerCopy(section.heading)}</h4><p>${customerCopy(section.body)}</p><span class="rt-badge">${customerCopy(displayConceptLayoutLabel(section.layout))}</span></article>`).join("")}<h4>Avvägningar</h4><ul>${concept.tradeoffs.map((tradeoff) => `<li>${customerCopy(tradeoff)}</li>`).join("")}</ul></div></div></details>`;
}

function renderConcepts(content: PersonalReportV2Content): string {
  return `<section class="rt-section" aria-labelledby="rt-concepts"><header class="rt-section-head"><div><p class="rt-section-eyebrow">Koncept</p><h2 class="rt-section-title" id="rt-concepts">Tre öppningsbara riktningar</h2></div><p class="rt-section-aside">Strukturerade förslag från analysagenten.</p></header><div class="rt-concepts">${content.conceptPreviews.map(renderConcept).join("")}</div></section>`;
}

function renderPrice(price: OfferPrice | null): string {
  return price ? customerCopy(price.display) : "Inte angivet";
}

function renderOfferComponent(component: OfferComponent, label: string): string {
  return `<article class="rt-offer-component"><header><span class="rt-eyebrow">${customerCopy(label)}</span><h3>${customerCopy(displayServiceName(component.service))} · ${customerCopy(component.tier)}</h3></header><dl class="rt-tier-rows"><div class="rt-tier-row"><dt>Engångspris</dt><dd>${renderPrice(component.oneTimePrice)}</dd></div><div class="rt-tier-row"><dt>Månadspris</dt><dd>${renderPrice(component.monthlyPrice)}</dd></div></dl><ul class="rt-needs">${component.includedItems.map((item) => `<li class="rt-need"><span class="rt-need-check">${iconCheck()}</span><span class="rt-need-body">${customerCopy(item)}</span></li>`).join("")}</ul></article>`;
}

function renderOffer(content: PersonalReportV2Content): string {
  const offer = content.recommendedOffer;
  return `<section class="rt-section" aria-labelledby="rt-offer"><header class="rt-section-head"><div><p class="rt-section-eyebrow">Rekommenderat erbjudande</p><h2 class="rt-section-title" id="rt-offer">Datadrivet upplägg för just detta underlag</h2></div></header><div class="rt-card rt-offer"><p class="rt-reco-summary">${customerCopy(offer.rationale)}</p><div class="rt-v2-grid">${offer.components.map((component) => renderOfferComponent(component, "Rekommenderad komponent")).join("")}</div><div class="rt-offer-totals"><div><span>Engångstotal</span><strong>${renderPrice(offer.oneTimeTotal)}</strong></div><div><span>Återkommande per månad</span><strong>${renderPrice(offer.recurringMonthlyTotal)}</strong></div></div>${offer.assumptions.length > 0 ? `<div class="rt-assumptions"><h3>Antaganden</h3><ul>${offer.assumptions.map((assumption) => `<li>${badge(displayClassificationLabel(assumption.classification))}<span>${customerCopy(assumption.text)}</span>${evidenceRefs(assumption.evidenceIds)}</li>`).join("")}</ul></div>` : ""}${offer.optionalAddOns.length > 0 ? `<details class="rt-offer-details"><summary>Valfria tillägg (${offer.optionalAddOns.length})</summary>${offer.optionalAddOns.map((component) => renderOfferComponent(component, "Valfritt tillägg")).join("")}</details>` : ""}${offer.alternatives.length > 0 ? `<details class="rt-offer-details"><summary>Alternativ (${offer.alternatives.length})</summary>${offer.alternatives.map((alternative) => `${renderOfferComponent(alternative, "Alternativ")}<p>${customerCopy(alternative.rationale)}</p>`).join("")}</details>` : ""}</div></section>`;
}

function renderV2(content: PersonalReportV2Content): string {
  const title = `${content.companyProfile.companyName} · personlig analys`;
  const introduction = `${content.companyProfile.industry} i ${content.companyProfile.location}. Målgrupp: ${content.companyProfile.audience}.`;
  return `${renderHero(title, content.companyProfile.companyName, content.companyProfile.contactName, introduction, content.companyProfile.brandTraits)}${renderSituationV2(content)}${renderEvidenceLedger(content.evidenceLedger)}${renderOpportunities(content)}${renderVisualizations(content)}${renderJourney(content)}${renderConcepts(content)}${renderOffer(content)}${renderListSection("rt-steps", "Nästa steg", "Så kan arbetet gå vidare", content.nextSteps)}${renderListSection("rt-needs", "Underlag", "Vad vi behöver från er", content.neededFromCustomer)}<p class="rt-disclaimer">${customerCopy(content.disclaimer)}</p>`;
}

function renderLegacy(content: LegacyReportContent): string {
  const title = content.title;
  const body = `${renderHero(title, content.companyName, content.contactName, content.introduction, content.highlights ?? [])}${content.situation ? `<section class="rt-section" aria-labelledby="rt-situation"><div class="rt-situation"><div><p class="rt-eyebrow">Nuläge</p><h2 class="rt-situation-headline" id="rt-situation">${customerCopy(content.situation.headline)}</h2><p class="rt-situation-body">${customerCopy(content.situation.body)}</p></div></div></section>` : ""}${content.observations.length > 0 ? `<section class="rt-section" aria-labelledby="rt-obs"><header class="rt-section-head"><div><p class="rt-section-eyebrow">Observationer</p><h2 class="rt-section-title" id="rt-obs">Det vi tar med oss</h2></div></header><ol class="rt-observations">${content.observations.map((item, index) => `<li class="rt-observation"><span class="rt-observation-num"><span>Observation</span><strong>${String(index + 1).padStart(2, "0")}</strong></span><p class="rt-observation-body">${customerCopy(item)}</p></li>`).join("")}</ol></section>` : ""}${content.comparison ? `<section class="rt-section" aria-labelledby="rt-cmp"><header class="rt-section-head"><div><p class="rt-section-eyebrow">Jämförelse</p><h2 class="rt-section-title" id="rt-cmp">Före och efter</h2></div></header><div class="rt-comparison"><article class="rt-comparison-card" data-side="before"><span class="rt-comparison-label">${iconMinus()} Idag</span><ul class="rt-comparison-list">${content.comparison.before.map((item) => `<li class="rt-comparison-item">${iconMinus()}<span>${customerCopy(item)}</span></li>`).join("")}</ul></article><article class="rt-comparison-card" data-side="after"><span class="rt-comparison-label">${iconCheck()} Med Webbtjänst</span><ul class="rt-comparison-list">${content.comparison.after.map((item) => `<li class="rt-comparison-item">${iconCheck()}<span>${customerCopy(item)}</span></li>`).join("")}</ul></article></div></section>` : ""}${renderLegacyRecommendation(content.recommendation)}${content.valueFlow && content.valueFlow.length > 0 ? `<section class="rt-section" aria-labelledby="rt-flow"><div class="rt-flow"><p class="rt-eyebrow">Flöde</p><h3 class="rt-section-title" id="rt-flow">Så hänger det ihop</h3><div class="rt-flow-track">${content.valueFlow.map((stage, index) => `<div class="rt-flow-step"><span class="rt-flow-num">Steg ${index + 1}</span><span class="rt-flow-stage">${customerCopy(stage.stage)}</span><p class="rt-flow-desc">${customerCopy(stage.description)}</p></div>`).join("")}</div></div></section>` : ""}${renderLegacyPricing(content.pricingOverview)}${renderListSection("rt-legacy-steps", "Nästa steg", "Så går det till", content.nextSteps)}${renderListSection("rt-legacy-needs", "Underlag", "Vad vi behöver från er", content.neededFromCustomer)}${content.disclaimer ? `<p class="rt-disclaimer">${customerCopy(content.disclaimer)}</p>` : ""}`;
  return body;
}

export function renderReportHtml(content: ReportContent): string {
  const accent = "schemaVersion" in content ? safeColor(content.theme.accent, "#b5631a") : safeColor(content.theme?.accent, "#b5631a");
  const main = isPersonalReportV2Content(content) ? renderV2(content) : renderLegacy(content);
  return `<!doctype html><html lang="sv"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><meta name="color-scheme" content="light dark"><title>${customerCopy("schemaVersion" in content ? `${content.companyProfile.companyName} · personlig analys` : content.title)} | Webbtjänst</title><style>${baseReportCss(accent)}\n/* guard:${REPORT_CSS_GUARD} */</style></head><body><main class="shell"><header class="rt-header"><a class="rt-brand" href="${PUBLIC_SITE}" rel="noopener"><span class="rt-brand-mark" aria-hidden="true">W</span><span>Webbtjänst</span></a><span class="rt-tag"><span class="rt-tag-dot" aria-hidden="true"></span>Personlig sammanställning</span></header>${main}<footer class="rt-footer"><span>Webbtjänst · personlig sammanställning</span><a href="${PUBLIC_SITE}" rel="noopener">Läs mer om Webbtjänst →</a></footer></main></body></html>`;
}

export function renderNotFoundHtml(): string {
  return `<!doctype html><html lang="sv"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><title>Sidan kan inte visas | Webbtjänst</title><style>${baseReportCss("#b5631a")}</style></head><body><main class="shell"><header class="rt-header"><span class="rt-brand"><span class="rt-brand-mark">W</span><span>Webbtjänst</span></span><span class="rt-tag"><span class="rt-tag-dot"></span>Länken kunde inte visas</span></header><section class="rt-notice"><p class="rt-eyebrow">Webbtjänst</p><h1>Sidan kan inte visas</h1><p>Länken är felaktig, har gått ut eller har återkallats. Av säkerhetsskäl visar vi inte mer information.</p><p>Kontakta oss om du behöver en ny länk.</p><a class="rt-notice-cta" href="${PUBLIC_SITE}" rel="noopener">Besök webbtjanst.com</a></section></main></body></html>`;
}

export { escapeHtml, safeColor as safeAccent };
