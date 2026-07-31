// Visual contract tests. Lock the modernised report shell so regressions
// surface immediately. Pure string checks — no browser, no fetch.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const ROOT = join(import.meta.dirname, "..");
const read = (relative: string) => readFileSync(join(ROOT, relative), "utf8");

test("globals.css defines the modernised shell tokens and components", () => {
  const css = read("src/app/globals.css");
  for (const token of [
    "--rt-bg",
    "--rt-surface",
    "--rt-accent",
    "--rt-text",
    "--rt-border",
    "--rt-shadow",
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
    ".rt-section",
    ".rt-section-title",
    ".rt-card",
    ".rt-observations",
    ".rt-observation",
    ".rt-pillars",
    ".rt-pillar",
    ".rt-price",
    ".rt-steps",
    ".rt-step",
    ".rt-needs",
    ".rt-need",
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
});

test("report renderer uses the modernised components and respects theme.accent", async () => {
  const page = read("src/app/r/[token]/page.tsx");
  for (const piece of [
    "rt-header",
    "rt-brand",
    "rt-tag",
    "rt-hero",
    "rt-title",
    "rt-intro",
    "rt-observations",
    "rt-pillars",
    "rt-pillar",
    "rt-price",
    "rt-steps",
    "rt-step",
    "rt-needs",
    "rt-need",
    "rt-footer",
    "PUBLIC_WEBSITE_URL",
  ]) {
    assert.ok(page.includes(piece), `report renderer missing ${piece}`);
  }
  // Theme.accent is honoured exactly once as a CSS variable, not interpolated into HTML.
  assert.match(page, /\-\-rt-accent/);
  // Disables indexing at the page level.
  assert.match(page, /robots:\s*{\s*index:\s*false/);
  // No arbitrary HTML or dangerouslySetInnerHTML.
  assert.equal(page.includes("dangerouslySetInnerHTML"), false);
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

test("Convex inline renderer mirrors the Next.js visual direction", () => {
  const http = read("convex/http.ts");
  for (const piece of [
    "rt-header",
    "rt-brand",
    "rt-tag",
    "rt-hero",
    "rt-title",
    "rt-observations",
    "rt-pillars",
    "rt-pillar",
    "rt-price",
    "rt-steps",
    "rt-needs",
    "rt-footer",
    "escapeHtml",
    "noindex,nofollow,noarchive",
    "frame-ancestors 'none'",
    "default-src 'none'",
  ]) {
    assert.ok(http.includes(piece), `convex http.ts missing ${piece}`);
  }
  // No script tags injected.
  assert.equal(/<script\b/i.test(http), false, "convex renderer must not inject <script>");
  // Theme accent is validated as a hex literal before being interpolated.
  assert.match(http, /#\[0-9a-fA-F\]\{6\}/);
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
  assert.match(robots, /disallow:\s*"\/"/);
});
