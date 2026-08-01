import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import test from "node:test";

import { Recommendation } from "../src/components/Recommendation.tsx";
import { V2Report } from "../src/components/V2Report.tsx";
import { makeV2Report } from "./fixtures.ts";

function render(industry: "plumbing" | "bakery"): string {
  return renderToStaticMarkup(createElement(V2Report, { content: makeV2Report(industry) }));
}

test("Next renderer uses the canonical v2 content and keeps industries distinct", () => {
  const plumbing = render("plumbing");
  const bakery = render("bakery");
  assert.ok(plumbing.includes("Rörklart VVS AB"));
  assert.ok(plumbing.includes("Trygg jour"));
  assert.ok(bakery.includes("Månskensbageriet AB"));
  assert.ok(bakery.includes("Varmt kvarter"));
  assert.notEqual(plumbing, bakery);
});

test("Next renderer renders exactly three interactive concepts and flexible offer fields", () => {
  const html = render("bakery");
  assert.equal((html.match(/<details class="rt-concept"/g) ?? []).length, 3);
  assert.equal((html.match(/<summary class="rt-concept-summary"/g) ?? []).length, 3);
  assert.ok(html.includes("<details class=\"rt-offer-details\""));
  assert.ok(html.includes("14 000 SEK"));
  assert.ok(html.includes("900 SEK / månad"));
  assert.ok(html.includes("Scenario"));
  assert.ok(html.includes("Underlag:"));
  assert.equal(/dangerouslySetInnerHTML/.test(html), false);
});

test("Next display layer hides internal terms and keeps the agent preview data-driven", () => {
  const report = makeV2Report("bakery");
  report.companyProfile.industry = "unknown";
  report.recommendedOffer.components[0].service = "webbplats_och_setup";
  report.recommendedOffer.optionalAddOns[0].service = "ai_receptionist";
  report.recommendedOffer.rationale = "Bygger på offer-claim-contracten och handoffens rekommendation.";

  const html = renderToStaticMarkup(createElement(V2Report, { content: report }));
  assert.ok(html.includes("Ej verifierat i underlaget"));
  assert.ok(html.includes("Webbplats och uppstart"));
  assert.ok(html.includes("AI-receptionist"));
  assert.equal(html.includes("webbplats_och_setup"), false);
  assert.equal(html.includes("ai_receptionist"), false);
  assert.equal(/offer-claim-contract|handoffens rekommendation/i.test(html), false);
  assert.equal((html.match(/class="rt-preview-browser"/g) ?? []).length, 3);
  assert.equal((html.match(/class="rt-preview-mobile"/g) ?? []).length, 3);
});

test("legacy recommendation can still show its pricing field", () => {
  const html = renderToStaticMarkup(createElement(Recommendation, {
    summary: "Sammanfattning",
    website: "Webbplats",
    receptionist: "Receptionist",
    pricing: "Legacy-pris",
  }));
  assert.equal((html.match(/<article class="rt-feature">/g) ?? []).length, 3);
  assert.ok(html.includes("Legacy-pris"));
});
