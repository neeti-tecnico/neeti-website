import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/section-heading";

// Textos e imagens dos 3 cartões. Para mudar o conteúdo, é só editar esta lista.
const ITEMS = [
  {
    kicker: "A equipa",
    title: "Voluntários ao serviço do IST",
    text: "A nossa equipa é feita de estudantes voluntários dedicados a melhorar a comunidade do IST. Criamos e gerimos eventos e atividades que promovem o convívio, a aprendizagem e o crescimento.",
    image: "/team2526.jpg",
    alt: "Equipa do NEETI",
    href: "/team",
    cta: "Conhecer a equipa",
  },
  {
    kicker: "Divulgação do curso",
    title: "Levamos o curso às escolas",
    text: "Todos os anos levamos a licenciatura e o mestrado em Engenharia de Telecomunicações e Informática a cada vez mais estudantes de todo o país, visitando escolas e participando em eventos como a Futurália.",
    image: "/polo-tagus.jpg",
    alt: "",
    href: "/curso",
    cta: "Conhecer o curso",
  },
  {
    kicker: "Shelf",
    title: "O nosso repositório de estudo",
    text: "Disponibilizamos aos estudantes os materiais de estudo de que precisam para ter sucesso académico e preparar a vida profissional.",
    image: "/telecom.jpg",
    alt: "",
    href: "/shelf",
    cta: "Abrir a Shelf",
  },
];

export default function WhatWeDo() {
  return (
    <section className="relative z-10 px-4 py-24" aria-labelledby="o-que-fazemos">
      <div className="mx-auto max-w-6xl">
        <div id="o-que-fazemos">
          <SectionHeading
            eyebrow="O que fazemos"
            title="Estudantes a trabalhar para estudantes."
          />
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="glass-card glass-card-lift group flex flex-col overflow-hidden"
            >
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(11,12,34,0.9), rgba(11,12,34,0) 60%)",
                  }}
                />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <p
                  className="mb-2 font-mono text-xs uppercase tracking-[0.25em]"
                  style={{ color: "var(--digital-cyan)" }}
                >
                  {item.kicker}
                </p>
                <h3 className="mb-3 text-2xl font-bold" style={{ color: "var(--starlight)" }}>
                  {item.title}
                </h3>
                <p
                  className="mb-6 flex-1 leading-relaxed"
                  style={{ color: "var(--tungsten-steel)" }}
                >
                  {item.text}
                </p>
                <span className="link-more">
                  {item.cta} <span className="arrow">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
