import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PUBLIC_WEBSITE_URL, resolveReport } from "@/lib/report";

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

      <article className="rt-hero">
        <p className="rt-eyebrow">För {content.companyName}</p>
        <h1 className="rt-title">{content.title}</h1>
        <p className="rt-meta">
          {content.contactName ? (
            <>Upplagd för <strong>{content.contactName}</strong> · </>
          ) : null}
          Sammanställd efter vårt samtal
        </p>
        <p className="rt-intro">{content.introduction}</p>
      </article>

      <section className="rt-section" aria-labelledby="rt-obs">
        <h2 className="rt-section-title" id="rt-obs">Det vi ser</h2>
        <ol className="rt-observations">
          {observations.map((item, index) => (
            <li className="rt-observation" key={item}>
              <span className="rt-observation-num" aria-hidden="true">{index + 1}</span>
              <span className="rt-observation-body">{item}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="rt-section" aria-labelledby="rt-reco">
        <h2 className="rt-section-title" id="rt-reco">Vår rekommendation</h2>
        <div className="rt-card">
          <p className="rt-reco-summary">{content.recommendation.summary}</p>
          <div className="rt-pillars">
            <article className="rt-pillar">
              <span className="rt-pillar-icon" aria-hidden="true">◐</span>
              <h3>Webbplats</h3>
              <p>{content.recommendation.website}</p>
            </article>
            <article className="rt-pillar">
              <span className="rt-pillar-icon" aria-hidden="true">◍</span>
              <h3>AI-receptionist</h3>
              <p>{content.recommendation.receptionist}</p>
            </article>
          </div>
          <div className="rt-price">
            <span className="rt-price-label">Prisbild</span>
            <p className="rt-price-body">{content.recommendation.pricing}</p>
          </div>
        </div>
      </section>

      <section className="rt-section" aria-labelledby="rt-steps">
        <h2 className="rt-section-title" id="rt-steps">Så går det till</h2>
        <ol className="rt-steps">
          {nextSteps.map((item) => (
            <li className="rt-step" key={item}>
              <span className="rt-step-num" aria-hidden="true" />
              <p className="rt-step-body">{item}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="rt-section" aria-labelledby="rt-needs">
        <h2 className="rt-section-title" id="rt-needs">Det vi behöver från er</h2>
        <ul className="rt-needs">
          {neededFromCustomer.map((item) => (
            <li className="rt-need" key={item}>
              <span className="rt-need-check" aria-hidden="true">✓</span>
              <p className="rt-need-body">{item}</p>
            </li>
          ))}
        </ul>
      </section>

      {content.disclaimer ? <p className="rt-disclaimer">{content.disclaimer}</p> : null}

      <footer className="rt-footer">
        <span>Webbtjänst · personlig sammanställning</span>
        <a href={PUBLIC_WEBSITE_URL} rel="noopener">Läs mer om Webbtjänst →</a>
      </footer>
    </main>
  );
}
