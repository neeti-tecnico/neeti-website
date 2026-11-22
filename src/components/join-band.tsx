import Link from "next/link";

/** Faixa final da home: convite para falar com o núcleo. */
export default function JoinBand() {
  return (
    <section className="relative z-10 px-4 py-24" aria-labelledby="junta-te">
      <div
        className="glass-card mx-auto max-w-5xl px-6 py-14 text-center md:px-16 md:py-20"
        style={{
          background:
            "linear-gradient(135deg, rgba(123,44,191,0.28), rgba(0,240,255,0.08)), rgba(11,12,34,0.6)",
        }}
      >
        <p
          className="mb-3 text-xs uppercase tracking-[0.3em]"
          style={{ color: "var(--digital-cyan)" }}
        >
          Junta-te
        </p>
        <h2
          id="junta-te"
          className="mb-4 text-3xl font-bold md:text-5xl"
          style={{ color: "var(--starlight)" }}
        >
          Junta-te ao NEETI
        </h2>
        <p
          className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed"
          style={{ color: "var(--tungsten-steel)" }}
        >
          Queres participar nas nossas atividades ou ajudar a organizá-las? Fala connosco por email ou
          passa pela nossa sala no Campus do Taguspark.
        </p>
        <Link
          href="/contactos"
          className="inline-block rounded-lg px-8 py-3 font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:scale-105"
          style={{ backgroundColor: "var(--plasma-magenta)", color: "var(--starlight)" }}
        >
          Contacta-nos
        </Link>
      </div>
    </section>
  );
}
