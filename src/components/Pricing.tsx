import type { ReactElement } from "react";

export type PricingTier = {
  id: string;
  name: string;
  tagline: string;
  recommended: boolean;
  website: string;
  receptionist: string;
  extraMinutes: string;
  maintenance?: string;
  notes?: string;
};

export type PricingOverviewProps = {
  tiers: PricingTier[];
  vatNote: string;
  personalNote?: string;
};

/**
 * Full pricing overview. Each tier is rendered as a card with the recommended
 * tier visually highlighted (accent border, recommended pill, soft tinted
 * background). No fabricated urgency. Every price string is shown verbatim
 * from the supplied overview so we never invent numbers.
 */
export function PricingOverview({ tiers, vatNote, personalNote }: PricingOverviewProps): ReactElement {
  if (tiers.length === 0) return <></>;
  return (
    <section className="rt-pricing" aria-labelledby="rt-pricing-title">
      <header className="rt-pricing-head">
        <p className="rt-eyebrow">Prisbild · hela utbudet</p>
        <h3 id="rt-pricing-title" className="rt-pricing-title">Tre nivåer för webbplats och AI-receptionist</h3>
        <p className="rt-pricing-vat">{vatNote}</p>
        {personalNote ? <p className="rt-pricing-vat" style={{ marginTop: 4 }}>{personalNote}</p> : null}
      </header>
      <div className="rt-tier-grid">
        {tiers.map((tier) => (
          <article key={tier.id} className="rt-tier" data-recommended={tier.recommended ? "true" : "false"}>
            <header className="rt-tier-head">
              <div>
                <h4 className="rt-tier-name">{tier.name}</h4>
                <p className="rt-tier-tagline">{tier.tagline}</p>
              </div>
              {tier.recommended ? (
                <span className="rt-tier-recommended" aria-label="Rekommenderad nivå för er">
                  Er rekommendation
                </span>
              ) : null}
            </header>
            <dl className="rt-tier-rows">
              <div className="rt-tier-row">
                <dt>Webbplats / setup</dt>
                <dd>{tier.website}</dd>
              </div>
              <div className="rt-tier-row">
                <dt>AI-receptionist</dt>
                <dd>{tier.receptionist}</dd>
              </div>
              <div className="rt-tier-row">
                <dt>Extra minut</dt>
                <dd>{tier.extraMinutes}</dd>
              </div>
              {tier.maintenance ? (
                <div className="rt-tier-row">
                  <dt>Underhåll (valfritt)</dt>
                  <dd>{tier.maintenance}</dd>
                </div>
              ) : null}
            </dl>
            {tier.notes ? <p className="rt-tier-notes">{tier.notes}</p> : null}
          </article>
        ))}
      </div>
      <p className="rt-pricing-note">
        Priser anges exklusive moms. Tillval som underhåll, extraminuter och
        premiumfunktioner kan läggas till eller tas bort — inget är obligatoriskt
        utöver den rekommenderade nivån för just ert företag.
      </p>
    </section>
  );
}
