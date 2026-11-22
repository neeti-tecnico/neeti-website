import { CYAN, MAGENTA, Packet } from "@/components/telecom-art";

/**
 * Estação base de telecomunicações desenhada em SVG.
 *
 * Sistema de coordenadas LOCAL: a base do mastro está em (0, 0) e o mastro sobe
 * para valores NEGATIVOS de y (em SVG o y cresce para baixo).
 * A cena que usa este desenho coloca-o no mundo com translate + scale.
 */

export const MAST_H = 520; // altura do mastro
export const ANTENNA_Y = -455; // altura (local) onde ficam os painéis de antena

const W0 = 36; // meia-largura do mastro na base
const W1 = 9; // meia-largura do mastro no topo
const STEPS = 13; // nº de "andares" da treliça

const f = (n: number) => n.toFixed(1);
const half = (up: number) => W0 + (W1 - W0) * (up / MAST_H);

// Treliça do mastro: 2 pernas + barras horizontais + diagonais em zig-zag
function latticePath() {
  const step = MAST_H / STEPS;
  let d = `M ${f(-W0)} 0 L ${f(-W1)} ${f(-MAST_H)} M ${f(W0)} 0 L ${f(W1)} ${f(-MAST_H)} `;
  for (let i = 0; i <= STEPS; i++) {
    const up = i * step;
    d += `M ${f(-half(up))} ${f(-up)} L ${f(half(up))} ${f(-up)} `;
  }
  for (let i = 0; i < STEPS; i++) {
    const a = i * step;
    const b = (i + 1) * step;
    d +=
      i % 2 === 0
        ? `M ${f(-half(a))} ${f(-a)} L ${f(half(b))} ${f(-b)} `
        : `M ${f(half(a))} ${f(-a)} L ${f(-half(b))} ${f(-b)} `;
  }
  return d;
}
const LATTICE = latticePath();

export default function BaseStation() {
  return (
    <g>
      <defs>
        <radialGradient id="bs-glow">
          <stop offset="0" stopColor={CYAN} stopOpacity="0.4" />
          <stop offset="1" stopColor={CYAN} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bs-panel" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#aebccd" />
          <stop offset="0.5" stopColor="#eef3f9" />
          <stop offset="1" stopColor="#aebccd" />
        </linearGradient>
      </defs>

      {/* brilho atrás das antenas */}
      <circle cx="0" cy={ANTENNA_Y} r="150" fill="url(#bs-glow)" />

      {/* mastro em treliça + sapata */}
      <path d={LATTICE} fill="none" stroke="#8fb4d8" strokeWidth="2.6" strokeLinecap="round" />
      <rect x={-W0 - 14} y="-8" width={2 * W0 + 28} height="8" rx="2" fill="#1a2c4d" />

      {/* estrutura de suporte dos painéis */}
      <line x1="-72" y1={ANTENNA_Y} x2="72" y2={ANTENNA_Y} stroke="#8fb4d8" strokeWidth="3" />

      {/* 3 painéis setoriais (as antenas "de rede móvel") */}
      {[-52, 0, 52].map((c) => (
        <g key={c}>
          <rect
            x={c - 13}
            y="-505"
            width="26"
            height="96"
            rx="4"
            fill="url(#bs-panel)"
            stroke="#6f8aa8"
            strokeWidth="1.2"
          />
          <line x1={c} y1="-498" x2={c} y2="-416" stroke="#6f8aa8" strokeWidth="1" />
          {[-482, -458, -434].map((y) => (
            <line key={y} x1={c - 8} y1={y} x2={c + 8} y2={y} stroke="#6f8aa8" strokeWidth="1" />
          ))}
        </g>
      ))}

      {/* parabólica de micro-ondas (grande, à esquerda) */}
      <line x1="-19" y1="-330" x2="-50" y2="-330" stroke="#8fb4d8" strokeWidth="3" />
      <circle cx="-66" cy="-330" r="20" fill="#dfe7f1" stroke="#8A95A5" strokeWidth="1.5" />
      <circle cx="-66" cy="-330" r="13" fill="#b6c3d3" />
      <circle cx="-66" cy="-330" r="3" fill="#475a74" />

      {/* parabólica mais pequena (à direita) */}
      <line x1="23" y1="-250" x2="44" y2="-250" stroke="#8fb4d8" strokeWidth="3" />
      <circle cx="58" cy="-250" r="14" fill="#dfe7f1" stroke="#8A95A5" strokeWidth="1.5" />
      <circle cx="58" cy="-250" r="9" fill="#b6c3d3" />
      <circle cx="58" cy="-250" r="2.4" fill="#475a74" />

      {/* para-raios + luz de sinalização */}
      <line x1="0" y1="-520" x2="0" y2="-545" stroke="#8fb4d8" strokeWidth="2.4" />
      <circle className="sat-blink" cx="0" cy="-550" r="3.8" fill="#ff2d55" />

      {/* armário de equipamento + cabo */}
      <path d="M 46 -30 Q 28 -30 26 -54" fill="none" stroke="#2a4a7a" strokeWidth="2" />
      <rect x="46" y="-44" width="74" height="44" rx="3" fill="#0e1a33" stroke="#2a4a7a" strokeWidth="1.5" />
      <circle cx="60" cy="-30" r="2.4" fill={CYAN} />
      <circle cx="72" cy="-30" r="2.4" fill={CYAN} opacity="0.5" />
      <circle cx="84" cy="-30" r="2.4" fill={MAGENTA} opacity="0.7" />
    </g>
  );
}

