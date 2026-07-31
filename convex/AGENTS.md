# Convex backend rules

- Store only token hashes, never raw capability tokens.
- Every public HTTP route requires `REPORT_INGEST_SECRET`; compare it without logging it.
- Use indexed reads and bounded validators. Do not add a report list endpoint.
- Customer content stays in Convex and must never be copied into Git.
- Return the same not-found shape for unknown, expired and revoked reports.
