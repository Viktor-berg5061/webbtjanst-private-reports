import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("..", import.meta.url);
const read = (relative: string): string => readFileSync(new URL(relative, root), "utf8");

test("shared v2 contract is used by schema and HTTP publish validation", () => {
  const schema = read("convex/schema.ts");
  const contract = read("convex/reportContract.ts");
  const http = read("convex/http.ts");
  assert.ok(schema.includes("./reportContract"));
  assert.ok(contract.includes('kind: v.literal("personal_report_v2")'));
  assert.ok(contract.includes("schemaVersion: v.literal(2)"));
  assert.ok(http.includes("validateReportContent"));
  assert.ok(http.includes("isPersonalReportV2Content"));
});

test("both renderers expose semantic v2 blocks and native interactions", () => {
  for (const path of ["convex/reportRender.ts", "src/components/V2Report.tsx"]) {
    const source = read(path);
    for (const piece of ["evidence", "visual", "journey", "concept", "offer", "details", "displayClassificationLabel"]) {
      assert.ok(source.toLowerCase().includes(piece.toLowerCase()), `${path} missing ${piece}`);
    }
  }
});

test("hardcoded concepts, fake metrics and unsafe concept HTML are absent", () => {
  for (const path of ["convex/reportRender.ts", "src/components/Concepts.tsx", "src/components/V2Report.tsx"]) {
    const source = read(path);
    for (const forbidden of ["CONCEPT_A", "CONCEPT_B", "CONCEPT_C", "420+", "bodyHtml", "bodyCss", "dangerouslySetInnerHTML"]) {
      assert.equal(source.includes(forbidden), false, `${path} contains ${forbidden}`);
    }
  }
});

test("Next and Convex use the same typed content without an unsafe bridge cast", () => {
  const page = read("src/app/r/[token]/page.tsx");
  const report = read("src/lib/report.ts");
  assert.equal(page.includes("as unknown as"), false);
  assert.equal(report.includes("as unknown as"), false);
  assert.ok(page.includes("isPersonalReportV2Content"));
  assert.ok(report.includes("parseResolvedReport"));
});

test("security and legacy CSS hooks remain present", () => {
  const http = read("convex/http.ts");
  const css = read("convex/reportCss.ts");
  for (const header of ["content-security-policy", "x-robots-tag", "referrer-policy", "x-content-type-options", "x-frame-options", "default-src 'none'"]) {
    assert.ok(http.toLowerCase().includes(header), `missing ${header}`);
  }
  for (const selector of [".rt-hero", ".rt-evidence", ".rt-visualization", ".rt-journey", ".rt-concept", ".rt-offer", ".rt-footer"]) {
    assert.ok(css.includes(selector), `missing ${selector}`);
  }
});

test("concept cards keep natural height and render complete web and mobile previews", () => {
  const nextCss = read("src/app/globals.css");
  const convexCss = read("convex/reportCss.ts");
  assert.ok(nextCss.includes(".rt-concepts { align-items: start;"));
  assert.ok(nextCss.includes(".rt-concept { align-self: start; display: block; height: fit-content;"));
  assert.ok(convexCss.includes(".rt-concepts{align-items:start;align-content:start}"));
  assert.ok(convexCss.includes(".rt-concept{align-self:start;display:block;height:fit-content;"));
  for (const css of [nextCss, convexCss]) {
    for (const selector of [".rt-preview-browser", ".rt-preview-mobile", ".rt-preview-sections", ".rt-preview-site"]) {
      assert.ok(css.includes(selector), `missing ${selector}`);
    }
  }
});
