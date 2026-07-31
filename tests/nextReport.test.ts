// Real rendered-structure tests for the Next.js report page using
// react-dom/server. We render the same component tree as src/app/r/[token]/
// page.tsx (minus the data-fetching + CSS-variable style override) and
// assert on the produced HTML.

import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import test from "node:test";

import { ReportHero } from "../src/components/ReportHero.tsx";
import { Observations, Situation, DefaultSituationDiagram } from "../src/components/Situation.tsx";
import { Recommendation, ValueFlow } from "../src/components/Recommendation.tsx";
import { Comparison } from "../src/components/Comparison.tsx";
import { ConceptPreview } from "../src/components/Concepts.tsx";
import { PricingOverview } from "../src/components/Pricing.tsx";
import { IconCheck } from "../src/components/icons.tsx";

const sample = {
  companyName: "Mästaren Bygg & Renovering AB",
  contactName: "Erik Lindgren",
  title: "Tydligare webbplats, färre missade samtal",
  introduction: "Efter vårt samtal ser vi tydligt hur en lugn webbplats och en AI-receptionist skulle göra skillnad.",
  highlights: [
    "Fler förfrågningar fångas upp — dygnet runt.",
    "Tydligare webbplats som visar er kompetens lokalt.",
  ],
  pull: "Bra hantverkare, men förfrågningarna tystnar efter arbetstid.",
  situation: {
    headline: "Bra hantverkare, men förfrågningarna tystnar efter arbetstid.",
    body: "En lugn webbplats och en AI-receptionist förändrar bilden utan att ni behöver vara tillgängliga 24/7.",
  },
  observations: [
    "Förfrågningar kommer ofta på kvällar och helger.",
    "Webbplatsen saknar tydliga projektbilder.",
    "Ni har stark lokal förankring som inte syns digitalt.",
  ],
  comparison: {
    before: [
      "Telefonsvarare som inte ringts upp.",
      "Webbplats utan kontaktvägar.",
    ],
    after: [
      "AI-receptionisten svarar inom sekunder.",
      "Strukturerad överlämning.",
    ],
  },
  recommendation: {
    summary: "Vi rekommenderar Tillväxt-paketet: webbplats + AI-receptionist som hör ihop.",
    website: "En redaktionell webbplats med tydliga projekt och kontaktvägar.",
    receptionist: "En AI-receptionist som svarar dygnet runt och eskalerar rätt ärenden.",
    pricing: "Webbplats Tillväxt 30 000 SEK exkl. moms + AI-receptionist 8 500 SEK exkl. moms/månad.",
  },
  valueFlow: [
    { stage: "Upptäckt", description: "Kunden hittar er." },
    { stage: "Förtroende", description: "Projektsektionen bygger trovärdighet." },
    { stage: "Kontakt", description: "Kunden ringer eller mejlar." },
  ],
  tiers: [
    {
      id: "start",
      name: "Start",
      tagline: "För dig som vill testa lugnt",
      recommended: false,
      website: "15 000 SEK engångskostnad",
      receptionist: "3 500 SEK / månad · 8 samtalstimmar",
      extraMinutes: "3,50 SEK / minut",
    },
    {
      id: "tillvaxt",
      name: "Tillväxt",
      tagline: "För dig som vill växa stadigt",
      recommended: true,
      website: "30 000 SEK engångskostnad",
      receptionist: "8 500 SEK / månad · 20 samtalstimmar",
      extraMinutes: "3,00 SEK / minut",
    },
    {
      id: "premium",
      name: "Premium",
      tagline: "För dig som vill ha en komplett lösning",
      recommended: false,
      website: "60 000 SEK engångskostnad",
      receptionist: "24 800 SEK / månad · 60 samtalstimmar",
      extraMinutes: "2,50 SEK / minut",
    },
  ],
  nextSteps: [
    "Avstämningsmöte och genomgång av befintlig webbplats.",
    "Ni samlar logotyper och projektbilder.",
    "Vi bygger en första version och visar den för er.",
  ],
  neededFromCustomer: [
    "Logotyp och varumärkesriktlinjer.",
    "8–15 projektbilder för projektdelen.",
    "Kort FAQ med vanliga frågor.",
  ],
  disclaimer: "Kvalitativt underlag baserat på vårt samtal. Inga marknadssiffror.",
};

test("ReportHero renders company name, title, intro, pull quote and highlights", () => {
  const tree = createElement(ReportHero, sample);
  const html = renderToStaticMarkup(tree);
  assert.ok(html.includes("Mästaren Bygg &amp; Renovering AB"));
  assert.ok(html.includes(sample.title));
  assert.ok(html.includes(sample.introduction));
  assert.ok(html.includes(sample.pull));
  assert.ok(html.includes("rt-hero"));
  assert.ok(html.includes("rt-hero-aside"));
  assert.ok(html.includes("rt-hero-pull"));
  for (const h of sample.highlights) assert.ok(html.includes(h));
});

test("Observations renders numbered editorial cards", () => {
  const tree = createElement(Observations, { items: sample.observations });
  const html = renderToStaticMarkup(tree);
  assert.ok(html.includes("rt-observations"));
  // Three cards
  const cards = html.match(/<li class="rt-observation">/g) ?? [];
  assert.equal(cards.length, 3);
  for (const item of sample.observations) assert.ok(html.includes(item));
});

