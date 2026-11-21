/**
 * Desenhos SVG partilhados pelas cenas da home (satélite e pacote de dados).
 * Alterar aqui muda o aspeto em todas as cenas de uma só vez.
 */

export const CYAN = "#00F0FF";
export const MAGENTA = "#ff3df0";

// CSS que estes desenhos precisam (cada <svg> que os usa inclui isto no seu <style>)
export const TELECOM_CSS = `
  .sat-blink { animation: sat-blink 2.4s ease-in-out infinite; }
  @keyframes sat-blink { 0%, 100% { opacity: .15; } 50% { opacity: 1; } }
`;

/** Satélite centrado em (0,0). Usar dentro de <defs> e depois <use href="#id" />. */
export function SatelliteSymbol({ id }: { id: string }) {
  return (
    <>
      <radialGradient id={`${id}-glow`}>
        <stop offset="0" stopColor={CYAN} stopOpacity="0.45" />
        <stop offset="1" stopColor={CYAN} stopOpacity="0" />
      </radialGradient>

      <g id={id}>
        <circle r="30" fill={`url(#${id}-glow)`} />

        {/* painéis solares */}
        <g fill="#0a2748" stroke={CYAN} strokeWidth="0.7">
          <rect x="-38" y="-5.5" width="26" height="11" />
          <rect x="12" y="-5.5" width="26" height="11" />
        </g>
        <g stroke={CYAN} strokeWidth="0.45" opacity="0.7">
          <line x1="-29" y1="-5.5" x2="-29" y2="5.5" />
          <line x1="-20.5" y1="-5.5" x2="-20.5" y2="5.5" />
          <line x1="-38" y1="0" x2="-12" y2="0" />
          <line x1="21" y1="-5.5" x2="21" y2="5.5" />
          <line x1="29.5" y1="-5.5" x2="29.5" y2="5.5" />
          <line x1="12" y1="0" x2="38" y2="0" />
        </g>
        {/* braços */}
        <g stroke="#8A95A5" strokeWidth="1">
          <line x1="-12" y1="0" x2="-6" y2="0" />
          <line x1="6" y1="0" x2="12" y2="0" />
        </g>

        {/* antena virada para a Terra (para baixo) */}
        <line x1="0" y1="6" x2="0" y2="10" stroke="#8A95A5" strokeWidth="1" />
        <path d="M -6 15 Q 0 8 6 15 Z" fill="#8A95A5" stroke={CYAN} strokeWidth="0.5" />

        {/* corpo */}
        <rect
          x="-6.5"
          y="-6.5"
          width="13"
          height="13"
          rx="1.8"
          fill="#dfe7f1"
          stroke="#8A95A5"
          strokeWidth="0.7"
        />
        <rect x="-3.5" y="-3.5" width="7" height="7" rx="1" fill="#0B0C22" opacity="0.55" />

        {/* luz a piscar */}
        <circle className="sat-blink" cx="0" cy="-9.5" r="1.5" fill={MAGENTA} />
      </g>
    </>
  );
}

/** Um pacote de dados (caixinha com "cabeçalho" magenta). Usar dentro de <defs>. */
export function PacketSymbol() {
  return (
    <g id="tp-packet">
      <circle r="17" fill={CYAN} opacity="0.16" />
      <rect x="-10" y="-6.5" width="20" height="13" rx="2.5" fill="#06122b" stroke={CYAN} strokeWidth="1.3" />
      <rect x="-10" y="-6.5" width="7" height="13" rx="2" fill={MAGENTA} />
      <line x1="1" y1="-2" x2="7" y2="-2" stroke={CYAN} strokeWidth="1.2" />
      <line x1="1" y1="2" x2="7" y2="2" stroke={CYAN} strokeWidth="1.2" />
    </g>
  );
}

/**
 * Um pacote a viajar ao longo de um caminho (path SVG).
 * dur   = segundos que demora a percorrer o caminho
 * begin = desfasamento inicial em segundos (negativo = já vai a meio quando a página abre)
 */
export function Packet({ path, dur, begin = 0 }: { path: string; dur: number; begin?: number }) {
  return (
    <g>
      <animateMotion path={path} dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
      <use href="#tp-packet" />
    </g>
  );
}
