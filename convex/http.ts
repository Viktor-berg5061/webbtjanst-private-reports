import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { renderReportHtml, renderNotFoundHtml, PUBLIC_SITE } from "./reportRender";
import { REPORT_CSS_GUARD } from "./reportCss";
import { isPersonalReportV2Content, validateReportContent } from "./reportContract";

const http = httpRouter();

function authorized(request: Request): boolean {
  const secret = process.env.REPORT_INGEST_SECRET;
  return Boolean(secret && request.headers.get("authorization") === `Bearer ${secret}`);
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function newToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function notFoundPage(): Response {
  return new Response(renderNotFoundHtml(), {
    status: 404,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "private, no-store",
      "x-robots-tag": "noindex, nofollow, noarchive",
      "referrer-policy": "no-referrer",
      "x-content-type-options": "nosniff",
      "x-frame-options": "DENY",
      "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'; frame-ancestors 'none'; base-uri 'none'",
    },
  });
}

// Re-export guard constant so the renderer pipeline remains self-documenting.
export { REPORT_CSS_GUARD, PUBLIC_SITE };

http.route({
  pathPrefix: "/r/",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const token = new URL(request.url).pathname.slice(3);
    if (!/^[A-Za-z0-9_-]{40,128}$/.test(token)) return notFoundPage();
    const report = await ctx.runQuery(internal.reports.resolveByTokenHash, {
      tokenHash: await sha256(token),
      now: Date.now(),
    });
    if (!report) return notFoundPage();
    return new Response(renderReportHtml(report.content), {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "private, no-store",
        "x-robots-tag": "noindex, nofollow, noarchive",
        "referrer-policy": "no-referrer",
        "x-content-type-options": "nosniff",
        "x-frame-options": "DENY",
        "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'; frame-ancestors 'none'; base-uri 'none'",
      },
    });
  }),
});

http.route({
  path: "/api/reports/resolve",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!authorized(request)) return json({ error: "not_found" }, 404);
    const body = (await request.json()) as { tokenHash?: unknown };
    if (typeof body.tokenHash !== "string" || !/^[a-f0-9]{64}$/.test(body.tokenHash)) {
      return json({ error: "not_found" }, 404);
    }
    const report = await ctx.runQuery(internal.reports.resolveByTokenHash, {
      tokenHash: body.tokenHash,
      now: Date.now(),
    });
    return report ? json(report) : json({ error: "not_found" }, 404);
  }),
});

http.route({
  path: "/api/reports/publish",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!authorized(request)) return json({ error: "unauthorized" }, 401);
    const body = await request.json() as unknown;
    if (!isRecord(body) || !isPersonalReportV2Content(body.content)) return json({ error: "invalid_content" }, 400);
    const contentErrors = validateReportContent(body.content);
    if (contentErrors.length > 0) return json({ error: "invalid_content", details: contentErrors }, 400);
    if (body.expiresAt !== undefined && typeof body.expiresAt !== "number") return json({ error: "invalid_expiry" }, 400);
    const token = typeof body.token === "string" ? body.token : newToken();
    if (!/^[A-Za-z0-9_-]{40,128}$/.test(token)) return json({ error: "invalid_token" }, 400);
    const result = await ctx.runMutation(internal.reports.upsertPublished, {
      tokenHash: await sha256(token),
      content: body.content,
      expiresAt: body.expiresAt as number | undefined,
      now: Date.now(),
    });
    const baseUrl = process.env.REPORT_PUBLIC_BASE_URL;
    if (!baseUrl) return json({ error: "missing_public_base_url" }, 500);
    return json({ reportUrl: `${baseUrl.replace(/\/$/, "")}/r/${token}`, version: result.version });
  }),
});

http.route({
  path: "/api/reports/revoke",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!authorized(request)) return json({ error: "unauthorized" }, 401);
    const body = (await request.json()) as { token?: unknown };
    if (typeof body.token !== "string" || !/^[A-Za-z0-9_-]{40,128}$/.test(body.token)) {
      return json({ error: "invalid_token" }, 400);
    }
    const revoked = await ctx.runMutation(internal.reports.revoke, {
      tokenHash: await sha256(body.token), now: Date.now(),
    });
    return json({ revoked });
  }),
});

export default http;
