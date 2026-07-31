import Link from "next/link";

export default function Home() {
  return (
    <main className="shell">
      <section className="notice" aria-labelledby="page-title">
        <p className="eyebrow">Webbtjänst</p>
        <h1 id="page-title">Personlig företagsinformation</h1>
        <p>
          En personlig sammanställning öppnas endast via länken som skickats
          efter samtalet. Här finns ingen publik lista över rapporter.
        </p>
        <Link href="https://www.webbtjanst.com">Besök Webbtjänst</Link>
      </section>
    </main>
  );
}
