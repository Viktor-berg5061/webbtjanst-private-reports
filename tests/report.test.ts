import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { hashCapabilityToken, isValidCapabilityToken, PUBLIC_WEBSITE_URL } from "../src/lib/report.ts";

test("capability tokens require an opaque URL-safe value", () => {
  assert.equal(isValidCapabilityToken("a".repeat(43)), true);
  assert.equal(isValidCapabilityToken("company-name"), false);
  assert.equal(isValidCapabilityToken("../secret"), false);
});

test("token hashing is deterministic and never returns the token", () => {
  const token = "a".repeat(43);
  const hash = hashCapabilityToken(token);
  assert.match(hash, /^[a-f0-9]{64}$/);
  assert.notEqual(hash, token);
  assert.equal(hashCapabilityToken(token), hash);
});

test("public website is distinct and canonical", () => {
  assert.equal(PUBLIC_WEBSITE_URL, "https://www.webbtjanst.com");
});

test("opaque URL, expiry, revoke and generic 404 invariants remain wired", () => {
  const reports = readFileSync(new URL("../convex/reports.ts", import.meta.url), "utf8");
  const http = readFileSync(new URL("../convex/http.ts", import.meta.url), "utf8");
  const renderer = readFileSync(new URL("../convex/reportRender.ts", import.meta.url), "utf8");
  assert.ok(reports.includes('withIndex("by_token_hash"'));
  assert.ok(reports.includes('report.status !== "published"'));
  assert.ok(reports.includes("report.expiresAt <= args.now"));
  assert.ok(reports.includes('status: "revoked"'));
  assert.ok(http.includes("renderNotFoundHtml"));
  assert.ok(http.includes("/^[A-Za-z0-9_-]{40,128}$/"));
  assert.ok(renderer.includes("Sidan kan inte visas"));
});