test("Situation renders headline, body and the default diagram", () => {
  const tree = createElement(Situation, {
    headline: sample.situation.headline,
    body: sample.situation.body,
    diagram: createElement(DefaultSituationDiagram),
  });
  const html = renderToStaticMarkup(tree);
  assert.ok(html.includes("rt-situation"));
  assert.ok(html.includes("rt-situation-diagram"));
  assert.ok(html.includes(sample.situation.headline));
});

test("Recommendation renders website + receptionist feature blocks", () => {
  const tree = createElement(Recommendation, {
    summary: sample.recommendation.summary,
    website: sample.recommendation.website,
    receptionist: sample.recommendation.receptionist,
  });
  const html = renderToStaticMarkup(tree);
  assert.ok(html.includes("rt-features"));
  const features = html.match(/<article class="rt-feature">/g) ?? [];
  assert.equal(features.length, 2);
  assert.ok(html.includes("Webbplats"));
  assert.ok(html.includes("AI-receptionist"));
  assert.ok(html.includes(sample.recommendation.summary));
});

test("ValueFlow renders each stage with arrow indicators on wide screens", () => {
  const tree = createElement(ValueFlow, { stages: sample.valueFlow });
  const html = renderToStaticMarkup(tree);
  assert.ok(html.includes("rt-flow"));
  const steps = html.match(/<div class="rt-flow-step">/g) ?? [];
  assert.equal(steps.length, 3);
  for (const s of sample.valueFlow) assert.ok(html.includes(s.stage));
});

test("Comparison renders before/after sides with distinct styling", () => {
  const tree = createElement(Comparison, {
    before: sample.comparison.before,
    after: sample.comparison.after,
  });
  const html = renderToStaticMarkup(tree);
  assert.ok(html.includes("rt-comparison"));
  assert.ok(html.includes('data-side="before"'));
  assert.ok(html.includes('data-side="after"'));
  for (const b of sample.comparison.before) assert.ok(html.includes(b));
  for (const a of sample.comparison.after) assert.ok(html.includes(a));
});

test("ConceptPreview renders the device frame, scaler and inline concept screen", () => {
  // Use the first default concept via the module's CONCEPT_A re-export.
  // ConceptPreview takes a ConceptPayload object; pass the exported CONCEPT_A.
  const tree = createElement(ConceptPreview, {
    concept: {
      id: "trust",
      name: "Trygghetsspecialisten",
      artDirection: "High-trust service · serif",
      blurb: "Varm, sanslöst redaktionell.",
      palette: { bg: "#fff", surface: "#fff", text: "#000", accent: "#8c5a1e", onAccent: "#fff", soft: "#eee" },
      hero: { eyebrow: "BYGG", title: "Hantverket ni kan lita på.", sub: "ROT.", cta: "Begär offert" },
      proofs: [{ label: "Projekt", value: "420+" }],
      projects: [{ title: "Badrum", tag: "ROT" }],
      footer: { phone: "08-123 45 67", tagline: "Svar inom 24 timmar" },
    },
    index: 0,
  });
  const html = renderToStaticMarkup(tree);
  assert.ok(html.includes("rt-concept"));
  assert.ok(html.includes("rt-concept-frame"));
  assert.ok(html.includes("rt-concept-screen"));
  assert.ok(html.includes("rt-concept-scaler"));
  assert.ok(html.includes("Trygghetsspecialisten"));
  // No external URLs in the concept body.
  assert.equal(/src\s*=\s*["']http/i.test(html), false);
});

test("PricingOverview renders three tiers with the recommended one highlighted", () => {
  const tree = createElement(PricingOverview, {
    tiers: sample.tiers,
    vatNote: "Alla priser anges exklusive moms.",
    personalNote: "Den mittersta nivån är markerad som rekommenderad för just er.",
  });
  const html = renderToStaticMarkup(tree);
  assert.ok(html.includes("rt-pricing"));
  assert.ok(html.includes("rt-tier-grid"));
  const tiers = html.match(/<article class="rt-tier"/g) ?? [];
  assert.equal(tiers.length, 3);
  const recommended = html.match(/<article class="rt-tier" data-recommended="true"/g) ?? [];
  assert.equal(recommended.length, 1);
  assert.ok(html.includes("Er rekommendation"));
  // All three prices for the recommended tier are present.
  assert.ok(html.includes("30 000 SEK"));
  assert.ok(html.includes("8 500 SEK"));
  assert.ok(html.includes("3,00 SEK / minut"));
  // No fake urgency language.
  const urgency = ["sista chansen", "erbjudande", "deadline", "rabatt", "kampanj"];
  for (const term of urgency) {
    assert.equal(html.toLowerCase().includes(term), false, `pricing must not contain fake-urgency term "${term}"`);
  }
});

test("IconCheck renders an inline svg without any script or fetch", () => {
  const html = renderToStaticMarkup(createElement(IconCheck));
  assert.ok(html.startsWith("<svg"));
  assert.equal(/<script\b/i.test(html), false);
  assert.equal(/fetch\s*\(/i.test(html), false);
  assert.equal(/src\s*=\s*["']http/i.test(html), false);
});
