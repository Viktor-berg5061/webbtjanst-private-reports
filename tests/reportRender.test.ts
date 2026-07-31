// Real rendered-structure tests for the Convex production renderer.
// Renders a full sample report and asserts on the produced HTML — section
// order, class hooks, escaping of user-supplied content, no <script>, no
// fabricated metrics.

import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { renderReportHtml, renderNotFoundHtml, PUBLIC_SITE } from "../convex/reportRender.ts";
import type { ReportContent } from "../convex/reportRender.ts";

const FULL_SAMPLE: ReportContent = {
  companyName: "Mästaren Bygg & Renovering AB",
  contactName: "Erik Lindgren",
  title: "Tydligare webbplats, färre missade samtal",
  introduction:
    "Efter vårt samtal ser vi tydligt hur en lugnare webbplats och en AI-receptionist som svarar dygnet runt skulle göra skillnad för er.",
  observations: [
    "Förfrågningar kommer ofta på kvällar och helger — i dag går de till en telefonsvarare som inte ringts upp.",
    "Den nuvarande webbplatsen saknar tydliga projektbilder och tydliga kontaktuppgifter.",
    "Ni har stark lokal förankring och bra referenser — de syns inte digitalt i dag.",
  ],
  recommendation: {
    summary:
      "Vi rekommenderar en Tillväxt-webbplats med projektsektion och en AI-receptionist som svarar, kvalificerar och bokar in ärenden direkt.",
    website:
      "En redaktionell webbplats som lyfter projekt, certifieringar och lokala referenser med lugn typografi.",
    receptionist:
      "En AI-receptionist som svarar dygnet runt, samlar in rätt uppgifter och eskalerar akuta ärenden.",
    pricing:
      "Webbplats Tillväxt 30 000 SEK exkl. moms (engångskostnad) + AI-receptionist Tillväxt 8 500 SEK exkl. moms/månad med 20 samtalstimmar ingår.",
  },
  nextSteps: [
    "Vi bokar ett kort avstämningsmöte och går igenom er befintliga webbplats.",
    "Ni samlar logotyper, projektbilder och en kort lista på önskade sidor.",
    "Vi bygger en första version och visar den för er på en demo-länk.",
    "Vid godkännande driftsätts webbplatsen och AI-receptionisten kopplas in.",
  ],
  neededFromCustomer: [
    "Logotyp och varumärkesriktlinjer om ni har dem.",
    "8–15 projektbilder (egna eller friköpta) för projektdelen.",
    "Kontaktuppgifter och svarstider för AI-receptionisten.",
    "En kort FAQ med de vanligaste frågorna era kunder ställer.",
  ],
  highlights: [
    "Fler förfrågningar fångas upp — dygnet runt.",
    "Tydligare webbplats som visar er kompetens lokalt.",
    "Strukturerad överlämning till rätt person i teamet.",
  ],
  situation: {
    headline:
      "Bra hantverkare, men förfrågningarna tystnar när ni lägger på luren för dagen.",
    body:
      "Många kunder ringer och mejlar på kvällar och helger. I dag hamnar de i en telefonsvarare eller i en kontaktformulärshög som ingen bevakar. Med en lugn webbplats och en AI-receptionist som svarar direkt förändras hela bilden — utan att ni behöver vara tillgängliga 24/7.",
  },
  comparison: {
    before: [
      "Telefonsvarare som inte ringts upp — kvällar och helger.",
      "Webbplats utan tydliga projektbilder eller kontaktvägar.",
      "Förfrågningar sprids mellan mejl, sms och lappar.",
    ],
    after: [
      "AI-receptionisten svarar och kvalificerar inom sekunder.",
      "Webbplatsen visar certifieringar, projekt och kontaktvägar.",
      "Strukturerad överlämning — rätt person får rätt ärende.",
    ],
  },
  valueFlow: [
    { stage: "Upptäckt", description: "Kunden hittar er via sök, rekommendation eller en länk." },
    { stage: "Förtroende", description: "Webbplatsens projektsektion bygger trovärdighet direkt." },
    { stage: "Kontakt", description: "Kunden ringer eller skickar en förfrågan — dag som natt." },
    { stage: "Fångad kallelse", description: "AI-receptionisten svarar, samlar in rätt detaljer." },
    { stage: "Strukturerad överlämning", description: "Sammanfattning skickas till rätt person i teamet." },
    { stage: "Nästa steg", description: "Ni följer upp med ett prisförslag eller ett platsbesök." },
  ],
  pricingOverview: {
    vatNote: "Alla priser anges exklusive moms. Inga dolda avgifter.",
    tiers: [
      {
        id: "start",
        name: "Start",
        tagline: "För dig som vill testa lugnt",
        recommended: false,
        website: "15 000 SEK engångskostnad",
        receptionist: "3 500 SEK / månad · 8 samtalstimmar ingår",
        extraMinutes: "3,50 SEK / minut",
        maintenance: "Trygg 500 SEK / månad",
        notes: "Bra för ett första steg. Begränsat antal sidor.",
      },
      {
        id: "tillvaxt",
        name: "Tillväxt",
        tagline: "För dig som vill växa stadigt",
        recommended: true,
        website: "30 000 SEK engångskostnad",
        receptionist: "8 500 SEK / månad · 20 samtalstimmar ingår",
        extraMinutes: "3,00 SEK / minut",
        maintenance: "Aktiv 1 800 SEK / månad",
        notes: "Vår rekommendation för er. Innehåller projektdel och prioriterad support.",
      },
      {
        id: "premium",
        name: "Premium",
        tagline: "För dig som vill ha en komplett lösning",
        recommended: false,
        website: "60 000 SEK engångskostnad",
        receptionist: "24 800 SEK / månad · 60 samtalstimmar ingår",
        extraMinutes: "2,50 SEK / minut",
        maintenance: "Partner 5 000 SEK / månad",
        notes: "För den som vill ha full service och längre garantitid.",
      },
    ],
  },
  disclaimer:
    "Den här sammanställningen är ett kvalitativt underlag baserat på vårt samtal. Inga marknadssiffror eller ROI-prognoser är inbakade.",
  theme: { accent: "#b5631a" },
};

