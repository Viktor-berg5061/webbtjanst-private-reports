import Link from "next/link";

export default function NotFound() {
  return (
    <main className="shell">
      <section className="notice">
        <p className="eyebrow">Webbtjänst</p>
        <h1>Sidan kan inte visas</h1>
        <p>Länken är felaktig, har gått ut eller har återkallats. Kontakta Webbtjänst om du behöver en ny länk.</p>
        <Link href="https://www.webbtjanst.com">Besök Webbtjänst</Link>
      </section>
    </main>
  );
}
