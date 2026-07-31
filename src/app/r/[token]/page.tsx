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
  const style = content.theme?.accent
    ? ({ "--report-accent": content.theme.accent } as CSSProperties)
    : undefined;

  return (
    <main className="shell" style={style}>
      <article className="report">
        <p className="eyebrow">Personlig sammanställning från Webbtjänst</p>
        <h1>{content.title}</h1>
        <p className="muted">För {content.companyName}</p>
        <p>{content.introduction}</p>
        <section><h2>Det vi ser</h2><ul>{content.observations.map((item) => <li key={item}>{item}</li>)}</ul></section>
        <section>
          <h2>Vår rekommendation</h2><p>{content.recommendation.summary}</p>
          <h3>Webbplats</h3><p>{content.recommendation.website}</p>
          <h3>AI-receptionist</h3><p>{content.recommendation.receptionist}</p>
          <h3>Prisbild</h3><p>{content.recommendation.pricing}</p>
        </section>
        <section><h2>Så går det till</h2><ol>{content.nextSteps.map((item) => <li key={item}>{item}</li>)}</ol></section>
        <section><h2>Det vi behöver från er</h2><ul>{content.neededFromCustomer.map((item) => <li key={item}>{item}</li>)}</ul></section>
        {content.disclaimer ? <p className="muted">{content.disclaimer}</p> : null}
        <p><a href={PUBLIC_WEBSITE_URL}>Läs mer om Webbtjänst</a></p>
      </article>
    </main>
  );
}
