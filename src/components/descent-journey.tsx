"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import BaseStation, { ANTENNA_Y, LocalDevices, SignalRings } from "@/components/base-station";
import { CYAN, Packet, PacketSymbol, SatelliteSymbol, TELECOM_CSS } from "@/components/telecom-art";

/**
 * CENAS 2 e 3 — A descida: do espaço até à estação base
 *
 * A ideia: uma secção MUITO alta (420% do ecrã) com um "palco" que fica colado
 * ao ecrã (position: sticky). Enquanto fazes scroll, o palco não se mexe — o que
 * muda é a "câmara" dentro do desenho. O scroll é o normal do browser; nós só
 * lemos o progresso (p, de 0 a 1) e movemos as camadas.
 *
 *   p = 0.00  espaço: satélites ligados entre si
 *   p = 0.00 → 0.55  a câmara desce: atmosfera, pacotes a viajar dos satélites para a Terra
 *   p = 0.55 → 0.95  aproximação à estação base e às antenas
 *   p = 1.00  antenas a emitir sinal para a casa e para o carro
 *
 * O "mundo" é um desenho de 1600 x 2700 unidades. O ecrã só vê uma janela de
 * 1600 x 900 que desliza para baixo (a "câmara").
 */

// ---------------------------------------------------------------- Textos ----
// (Mexe aqui para mudar o que aparece no ecrã.)
const COPY = {
  cap1: {
    kicker: "01 · Espaço",
    title: "Tudo começa lá em cima",
    text: "Constelações de satélites formam uma rede à volta do planeta. Cada um fala com os vizinhos e com a Terra.",
  },
  cap2: {
    kicker: "02 · Atmosfera",
    title: "A mensagem viaja em pacotes",
    text: "Tudo o que enviamos é cortado em pequenos pacotes, encaminhado por vários caminhos e recomposto no destino.",
  },
  cap3: {
    kicker: "03 · Terra",
    title: "Até chegar a ti",
    text: "Estações base, antenas e fibra fazem a ponte final para casas, telemóveis e carros. É aqui que as telecomunicações aterram — e é isto que estudamos em Engenharia de Telecomunicações e Informática.",
    cta1: { label: "Conhecer o curso", href: "/curso" },
    cta2: { label: "Quem somos", href: "/team" },
  },
};

const ARIA_LABEL =
  "Ilustração animada: satélites em órbita, pacotes de dados a atravessar a atmosfera e uma estação base de telecomunicações a emitir sinal.";

// ------------------------------------------------------------- Constantes ----
const CAM_TRAVEL = 1800; // quanto a câmara desce no total (unidades do desenho)
const CAM_END = 0.55; // a câmara chega ao chão em p = 0.55
const TOWER_BASE = { x: 800, y: 2640 }; // onde está a base do mastro no mundo
const TOWER_SCALE_FAR = 0.55; // tamanho da estação base ao longe
const TOWER_SCALE_NEAR = 1.25; // tamanho quando já estamos perto
const START_P = 0;

// onde as antenas ficam no início (ao longe) -> fim dos feixes vindos dos satélites
const ANTENNA_WORLD_Y = Math.round(TOWER_BASE.y + ANTENNA_Y * TOWER_SCALE_FAR); // ~2390

// Satélites da constelação (coordenadas do mundo)
const SATS = [
  { x: 330, y: 260 },
  { x: 640, y: 150 },
  { x: 960, y: 300 },
  { x: 1250, y: 190 },
  { x: 800, y: 430 },
];
const SAT_LINKS: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [1, 4],
  [2, 4],
  [0, 4],
];

// Feixes (caminhos) dos satélites até à estação base, e o caminho inverso (uplink)
const BEAMS = [
  {
    down: `M 330 290 C 330 1300 800 1500 800 ${ANTENNA_WORLD_Y}`,
    up: `M 800 ${ANTENNA_WORLD_Y} C 800 1500 330 1300 330 290`,
  },
  {
    down: `M 960 330 C 960 1400 800 1500 800 ${ANTENNA_WORLD_Y}`,
    up: `M 800 ${ANTENNA_WORLD_Y} C 800 1500 960 1400 960 330`,
  },
  {
    down: `M 800 460 C 740 1200 860 1700 800 ${ANTENNA_WORLD_Y}`,
    up: `M 800 ${ANTENNA_WORLD_Y} C 860 1700 740 1200 800 460`,
  },
];

