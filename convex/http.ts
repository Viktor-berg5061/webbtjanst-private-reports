import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

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

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function newToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  })[character] ?? character);
}

function list(items: string[], ordered = false): string {
  const tag = ordered ? "ol" : "ul";
  return `<${tag}>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</${tag}>`;
}

function notFoundPage(): Response {
  return new Response(
    "<!doctype html><html lang=\"sv\"><meta charset=\"utf-8\"><meta name=\"robots\" content=\"noindex,nofollow,noarchive\"><title>Sidan kan inte visas | Webbtjänst</title><body><main><h1>Sidan kan inte visas</h1><p>Länken är felaktig, har gått ut eller har återkallats.</p><a href=\"https://www.webbtjanst.com\">Besök Webbtjänst</a></main></body></html>",
    { status: 404, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "private, no-store", "x-robots-tag": "noindex, nofollow, noarchive", "referrer-policy": "no-referrer" } },
  );
}

function renderReport(report: {
  content: {
    companyName: string;
    title: string;
    introduction: string;
    observations: string[];
    recommendation: { summary: string; website: string; receptionist: string; pricing: string };
    nextSteps: string[];
    neededFromCustomer: string[];
    disclaimer?: string;
    theme?: { accent?: string };
  };
}): Response {
  const content = report.content;
  const accent = content.theme?.accent && /^#[0-9a-fA-F]{6}$/.test(content.theme.accent)
    ? content.theme.accent
    : "#2563eb";
  const disclaimer = content.disclaimer ? `<p class=\"muted\">${escapeHtml(content.disclaimer)}</p>` : "";
  const html = `<!doctype html><html lang=\"sv\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><meta name=\"robots\" content=\"noindex,nofollow,noarchive\"><title>${escapeHtml(content.title)} | Webbtjänst</title><style>:root{--accent:${accent};color-scheme:light dark}*{box-sizing:border-box}body{margin:0;background:#f4f6fa;color:#172033;font:16px/1.6 Arial,sans-serif}main{width:min(860px,calc(100% - 32px));margin:auto;padding:48px 0}article{background:#fff;border:1px solid #dfe4ec;border-radius:14px;padding:clamp(24px,5vw,48px)}section{margin-top:32px}.eyebrow,a{color:var(--accent)}.eyebrow{font-weight:700;text-transform:uppercase;letter-spacing:.08em}.muted{color:#5b6475}li+li{margin-top:8px}@media(prefers-color-scheme:dark){body{background:#080d16;color:#edf2f7}article{background:#111827;border-color:#263247}.muted{color:#aeb8c7}}</style></head><body><main><article><p class=\"eyebrow\">Personlig sammanställning från Webbtjänst</p><h1>${escapeHtml(content.title)}</h1><p class=\"muted\">För ${escapeHtml(content.companyName)}</p><p>${escapeHtml(content.introduction)}</p><section><h2>Det vi ser</h2>${list(content.observations)}</section><section><h2>Vår rekommendation</h2><p>${escapeHtml(content.recommendation.summary)}</p><h3>Webbplats</h3><p>${escapeHtml(content.recommendation.website)}</p><h3>AI-receptionist</h3><p>${escapeHtml(content.recommendation.receptionist)}</p><h3>Prisbild</h3><p>${escapeHtml(content.recommendation.pricing)}</p></section><section><h2>Så går det till</h2>${list(content.nextSteps, true)}</section><section><h2>Det vi behöver från er</h2>${list(content.neededFromCustomer)}</section>${disclaimer}<p><a href=\"https://www.webbtjanst.com\">Läs mer om Webbtjänst</a></p></article></main></body></html>`;
  return new Response(html, {
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
    return report ? renderReport(report) : notFoundPage();
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
    const body = (await request.json()) as { content?: unknown; expiresAt?: unknown; token?: unknown };
    if (!body.content || typeof body.content !== "object") return json({ error: "invalid_content" }, 400);
    if (body.expiresAt !== undefined && typeof body.expiresAt !== "number") return json({ error: "invalid_expiry" }, 400);
    const token = typeof body.token === "string" ? body.token : newToken();
    if (!/^[A-Za-z0-9_-]{40,128}$/.test(token)) return json({ error: "invalid_token" }, 400);
    const result = await ctx.runMutation(internal.reports.upsertPublished, {
      tokenHash: await sha256(token),
      content: body.content as never,
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
