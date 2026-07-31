import type { ReactElement } from "react";

import { IconCheck, IconMinus } from "./icons";

type Props = {
  before: string[];
  after: string[];
  /** Optional short note below the comparison (e.g. estimate boundary). */
  note?: string;
};

/**
 * Qualitative comparison. Before/after pairing rather than a metric bar. The
 * `before` list represents the prospect's reported situation; the `after`
 * list represents the qualitative outcomes of the recommendation. No
 * fabricated percentages, conversions or revenue numbers appear here.
 */
export function Comparison({ before, after, note }: Props): ReactElement {
  if (before.length === 0 && after.length === 0) return <></>;
  return (
    <div>
      <p className="rt-eyebrow">Kvalitativ jämförelse</p>
      <div className="rt-comparison" style={{ marginTop: 16 }}>
        <article className="rt-comparison-card" data-side="before">
          <span className="rt-comparison-label">
            <IconMinus size={14} aria-hidden={true} />
            Idag
          </span>
          <ul className="rt-comparison-list">
            {before.map((item) => (
              <li key={`b-${item}`} className="rt-comparison-item">
                <IconMinus size={16} aria-hidden={true} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
        <article className="rt-comparison-card" data-side="after">
          <span className="rt-comparison-label">
            <IconCheck size={14} aria-hidden={true} />
            Med Webbtjänst
          </span>
          <ul className="rt-comparison-list">
            {after.map((item) => (
              <li key={`a-${item}`} className="rt-comparison-item">
                <IconCheck size={16} aria-hidden={true} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
      {note ? <p className="rt-comparison-note">{note}</p> : null}
    </div>
  );
}
