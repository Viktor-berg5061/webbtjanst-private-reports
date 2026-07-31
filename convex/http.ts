import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

const PUBLIC_SITE = "https://www.webbtjanst.com";

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

function escapeAttr(value: string): string {
  return escapeHtml(value);
}

function notFoundPage(): Response {
  const body = `<!doctype html><html lang="sv"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><title>Sidan kan inte visas | Webbtjänst</title><style>${notFoundCss()}</style></head><body><main class="shell"><header class="rt-header"><span class="rt-brand"><span class="rt-brand-mark" aria-hidden="true">W</span><span>Webbtjänst</span></span><span class="rt-tag"><span class="rt-tag-dot" aria-hidden="true"></span>Länken kunde inte visas</span></header><section class="rt-notice"><p class="rt-eyebrow">Webbtjänst</p><h1>Sidan kan inte visas</h1><p>Länken är felaktig, har gått ut eller har återkallats. Av säkerhetsskäl visar vi inte mer information.</p><p>Kontakta oss om du behöver en ny länk — vi skickar en ny personlig sammanställning direkt.</p><a class="rt-notice-cta" href="${PUBLIC_SITE}" rel="noopener">Besök webbtjanst.com</a></section></main></body></html>`;
  return new Response(body, {
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

function notFoundCss(): string {
  return baseReportCss("") + `
.rt-notice{background:var(--rt-surface);border:1px solid var(--rt-border);border-radius:18px;padding:clamp(32px,6vw,56px);box-shadow:var(--rt-shadow);text-align:left}
.rt-notice h1{font-size:clamp(26px,4vw,34px);line-height:1.2;letter-spacing:-0.02em;margin:0 0 14px;color:var(--rt-text)}
.rt-notice p{margin:0 0 12px;color:var(--rt-text-soft);font-size:16px;line-height:1.65;max-width:56ch}
.rt-notice-cta{margin-top:22px;display:inline-flex;align-items:center;gap:10px;padding:12px 18px;background:var(--rt-accent);color:#fff;border-radius:999px;text-decoration:none;font-weight:600;font-size:15px;box-shadow:0 6px 16px rgba(37,99,235,0.28)}
`;
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
  const intro = `<p class="rt-intro">${escapeHtml(content.introduction)}</p>`;
  const contact = content.companyName ? `<p class="rt-meta">Sammanställd efter vårt samtal</p>` : "";
  const observations = content.observations
    .map(
      (item, index) => `<li class="rt-observation"><span class="rt-observation-num" aria-hidden="true">${index + 1}</span><span class="rt-observation-body">${escapeHtml(item)}</span></li>`,
    )
    .join("");
  const steps = content.nextSteps
    .map((item) => `<li class="rt-step"><span class="rt-step-num" aria-hidden="true"></span><p class="rt-step-body">${escapeHtml(item)}</p></li>`)
    .join("");
  const needs = content.neededFromCustomer
    .map((item) => `<li class="rt-need"><span class="rt-need-check" aria-hidden="true">✓</span><p class="rt-need-body">${escapeHtml(item)}</p></li>`)
    .join("");
  const disclaimer = content.disclaimer
    ? `<p class="rt-disclaimer">${escapeHtml(content.disclaimer)}</p>`
    : "";

  const html = `<!doctype html><html lang="sv"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><meta name="color-scheme" content="light dark"><title>${escapeHtml(content.title)} | Webbtjänst</title><style>${baseReportCss(accent)}</style></head><body><main class="shell"><header class="rt-header"><a class="rt-brand" href="${PUBLIC_SITE}" rel="noopener"><span class="rt-brand-mark" aria-hidden="true">W</span><span>Webbtjänst</span></a><span class="rt-tag"><span class="rt-tag-dot" aria-hidden="true"></span>Personlig sammanställning</span></header><article class="rt-hero"><p class="rt-eyebrow">För ${escapeHtml(content.companyName)}</p><h1 class="rt-title">${escapeHtml(content.title)}</h1>${contact}${intro}</article><section class="rt-section"><h2 class="rt-section-title">Det vi ser</h2><ol class="rt-observations">${observations}</ol></section><section class="rt-section"><h2 class="rt-section-title">Vår rekommendation</h2><div class="rt-card"><p class="rt-reco-summary">${escapeHtml(content.recommendation.summary)}</p><div class="rt-pillars"><article class="rt-pillar"><span class="rt-pillar-icon" aria-hidden="true">◐</span><h3>Webbplats</h3><p>${escapeHtml(content.recommendation.website)}</p></article><article class="rt-pillar"><span class="rt-pillar-icon" aria-hidden="true">◍</span><h3>AI-receptionist</h3><p>${escapeHtml(content.recommendation.receptionist)}</p></article></div><div class="rt-price"><span class="rt-price-label">Prisbild</span><p class="rt-price-body">${escapeHtml(content.recommendation.pricing)}</p></div></div></section><section class="rt-section"><h2 class="rt-section-title">Så går det till</h2><ol class="rt-steps">${steps}</ol></section><section class="rt-section"><h2 class="rt-section-title">Det vi behöver från er</h2><ul class="rt-needs">${needs}</ul></section>${disclaimer}<footer class="rt-footer"><span>Webbtjänst · personlig sammanställning</span><a href="${PUBLIC_SITE}" rel="noopener">Läs mer om Webbtjänst →</a></footer></main></body></html>`;
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

function baseReportCss(accent: string): string {
  // Token definitions + component styles. Inline-only CSS, no script, no fetch.
  // Theme accent is honoured when the value is a valid 6-digit hex (validator above).
  return `:root{--rt-accent:${escapeAttr(accent)};--rt-accent-strong:${escapeAttr(accent)};--rt-accent-soft:transparent;color-scheme:light dark}@media(prefers-color-scheme:light){:root{--rt-bg:#f5f6f8;--rt-bg-elevated:#fff;--rt-surface:#fff;--rt-surface-2:#f8f9fb;--rt-border:#e4e7ee;--rt-border-strong:#d3d7e0;--rt-text:#0f1726;--rt-text-soft:#45506a;--rt-text-muted:#6b7589;--rt-shadow:0 1px 2px rgba(15,23,42,0.04),0 12px 32px rgba(15,23,42,0.06);--rt-shadow-card:0 1px 0 rgba(15,23,42,0.02),0 8px 24px rgba(15,23,42,0.05)}}@media(prefers-color-scheme:dark){:root{--rt-bg:#0a0f1c;--rt-bg-elevated:#111729;--rt-surface:#131a30;--rt-surface-2:#182040;--rt-border:#232c46;--rt-border-strong:#2d385a;--rt-text:#eef2fb;--rt-text-soft:#c4cce0;--rt-text-muted:#8e99b6;--rt-shadow:0 1px 2px rgba(0,0,0,0.3),0 12px 32px rgba(0,0,0,0.4);--rt-shadow-card:0 1px 0 rgba(255,255,255,0.02),0 8px 24px rgba(0,0,0,0.35)}body{background:#0a0f1c}*{box-sizing:border-box}html,body{min-height:100%}body{margin:0;background:var(--rt-bg);color:var(--rt-text);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Inter","Helvetica Neue",Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;line-height:1.6}.shell{width:min(920px,calc(100% - 32px));margin:0 auto;padding:clamp(40px,7vw,80px) 0 clamp(56px,8vw,96px)}.rt-header{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:clamp(28px,5vw,48px);padding-bottom:20px;border-bottom:1px solid var(--rt-border);flex-wrap:wrap}.rt-brand{display:inline-flex;align-items:center;gap:10px;font-weight:600;letter-spacing:-0.01em;color:var(--rt-text);text-decoration:none;font-size:15px}.rt-brand-mark{width:28px;height:28px;border-radius:8px;background:var(--rt-accent);display:inline-grid;place-items:center;color:#fff;font-weight:700;font-size:14px;box-shadow:0 2px 8px rgba(37,99,235,0.25)}.rt-tag{display:inline-flex;align-items:center;gap:8px;padding:6px 12px;border-radius:999px;background:var(--rt-accent-soft);color:var(--rt-accent-strong);font-size:12px;font-weight:600;letter-spacing:0.02em;text-transform:uppercase}.rt-tag-dot{width:6px;height:6px;border-radius:50%;background:var(--rt-accent);box-shadow:0 0 0 4px rgba(37,99,235,0.18)}.rt-hero{background:var(--rt-surface);border:1px solid var(--rt-border);border-radius:18px;padding:clamp(28px,5vw,48px);box-shadow:var(--rt-shadow)}.rt-eyebrow{display:inline-block;color:var(--rt-accent);font-weight:600;letter-spacing:0.08em;text-transform:uppercase;font-size:12px;margin:0 0 14px}.rt-title{font-size:clamp(28px,4.4vw,40px);line-height:1.15;letter-spacing:-0.02em;font-weight:700;margin:0 0 14px;color:var(--rt-text);max-width:32ch}.rt-meta{color:var(--rt-text-muted);font-size:15px;margin:0 0 24px}.rt-intro{font-size:17px;line-height:1.65;color:var(--rt-text-soft);margin:0;max-width:64ch}.rt-section{margin-top:clamp(32px,5vw,48px)}.rt-section-title{font-size:13px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--rt-text-muted);margin:0 0 18px;display:flex;align-items:center;gap:12px}.rt-section-title::after{content:"";flex:1;height:1px;background:var(--rt-border)}.rt-card{background:var(--rt-surface);border:1px solid var(--rt-border);border-radius:18px;padding:clamp(24px,4vw,36px);box-shadow:var(--rt-shadow-card)}.rt-observations{list-style:none;padding:0;margin:0;display:grid;gap:14px}.rt-observation{display:grid;grid-template-columns:28px 1fr;gap:14px;padding:16px 18px;background:var(--rt-surface);border:1px solid var(--rt-border);border-radius:10px;box-shadow:var(--rt-shadow-card)}.rt-observation-num{width:28px;height:28px;border-radius:50%;background:var(--rt-accent-soft);color:var(--rt-accent-strong);font-weight:700;font-size:13px;display:inline-grid;place-items:center}.rt-observation-body{color:var(--rt-text-soft);font-size:15px;line-height:1.6;align-self:center}.rt-pillars{display:grid;gap:18px;grid-template-columns:1fr}@media(min-width:720px){.rt-pillars{grid-template-columns:1fr 1fr}}.rt-pillar{position:relative;background:var(--rt-surface);border:1px solid var(--rt-border);border-radius:18px;padding:clamp(22px,3vw,30px);display:flex;flex-direction:column;gap:14px;box-shadow:var(--rt-shadow-card);overflow:hidden}.rt-pillar::before{content:"";position:absolute;top:0;left:0;right:0;height:3px;background:var(--rt-accent);opacity:0.85}.rt-pillar-icon{width:40px;height:40px;border-radius:12px;background:var(--rt-accent-soft);color:var(--rt-accent-strong);display:inline-grid;place-items:center;font-size:20px}.rt-pillar h3{font-size:19px;font-weight:700;letter-spacing:-0.01em;margin:0;color:var(--rt-text)}.rt-pillar p{margin:0;color:var(--rt-text-soft);font-size:15px;line-height:1.65}.rt-reco-summary{margin:0 0 24px;padding:20px 22px;background:var(--rt-surface-2);border:1px solid var(--rt-border);border-radius:10px;color:var(--rt-text-soft);font-size:16px;line-height:1.65}.rt-price{margin-top:18px;background:linear-gradient(135deg,var(--rt-accent-soft) 0%,var(--rt-surface) 80%);border:1px solid var(--rt-border);border-radius:18px;padding:clamp(22px,3vw,30px);display:flex;flex-direction:column;gap:10px}.rt-price-label{font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--rt-accent-strong)}.rt-price-body{margin:0;font-size:16px;line-height:1.65;color:var(--rt-text);font-weight:500}.rt-steps{list-style:none;padding:0;margin:0;counter-reset:rt-step;display:grid;gap:14px}.rt-step{display:grid;grid-template-columns:44px 1fr;gap:16px;align-items:start;padding:16px 18px;background:var(--rt-surface);border:1px solid var(--rt-border);border-radius:10px;box-shadow:var(--rt-shadow-card)}.rt-step-num{width:36px;height:36px;border-radius:10px;background:var(--rt-accent);color:#fff;font-weight:700;font-size:14px;display:inline-grid;place-items:center;counter-increment:rt-step;box-shadow:0 4px 12px rgba(37,99,235,0.3)}.rt-step-num::before{content:counter(rt-step)}.rt-step-body{margin:0;color:var(--rt-text-soft);font-size:15px;line-height:1.6;padding-top:6px}.rt-needs{list-style:none;padding:0;margin:0;display:grid;gap:10px}.rt-need{display:grid;grid-template-columns:22px 1fr;gap:12px;padding:12px 14px;background:var(--rt-surface);border:1px solid var(--rt-border);border-radius:10px;box-shadow:var(--rt-shadow-card)}.rt-need-check{width:20px;height:20px;border-radius:6px;background:var(--rt-accent);color:#fff;font-size:13px;font-weight:700;display:inline-grid;place-items:center;margin-top:2px}.rt-need-body{margin:0;color:var(--rt-text-soft);font-size:15px;line-height:1.6}.rt-disclaimer{margin-top:24px;padding:14px 16px;border:1px dashed var(--rt-border-strong);border-radius:10px;color:var(--rt-text-muted);font-size:13px;line-height:1.6}.rt-footer{margin-top:clamp(40px,6vw,56px);padding-top:24px;border-top:1px solid var(--rt-border);display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px;color:var(--rt-text-muted);font-size:13px}.rt-footer a{color:var(--rt-accent);text-decoration:none;font-weight:600}`;
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
