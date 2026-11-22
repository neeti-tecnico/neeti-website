"use client";

import { useEffect, useRef } from "react";
import { CYAN, SatelliteSymbol, TELECOM_CSS } from "@/components/telecom-art";

/**
 * CENA 1 — Satélites em órbita à volta da Terra
 *
 * Como funciona (em resumo):
 *  - Desenhamos um <svg> com EXATAMENTE as mesmas proporções da imagem
 *    /public/earth-custom.png (1536 x 1024) e com o mesmo recorte ("slice"
 *    = "cover" do CSS). Assim, as órbitas ficam sempre alinhadas com o
 *    horizonte da Terra, em qualquer tamanho de ecrã.
 *  - O horizonte da imagem é, aproximadamente, um círculo gigante. As órbitas
 *    são círculos concêntricos um pouco maiores (R + offset).
 *  - Cada satélite anda ao longo da sua órbita (ângulo a variar no tempo) e,
 *    quando dois satélites estão perto, desenha-se uma ligação entre eles.
 *  - A animação usa requestAnimationFrame e mexe diretamente nos elementos SVG
 *    (sem re-renders do React), por isso é muito leve.
 */

// ---------- Geometria (coordenadas da imagem 1536 x 1024) ----------
const CX = 800; // centro do "círculo" do horizonte da Terra
const CY = 2017;
const R = 1680; // raio do horizonte da Terra
const ANGLE_MAX = 36; // graus: ângulo máximo para cada lado antes de "desaparecer"
const LINK_DISTANCE = 720; // distância máxima para existir ligação entre 2 satélites
const START_T = 12; // segundos: evita começar com todos os satélites em linha


// ---------- Órbitas (mexe aqui para mudar o aspeto) ----------
// offset: altura da órbita acima do horizonte (maior = mais longe da Terra)
// speed:  graus por segundo (negativo = anda para a esquerda)
// scale:  tamanho dos satélites
// sats:   ângulos de partida de cada satélite
const TRACKS = [
  { offset: 40, speed: 1.5, scale: 1.25, sats: [-22, 4, 30] },
  { offset: 105, speed: -1.0, scale: 1.0, sats: [-30, -4, 22] },
  { offset: 175, speed: 0.7, scale: 0.8, sats: [-14, 16] },
];

// ---------- Matemática ----------
type Sat = { x: number; y: number; rot: number; alpha: number; scale: number };
type Link = { x1: number; y1: number; x2: number; y2: number; op: number };

const TOTAL_SATS = TRACKS.reduce((n, t) => n + t.sats.length, 0);

// todos os pares de satélites (i, j)
const PAIRS: [number, number][] = [];
for (let i = 0; i < TOTAL_SATS; i++)
  for (let j = i + 1; j < TOTAL_SATS; j++) PAIRS.push([i, j]);

// mantém o ângulo entre -ANGLE_MAX e +ANGLE_MAX (dá a volta quando chega ao fim)
function wrap(a: number) {
  const span = ANGLE_MAX * 2;
  return ((((a + ANGLE_MAX) % span) + span) % span) - ANGLE_MAX;
}

// 0 nas pontas (satélite invisível) -> 1 no meio
function edgeFade(a: number) {
  const k = Math.min(Math.max((ANGLE_MAX - Math.abs(a)) / 8, 0), 1);
  return k * k * (3 - 2 * k);
}

function computeFrame(t: number): { sats: Sat[]; links: Link[] } {
  const sats: Sat[] = [];
  for (const track of TRACKS) {
    const r = R + track.offset;
    for (const a0 of track.sats) {
      const a = wrap(a0 + track.speed * t);
      const rad = (a * Math.PI) / 180;
      sats.push({
        x: CX + r * Math.sin(rad),
        y: CY - r * Math.cos(rad),
        rot: a, // o "topo" do satélite aponta sempre para longe da Terra
        alpha: edgeFade(a),
        scale: track.scale,
      });
    }
  }

  const links: Link[] = PAIRS.map(([i, j]) => {
    const A = sats[i];
    const B = sats[j];
    const d = Math.hypot(A.x - B.x, A.y - B.y);
    const closeness = Math.max(0, 1 - d / LINK_DISTANCE);
    return {
      x1: A.x,
      y1: A.y,
      x2: B.x,
      y2: B.y,
      op: closeness * 0.85 * Math.min(A.alpha, B.alpha),
    };
  });

  return { sats, links };
}

