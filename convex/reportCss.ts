/**
 * Shared CSS for the Convex inline renderer. Mirrors the Next.js globals.css
 * visual direction. Kept in one file so future edits apply to both surfaces.
 *
 * Strict structural rule: theme tokens live INSIDE prefers-color-scheme media
 * blocks. Layout / component CSS lives OUTSIDE both media blocks so light
 * and dark schemes both receive the full responsive behaviour. This is the
 * correction that the previous agent had partially completed in convex/http.ts
 * — the discipline is preserved here and the new design follows it.
 */

export const REPORT_CSS_GUARD = "/* light-and-dark-share-layout-css */";

export const baseReportCss = (accent: string): string => {
  const safeAccent = accent;
  return `:root{--rt-accent:${safeAccent};--rt-accent-strong:${safeAccent};--rt-accent-soft:transparent;color-scheme:light dark}
@media(prefers-color-scheme:light){:root{
  --rt-bg:#f5f2ec;--rt-bg-elevated:#ffffff;--rt-surface:#ffffff;--rt-surface-2:#faf7f1;--rt-surface-3:#f1ece2;
  --rt-ink:#1b1f17;--rt-border:#e5dccc;--rt-border-strong:#c9bda6;
  --rt-text:#1b1f17;--rt-text-soft:#4d4a40;--rt-text-muted:#7a7466;
  --rt-accent:${safeAccent};--rt-accent-strong:#8c4810;--rt-accent-soft:#f7e7d2;--rt-accent-ink:#ffffff;
  --rt-positive:#2f7a4f;--rt-positive-soft:#e3efe7;
  --rt-shadow:0 1px 2px rgba(36,28,12,.05),0 24px 64px rgba(36,28,12,.08);
  --rt-shadow-card:0 1px 0 rgba(36,28,12,.03),0 10px 30px rgba(36,28,12,.06);
  --rt-shadow-frame:0 2px 4px rgba(36,28,12,.06),0 24px 60px rgba(36,28,12,.14);
  --rt-radius:22px;--rt-radius-sm:12px;
  --rt-display:"Iowan Old Style","Source Serif Pro",Cambria,Georgia,serif;
  --rt-sans:-apple-system,BlinkMacSystemFont,"Segoe UI","Inter","Helvetica Neue",Arial,sans-serif;
}}
@media(prefers-color-scheme:dark){:root{
  --rt-bg:#0e1014;--rt-bg-elevated:#161922;--rt-surface:#161922;--rt-surface-2:#1c2030;--rt-surface-3:#222738;
  --rt-ink:#f5efe2;--rt-border:#2a2f40;--rt-border-strong:#3a4159;
  --rt-text:#f5efe2;--rt-text-soft:#c4c1b3;--rt-text-muted:#8d8775;
  --rt-accent:${safeAccent};--rt-accent-strong:#f0b07d;--rt-accent-soft:#3a2615;--rt-accent-ink:#1a0d03;
  --rt-positive:#8ed3a9;--rt-positive-soft:#1f3a2b;
  --rt-shadow:0 1px 2px rgba(0,0,0,.4),0 24px 64px rgba(0,0,0,.6);
  --rt-shadow-card:0 1px 0 rgba(255,255,255,.02),0 10px 30px rgba(0,0,0,.35);
  --rt-shadow-frame:0 2px 4px rgba(0,0,0,.45),0 24px 60px rgba(0,0,0,.55);
}}

${REPORT_CSS_GUARD}

*{box-sizing:border-box}
html,body{min-height:100%}
body{margin:0;background:var(--rt-bg);color:var(--rt-text);font-family:var(--rt-sans);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;line-height:1.6}
a{color:inherit}
body::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;opacity:.5;
  background-image:radial-gradient(circle at 20% 10%,color-mix(in srgb,var(--rt-accent) 8%,transparent) 0,transparent 40%),
                   radial-gradient(circle at 85% 90%,color-mix(in srgb,var(--rt-positive) 6%,transparent) 0,transparent 35%)}
@media(prefers-color-scheme:dark){body::before{opacity:.35}}
.shell > *{position:relative;z-index:1}

.shell{width:min(1080px,calc(100% - 32px));margin:0 auto;padding:clamp(28px,5vw,56px) 0 clamp(72px,9vw,120px)}

.rt-header{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:clamp(24px,4vw,40px);padding-bottom:20px;border-bottom:1px solid var(--rt-border);flex-wrap:wrap}
.rt-brand{display:inline-flex;align-items:center;gap:10px;font-weight:600;letter-spacing:-.01em;color:var(--rt-text);text-decoration:none;font-size:15px}
.rt-brand-mark{width:30px;height:30px;border-radius:9px;background:var(--rt-accent);display:inline-grid;place-items:center;color:var(--rt-accent-ink);font-weight:700;font-size:15px;box-shadow:0 2px 8px color-mix(in srgb,var(--rt-accent) 35%,transparent)}
.rt-tag{display:inline-flex;align-items:center;gap:8px;padding:6px 12px;border-radius:999px;background:var(--rt-accent-soft);color:var(--rt-accent-strong);font-size:12px;font-weight:600;letter-spacing:.04em;text-transform:uppercase}
.rt-tag-dot{width:6px;height:6px;border-radius:50%;background:var(--rt-accent);box-shadow:0 0 0 4px color-mix(in srgb,var(--rt-accent) 22%,transparent)}

.rt-hero{display:grid;gap:clamp(20px,3vw,32px);background:linear-gradient(155deg,var(--rt-surface) 0%,var(--rt-surface-2) 100%);border:1px solid var(--rt-border);border-radius:var(--rt-radius);padding:clamp(28px,5vw,56px);box-shadow:var(--rt-shadow);position:relative;overflow:hidden}
.rt-hero::after{content:"";position:absolute;inset:auto -40px -80px auto;width:280px;height:280px;border-radius:50%;background:radial-gradient(circle,color-mix(in srgb,var(--rt-accent) 22%,transparent),transparent 70%);pointer-events:none}
.rt-hero-grid{display:grid;gap:clamp(24px,4vw,48px);grid-template-columns:1fr;align-items:start}
@media(min-width:880px){.rt-hero-grid{grid-template-columns:minmax(0,1.25fr) minmax(0,1fr)}}
.rt-eyebrow{display:inline-flex;align-items:center;gap:8px;color:var(--rt-accent-strong);font-weight:700;letter-spacing:.16em;text-transform:uppercase;font-size:12px;margin:0}
.rt-eyebrow::before{content:"";width:24px;height:1px;background:var(--rt-accent-strong)}
.rt-title{font-family:var(--rt-display);font-size:clamp(30px,5.2vw,48px);line-height:1.08;letter-spacing:-.02em;font-weight:600;margin:14px 0;color:var(--rt-text);max-width:22ch}
.rt-meta{color:var(--rt-text-muted);font-size:15px;margin:0 0 20px}
.rt-meta strong{color:var(--rt-text);font-weight:600}
.rt-intro{font-size:17px;line-height:1.7;color:var(--rt-text-soft);margin:0;max-width:62ch}
.rt-hero-aside{background:var(--rt-bg-elevated);border:1px solid var(--rt-border);border-radius:var(--rt-radius-sm);padding:clamp(20px,3vw,28px);box-shadow:var(--rt-shadow-card);position:relative}
.rt-hero-aside h3{font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:var(--rt-text-muted);margin:0 0 12px;font-weight:700}
.rt-hero-pull{font-family:var(--rt-display);font-size:clamp(19px,2.4vw,22px);line-height:1.4;color:var(--rt-text);margin:0 0 16px;font-style:italic}
.rt-hero-highlights{list-style:none;margin:0;padding:0;display:grid;gap:10px}
.rt-hero-highlight{display:grid;grid-template-columns:22px 1fr;gap:12px;align-items:start;font-size:14px;color:var(--rt-text-soft);line-height:1.55}
.rt-hero-highlight svg{color:var(--rt-positive);margin-top:3px}

.rt-section{margin-top:clamp(40px,6vw,64px);scroll-margin-top:24px}
.rt-section-head{display:flex;align-items:baseline;justify-content:space-between;gap:16px;margin-bottom:clamp(18px,3vw,28px);flex-wrap:wrap}
.rt-section-eyebrow{display:inline-flex;align-items:center;gap:10px;color:var(--rt-accent-strong);font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;margin:0}
.rt-section-eyebrow::before{content:"";width:28px;height:1px;background:var(--rt-accent-strong)}
.rt-section-title{font-family:var(--rt-display);font-size:clamp(24px,3.4vw,32px);line-height:1.18;letter-spacing:-.01em;font-weight:600;color:var(--rt-text);margin:8px 0 0;max-width:28ch}
.rt-section-aside{font-size:14px;color:var(--rt-text-muted);margin:0;max-width:30ch;text-align:right}
@media(max-width:720px){.rt-section-aside{text-align:left}}

.rt-situation{display:grid;gap:clamp(20px,3vw,32px);grid-template-columns:1fr;background:var(--rt-surface);border:1px solid var(--rt-border);border-radius:var(--rt-radius);padding:clamp(24px,4vw,40px);box-shadow:var(--rt-shadow-card);align-items:center}
@media(min-width:760px){.rt-situation{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}}
.rt-situation-headline{font-family:var(--rt-display);font-size:clamp(20px,2.6vw,26px);line-height:1.25;margin:0 0 12px;color:var(--rt-text);letter-spacing:-.01em}
.rt-situation-body{margin:0;color:var(--rt-text-soft);font-size:16px;line-height:1.7}
.rt-situation-diagram{margin:0;width:100%;height:auto;border-radius:var(--rt-radius-sm);background:var(--rt-surface-2);border:1px solid var(--rt-border);padding:16px;display:block}

.rt-observations{display:grid;gap:18px;grid-template-columns:1fr;list-style:none;padding:0;margin:0}
@media(min-width:720px){.rt-observations{grid-template-columns:repeat(3,minmax(0,1fr))}}
.rt-observation{position:relative;display:flex;flex-direction:column;gap:14px;background:var(--rt-surface);border:1px solid var(--rt-border);border-radius:var(--rt-radius);padding:clamp(22px,3vw,28px);box-shadow:var(--rt-shadow-card);overflow:hidden}
.rt-observation-num{display:inline-flex;align-items:center;gap:8px;font-family:var(--rt-display);font-size:13px;font-weight:600;color:var(--rt-accent-strong);letter-spacing:.08em;text-transform:uppercase}
.rt-observation-num strong{font-family:var(--rt-display);font-size:36px;font-weight:500;line-height:1;color:var(--rt-text);letter-spacing:-.02em}
.rt-observation-body{color:var(--rt-text-soft);font-size:15.5px;line-height:1.65;margin:0}
.rt-observation-icon{width:44px;height:44px;border-radius:12px;background:var(--rt-accent-soft);color:var(--rt-accent-strong);display:inline-grid;place-items:center}

.rt-comparison{display:grid;gap:16px;grid-template-columns:1fr}
@media(min-width:760px){.rt-comparison{grid-template-columns:1fr 1fr}}
.rt-comparison-card{background:var(--rt-surface);border:1px solid var(--rt-border);border-radius:var(--rt-radius);padding:clamp(20px,3vw,28px);display:flex;flex-direction:column;gap:14px;box-shadow:var(--rt-shadow-card)}
.rt-comparison-card[data-side="after"]{background:linear-gradient(155deg,var(--rt-surface) 0%,color-mix(in srgb,var(--rt-positive-soft) 60%,var(--rt-surface)) 100%);border-color:color-mix(in srgb,var(--rt-positive) 28%,var(--rt-border))}
.rt-comparison-label{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--rt-text-muted)}
.rt-comparison-card[data-side="after"] .rt-comparison-label{color:var(--rt-positive)}
.rt-comparison-list{list-style:none;margin:0;padding:0;display:grid;gap:10px}
.rt-comparison-item{display:grid;grid-template-columns:22px 1fr;gap:10px;align-items:start;font-size:15px;color:var(--rt-text-soft);line-height:1.55}
.rt-comparison-item svg{margin-top:4px;color:var(--rt-text-muted)}
.rt-comparison-card[data-side="after"] .rt-comparison-item svg{color:var(--rt-positive)}

.rt-reco-summary{margin:0 0 28px;padding:22px 26px;background:var(--rt-surface-2);border:1px solid var(--rt-border);border-left:4px solid var(--rt-accent);border-radius:var(--rt-radius-sm);color:var(--rt-text-soft);font-size:16px;line-height:1.7}
.rt-features{display:grid;gap:18px;grid-template-columns:1fr}
@media(min-width:760px){.rt-features{grid-template-columns:1fr 1fr}}
.rt-feature{position:relative;background:var(--rt-surface);border:1px solid var(--rt-border);border-radius:var(--rt-radius);padding:clamp(24px,3vw,32px);display:flex;flex-direction:column;gap:16px;box-shadow:var(--rt-shadow-card);overflow:hidden}
.rt-feature::before{content:"";position:absolute;top:0;left:0;right:0;height:4px;background:var(--rt-accent);opacity:.9}
.rt-feature-icon{width:48px;height:48px;border-radius:14px;background:var(--rt-accent-soft);color:var(--rt-accent-strong);display:inline-grid;place-items:center}
.rt-feature h3{font-family:var(--rt-display);font-size:22px;font-weight:600;letter-spacing:-.01em;margin:0;color:var(--rt-text)}
.rt-feature p{margin:0;color:var(--rt-text-soft);font-size:15.5px;line-height:1.7}
.rt-feature-list{list-style:none;margin:4px 0 0;padding:0;display:grid;gap:8px}
.rt-feature-list li{display:grid;grid-template-columns:18px 1fr;gap:10px;align-items:start;font-size:14.5px;color:var(--rt-text-soft);line-height:1.5}
.rt-feature-list svg{margin-top:4px;color:var(--rt-accent)}

.rt-flow{background:var(--rt-surface);border:1px solid var(--rt-border);border-radius:var(--rt-radius);padding:clamp(24px,3vw,36px);box-shadow:var(--rt-shadow-card)}
.rt-flow-track{display:grid;gap:14px;grid-template-columns:1fr;--rt-flow-steps:1}
@media(min-width:760px){.rt-flow-track{grid-template-columns:repeat(var(--rt-flow-steps,1),minmax(0,1fr));gap:0;align-items:stretch;position:relative}}
.rt-flow-step{position:relative;display:flex;flex-direction:column;gap:8px;padding:14px 16px;background:var(--rt-surface-2);border:1px solid var(--rt-border);border-radius:var(--rt-radius-sm)}
@media(min-width:760px){.rt-flow-step{border-radius:0;border-left:0;border-right:0;border-top:1px solid var(--rt-border);border-bottom:1px solid var(--rt-border);background:transparent;padding:16px 14px}}
@media(min-width:760px){.rt-flow-step:first-child{border-top-left-radius:var(--rt-radius-sm);border-bottom-left-radius:var(--rt-radius-sm);border-left:1px solid var(--rt-border)}}
@media(min-width:760px){.rt-flow-step:last-child{border-top-right-radius:var(--rt-radius-sm);border-bottom-right-radius:var(--rt-radius-sm);border-right:1px solid var(--rt-border)}}
.rt-flow-num{font-family:var(--rt-display);font-size:13px;color:var(--rt-accent-strong);letter-spacing:.12em;text-transform:uppercase;font-weight:700}
.rt-flow-stage{font-family:var(--rt-display);font-size:18px;font-weight:600;color:var(--rt-text);letter-spacing:-.01em;line-height:1.25}
.rt-flow-desc{font-size:13.5px;color:var(--rt-text-soft);line-height:1.55;margin:0}
@media(min-width:760px){.rt-flow-step + .rt-flow-step::before{content:"";position:absolute;left:-7px;top:50%;width:14px;height:14px;border-top:2px solid var(--rt-accent);border-right:2px solid var(--rt-accent);transform:translateY(-50%) rotate(45deg)}}

.rt-concepts{display:grid;gap:24px;grid-template-columns:1fr}
@media(min-width:760px){.rt-concepts{grid-template-columns:repeat(3,minmax(0,1fr))}}
.rt-concept{background:var(--rt-surface);border:1px solid var(--rt-border);border-radius:var(--rt-radius);padding:clamp(20px,3vw,28px);box-shadow:var(--rt-shadow-card);display:flex;flex-direction:column;gap:16px}
.rt-concept-meta{display:flex;flex-direction:column;gap:8px}
.rt-concept-name{font-family:var(--rt-display);font-size:22px;font-weight:600;letter-spacing:-.01em;margin:0;color:var(--rt-text)}
.rt-concept-direction{display:inline-flex;align-items:center;gap:8px;font-size:11.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--rt-accent-strong);font-weight:700}
.rt-concept-direction::before{content:"";width:18px;height:2px;background:var(--rt-accent)}
.rt-concept-blurb{font-size:14.5px;color:var(--rt-text-soft);line-height:1.6;margin:0}
.rt-concept-frame{position:relative;background:#0a0a0a;border-radius:22px;padding:14px 12px 18px;box-shadow:var(--rt-shadow-frame);border:1px solid color-mix(in srgb,var(--rt-text) 16%,transparent);margin-top:auto}
.rt-concept-screen{position:relative;width:100%;aspect-ratio:9/14;background:#fff;border-radius:12px;overflow:hidden;transform-origin:top left;isolation:isolate}
.rt-concept-frame::before{content:"";position:absolute;top:6px;left:50%;transform:translateX(-50%);width:44px;height:5px;border-radius:999px;background:#1c1c1c;z-index:2}
.rt-concept-scaler{position:absolute;top:0;left:0;width:360px;height:560px;transform-origin:top left}
.rt-concept-tag{display:inline-flex;align-items:center;gap:6px;align-self:flex-start;padding:4px 10px;border-radius:999px;background:var(--rt-accent-soft);color:var(--rt-accent-strong);font-size:11px;letter-spacing:.08em;text-transform:uppercase;font-weight:700}

.rt-pricing{background:var(--rt-surface);border:1px solid var(--rt-border);border-radius:var(--rt-radius);padding:clamp(24px,3vw,36px);box-shadow:var(--rt-shadow-card);display:flex;flex-direction:column;gap:22px}
.rt-pricing-head{display:flex;flex-direction:column;gap:8px}
.rt-pricing-title{font-family:var(--rt-display);font-size:clamp(22px,3vw,28px);font-weight:600;letter-spacing:-.01em;margin:0;color:var(--rt-text)}
.rt-pricing-vat{font-size:13px;color:var(--rt-text-muted);margin:0}
.rt-tier-grid{display:grid;gap:14px;grid-template-columns:1fr}
@media(min-width:760px){.rt-tier-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
.rt-tier{position:relative;background:var(--rt-surface-2);border:1px solid var(--rt-border);border-radius:var(--rt-radius-sm);padding:clamp(18px,2.6vw,24px);display:flex;flex-direction:column;gap:14px}
.rt-tier[data-recommended="true"]{background:linear-gradient(155deg,color-mix(in srgb,var(--rt-accent-soft) 70%,var(--rt-surface)) 0%,var(--rt-surface) 100%);border:1.5px solid var(--rt-accent);box-shadow:0 12px 36px color-mix(in srgb,var(--rt-accent) 18%,transparent)}
.rt-tier-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}
.rt-tier-name{font-family:var(--rt-display);font-size:22px;font-weight:600;letter-spacing:-.01em;margin:0;color:var(--rt-text)}
.rt-tier-tagline{font-size:13px;color:var(--rt-text-muted);margin:4px 0 0}
.rt-tier-recommended{display:inline-flex;align-items:center;gap:6px;padding:3px 9px;background:var(--rt-accent);color:var(--rt-accent-ink);border-radius:999px;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase}
.rt-tier-rows{display:grid;gap:10px;margin:0}
.rt-tier-row{display:flex;justify-content:space-between;align-items:baseline;gap:12px;padding:8px 0;border-bottom:1px dashed var(--rt-border);font-size:14px;color:var(--rt-text-soft)}
.rt-tier-row:last-child{border-bottom:0}
.rt-tier-row dt{margin:0;color:var(--rt-text-muted);font-weight:500}
.rt-tier-row dd{margin:0;color:var(--rt-text);font-weight:600;text-align:right;font-variant-numeric:tabular-nums}
.rt-tier-notes{font-size:12.5px;color:var(--rt-text-muted);line-height:1.55;margin:0;font-style:italic}
.rt-pricing-note{font-size:13px;color:var(--rt-text-muted);line-height:1.55;margin:0;padding:14px 18px;border:1px dashed var(--rt-border-strong);border-radius:var(--rt-radius-sm);background:var(--rt-surface-2)}

.rt-steps{list-style:none;padding:0;margin:0;counter-reset:rt-step;display:grid;gap:14px}
.rt-step{display:grid;grid-template-columns:48px 1fr;gap:16px;align-items:start;padding:18px 20px;background:var(--rt-surface);border:1px solid var(--rt-border);border-radius:var(--rt-radius-sm);box-shadow:var(--rt-shadow-card)}
.rt-step-num{width:40px;height:40px;border-radius:12px;background:var(--rt-accent);color:var(--rt-accent-ink);font-family:var(--rt-display);font-weight:600;font-size:17px;display:inline-grid;place-items:center;counter-increment:rt-step;box-shadow:0 4px 14px color-mix(in srgb,var(--rt-accent) 32%,transparent)}
.rt-step-num::before{content:counter(rt-step)}
.rt-step-body{margin:0;color:var(--rt-text-soft);font-size:15px;line-height:1.65;padding-top:6px}

.rt-needs{list-style:none;padding:0;margin:0;display:grid;gap:10px}
.rt-need{display:grid;grid-template-columns:24px 1fr;gap:12px;padding:14px 16px;background:var(--rt-surface);border:1px solid var(--rt-border);border-radius:var(--rt-radius-sm);box-shadow:var(--rt-shadow-card);align-items:start}
.rt-need-check{width:22px;height:22px;border-radius:7px;background:var(--rt-positive);color:var(--rt-accent-ink);font-size:13px;font-weight:700;display:inline-grid;place-items:center;margin-top:2px}
.rt-need-body{margin:0;color:var(--rt-text-soft);font-size:15px;line-height:1.65}

.rt-disclaimer{margin-top:24px;padding:14px 16px;border:1px dashed var(--rt-border-strong);border-radius:var(--rt-radius-sm);color:var(--rt-text-muted);font-size:13px;line-height:1.6}
.rt-footer{margin-top:clamp(48px,7vw,80px);padding-top:28px;border-top:1px solid var(--rt-border);display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px;color:var(--rt-text-muted);font-size:13px}
.rt-footer a{color:var(--rt-accent-strong);text-decoration:none;font-weight:600}
.rt-footer a:focus-visible,.rt-brand:focus-visible{outline:2px solid var(--rt-accent);outline-offset:3px;border-radius:6px}

.rt-notice{background:var(--rt-surface);border:1px solid var(--rt-border);border-radius:var(--rt-radius);padding:clamp(32px,6vw,56px);box-shadow:var(--rt-shadow);text-align:left}
.rt-notice h1{font-family:var(--rt-display);font-size:clamp(26px,4vw,34px);line-height:1.2;letter-spacing:-.02em;margin:0 0 14px;color:var(--rt-text)}
.rt-notice p{margin:0 0 12px;color:var(--rt-text-soft);font-size:16px;line-height:1.65;max-width:56ch}
.rt-notice-cta{margin-top:22px;display:inline-flex;align-items:center;gap:10px;padding:12px 18px;background:var(--rt-accent);color:var(--rt-accent-ink);border-radius:999px;text-decoration:none;font-weight:600;font-size:15px;box-shadow:0 6px 16px color-mix(in srgb,var(--rt-accent) 28%,transparent)}

.rt-v2-grid{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}.rt-v2-stack{display:grid;gap:12px}.rt-badge{display:inline-flex;align-items:center;width:max-content;padding:3px 8px;border:1px solid var(--rt-border-strong);border-radius:999px;color:var(--rt-text-muted);font-size:11px;font-weight:700;letter-spacing:.03em}.rt-evidence-list{display:grid;gap:12px;list-style:none;padding:0;margin:0}.rt-evidence-item{padding:18px;background:var(--rt-surface);border:1px solid var(--rt-border);border-radius:var(--rt-radius-sm);box-shadow:var(--rt-shadow-card)}.rt-evidence-head{display:flex;justify-content:space-between;gap:12px;align-items:center}.rt-evidence-item h3{margin:12px 0 6px;color:var(--rt-text);font-size:16px}.rt-evidence-item p{margin:0;color:var(--rt-text-soft);line-height:1.55}.rt-evidence-source,.rt-evidence-ref{margin-top:10px!important;color:var(--rt-text-muted)!important;font-size:12px!important}.rt-evidence-ref code{margin-left:6px;color:var(--rt-accent-strong)}.rt-gap h3,.rt-visualization h3,.rt-offer-component h3{margin:0 0 8px;color:var(--rt-text)}.rt-gap p,.rt-visualization p{margin:0;color:var(--rt-text-soft);line-height:1.55}.rt-visual-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.rt-visual-list{list-style:none;padding:0;margin:18px 0 0;display:grid;gap:12px}.rt-visual-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center;color:var(--rt-text-soft)}.rt-visual-value{display:flex;gap:7px;align-items:center;justify-content:flex-end}.rt-visual-bar{grid-column:1/-1;height:8px;background:var(--rt-surface-2);border-radius:999px;overflow:hidden}.rt-visual-bar span{display:block;height:100%;background:var(--rt-accent);border-radius:inherit}.rt-journey{display:grid;gap:12px}.rt-journey-step{padding:18px;background:var(--rt-surface);border:1px solid var(--rt-border);border-radius:var(--rt-radius-sm)}.rt-journey-step h3{margin:12px 0 8px;color:var(--rt-text)}.rt-journey-step p{margin:5px 0;color:var(--rt-text-soft);line-height:1.55}.rt-concept{overflow:hidden;background:var(--rt-concept-bg);color:var(--rt-concept-text);border:1px solid var(--rt-border);border-radius:var(--rt-radius);box-shadow:var(--rt-shadow-card)}.rt-concept-summary{cursor:pointer;padding:20px;list-style:none}.rt-concept-summary::-webkit-details-marker{display:none}.rt-concept-summary::after{content:"Öppna";float:right;color:var(--rt-concept-accent);font-size:12px;font-weight:700}.rt-concept[open] .rt-concept-summary::after{content:"Stäng"}.rt-concept-name{margin:10px 0 5px;font-family:var(--rt-display);font-size:24px;color:var(--rt-concept-text)}.rt-concept-direction,.rt-concept-blurb{display:block;color:var(--rt-concept-muted);line-height:1.5}.rt-concept-blurb{margin:10px 0 0}.rt-concept-body{display:grid;gap:16px;padding:0 20px 20px}.rt-concept-preview{padding:22px;background:var(--rt-concept-surface);border-radius:var(--rt-radius-sm);color:var(--rt-concept-text)}.rt-concept-preview h4{margin:6px 0 8px;font-family:var(--rt-display);font-size:28px;line-height:1.1}.rt-concept-preview p{margin:6px 0;line-height:1.5}.rt-concept-eyebrow{color:var(--rt-concept-accent)!important;font-size:11px!important;font-weight:700;letter-spacing:.1em;text-transform:uppercase}.rt-concept-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}.rt-concept-actions span{padding:9px 12px;border-radius:999px;background:var(--rt-concept-accent);color:var(--rt-concept-on-accent);font-size:12px;font-weight:700}.rt-concept-actions span+span{background:transparent;color:var(--rt-concept-accent);border:1px solid var(--rt-concept-accent)}.rt-concept-proofs{display:grid;grid-template-columns:repeat(auto-fit,minmax(90px,1fr));gap:8px;margin-top:18px}.rt-concept-proofs>div{padding:10px;border:1px solid color-mix(in srgb,var(--rt-concept-accent) 25%,transparent);border-radius:10px}.rt-concept-proofs strong,.rt-concept-proofs span{display:block}.rt-concept-proofs strong{font-size:18px}.rt-concept-proofs span{font-size:11px;color:var(--rt-concept-muted)}.rt-concept-copy{display:grid;gap:12px}.rt-concept-copy article{padding:14px;border:1px solid var(--rt-border);border-radius:var(--rt-radius-sm);background:color-mix(in srgb,var(--rt-concept-surface) 72%,transparent)}.rt-concept-copy h4{margin:0;color:var(--rt-concept-text)}.rt-concept-copy p{margin:7px 0;color:var(--rt-concept-muted);line-height:1.5}.rt-concept-copy ul{margin:0;padding-left:18px;color:var(--rt-concept-muted);line-height:1.5}.rt-offer{display:grid;gap:20px}.rt-offer-component{padding:18px;background:var(--rt-surface-2);border:1px solid var(--rt-border);border-radius:var(--rt-radius-sm)}.rt-offer-component header{margin-bottom:12px}.rt-offer-component .rt-needs{margin-top:12px}.rt-offer-totals{display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(180px,1fr))}.rt-offer-totals>div{display:grid;gap:5px;padding:16px;background:var(--rt-surface-2);border:1px solid var(--rt-border);border-radius:var(--rt-radius-sm)}.rt-offer-totals span{color:var(--rt-text-muted);font-size:12px}.rt-offer-totals strong{color:var(--rt-text);font-size:18px}.rt-assumptions{padding:16px;background:var(--rt-surface-2);border:1px dashed var(--rt-border-strong);border-radius:var(--rt-radius-sm)}.rt-assumptions h3{margin:0 0 10px;color:var(--rt-text)}.rt-assumptions ul{display:grid;gap:12px;margin:0;padding:0;list-style:none}.rt-assumptions li{display:grid;gap:5px;color:var(--rt-text-soft)}.rt-offer-details{padding:14px 0;border-top:1px solid var(--rt-border)}.rt-offer-details summary{cursor:pointer;color:var(--rt-accent-strong);font-weight:700}.rt-offer-details .rt-offer-component{margin-top:12px}

.rt-concepts{align-items:start;align-content:start}.rt-concept{align-self:start;display:block;height:fit-content;min-width:0;padding:0}.rt-concept-body{min-width:0}.rt-preview-devices{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(112px,.55fr);gap:12px;align-items:start}.rt-preview-browser{min-width:0;overflow:hidden;border:1px solid color-mix(in srgb,var(--rt-concept-accent) 22%,transparent);border-radius:14px;background:var(--rt-concept-surface);box-shadow:0 14px 28px color-mix(in srgb,var(--rt-concept-text) 12%,transparent)}.rt-preview-browser-bar{display:flex;align-items:center;gap:8px;padding:8px 10px;background:color-mix(in srgb,var(--rt-concept-text) 8%,var(--rt-concept-surface));color:var(--rt-concept-muted);font-size:10px}.rt-preview-dots{display:inline-flex;gap:3px;flex:0 0 auto}.rt-preview-dots i{width:5px;height:5px;border-radius:999px;background:var(--rt-concept-accent);opacity:.65}.rt-preview-address{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rt-preview-site{min-height:250px;padding:14px;background:linear-gradient(145deg,color-mix(in srgb,var(--rt-concept-bg) 86%,var(--rt-concept-surface)),var(--rt-concept-surface));color:var(--rt-concept-text)}.rt-preview-nav{display:flex;justify-content:space-between;gap:8px;align-items:center;margin-bottom:18px;font-size:10px;color:var(--rt-concept-muted)}.rt-preview-nav strong{color:var(--rt-concept-text);font-size:12px}.rt-preview-nav span{max-width:45%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rt-preview-hero{padding:12px;border-radius:12px;background:color-mix(in srgb,var(--rt-concept-accent) 13%,var(--rt-concept-surface))}.rt-preview-hero h4{font-size:clamp(18px,2.8vw,28px)}.rt-preview-sections{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:10px}.rt-preview-section{padding:9px;border:1px solid color-mix(in srgb,var(--rt-concept-accent) 18%,transparent);border-radius:10px;background:color-mix(in srgb,var(--rt-concept-surface) 78%,transparent)}.rt-preview-section h5{margin:4px 0;font-size:12px;color:var(--rt-concept-text)}.rt-preview-section p{margin:0;color:var(--rt-concept-muted);font-size:10px;line-height:1.4;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden}.rt-preview-kicker{color:var(--rt-concept-accent);font-size:8px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}.rt-preview-mobile{min-width:0;padding:7px;border:1px solid color-mix(in srgb,var(--rt-concept-text) 24%,transparent);border-radius:18px;background:var(--rt-concept-text);box-shadow:0 14px 28px color-mix(in srgb,var(--rt-concept-text) 18%,transparent)}.rt-preview-mobile-bar{display:flex;justify-content:space-between;gap:6px;padding:5px 6px 8px;color:var(--rt-concept-on-accent);font-size:8px}.rt-preview-mobile-bar span:first-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rt-preview-mobile-screen{min-height:238px;padding:12px 10px;border-radius:12px;background:linear-gradient(165deg,var(--rt-concept-bg),var(--rt-concept-surface));color:var(--rt-concept-text)}.rt-preview-mobile-screen h4{margin:5px 0 7px;font-size:18px;line-height:1.08}.rt-preview-mobile-screen>p:not(.rt-concept-eyebrow){display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:4;overflow:hidden;font-size:11px}.rt-preview-mobile-action{display:block;margin-top:12px;padding:7px 8px;border-radius:999px;background:var(--rt-concept-accent);color:var(--rt-concept-on-accent);font-size:10px;font-weight:700;text-align:center}.rt-preview-mobile-proof{display:flex;justify-content:space-between;gap:5px;margin-top:10px;padding-top:8px;border-top:1px solid color-mix(in srgb,var(--rt-concept-accent) 22%,transparent);font-size:9px}.rt-preview-mobile-proof span{color:var(--rt-concept-muted);text-align:right}@media(max-width:759px){.rt-preview-devices{grid-template-columns:1fr}.rt-preview-mobile{max-width:260px}}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}
`;
};
