import type { ReactElement } from "react";

import { IconQuote } from "./icons";

type Props = {
  headline: string;
  body: string;
  diagram: ReactElement;
};

/**
 * Situation diagram: short editorial statement on the left, qualitative SVG
 * on the right. The diagram is supplied by the caller so the figure can be
 * tailored to each company without hard-coding a single shape.
 */
export function Situation({ headline, body, diagram }: Props): ReactElement {
  return (
    <div className="rt-situation">
      <div>
        <p className="rt-eyebrow">Nuläge &amp; möjlighet</p>
        <h2 className="rt-situation-headline">{headline}</h2>
        <p className="rt-situation-body">{body}</p>
      </div>
      {diagram}
    </div>
  );
}

/**
 * Default qualitative situation diagram used when the report does not provide
 * a custom SVG. Shows a calm "where you are" → "where you could be" arc with
 * no fabricated numbers, only labels and qualitative bars.
 */
export function DefaultSituationDiagram(): ReactElement {
  return (
    <svg
      className="rt-situation-diagram"
      viewBox="0 0 360 200"
      role="img"
      aria-label="Kvalitativ nuläges- och möjlighetsbild: idag syns ni lite, med Webbtjänst blir ni tydliga, nåbara och strukturerade."
    >
      <defs>
        <linearGradient id="rt-now" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--rt-border)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="var(--rt-border)" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="rt-next" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--rt-accent)" stopOpacity="0.95" />
          <stop offset="100%" stopColor="var(--rt-accent)" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <g fontFamily="-apple-system, Segoe UI, Inter, sans-serif" fontSize="11">
        <text x="20" y="28" fill="var(--rt-text-muted)" fontWeight="600" letterSpacing="1">
          IDAG
        </text>
        <text x="220" y="28" fill="var(--rt-accent-strong)" fontWeight="700" letterSpacing="1">
          MED WEBBTJÄNST
        </text>
      </g>
      {/* Now bar */}
      <rect x="20" y="44" width="44" height="100" rx="6" fill="url(#rt-now)" />
      <text x="42" y="166" textAnchor="middle" fontFamily="-apple-system, sans-serif" fontSize="10" fill="var(--rt-text-muted)">
        Synlighet
      </text>
      <rect x="20" y="74" width="32" height="70" rx="6" fill="url(#rt-now)" />
      <text x="36" y="166" textAnchor="middle" fontFamily="-apple-system, sans-serif" fontSize="10" fill="var(--rt-text-muted)" dx="56">
        Kontakt
      </text>
      <rect x="20" y="104" width="24" height="40" rx="6" fill="url(#rt-now)" />
      <text x="32" y="166" textAnchor="middle" fontFamily="-apple-system, sans-serif" fontSize="10" fill="var(--rt-text-muted)" dx="112">
        Struktur
      </text>
      {/* Next bar */}
      <rect x="220" y="36" width="120" height="108" rx="6" fill="url(#rt-next)" />
      <text x="280" y="166" textAnchor="middle" fontFamily="-apple-system, sans-serif" fontSize="10" fill="var(--rt-text)">
        Synlighet
      </text>
      <rect x="220" y="56" width="120" height="88" rx="6" fill="url(#rt-next)" opacity="0.85" />
      <text x="280" y="166" textAnchor="middle" fontFamily="-apple-system, sans-serif" fontSize="10" fill="var(--rt-text)" dx="60">
        Kontakt
      </text>
      <rect x="220" y="80" width="120" height="64" rx="6" fill="url(#rt-next)" opacity="0.7" />
      <text x="280" y="166" textAnchor="middle" fontFamily="-apple-system, sans-serif" fontSize="10" fill="var(--rt-text)" dx="120">
        Struktur
      </text>
      {/* Arc */}
      <path
        d="M64 84 C 140 60, 220 60, 220 80"
        fill="none"
        stroke="var(--rt-accent)"
        strokeWidth="1.4"
        strokeDasharray="4 4"
        opacity="0.7"
      />
      <g transform="translate(124 56)">
        <rect x="0" y="0" width="92" height="20" rx="10" fill="var(--rt-surface)" stroke="var(--rt-accent)" strokeWidth="1" />
        <text x="46" y="14" textAnchor="middle" fontFamily="-apple-system, sans-serif" fontSize="10" fill="var(--rt-accent-strong)" fontWeight="600">
          kvalitativ illustration
        </text>
      </g>
    </svg>
  );
}

/**
 * Editorial observation cards. Numbered in serif type, no row of identical
 * list rows. Falls back to a single quote-style line if only one item is
 * passed, to keep the section from feeling empty.
 */
export function Observations({ items }: { items: string[] }): ReactElement {
  if (items.length === 0) return <></>;
  const safeItems = items.slice(0, 6);
  return (
    <ol className="rt-observations" aria-label="Observationer från samtalet">
      {safeItems.map((item, index) => (
        <li className="rt-observation" key={`${index}-${item.slice(0, 16)}`}>
          <span className="rt-observation-num" aria-hidden={true}>
            <span>Observation</span>
            <strong>{String(index + 1).padStart(2, "0")}</strong>
          </span>
          <p className="rt-observation-body">{item}</p>
          <span className="rt-observation-icon" aria-hidden={true}>
            <IconQuote size={20} />
          </span>
        </li>
      ))}
    </ol>
  );
}