// ----------------------------------------------------------- Matemática ----
const clamp = (x: number, a = 0, b = 1) => Math.min(Math.max(x, a), b);
const range = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const smooth = (x: number) => x * x * (3 - 2 * x);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
// aparece em a→b, fica, desaparece em c→d
const win = (p: number, a: number, b: number, c: number, d: number) =>
  smooth(range(p, a, b)) * (1 - smooth(range(p, c, d)));

function layoutFor(p: number) {
  const cam = CAM_TRAVEL * range(p, 0, CAM_END);
  const towerScale = lerp(TOWER_SCALE_FAR, TOWER_SCALE_NEAR, smooth(range(p, 0.55, 0.95)));
  return {
    world: `translate(0 ${(-cam).toFixed(1)})`,
    stars: `translate(0 ${(-cam * 0.35).toFixed(1)})`,
    starsOp: 1 - smooth(range(p, 0.28, 0.55)),
    tower: `translate(${TOWER_BASE.x} ${TOWER_BASE.y}) scale(${towerScale.toFixed(4)})`,
    beamsOp: smooth(range(p, 0, 0.1)) * (1 - smooth(range(p, 0.56, 0.68))),
    ringsOp: smooth(range(p, 0.5, 0.62)),
    localOp: smooth(range(p, 0.74, 0.9)),
    cardOp: win(p, 0.26, 0.34, 0.5, 0.58),
    cap1: win(p, -0.1, 0, 0.2, 0.28),
    cap2: win(p, 0.28, 0.35, 0.5, 0.58),
    cap3: smooth(range(p, 0.66, 0.78)),
  };
}

const capStyle = (op: number): React.CSSProperties => ({
  opacity: op,
  transform: `translateY(${((1 - op) * 24).toFixed(1)}px)`,
  visibility: op < 0.01 ? "hidden" : "visible",
});

// ------------------------------------- Dados do desenho (sempre iguais) ----
// Gerador de números "aleatórios" com semente: dá sempre o mesmo resultado, por
// isso o desenho é igual no servidor e no browser.
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(2026);
const r1 = (n: number) => +n.toFixed(1);

const STARS = Array.from({ length: 150 }, (_, i) => ({
  x: r1(rnd() * 1600),
  y: r1(rnd() * 1500),
  r: +(0.6 + rnd() * 1.4).toFixed(2),
  o: +(0.35 + rnd() * 0.6).toFixed(2),
  tw: i % 5 === 0,
  d: +(rnd() * 3).toFixed(2),
}));

const CLOUDS = Array.from({ length: 9 }, (_, i) => ({
  x: r1(rnd() * 1600),
  y: r1(1350 + i * 100 + rnd() * 40),
  rx: r1(220 + rnd() * 260),
  ry: r1(24 + rnd() * 30),
}));

// Silhueta da cidade ao longe + janelas iluminadas
const SKYLINE_BASE = 2400;
const SKYLINE: { x: number; w: number; h: number }[] = [];
let WINDOWS = "";
{
  let sx = 0;
  while (sx < 1620) {
    const w = 16 + rnd() * 26;
    const h = 16 + rnd() * (rnd() < 0.18 ? 96 : 44);
    SKYLINE.push({ x: r1(sx), w: r1(w), h: r1(h) });
    if (rnd() < 0.7) {
      const n = 1 + Math.floor(rnd() * 3);
      for (let k = 0; k < n; k++) {
        const wx = sx + 4 + rnd() * (w - 8);
        const wy = SKYLINE_BASE - 6 - rnd() * (h - 10);
        WINDOWS += `M ${wx.toFixed(1)} ${wy.toFixed(1)} h 2.2 `;
      }
    }
    sx += w + rnd() * 5;
  }
}

