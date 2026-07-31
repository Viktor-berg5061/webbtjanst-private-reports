import { createHash } from "node:crypto";

export const PUBLIC_WEBSITE_URL = "https://www.webbtjanst.com";

export type ReportContent = {
  companyName: string;
  contactName?: string;
  title: string;
  introduction: string;
  observations: string[];
  recommendation: {
    summary: string;
    website: string;
    receptionist: string;
    pricing: string;
  };
  nextSteps: string[];
  neededFromCustomer: string[];
  disclaimer?: string;
  theme?: { accent?: string; tone?: "neutral" | "warm" | "technical" };
  // Editorial presentation layer — every field is optional so old published
  // reports continue to render through the fallback layout.
  highlights?: string[];
  situation?: { headline: string; body: string };
  comparison?: { before: string[]; after: string[] };
  valueFlow?: { stage: string; description: string }[];
  conceptPreviews?: {
    id: string;
    name: string;
    artDirection: string;
    blurb: string;
    /** Inline SVG/CSS body for the concept preview — no scripts, no fetches. */
    bodyHtml: string;
    /** Inline CSS for the concept preview. */
    bodyCss: string;
  }[];
  pricingOverview?: {
    tiers: {
      id: string;
      name: string;
      tagline: string;
      recommended: boolean;
      website: string;
      receptionist: string;
      extraMinutes: string;
      maintenance?: string;
      notes?: string;
    }[];
    vatNote: string;
  };
};

export type ResolvedReport = {
  content: ReportContent;
  expiresAt?: number;
  updatedAt: number;
};

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
  return (await response.json()) as ResolvedReport;
}
