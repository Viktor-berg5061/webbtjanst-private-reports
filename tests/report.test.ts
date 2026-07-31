import assert from "node:assert/strict";
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