function satTransform(s: Sat) {
  return `translate(${s.x.toFixed(1)} ${s.y.toFixed(1)}) rotate(${s.rot.toFixed(
    2
  )}) scale(${s.scale})`;
}

// linha tracejada da órbita (só o arco visível)
function orbitPath(offset: number) {
  const r = R + offset;
  const p = (a: number) => {
    const rad = (a * Math.PI) / 180;
    return `${(CX + r * Math.sin(rad)).toFixed(1)} ${(CY - r * Math.cos(rad)).toFixed(1)}`;
  };
  return `M ${p(-ANGLE_MAX)} A ${r} ${r} 0 0 1 ${p(ANGLE_MAX)}`;
}

// ---------- Componente ----------
export default function OrbitScene() {
  const svgRef = useRef<SVGSVGElement>(null);
  const satRefs = useRef<(SVGGElement | null)[]>([]);
  const linkRefs = useRef<(SVGLineElement | null)[]>([]);

  // Primeiro desenho (igual no servidor e no browser -> sem erros de hidratação)
  const initial = computeFrame(START_T);

  useEffect(() => {
    // Quem pediu "reduzir movimento" no sistema vê tudo parado.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let last = performance.now();
    let t = START_T;
    let visible = true;

    // Pausa a animação quando o hero já saiu do ecrã (poupa bateria)
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    if (svgRef.current) io.observe(svgRef.current);

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;

      if (visible) {
        t += dt;
        const { sats, links } = computeFrame(t);

        sats.forEach((s, i) => {
          const el = satRefs.current[i];
          if (!el) return;
          el.setAttribute("transform", satTransform(s));
          el.setAttribute("opacity", s.alpha.toFixed(3));
        });

        links.forEach((l, i) => {
          const el = linkRefs.current[i];
          if (!el) return;
          el.setAttribute("x1", l.x1.toFixed(1));
          el.setAttribute("y1", l.y1.toFixed(1));
          el.setAttribute("x2", l.x2.toFixed(1));
          el.setAttribute("y2", l.y2.toFixed(1));
          el.setAttribute("stroke-opacity", l.op.toFixed(3));
        });
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className="absolute top-0 left-0 w-full h-[60vh] pointer-events-none"
      viewBox="0 0 1536 1024"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <style>{`
        ${TELECOM_CSS}
        .orbit-link { stroke-dasharray: 2 9; animation: orbit-flow 1.2s linear infinite; }
        @keyframes orbit-flow { to { stroke-dashoffset: -22; } }
        @media (prefers-reduced-motion: reduce) {
          .orbit-link, .sat-blink { animation: none; }
        }
      `}</style>

      <defs>
        {/* O desenho do satélite está em telecom-art.tsx */}
        <SatelliteSymbol id="orbit-sat" />
      </defs>

      {/* linhas das órbitas */}
      {TRACKS.map((t) => (
        <path
          key={t.offset}
          d={orbitPath(t.offset)}
          fill="none"
          stroke={CYAN}
          strokeOpacity="0.14"
          strokeWidth="1.2"
          strokeDasharray="3 12"
        />
      ))}

      {/* ligações entre satélites */}
      {initial.links.map((l, i) => (
        <line
          key={i}
          ref={(el) => {
            linkRefs.current[i] = el;
          }}
          className="orbit-link"
          x1={l.x1.toFixed(1)}
          y1={l.y1.toFixed(1)}
          x2={l.x2.toFixed(1)}
          y2={l.y2.toFixed(1)}
          stroke={CYAN}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeOpacity={l.op.toFixed(3)}
        />
      ))}

      {/* satélites */}
      {initial.sats.map((s, i) => (
        <g
          key={i}
          ref={(el) => {
            satRefs.current[i] = el;
          }}
          transform={satTransform(s)}
          opacity={s.alpha.toFixed(3)}
        >
          <use href="#orbit-sat" />
        </g>
      ))}
    </svg>
  );
}
