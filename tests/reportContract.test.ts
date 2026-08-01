import assert from "node:assert/strict";
import test from "node:test";

import { isPersonalReportV2Content, validateReportContent } from "../convex/reportContract.ts";
import { makeV2Report } from "./fixtures.ts";

test("personal_report_v2 requires both kind and schemaVersion", () => {
  const valid = makeV2Report("plumbing");
  assert.equal(isPersonalReportV2Content(valid), true);
  assert.ok(validateReportContent({ ...valid, kind: "other" }).some((error) => error.includes("kind")));
  const missingKind = { ...valid } as Record<string, unknown>;
  delete missingKind.kind;
  assert.ok(validateReportContent(missingKind).some((error) => error.includes("kind")));
  assert.equal(isPersonalReportV2Content({ ...valid, schemaVersion: 1 }), false);
});

test("component prices may be null while totals must remain price objects", () => {
  const valid = makeV2Report("bakery");
  valid.recommendedOffer.components[0].monthlyPrice = null;
  assert.deepEqual(validateReportContent(valid), []);
  const invalid = structuredClone(valid);
  invalid.recommendedOffer.oneTimeTotal = null as never;
  assert.ok(validateReportContent(invalid).some((error) => error.includes("oneTimeTotal")));
});

test("source URLs and CSS colors are fail-closed", () => {
  const sourceInvalid = structuredClone(makeV2Report("plumbing"));
  sourceInvalid.evidenceLedger[0].sourceUrl = "javascript:alert(1)";
  assert.ok(validateReportContent(sourceInvalid).some((error) => error.includes("sourceUrl")));
  const colorInvalid = structuredClone(makeV2Report("plumbing"));
  colorInvalid.theme.accent = "red; background:url(https://example.test)";
  assert.ok(validateReportContent(colorInvalid).some((error) => error.includes("theme.accent")));
  const conceptColorInvalid = structuredClone(makeV2Report("plumbing"));
  conceptColorInvalid.conceptPreviews[0].palette.accent = "#fff";
  assert.ok(validateReportContent(conceptColorInvalid).some((error) => error.includes("palette.accent")));
});

test("richness, distinct concepts and offer totals are fail-closed", () => {
  const tooShallow = structuredClone(makeV2Report("plumbing"));
  tooShallow.opportunities = tooShallow.opportunities.slice(0, 1);
  assert.ok(validateReportContent(tooShallow).some((error) => error.includes("opportunities")));

  const duplicateDirection = structuredClone(makeV2Report("plumbing"));
  duplicateDirection.conceptPreviews[1].artDirection = duplicateDirection.conceptPreviews[0].artDirection;
  assert.ok(validateReportContent(duplicateDirection).some((error) => error.includes("art directions")));

  const wrongTotal = structuredClone(makeV2Report("plumbing"));
  wrongTotal.recommendedOffer.oneTimeTotal.amount += 1;
  assert.ok(validateReportContent(wrongTotal).some((error) => error.includes("component total")));
});
