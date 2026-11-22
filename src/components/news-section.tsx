import Link from "next/link";
import SectionHeading from "@/components/section-heading";
import { NEWS, type NewsItem } from "@/data/news";

// Exemplos só para ver o aspeto em desenvolvimento. Nunca aparecem no site publicado.
const DEMO: NewsItem[] = [
  { date: "2026-03-14", source: "Exemplo", title: "Título de uma notícia ou evento do NEETI" },
  { date: "2026-02-02", source: "Exemplo", title: "Outro evento ou novidade do núcleo" },
  { date: "2026-01-19", source: "Exemplo", title: "Mais uma novidade, com data e link" },
];

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function NewsSection() {
  const isDemo = NEWS.length === 0;
  if (isDemo && process.env.NODE_ENV !== "development") return null;

  const items = [...(isDemo ? DEMO : NEWS)].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <section className="relative z-10 px-4 py-24" aria-labelledby="noticias">
      <div className="mx-auto max-w-4xl">
        <div id="noticias">
          <SectionHeading eyebrow="Notícias e eventos" title="Fica a par das novidades." />
        </div>

        {isDemo && (
          <p className="mt-6 text-xs" style={{ color: "var(--tungsten-steel)" }}>
            [só em desenvolvimento] Itens de exemplo. Para publicar novidades, edita src/data/news.ts.
          </p>
        )}

        <ul className="mt-10 space-y-3">
          {items.map((item) => {
            const inner = (
              <>
                <div className="text-xs uppercase tracking-wider md:w-44 md:shrink-0" style={{ color: "var(--tungsten-steel)" }}>
                  <span>{formatDate(item.date)}</span>
                  {item.source && (
                    <span className="block md:mt-1" style={{ color: "var(--digital-cyan)" }}>
                      {item.source}
                    </span>
                  )}
                </div>
                <p className="flex-1 text-lg font-semibold" style={{ color: "var(--starlight)" }}>
                  {item.title}
                </p>
                {item.href && (
                  <span className="link-more shrink-0">
                    Ler mais <span className="arrow">→</span>
                  </span>
                )}
              </>
            );
            const cls = "glass-card flex flex-col gap-3 p-5 md:flex-row md:items-center md:gap-6";
            return (
              <li key={item.date + item.title}>
                {!item.href ? (
                  <div className={cls}>{inner}</div>
                ) : item.href.startsWith("/") ? (
                  <Link href={item.href} className={cls}>
                    {inner}
                  </Link>
                ) : (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className={cls}>
                    {inner}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
