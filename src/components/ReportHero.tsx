import type { ReactElement } from "react";

/**
 * Editorial opening hero. Combines eyebrow, serif headline, intro and a
 * framed aside (situation pull + bullet highlights). Aside stays above the
 * intro on narrow screens and docks to the right on wide screens.
 */

import { IconCheck } from "./icons";

type HighlightsProps = { items: string[] };

export function Highlights({ items }: HighlightsProps): ReactElement {
  return (
    <ul className="rt-hero-highlights" aria-label="Sammanfattande punkter">
      {items.map((item) => (
        <li key={item} className="rt-hero-highlight">
          <IconCheck size={18} aria-hidden={true} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

type Props = {
  companyName: string;
  contactName?: string;
  title: string;
  introduction: string;
  pull?: string;
  highlights?: string[];
};

export function ReportHero({ companyName, contactName, title, introduction, pull, highlights }: Props): ReactElement {
  return (
    <article className="rt-hero">
      <div className="rt-hero-grid">
        <div>
          <p className="rt-eyebrow">För {companyName}</p>
          <h1 className="rt-title">{title}</h1>
          <p className="rt-meta">
            {contactName ? (
              <>
                Upplagd för <strong>{contactName}</strong> ·{" "}
              </>
            ) : null}
            Sammanställd efter vårt samtal
          </p>
          <p className="rt-intro">{introduction}</p>
        </div>
        {(pull || (highlights && highlights.length > 0)) ? (
          <aside className="rt-hero-aside" aria-label="Sammanfattning i korthet">
            <h3>I korthet</h3>
            {pull ? <p className="rt-hero-pull">&ldquo;{pull}&rdquo;</p> : null}
            {highlights && highlights.length > 0 ? <Highlights items={highlights} /> : null}
          </aside>
        ) : null}
      </div>
    </article>
  );
}
