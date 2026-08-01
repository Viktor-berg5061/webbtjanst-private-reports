import assert from "node:assert/strict";
import test from "node:test";

import { renderNotFoundHtml, renderReportHtml } from "../convex/reportRender.ts";
import { legacyReport, makeV2Report } from "./fixtures.ts";

test("two industries render different agent-provided concepts and content", () => {
  const plumbing = renderReportHtml(makeV2Report("plumbing"));
  const bakery = renderReportHtml(makeV2Report("bakery"));
  assert.ok(plumbing.includes("Rörklart VVS AB"));
  assert.ok(plumbing.includes("Trygg jour"));
  assert.ok(bakery.includes("Månskensbageriet AB"));
  assert.ok(bakery.includes("Varmt kvarter"));
  assert.notEqual(plumbing, bakery);
  assert.equal((plumbing.match(/<details class="rt-concept"/g) ?? []).length, 3);
  assert.equal((bakery.match(/<details class="rt-concept"/g) ?? []).length, 3);
  assert.equal(plumbing.includes("CONCEPT_A"), false);
  assert.equal(plumbing.includes("420+"), false);
});

test("v2 renderer exposes safe native interactions, flexible offer and evidence labels", () => {
  const html = renderReportHtml(makeV2Report("plumbing"));
  assert.ok(html.includes("<details class=\"rt-concept\""));
  assert.ok(html.includes("<summary class=\"rt-concept-summary\">"));
  assert.ok(html.includes("Valfria"));
  assert.ok(html.includes("Alternativ"));
  assert.ok(html.includes("Uppskattning") || html.includes("Scenario"));
  assert.ok(html.includes("Kunden uppgav"));
  assert.ok(html.includes("Underlag:"));
  assert.ok(html.includes("18 000 SEK"));
  assert.ok(html.includes("900 SEK / månad"));
  assert.equal(/<script\b/i.test(html), false);
  assert.equal(/\son[a-z]+=/i.test(html), false);
  assert.equal(/javascript:/i.test(html), false);
});

test("v2 display layer uses customer labels and a richer data-driven preview", () => {
  const report = makeV2Report("plumbing");
  report.currentSituation.summary = "unknown";
  report.recommendedOffer.components[0].service = "webbplats_och_setup";
  report.recommendedOffer.optionalAddOns[0].service = "ai_receptionist";
  report.recommendedOffer.rationale = "Bygger på offer-claim-contracten och handoffens rekommendation.";

  const html = renderReportHtml(report);
  assert.ok(html.includes("Ej verifierat i underlaget"));
  assert.ok(html.includes("Webbplats och uppstart"));
  assert.ok(html.includes("AI-receptionist"));
  assert.equal(html.includes("webbplats_och_setup"), false);
  assert.equal(html.includes("ai_receptionist"), false);
  assert.equal(/offer-claim-contract|handoffens rekommendation/i.test(html), false);
  assert.equal((html.match(/class="rt-preview-browser"/g) ?? []).length, 3);
  assert.equal((html.match(/class="rt-preview-mobile"/g) ?? []).length, 3);
  assert.equal((html.match(/class="rt-preview-sections"/g) ?? []).length, 3);
});

test("legacy content remains renderable without fake concepts", () => {
  const html = renderReportHtml(legacyReport);
  assert.ok(html.includes("Äldre Kund AB"));
  assert.ok(html.includes("Legacy-rekommendation."));
  assert.ok(html.includes("Legacy-pris."));
  assert.equal(html.includes("CONCEPT_A"), false);
  assert.equal(html.includes("420+"), false);
});

test("not-found output is generic and deterministic", () => {
  const first = renderNotFoundHtml();
  assert.equal(first, renderNotFoundHtml());
  assert.equal(first.includes("token"), false);
  assert.match(first, /Sidan kan inte visas/);
});