// Colinas: linha ondulada com ondas somadas
function hillPath(base: number, a1: number, f1: number, p1: number, a2: number, f2: number, p2: number) {
  let d = "";
  for (let x = 0; x <= 1600; x += 20) {
    const y = base + a1 * Math.sin(x * f1 + p1) + a2 * Math.sin(x * f2 + p2);
    d += `${x === 0 ? "M" : "L"} ${x} ${y.toFixed(1)} `;
  }
  return d + "L 1600 2800 L 0 2800 Z";
}
const HILLS_FAR = hillPath(2330, 18, 0.006, 0.6, 9, 0.017, 1.9);
const HILLS_MID = hillPath(2470, 26, 0.004, 2.1, 12, 0.013, 0.4);

// Luzes de casas nas colinas do meio
let HOUSE_LIGHTS = "";
for (let i = 0; i < 46; i++) {
  HOUSE_LIGHTS += `M ${(rnd() * 1600).toFixed(1)} ${(2500 + rnd() * 120).toFixed(1)} h 2.2 `;
}

const ALTITUDES = [
  { y: 300, label: "~550 km · satélites" },
  { y: 1250, label: "~10 km · atmosfera" },
  { y: 2390, label: "~30 m · estação base" },
];

const CSS = `
  ${TELECOM_CSS}
  .jr-link { stroke-dasharray: 2 9; animation: jr-flow 1.2s linear infinite; }
  @keyframes jr-flow { to { stroke-dashoffset: -22; } }
  .jr-tw { animation: twinkle 3.5s ease-in-out infinite; }
  @media (prefers-reduced-motion: reduce) {
    .jr-link, .jr-tw, .sat-blink { animation: none; }
  }
`;

