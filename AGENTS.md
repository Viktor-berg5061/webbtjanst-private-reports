<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Webbtjänst private reports

- This repository contains the single shared report application. Never create one repository per prospect.
- Git contains application code only. Prospect names, contact details, report bodies, access tokens and delivery state belong in Convex.
- A report is reachable only through an opaque capability URL under `/r/<token>`. Never add a report index, directory, search endpoint or predictable customer slug.
- Store only SHA-256 hashes of capability tokens. Invalid, expired and revoked tokens must return the same generic not-found result.
- The public Webbtjänst URL is `https://www.webbtjanst.com`; it is distinct from each private report URL.
- `personal-report-page-agent` owns report copy and visual direction. Infrastructure code must expose safe structured content and theme fields, not arbitrary executable HTML or JavaScript.
- `convex/reportContract.ts` is the single shared contract for legacy content and `personal_report_v2`. v2 is identified by both `kind: "personal_report_v2"` and `schemaVersion: 2`; semantic validation requires exactly three structured concepts, evidence references, safe HTTP source URLs, safe hex colors and price totals. Renderers must consume the supplied data and may use only native safe interaction such as `details`.
- The runtime validator rejects unsupported v2 object fields before `runMutation`, mirroring Convex's exact `v.object` shape so malformed agent payloads fail as a safe 400 instead of a post-mutation 500.
- Rendering truth: `convex/reportRender.ts` and `src/components/V2Report.tsx` use the same validated v2 fields. The display layer translates classifications, visualization/layout enums and canonical service IDs into customer-facing labels, replaces unknown values with `Ej verifierat i underlaget`, and suppresses internal pipeline terms without changing stored data. Each of the exactly three agent concepts is an opening-safe `details` panel with data-driven browser and mobile previews, evidence references and natural-height layout; no raw HTML/JS or hardcoded prospect concepts are allowed.
- Real SMS and email delivery remains disabled until separately approved.
- Secrets belong in Convex/VPS environment variables and must never be committed.
- Pushes to `master` are verified and deployed to the production Convex project by `.github/workflows/deploy-convex.yml`. The workflow must pass the locked install, type-check, functional tests, lint and production build before deployment; `CONVEX_DEPLOY_KEY` remains a GitHub Actions secret.
