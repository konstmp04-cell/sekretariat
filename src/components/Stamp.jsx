/**
 * Stempelabdruck.
 *
 * Ein sauber gedruckter Stempel wirkt wie ein Icon. Ein echter Abdruck ist
 * fleckig, sitzt schief und an manchen Stellen fehlt Farbe – dafür sorgt die
 * Turbulenz-Maske. Der Abdruck bleibt danach dauerhaft auf dem Papier liegen.
 */

/**
 * Schriftgröße aus der Wortlänge statt in festen Stufen.
 *
 * Bei fester Größe lief „FREIGESTELLT" über den Rahmen hinaus und wurde vom
 * SVG-Rand beschnitten – auf dem Abdruck stand dann „REIGESTELL". Die Formel
 * rechnet aus der Zeichenbreite einer Festbreitenschrift zurück, wie groß der
 * Satz höchstens sein darf, damit er in die 132 Einheiten des Innenrahmens
 * passt.
 */
function schriftgroesse(text) {
  return Math.min(22, (132 / text.length - 1.2) / 0.6)
}

export default function Stamp({
  kind = 'deny',
  label,
  size = 156,
  rotate = -12,
  slam = true,
  className = '',
  style,
}) {
  const ok = kind === 'ok'
  const color = ok ? 'var(--color-stamp-ok)' : 'var(--color-stamp-deny)'
  const text = label ?? (ok ? 'ENTSCHULDIGT' : 'UNENTSCHULDIGT')
  const uid = `st-${kind}-${text.length}`

  return (
    <div
      className={`pointer-events-none ${slam ? 'animate-stamp-slam' : ''} ${className}`}
      style={{ width: size, ...style }}
    >
      <svg viewBox="0 0 160 90" width={size} style={{ transform: `rotate(${rotate}deg)` }} role="img" aria-label={text}>
        <defs>
          {/* Löchrige Tinte: Rauschen als Alphamaske über den kompletten Abdruck */}
          <filter id={`${uid}-rough`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.28" numOctaves="4" seed="7" result="n" />
            <feColorMatrix in="n" type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.1 1.05" result="mask" />
            <feComposite in="SourceGraphic" in2="mask" operator="in" />
          </filter>
        </defs>

        <g filter={`url(#${uid}-rough)`} opacity="0.88">
          <rect x="4" y="4" width="152" height="82" rx="5" fill="none" stroke={color} strokeWidth="4.5" />
          <rect x="12" y="12" width="136" height="66" rx="3" fill="none" stroke={color} strokeWidth="1.6" />
          <text
            x="80"
            y="49"
            textAnchor="middle"
            fill={color}
            fontSize={schriftgroesse(text)}
            fontFamily="ui-monospace, 'Courier New', monospace"
            fontWeight="700"
            letterSpacing="1.2"
          >
            {text}
          </text>
          <text
            x="80"
            y="68"
            textAnchor="middle"
            fill={color}
            fontSize="9"
            fontFamily="ui-monospace, 'Courier New', monospace"
            letterSpacing="2.5"
            opacity="0.8"
          >
            SEKRETARIAT
          </text>
        </g>
      </svg>
    </div>
  )
}
