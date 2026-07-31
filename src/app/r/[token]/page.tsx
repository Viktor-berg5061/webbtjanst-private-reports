import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PUBLIC_WEBSITE_URL, resolveReport } from "@/lib/report";

import { ReportHero } from "@/components/ReportHero";
import { Observations, Situation, DefaultSituationDiagram } from "@/components/Situation";
import { Recommendation, ValueFlow } from "@/components/Recommendation";
import { Comparison } from "@/components/Comparison";
import { ConceptPreview, DEFAULT_CONCEPTS, resolveConcepts, type ConceptPayload } from "@/components/Concepts";
import { PricingOverview, type PricingTier } from "@/components/Pricing";
import { IconCheck } from "@/components/icons";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Personlig sammanställning | Webbtjänst",
  robots: { index: false, follow: false, nocache: true },
};

export default async function ReportPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const report = await resolveReport(token);
  if (!report) notFound();

  const { content } = report;
  const accent = content.theme?.accent;
  const style = accent
    ? ({ "--rt-accent": accent, "--rt-accent-strong": accent, "--rt-accent-soft": "transparent" } as CSSProperties)
    : undefined;

  const observations = content.observations ?? [];
  const nextSteps = content.nextSteps ?? [];
  const neededFromCustomer = content.neededFromCustomer ?? [];

  const concepts: ConceptPayload[] = content.conceptPreviews && content.conceptPreviews.length > 0
    ? resolveConcepts(content.conceptPreviews as unknown as ConceptPayload[])
    : DEFAULT_CONCEPTS;

  const tiers: PricingTier[] | undefined = content.pricingOverview?.tiers;

  return (
    <main className="shell" style={style}>
      <header className="rt-header">
        <a className="rt-brand" href={PUBLIC_WEBSITE_URL} rel="noopener">
          <span className="rt-brand-mark" aria-hidden="true">W</span>
          <span>Webbtjänst</span>
        </a>
        <span className="rt-tag">
          <span className="rt-tag-dot" aria-hidden="true" />
          Personlig sammanställning
        </span>
      </header>

      <ReportHero
        companyName={content.companyName}
        contactName={content.contactName}
        title={content.title}
        introduction={content.introduction}
        pull={content.situation?.headline}
        highlights={content.highlights}
      />

      {content.situation ? (
        <section className="rt-section" aria-labelledby="rt-sit">
          <Situation
            headline={content.situation.headline}
            body={content.situation.body}
            diagram={<DefaultSituationDiagram />}
          />
        </section>
      ) : null}

      {observations.length > 0 ? (
        <section className="rt-section" aria-labelledby="rt-obs">
          <header className="rt-section-head">
            <div>
              <p className="rt-section-eyebrow">Det vi ser</p>
              <h2 className="rt-section-title" id="rt-obs">Tre saker vi tar med oss från samtalet</h2>
            </div>
            <p className="rt-section-aside">Kvalitativa observationer — inte marknadssiffror.</p>
          </header>
          <Observations items={observations} />
        </section>
      ) : null}

      {content.comparison && (content.comparison.before.length > 0 || content.comparison.after.length > 0) ? (
        <section className="rt-section" aria-labelledby="rt-cmp">
          <header className="rt-section-head">
            <div>
              <p className="rt-section-eyebrow">Vad som ändras</p>
              <h2 className="rt-section-title" id="rt-cmp">Från dagens situation till ett tydligare upplägg</h2>
            </div>
          </header>
          <Comparison before={content.comparison.before} after={content.comparison.after} />
        </section>
      ) : null}

      <section className="rt-section" aria-labelledby="rt-reco">
        <header className="rt-section-head">
          <div>
            <p className="rt-section-eyebrow">Vår rekommendation</p>
            <h2 className="rt-section-title" id="rt-reco">Webbplats och AI-receptionist som hör ihop</h2>
          </div>
          <p className="rt-section-aside">Kombinationen är vald utifrån er situation, inte en standard.</p>
        </header>
        <Recommendation
          summary={content.recommendation.summary}
          website={content.recommendation.website}
          receptionist={content.recommendation.receptionist}
        />
      </section>

      {content.valueFlow && content.valueFlow.length > 0 ? (
        <section className="rt-section" aria-labelledby="rt-flow">
          <ValueFlow stages={content.valueFlow} />
        </section>
      ) : null}

      <section className="rt-section" aria-labelledby="rt-concepts">
        <header className="rt-section-head">
          <div>
            <p className="rt-section-eyebrow">Tre koncept att utgå från</p>
            <h2 className="rt-section-title" id="rt-concepts">Tänkbara riktningar för er webbplats</h2>
          </div>
          <p className="rt-section-aside">Konceptförslag — inte färdiga leveranser.</p>
        </header>
        <div className="rt-concepts">
          {concepts.map((c, i) => (
            <ConceptPreview key={c.id} concept={c} index={i} />
          ))}
        </div>
      </section>

      {tiers && tiers.length > 0 && content.pricingOverview ? (
        <section className="rt-section" aria-labelledby="rt-pricing">
          <PricingOverview
            tiers={tiers}
            vatNote={content.pricingOverview.vatNote}
            personalNote="Den mittersta nivån (Tillväxt) är markerad som rekommenderad för just er."
          />
        </section>
      ) : null}

      {nextSteps.length > 0 ? (
        <section className="rt-section" aria-labelledby="rt-steps">
          <header className="rt-section-head">
            <div>
              <p className="rt-section-eyebrow">Så går det till</p>
              <h2 className="rt-section-title" id="rt-steps">Fyra steg från samtal till första samtal via er nya lösning</h2>
            </div>
          </header>
          <ol className="rt-steps">
            {nextSteps.map((item) => (
              <li className="rt-step" key={item}>
                <span className="rt-step-num" aria-hidden="true" />
                <p className="rt-step-body">{item}</p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {neededFromCustomer.length > 0 ? (
        <section className="rt-section" aria-labelledby="rt-needs">
          <header className="rt-section-head">
            <div>
              <p className="rt-section-eyebrow">Vad vi behöver från er</p>
              <h2 className="rt-section-title" id="rt-needs">Material och beslut för att kunna börja bygga</h2>
            </div>
          </header>
          <ul className="rt-needs">
            {neededFromCustomer.map((item) => (
              <li className="rt-need" key={item}>
                <span className="rt-need-check" aria-hidden="true"><IconCheck size={12} /></span>
                <p className="rt-need-body">{item}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {content.disclaimer ? <p className="rt-disclaimer">{content.disclaimer}</p> : null}

      <footer className="rt-footer">
        <span>Webbtjänst · personlig sammanställning</span>
        <a href={PUBLIC_WEBSITE_URL} rel="noopener">Läs mer om Webbtjänst →</a>
      </footer>
    </main>
  );
}