// ------------------------------------------------------------ Componente ----
export default function DescentJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const worldRef = useRef<SVGGElement>(null);
  const starsRef = useRef<SVGGElement>(null);
  const towerRef = useRef<SVGGElement>(null);
  const beamsRef = useRef<SVGGElement>(null);
  const ringsRef = useRef<SVGGElement>(null);
  const localRef = useRef<SVGGElement>(null);
  const cardRef = useRef<SVGGElement>(null);
  const cap1Ref = useRef<HTMLDivElement>(null);
  const cap2Ref = useRef<HTMLDivElement>(null);
  const cap3Ref = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const L0 = layoutFor(START_P);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Quem pediu "reduzir movimento": páramos os loops (pacotes, ondas).
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      svgRef.current?.pauseAnimations();
    }

    const setOp = (el: SVGGElement | null, v: number) => el?.setAttribute("opacity", v.toFixed(3));
    const setCap = (el: HTMLDivElement | null, op: number) => {
      if (!el) return;
      const s = capStyle(op);
      el.style.opacity = String(s.opacity);
      el.style.transform = String(s.transform);
      el.style.visibility = String(s.visibility);
    };

    const apply = (p: number) => {
      const L = layoutFor(p);
      worldRef.current?.setAttribute("transform", L.world);
      starsRef.current?.setAttribute("transform", L.stars);
      setOp(starsRef.current, L.starsOp);
      towerRef.current?.setAttribute("transform", L.tower);
      setOp(beamsRef.current, L.beamsOp);
      setOp(ringsRef.current, L.ringsOp);
      setOp(localRef.current, L.localOp);
      setOp(cardRef.current, L.cardOp);
      setCap(cap1Ref.current, L.cap1);
      setCap(cap2Ref.current, L.cap2);
      setCap(cap3Ref.current, L.cap3);
      if (ctaRef.current) ctaRef.current.style.pointerEvents = L.cap3 > 0.6 ? "auto" : "none";
    };

    let raf = 0;
    let lastP = -1;
    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? clamp(-rect.top / total) : 0;
      if (Math.abs(p - lastP) < 0.0003) return;
      lastP = p;
      apply(p);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative" style={{ height: "420svh" }} aria-label="Dos satélites à estação base">
      {/* O palco: fica colado ao ecrã enquanto fazemos scroll */}
      <div className="sticky top-0 h-screen overflow-hidden bg-black" style={{ height: "100svh" }}>
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1600 900"
          preserveAspectRatio="xMidYMid slice"
          role="img"
          aria-label={ARIA_LABEL}
        >
          <style>{CSS}</style>

          <defs>
            <SatelliteSymbol id="jr-sat" />
            <PacketSymbol />
            {/* céu: do preto do espaço ao azul do horizonte */}
            <linearGradient id="jr-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#041a3d" stopOpacity="0" />
              <stop offset="0.25" stopColor="#041a3d" />
              <stop offset="0.6" stopColor="#0a3a73" />
              <stop offset="1" stopColor="#1f6595" />
            </linearGradient>
            <radialGradient id="jr-cloud">
              <stop offset="0" stopColor="#bfe3ff" stopOpacity="0.16" />
              <stop offset="1" stopColor="#bfe3ff" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="jr-fade-bottom" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#000" stopOpacity="0" />
              <stop offset="1" stopColor="#000" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Estrelas (mexem mais devagar do que o resto -> profundidade) */}
          <g ref={starsRef} transform={L0.stars} opacity={L0.starsOp.toFixed(3)}>
            {STARS.map((s, i) => (
              <circle
                key={i}
                cx={s.x}
                cy={s.y}
                r={s.r}
                fill="#fff"
                opacity={s.o}
                className={s.tw ? "jr-tw" : undefined}
                style={s.tw ? { animationDelay: `${s.d}s` } : undefined}
              />
            ))}
          </g>

          {/* ===== O MUNDO (desliza para cima quando a câmara desce) ===== */}
          <g ref={worldRef} transform={L0.world}>
            {/* céu */}
            <rect x="-100" y="400" width="1800" height="1960" fill="url(#jr-sky)" />

            {/* nuvens suaves: dão a sensação de atravessar camadas */}
            {CLOUDS.map((c, i) => (
              <ellipse key={i} cx={c.x} cy={c.y} rx={c.rx} ry={c.ry} fill="url(#jr-cloud)" />
            ))}

            {/* marcas de altitude (no lado direito) */}
            <g fontFamily="'Overpass Mono', monospace" fontSize="20" fill="#8fd8ff" opacity="0.65">
              {ALTITUDES.map((a) => (
                <g key={a.y}>
                  <line x1="1470" y1={a.y} x2="1580" y2={a.y} stroke="#8fd8ff" strokeOpacity="0.5" />
                  <text x="1560" y={a.y - 10} textAnchor="end">
                    {a.label}
                  </text>
                </g>
              ))}
            </g>

            {/* cartão: "anatomia" de um pacote IP */}
            <g ref={cardRef} opacity={L0.cardOp.toFixed(3)}>
              <g transform="translate(1100 1010)" fontFamily="'Overpass Mono', monospace">
                <rect width="400" height="104" rx="10" fill="#06122b" fillOpacity="0.78" stroke={CYAN} strokeOpacity="0.6" />
                <text x="18" y="29" fontSize="16" fill="#8fd8ff" letterSpacing="3">
                  PACOTE IP
                </text>
                {[
                  { x: 18, w: 92, t: "ORIGEM" },
                  { x: 114, w: 102, t: "DESTINO" },
                  { x: 220, w: 56, t: "TTL" },
                  { x: 280, w: 102, t: "DADOS" },
                ].map((c, i) => (
                  <g key={c.t}>
                    <rect x={c.x} y="44" width={c.w} height="44" rx="5" fill={CYAN} fillOpacity="0.1" stroke={CYAN} strokeOpacity="0.7">
                      <animate attributeName="fill-opacity" values="0.08;0.5;0.08" dur="4s" begin={`${i}s`} repeatCount="indefinite" />
                    </rect>
                    <text x={c.x + c.w / 2} y="71" fontSize="14" fill="#e8f6ff" textAnchor="middle">
                      {c.t}
                    </text>
                  </g>
                ))}
              </g>
            </g>

            {/* constelação: ligações entre satélites + satélites */}
            <g fill="none" stroke={CYAN} strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.55">
              {SAT_LINKS.map(([a, b]) => (
                <line key={`${a}-${b}`} className="jr-link" x1={SATS[a].x} y1={SATS[a].y} x2={SATS[b].x} y2={SATS[b].y} />
              ))}
            </g>
            {SATS.map((s, i) => (
              <g key={i} transform={`translate(${s.x} ${s.y}) scale(1.5)`}>
                <use href="#jr-sat" />
              </g>
            ))}

            {/* terreno ao longe: colinas, cidade, colinas do meio */}
            <path d={HILLS_FAR} fill="#0b2142" />
            <g>
              {SKYLINE.map((b, i) => (
                <rect key={i} x={b.x} y={SKYLINE_BASE - b.h} width={b.w} height={b.h + 80} fill="#07142b" />
              ))}
              <path d={WINDOWS} stroke="#ffcf7a" strokeWidth="2.6" strokeOpacity="0.75" />
            </g>
            <path d={HILLS_MID} fill="#050c1c" />
            <path d={HOUSE_LIGHTS} stroke="#ffd98f" strokeWidth="2.4" strokeOpacity="0.6" />

            {/* feixes dos satélites até à estação base + pacotes a viajar */}
            <g ref={beamsRef} opacity={L0.beamsOp.toFixed(3)}>
              {BEAMS.map((b, i) => (
                <g key={i}>
                  <path d={b.down} fill="none" stroke={CYAN} strokeWidth="9" strokeOpacity="0.05" />
                  <path className="jr-link" d={b.down} fill="none" stroke={CYAN} strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.5" />
                  <Packet path={b.down} dur={9} begin={-(i * 1.5)} />
                  <Packet path={b.down} dur={9} begin={-(i * 1.5 + 3)} />
                  <Packet path={b.down} dur={9} begin={-(i * 1.5 + 6)} />
                  <Packet path={b.up} dur={11} begin={-(i * 2 + 4)} />
                </g>
              ))}
            </g>

            {/* A ESTAÇÃO BASE (cresce quando nos aproximamos) */}
            <g ref={towerRef} transform={L0.tower}>
              {/* chão em primeiro plano */}
              <rect x="-3000" y="0" width="6000" height="700" fill="#03050c" />
              <line x1="-3000" y1="0" x2="3000" y2="0" stroke="#1b3358" strokeWidth="2" />

              <g ref={localRef} opacity={L0.localOp.toFixed(3)}>
                <LocalDevices />
              </g>
              <BaseStation />
              <g ref={ringsRef} opacity={L0.ringsOp.toFixed(3)}>
                <SignalRings />
              </g>
            </g>
          </g>

          {/* desvanece o fundo para preto, para encaixar na secção seguinte */}
          <rect x="0" y="830" width="1600" height="70" fill="url(#jr-fade-bottom)" />
        </svg>

        {/* Sombra por baixo do texto no telemóvel, para se ler bem */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/75 to-transparent md:hidden" />

        {/* Textos (HTML normal: bom para SEO e leitores de ecrã) */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-end md:items-center">
          <div className="grid w-full px-6 pb-14 md:w-[36%] md:pb-0 md:pl-16 md:pr-0">
            {(
              [
                { ref: cap1Ref, c: COPY.cap1, op: L0.cap1 },
                { ref: cap2Ref, c: COPY.cap2, op: L0.cap2 },
                { ref: cap3Ref, c: COPY.cap3, op: L0.cap3 },
              ] as const
            ).map(({ ref, c, op }) => (
              <div key={c.kicker} ref={ref} style={{ gridArea: "1 / 1", ...capStyle(op) }}>
                <p className="font-mono text-xs tracking-[0.3em] uppercase mb-3" style={{ color: "var(--digital-cyan)" }}>
                  {c.kicker}
                </p>
                <h2
                  className="text-3xl md:text-5xl font-bold mb-4"
                  style={{ color: "var(--starlight)", textShadow: "0 0 20px var(--digital-cyan)" }}
                >
                  {c.title}
                </h2>
                <p className="text-base md:text-lg leading-relaxed" style={{ color: "var(--starlight)" }}>
                  {c.text}
                </p>
                {"cta1" in c && (
                  <div
                    ref={ctaRef}
                    className="mt-6 flex flex-wrap gap-3"
                    style={{ pointerEvents: L0.cap3 > 0.6 ? "auto" : "none" }}
                  >
                    <Link
                      href={c.cta1.href}
                      className="inline-block px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                      style={{ backgroundColor: "var(--plasma-magenta)", color: "var(--starlight)" }}
                    >
                      {c.cta1.label}
                    </Link>
                    <Link
                      href={c.cta2.href}
                      className="inline-block px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                      style={{ border: "1px solid var(--digital-cyan)", color: "var(--digital-cyan)" }}
                    >
                      {c.cta2.label}
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