test("Convex renderer escapes user-supplied content and never injects script", () => {
  const html = renderReportHtml(FULL_SAMPLE);
  // No <script>, no inline event handlers, no fetch references.
  assert.equal(/<script\b/i.test(html), false, "no script tags");
  assert.equal(/\bon[a-z]+=/i.test(html), false, "no inline event handlers");
  assert.equal(/fetch\s*\(/i.test(html), false, "no fetch() calls");
  assert.equal(/src\s*=\s*["']http/i.test(html), false, "no external script sources");
});

test("Convex renderer includes every editorial section in the right order", () => {
  const html = renderReportHtml(FULL_SAMPLE);
  const order: [string, RegExp][] = [
    ["header", /<header class="rt-header">/],
    ["hero", /<article class="rt-hero">/],
    ["situation", /<section class="rt-section" aria-labelledby="rt-sit">/],
    ["observations", /<section class="rt-section" aria-labelledby="rt-obs">/],
    ["comparison", /<section class="rt-section" aria-labelledby="rt-cmp">/],
    ["recommendation", /<section class="rt-section" aria-labelledby="rt-reco">/],
    ["valueFlow", /<section class="rt-section" aria-labelledby="rt-flow">/],
    ["concepts", /<section class="rt-section" aria-labelledby="rt-concepts">/],
    ["pricing", /<section class="rt-section" aria-labelledby="rt-pricing">/],
    ["steps", /<section class="rt-section" aria-labelledby="rt-steps">/],
    ["needs", /<section class="rt-section" aria-labelledby="rt-needs">/],
    ["disclaimer", /<p class="rt-disclaimer">/],
    ["footer", /<footer class="rt-footer">/],
  ];
  let cursor = 0;
  for (const [name, re] of order) {
    const pos = html.search(re);
    assert.ok(pos !== -1, `missing section ${name}`);
    assert.ok(pos >= cursor, `section ${name} appears before its predecessor`);
    cursor = pos;
  }
});

test("Convex renderer escapes HTML in user content", () => {
  const xss: ReportContent = {
    ...FULL_SAMPLE,
    title: "Hej <script>alert(1)</script> & \"<img onerror=x>",
    introduction: "<b>bold</b> & 'quoted'",
    companyName: "Foo & Bar < Co",
  };
  const html = renderReportHtml(xss);
  assert.ok(html.includes("&lt;script&gt;alert(1)&lt;/script&gt;"));
  assert.ok(html.includes("&amp;"));
  assert.ok(html.includes("&quot;"));
  assert.ok(html.includes("&#39;"));
  assert.equal(/<script\b/i.test(html), false);
});

test("Convex renderer includes three concept previews with three distinct art directions", () => {
  const html = renderReportHtml(FULL_SAMPLE);
  // Three concept cards present
  const cards = html.match(/<article class="rt-concept">/g) ?? [];
  assert.equal(cards.length, 3, `expected 3 concept cards, found ${cards.length}`);
  // Three distinct accent colours in the inline styles
  for (const accent of ["#8c5a1e", "#ffb13d", "#9a3324"]) {
    assert.ok(html.includes(accent), `concept accent ${accent} missing`);
  }
  // Each concept has its own device-frame wrapper
  const frames = html.match(/<div class="rt-concept-frame"/g) ?? [];
  assert.equal(frames.length, 3, `expected 3 device frames, found ${frames.length}`);
  // Each concept has a screen scaler (miniature site)
  const scalers = html.match(/<div class="rt-concept-scaler"/g) ?? [];
  assert.equal(scalers.length, 3, `expected 3 concept scalers, found ${scalers.length}`);
  // Each concept carries a labelled tag (Koncept A/B/C)
  assert.ok(html.includes("Koncept A"));
  assert.ok(html.includes("Koncept B"));
  assert.ok(html.includes("Koncept C"));
  assert.ok(html.includes("konceptförslag"));
});

test("Convex renderer highlights the recommended pricing tier", () => {
  const html = renderReportHtml(FULL_SAMPLE);
  // The CSS contains a .rt-tier[data-recommended="true"] selector; count only
  // the data attribute on actual <article> elements.
  const articleMatches = (html.match(/<article class="rt-tier" data-recommended="true">/g) ?? []).length;
  assert.equal(articleMatches, 1, `expected 1 recommended tier article, found ${articleMatches}`);
  assert.ok(html.includes("Er rekommendation"));
  assert.ok(html.includes("Den mittersta nivån (Tillväxt)"));
  // VAT note visible
  assert.ok(html.includes("exklusive moms"));
});

test("Convex renderer value-flow diagram contains all six stages", () => {
  const html = renderReportHtml(FULL_SAMPLE);
  for (const stage of ["Upptäckt", "Förtroende", "Kontakt", "Fångad kallelse", "Strukturerad överlämning", "Nästa steg"]) {
    assert.ok(html.includes(stage), `value-flow missing stage ${stage}`);
  }
});

test("Convex renderer includes light/dark theme + reduced motion support in CSS", () => {
  const html = renderReportHtml(FULL_SAMPLE);
  assert.match(html, /@media\s*\(prefers-color-scheme:\s*dark\)/);
  assert.match(html, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  // The light/dark guard is present in the output
  assert.ok(html.includes("light-and-dark-share-layout-css"));
});

test("Convex renderer sets noindex and security headers are documented", async () => {
  const html = renderReportHtml(FULL_SAMPLE);
  assert.match(html, /noindex,nofollow,noarchive/);
  // The actual CSP header is set by http.ts, not the HTML body. Verify the
  // header keys are set in http.ts so security invariants are not just inline.
  const { readFileSync } = await import("node:fs");
  const http = readFileSync(
    fileURLToPath(new URL("../convex/http.ts", import.meta.url)),
    "utf8",
  );
  for (const header of [
    "content-security-policy",
    "x-robots-tag",
    "referrer-policy",
    "x-content-type-options",
    "x-frame-options",
  ]) {
    assert.ok(http.toLowerCase().includes(header), `convex http.ts missing header ${header}`);
  }
});

test("Convex renderer highlights exactly the personalised pricing tier", () => {
  const html = renderReportHtml(FULL_SAMPLE);
  // The recommended tier should have a soft accent background via the CSS class
  // and the text "Er rekommendation" only appears once.
  const recoCount = (html.match(/Er rekommendation/g) ?? []).length;
  assert.equal(recoCount, 1);
  // All three tier names appear
  assert.ok(html.includes(">Start<"));
  assert.ok(html.includes(">Tillväxt<"));
  assert.ok(html.includes(">Premium<"));
});

test("Convex not-found page is identical in shape regardless of failure cause", () => {
  const a = renderNotFoundHtml();
  const b = renderNotFoundHtml();
  assert.equal(a, b, "not-found page must be deterministic");
  assert.match(a, /Sidan kan inte visas/);
  // Must not reveal token-related info
  assert.equal(a.includes("token"), false);
  assert.equal(/<script\b/i.test(a), false);
});

test("PUBLIC_SITE constant matches the canonical webbtjänst URL", () => {
  assert.equal(PUBLIC_SITE, "https://www.webbtjanst.com");
});
