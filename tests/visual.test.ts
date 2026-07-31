// Visual contract tests. Lock the editorial report shell and the three
// concept previews so regressions surface immediately. Pure string checks —
// no browser, no fetch.

import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const ROOT = join(import.meta.dirname, "..");
const read = (relative: string) => readFileSync(join(ROOT, relative), "utf8");
const list = (relative: string) => readdirSync(join(ROOT, relative));

test("globals.css defines the editorial shell tokens and components", () => {
  const css = read("src/app/globals.css");
  for (const token of [
    "--rt-bg",
    "--rt-surface",
    "--rt-accent",
    "--rt-text",
    "--rt-border",
    "--rt-shadow",
    "--rt-radius",
    "--rt-display",
  ]) {
    assert.match(css, new RegExp(`${token}:`), `missing token ${token}`);
  }
  for (const selector of [
    ".rt-header",
    ".rt-hero",
    ".rt-eyebrow",
    ".rt-title",
    ".rt-meta",
    ".rt-intro",
    ".rt-hero-aside",
    ".rt-hero-pull",
    ".rt-section",
    ".rt-section-title",
    ".rt-section-eyebrow",
    ".rt-section-aside",
    ".rt-situation",
    ".rt-situation-headline",
    ".rt-situation-body",
    ".rt-situation-diagram",
    ".rt-observations",
    ".rt-observation",
    ".rt-observation-num",
    ".rt-comparison",
    ".rt-comparison-card",
    ".rt-comparison-list",
    ".rt-reco-summary",
    ".rt-features",
    ".rt-feature",
    ".rt-feature-icon",
    ".rt-feature-list",
    ".rt-flow",
    ".rt-flow-track",
    ".rt-flow-step",
    ".rt-concepts",
    ".rt-concept",
    ".rt-concept-name",
    ".rt-concept-direction",
    ".rt-concept-blurb",
    ".rt-concept-frame",
    ".rt-concept-screen",
    ".rt-concept-scaler",
    ".rt-concept-tag",
    ".rt-pricing",
    ".rt-pricing-title",
    ".rt-tier-grid",
    ".rt-tier",
    ".rt-tier-name",
    ".rt-tier-recommended",
    ".rt-tier-row",
    ".rt-pricing-note",
    ".rt-steps",
    ".rt-step",
    ".rt-step-num",
    ".rt-needs",
    ".rt-need",
    ".rt-need-check",
    ".rt-disclaimer",
    ".rt-footer",
    ".rt-notice",
    ".rt-notice-cta",
    ".rt-brand",
    ".rt-brand-mark",
    ".rt-tag",
    ".rt-tag-dot",
  ]) {
    assert.ok(css.includes(selector), `missing selector ${selector}`);
  }
  // Dark mode actually switches tokens, not just colours text.
  assert.match(css, /@media\s*\(prefers-color-scheme:\s*dark\)/);
  // Reduced motion respected.
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  // Mobile-first hero padding.
  assert.match(css, /clamp\(/);
  // Layout / component CSS must live OUTSIDE the dark colour-scheme block.
  // Find every @media(prefers-color-scheme:dark) block and ensure no .shell or
  // .rt-* selector is inside one of them.
  const darkBlockRegex = /@media\s*\(prefers-color-scheme:\s*dark\)\s*\{([\s\S]*?)\}/g;
  let m: RegExpExecArray | null;
  while ((m = darkBlockRegex.exec(css))) {
    const block = m[1] ?? "";
    assert.ok(!/\.shell\s*\{/.test(block), "dark scheme block must not contain .shell rules");
    assert.ok(!/\.rt-(header|hero|section|features|concept|pricing|tier|steps|footer|brand|tag|notice)\s*\{/.test(block), "dark scheme block must not contain layout .rt-* rules");
  }
});

test("Convex inline CSS mirrors the same discipline as globals.css", () => {
  const css = read("convex/reportCss.ts");
  // Token coverage
  for (const token of ["--rt-bg", "--rt-surface", "--rt-accent", "--rt-text", "--rt-border", "--rt-display"]) {
    assert.ok(css.includes(`${token}:`), `convex CSS missing token ${token}`);
  }
  // Selector coverage
  for (const selector of [".rt-header", ".rt-hero", ".rt-situation", ".rt-observations", ".rt-comparison", ".rt-features", ".rt-flow", ".rt-concepts", ".rt-concept", ".rt-pricing", ".rt-tier", ".rt-steps", ".rt-needs", ".rt-footer"]) {
    assert.ok(css.includes(selector), `convex CSS missing selector ${selector}`);
  }
  // Both colour schemes present, with layout CSS after them.
  assert.match(css, /@media\(prefers-color-scheme:light\)/);
  assert.match(css, /@media\(prefers-color-scheme:dark\)/);
  const layoutPos = css.indexOf(".shell{");
  const firstColorSchemePos = css.search(/@media\(prefers-color-scheme:\s*(light|dark)\)/);
  assert.ok(layoutPos > firstColorSchemePos, "convex layout CSS must follow colour-scheme blocks");
});

test("Next.js renderer renders every editorial section by class", async () => {
  const page = read("src/app/r/[token]/page.tsx");
  // The page must import and render every section component, so the visual
  // contract is met through the component tree.
  for (const piece of [
    "ReportHero",
    "Observations",
    "Comparison",
    "Recommendation",
    "ValueFlow",
    "ConceptPreview",
    "PricingOverview",
    "PUBLIC_WEBSITE_URL",
  ]) {
    assert.ok(page.includes(piece), `report page missing ${piece}`);
  }
  // The page itself contributes the structural classes (header, footer, sections).
  for (const piece of ["rt-header", "rt-brand", "rt-tag", "rt-footer", "rt-section"]) {
    assert.ok(page.includes(piece), `report page missing ${piece}`);
  }

  // Each section component must contribute the class it is named after.
  const sectionClasses: Record<string, string> = {
    "src/components/ReportHero.tsx": "rt-hero",
    "src/components/Situation.tsx": "rt-situation",
    "src/components/Recommendation.tsx": "rt-feature",
    "src/components/Comparison.tsx": "rt-comparison",
    "src/components/Concepts.tsx": "rt-concept",
    "src/components/Pricing.tsx": "rt-pricing",
  };
  for (const [path, className] of Object.entries(sectionClasses)) {
    const src = read(path);
    assert.ok(src.includes(className), `${path} missing class ${className}`);
  }

  // Theme.accent is honoured exactly once as a CSS variable, not interpolated into HTML.
  assert.match(page, /--rt-accent/);
  // Disables indexing at the page level.
  assert.match(page, /robots:\s*{\s*index:\s*false/);
  // No arbitrary HTML or dangerouslySetInnerHTML at the page level.
  assert.equal(page.includes("dangerouslySetInnerHTML"), false, "report page must not use dangerouslySetInnerHTML");
});

test("all editorial React components exist and render the expected classes", () => {
  const components = list("src/components");
  const required = ["ReportHero", "Situation", "Recommendation", "Comparison", "Concepts", "Pricing", "icons"];
  for (const name of required) {
    assert.ok(components.includes(`${name}.tsx`), `missing component ${name}.tsx`);
  }
  const hero = read("src/components/ReportHero.tsx");
  assert.ok(hero.includes("rt-hero"));
  assert.ok(hero.includes("rt-title"));
  assert.ok(hero.includes("rt-hero-aside"));

  const reco = read("src/components/Recommendation.tsx");
  assert.ok(reco.includes("rt-feature"));
  assert.ok(reco.includes("rt-flow"));
  assert.ok(reco.includes("rt-flow-step"));

  const compare = read("src/components/Comparison.tsx");
  assert.ok(compare.includes("rt-comparison"));
  assert.ok(compare.includes("data-side=\"after\""));

  const concepts = read("src/components/Concepts.tsx");
  assert.ok(concepts.includes("rt-concept-frame"));
  assert.ok(concepts.includes("rt-concept-screen"));
  assert.ok(concepts.includes("rt-concept-scaler"));
  // Three built-in concepts with three distinct art directions.
  assert.ok(concepts.includes("CONCEPT_A"));
  assert.ok(concepts.includes("CONCEPT_B"));
  assert.ok(concepts.includes("CONCEPT_C"));
  for (const id of ["trust", "local", "premium"]) {
    assert.ok(concepts.includes(`id: "${id}"`), `concept ${id} missing`);
  }

  const pricing = read("src/components/Pricing.tsx");
  assert.ok(pricing.includes("rt-pricing"));
  assert.ok(pricing.includes("rt-tier"));
  assert.ok(pricing.includes("data-recommended"));
});

test("Three concept previews have distinct art directions and palettes", () => {
  const src = read("src/components/Concepts.tsx");
  // Three distinct palettes — extract palette accent colours
  const accents = ["#8c5a1e", "#ffb13d", "#9a3324"];
  for (const accent of accents) {
    assert.ok(src.includes(accent), `concept accent ${accent} missing`);
  }
  // Three distinct font stacks
  assert.ok(src.includes("Iowan Old Style"));
  assert.ok(src.includes("Inter"));
  // Hero CTAs all distinct
  for (const cta of [
    "Begär kostnadsfri offert",
    "Ring 031-555 12 12",
    "Se utvalda projekt",
  ]) {
    assert.ok(src.includes(cta), `concept CTA "${cta}" missing`);
  }
});

test("Convex inline renderer mirrors the Next.js visual direction", () => {
  // The renderer lives in convex/reportRender.ts; http.ts is a thin HTTP shell
  // that wires it up. Visual checks belong on the renderer, security/header
  // checks on http.ts.
  const renderer = read("convex/reportRender.ts");
  const http = read("convex/http.ts");
  for (const piece of [
    "rt-header",
    "rt-brand",
    "rt-tag",
    "rt-hero",
    "rt-hero-aside",
    "rt-title",
    "rt-observations",
    "rt-comparison",
    "rt-reco-summary",
    "rt-features",
    "rt-flow",
    "rt-concepts",
    "rt-concept",
    "rt-pricing",
    "rt-tier",
    "rt-steps",
    "rt-needs",
    "rt-footer",
    "CONCEPT_A",
    "CONCEPT_B",
    "CONCEPT_C",
    "escapeHtml",
    "renderReportHtml",
    "renderNotFoundHtml",
  ]) {
    assert.ok(renderer.includes(piece), `convex reportRender.ts missing ${piece}`);
  }
  // http.ts wires the renderer into the HTTP shell and sets security headers.
  for (const piece of [
    "renderReportHtml",
    "renderNotFoundHtml",
    "noindex, nofollow, noarchive",
    "frame-ancestors 'none'",
    "default-src 'none'",
  ]) {
    assert.ok(http.includes(piece), `convex http.ts missing ${piece}`);
  }
  // No <script> tag is ever produced by the renderer — exercised in
  // tests/reportRender.test.ts where we render a sample report.
});

test("Convex reportCss guard comment is present in the rendered output", () => {
  const renderer = read("convex/reportRender.ts");
  assert.ok(renderer.includes("REPORT_CSS_GUARD"), "convex reportRender.ts must reference the light/dark guard");
  const css = read("convex/reportCss.ts");
  assert.ok(css.includes("REPORT_CSS_GUARD"));
  // The guard comment is embedded in the rendered HTML via the reportRender.ts template.
  assert.ok(renderer.includes("/* guard:"), "renderer should embed the guard comment in the output");
});

test("not-found page shares the same shell language and stays generic", () => {
  const notFound = read("src/app/not-found.tsx");
  for (const piece of ["rt-header", "rt-brand", "rt-notice", "rt-notice-cta", "Sidan kan inte visas"]) {
    assert.ok(notFound.includes(piece), `not-found missing ${piece}`);
  }
  // Does not leak token-related info.
  assert.equal(notFound.includes("token"), false);
});

test("home page shares the same shell and explains the no-list policy", () => {
  const home = read("src/app/page.tsx");
  for (const piece of ["rt-header", "rt-brand", "rt-notice", "rt-notice-cta", "ingen publik lista"]) {
    assert.ok(home.includes(piece), `home page missing ${piece}`);
  }
});

test("next.config.ts keeps the safety headers from AGENTS.md", () => {
  const config = read("next.config.ts");
  for (const header of [
    "X-Content-Type-Options",
    "X-Frame-Options",
    "Referrer-Policy",
    "Permissions-Policy",
    "Content-Security-Policy",
    "noindex, nofollow, noarchive",
  ]) {
    assert.ok(config.includes(header), `next.config.ts missing ${header}`);
  }
});

test("robots.txt blocks every crawler on every route", () => {
  const robots = read("src/app/robots.ts");
  assert.match(robots, /disallow:\s*"\//);
});

test("ReportContent schema covers the editorial fields without breaking legacy fields", () => {
  const schema = read("convex/schema.ts");
  // Required legacy fields
  for (const field of ["companyName", "title", "introduction", "observations", "recommendation", "nextSteps", "neededFromCustomer"]) {
    assert.ok(schema.includes(field), `schema missing ${field}`);
  }
  // New editorial fields, all optional
  for (const field of ["highlights", "situation", "comparison", "valueFlow", "conceptPreviews", "pricingOverview"]) {
    assert.ok(schema.includes(field), `schema missing new field ${field}`);
    assert.ok(schema.match(new RegExp(`${field}:\\s*v\\.optional`)), `field ${field} should be v.optional`);
  }
});

test("No third-party tracking or external fetches in the renderer assets", () => {
  for (const path of [
    "src/app/r/[token]/page.tsx",
    "src/app/page.tsx",
    "src/app/not-found.tsx",
    "convex/http.ts",
    "convex/reportCss.ts",
    "src/components/Concepts.tsx",
    "src/components/Pricing.tsx",
  ]) {
    const src = read(path);
    assert.equal(/https?:\/\/(?![^"'\s]*webbtjanst\.com)[^\s"']+/i.test(src), false, `${path} references a non-webbtjanst.com external URL`);
  }
});
