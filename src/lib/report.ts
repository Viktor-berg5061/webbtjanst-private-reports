import { createHash } from "node:crypto";

import {
  parseResolvedReport,
  type ResolvedReport,
} from "../../convex/reportContract.ts";

export type {
  CompanyProfile,
  ConceptPalette,
  ConceptPreview,
  EvidenceClassification,
  EvidenceLedgerEntry,
  LegacyReportContent,
  OfferComponent,
  OfferPrice,
  PersonalReportV2Content,
  ReportContent,
  ResolvedReport,
  Visualization,
} from "../../convex/reportContract.ts";

export const PUBLIC_WEBSITE_URL = "https://www.webbtjanst.com";

export function hashCapabilityToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export function isValidCapabilityToken(token: string): boolean {
  return /^[A-Za-z0-9_-]{40,128}$/.test(token);
}

export async function resolveReport(token: string): Promise<ResolvedReport | null> {
  if (!isValidCapabilityToken(token)) return null;
  const siteUrl = process.env.CONVEX_SITE_URL;
  const secret = process.env.REPORT_INGEST_SECRET;
  if (!siteUrl || !secret) return null;

  const response = await fetch(`${siteUrl}/api/reports/resolve`, {
    method: "POST",
    cache: "no-store",
    headers: { authorization: `Bearer ${secret}`, "content-type": "application/json" },
    body: JSON.stringify({ tokenHash: hashCapabilityToken(token) }),
  });
  if (!response.ok) return null;
  return parseResolvedReport(await response.json());
}
