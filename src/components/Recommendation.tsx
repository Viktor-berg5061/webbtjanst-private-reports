import type { ReactElement } from "react";

import { IconCheck, IconGlobe, IconPhone } from "./icons";

type Props = {
  summary: string;
  website: string;
  receptionist: string;
  websiteBullets?: string[];
  receptionistBullets?: string[];
};

/**
 * Recommendation section. The summary opens the section, followed by two
 * large feature blocks (webbplats, AI-receptionist) on desktop. Each feature
 * block has its own icon, headline and a short bullet list (always optional).
 */
export function Recommendation({ summary, website, receptionist, websiteBullets, receptionistBullets }: Props): ReactElement {
  return (
    <div className="rt-card" style={{ padding: 0 }}>
      <div style={{ padding: "clamp(24px, 4vw, 36px)" }}>
        <p className="rt-reco-summary">{summary}</p>
      </div>
      <div className="rt-features" style={{ padding: "0 clamp(24px, 4vw, 36px) clamp(24px, 4vw, 36px)" }}>
        <article className="rt-feature">
          <span className="rt-feature-icon" aria-hidden={true}>
            <IconGlobe size={22} />
          </span>
          <h3>Webbplats</h3>
          <p>{website}</p>
          {websiteBullets && websiteBullets.length > 0 ? (
            <ul className="rt-feature-list" aria-label="Vad webbplatsen innehåller">
              {websiteBullets.map((item) => (
                <li key={item}>
                  <IconCheck size={16} aria-hidden={true} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </article>
        <article className="rt-feature">
          <span className="rt-feature-icon" aria-hidden={true}>
            <IconPhone size={22} />
          </span>
          <h3>AI-receptionist</h3>
          <p>{receptionist}</p>
          {receptionistBullets && receptionistBullets.length > 0 ? (
            <ul className="rt-feature-list" aria-label="Vad AI-receptionisten hanterar">
              {receptionistBullets.map((item) => (
                <li key={item}>
                  <IconCheck size={16} aria-hidden={true} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </article>
      </div>
    </div>
  );
}

/**
 * Value-flow diagram. Renders a horizontal track of qualitative stages
 * (synlighet → förtroende → kontakt → fångad kallelse → strukturerad
 * överlämning → nästa steg). Uses inline SVG arrows on wide screens and
 * falls back to a clean stacked layout on narrow screens.
 */
export function ValueFlow({ stages }: { stages: { stage: string; description: string }[] }): ReactElement {
  if (stages.length === 0) return <></>;
  return (
    <div
      className="rt-flow"
      style={{ ["--rt-flow-steps" as string]: String(stages.length) } as React.CSSProperties}
    >
      <p className="rt-eyebrow">Så hänger det ihop</p>
      <h3 className="rt-section-title" style={{ margin: "8px 0 24px", maxWidth: "32ch" }}>
        Webbplats och AI-receptionist i ett sammanhängande flöde
      </h3>
      <div className="rt-flow-track">
        {stages.map((s, i) => (
          <div className="rt-flow-step" key={`${i}-${s.stage}`}>
            <span className="rt-flow-num">Steg {i + 1}</span>
            <span className="rt-flow-stage">{s.stage}</span>
            <p className="rt-flow-desc">{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
