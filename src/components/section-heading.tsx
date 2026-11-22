/**
 * Cabeçalho de secção partilhado: etiqueta pequena (eyebrow) + título + texto opcional.
 * Sem brilhos atrás do texto: o único título com brilho é o NEETI do hero.
 */
export default function SectionHeading({
  eyebrow,
  title,
  text,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  text?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p
        className="mb-3 text-xs uppercase tracking-[0.3em]"
        style={{ color: "var(--digital-cyan)" }}
      >
        {eyebrow}
      </p>
      <h2 className="text-3xl font-bold md:text-5xl" style={{ color: "var(--starlight)" }}>
        {title}
      </h2>
      {text && (
        <p className="mt-4 text-lg leading-relaxed" style={{ color: "var(--tungsten-steel)" }}>
          {text}
        </p>
      )}
    </div>
  );
}