/** Ondas de sinal a sair das antenas (animadas). Quando as animações estão paradas, ficam anéis fixos. */
export function SignalRings() {
  return (
    <g fill="none" stroke={CYAN}>
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx="0"
          cy={ANTENNA_Y}
          r={80 + i * 100}
          strokeWidth="2.5"
          strokeOpacity={(0.5 - i * 0.14).toFixed(2)}
        >
          <animate attributeName="r" from="24" to="340" dur="3.6s" begin={`${-i * 1.2}s`} repeatCount="indefinite" />
          <animate
            attributeName="stroke-opacity"
            from="0.75"
            to="0"
            dur="3.6s"
            begin={`${-i * 1.2}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </g>
  );
}

// Caminhos (coordenadas locais) das ligações da antena a uma casa e a um carro
const TO_HOUSE = `M 0 ${ANTENNA_Y} Q -300 -420 -520 -112`;
const FROM_HOUSE = `M -520 -112 Q -300 -420 0 ${ANTENNA_Y}`;
const TO_CAR = `M 0 ${ANTENNA_Y} Q 330 -400 560 -70`;
const FROM_CAR = `M 560 -70 Q 330 -400 0 ${ANTENNA_Y}`;

/** Última milha: casa (Wi-Fi/fibra) e carro (IoT) ligados à estação base. */
export function LocalDevices() {
  return (
    <g>
      {/* ligações a tracejado */}
      <g fill="none" stroke={CYAN} strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5">
        <path className="jr-link" d={TO_HOUSE} />
        <path className="jr-link" d={TO_CAR} />
      </g>
      <Packet path={TO_HOUSE} dur={5} begin={-1} />
      <Packet path={FROM_HOUSE} dur={6} begin={-4} />
      <Packet path={TO_CAR} dur={5.5} begin={-2.5} />
      <Packet path={FROM_CAR} dur={6.5} begin={-5} />

      {/* casa */}
      <g transform="translate(-520 0)">
        <rect x="-48" y="-62" width="96" height="62" fill="#0b1a33" stroke="#2a4a7a" strokeWidth="1.5" />
        <path d="M -58 -62 L 0 -102 L 58 -62 Z" fill="#12274a" stroke="#2a4a7a" strokeWidth="1.5" />
        <rect x="-30" y="-44" width="20" height="20" fill="#ffcf7a" opacity="0.85" />
        <rect x="10" y="-44" width="20" height="20" fill="#ffcf7a" opacity="0.6" />
        {/* símbolo wi-fi no telhado */}
        <g fill="none" stroke={CYAN} strokeWidth="2" strokeLinecap="round">
          {[8, 16, 24].map((r) => (
            <path
              key={r}
              d={`M ${f(-0.707 * r)} ${f(-112 - 0.707 * r)} A ${r} ${r} 0 0 1 ${f(0.707 * r)} ${f(-112 - 0.707 * r)}`}
            />
          ))}
        </g>
        <circle cx="0" cy="-112" r="2.6" fill={CYAN} />
      </g>

      {/* carro ligado (IoT) */}
      <g transform="translate(560 0)">
        <path
          d="M -52 -2 L -52 -16 L -38 -22 L -24 -40 L 22 -40 L 38 -22 L 54 -18 L 54 -2 Z"
          fill="#12274a"
          stroke="#2a4a7a"
          strokeWidth="1.5"
        />
        <path d="M -20 -36 L 18 -36 L 30 -23 L -30 -23 Z" fill="#0b1a33" stroke="#2a4a7a" strokeWidth="1" />
        <circle cx="-30" cy="0" r="9" fill="#050912" stroke="#2a4a7a" strokeWidth="2" />
        <circle cx="32" cy="0" r="9" fill="#050912" stroke="#2a4a7a" strokeWidth="2" />
        <rect x="46" y="-14" width="7" height="4" fill="#ffcf7a" />
        {/* antena do carro + sinal */}
        <path d="M 0 -40 L 4 -48 L 10 -48 L 8 -40 Z" fill="#8A95A5" />
        <g fill="none" stroke={CYAN} strokeWidth="2" strokeLinecap="round">
          {[8, 16, 24].map((r) => (
            <path
              key={r}
              d={`M ${f(7 - 0.707 * r)} ${f(-62 - 0.707 * r + 8)} A ${r} ${r} 0 0 1 ${f(7 + 0.707 * r)} ${f(-62 - 0.707 * r + 8)}`}
            />
          ))}
        </g>
      </g>
    </g>
  );
}
