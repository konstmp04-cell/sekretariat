/**
 * Passfoto. Rendert ein prozedurales Gesicht in dem leicht überbelichteten,
 * entsättigten Look, den Schulfotos und Ausweisbilder nun mal haben.
 */

const CX = 50
const CY = 45 // Augen-/Kopfmitte, Bezugspunkt für alle Proportionen

/**
 * Haare.
 *
 * Entscheidend ist, dass die Frisur der Schädelkuppe FOLGT statt als eigene
 * Form darüber zu schweben – sonst sieht jede Figur aus, als trüge sie einen
 * schlecht sitzenden Hut. Alle Pfade teilen sich deshalb dieselbe Kuppe und
 * unterscheiden sich nur in Länge, Seitenpartie und Kontur des Ponys.
 */
function Hair({ f }) {
  const { style, hair, headW, headH, hairVolume } = f
  const hw = headW * 0.5 * hairVolume
  const top = CY - headH * 0.42

  // Kuppe: umschließt den Schädel und endet in einer gefegten Ponykante.
  const kuppe =
    style === 'pony'
      ? // Gerade abgeschnittener Pony quer über die Stirn
        `M ${CX - hw} ${CY - headH * 0.06}
         C ${CX - hw} ${top - headH * 0.2}, ${CX + hw} ${top - headH * 0.2}, ${CX + hw} ${CY - headH * 0.06}
         L ${CX + hw * 0.94} ${CY - headH * 0.2}
         C ${CX + hw * 0.4} ${CY - headH * 0.28}, ${CX - hw * 0.4} ${CY - headH * 0.28}, ${CX - hw * 0.94} ${CY - headH * 0.2}
         Z`
      : // Zur Seite gekämmter Scheitel
        `M ${CX - hw} ${CY - headH * 0.06}
         C ${CX - hw} ${top - headH * 0.2}, ${CX + hw} ${top - headH * 0.2}, ${CX + hw} ${CY - headH * 0.06}
         C ${CX + hw * 0.92} ${CY - headH * 0.3}, ${CX + hw * 0.3} ${CY - headH * 0.34}, ${CX - hw * 0.25} ${CY - headH * 0.27}
         C ${CX - hw * 0.62} ${CY - headH * 0.24}, ${CX - hw * 0.9} ${CY - headH * 0.18}, ${CX - hw} ${CY - headH * 0.06}
         Z`

  // Seitenpartie: fällt vom Ohransatz nach unten, Länge je nach Frisur.
  const seite = (sign, len) =>
    `M ${CX + sign * hw} ${CY - headH * 0.12}
     C ${CX + sign * hw * 1.06} ${CY + len * 0.45}, ${CX + sign * hw * 1.0} ${CY + len * 0.82}, ${CX + sign * hw * 0.78} ${CY + len}
     L ${CX + sign * hw * 0.44} ${CY + len}
     C ${CX + sign * hw * 0.54} ${CY + len * 0.5}, ${CX + sign * hw * 0.66} ${CY + headH * 0.1}, ${CX + sign * hw * 0.6} ${CY - headH * 0.2}
     Z`

  const laenge = { kurz: 0, pony: 0, mittel: headH * 0.34, lang: headH * 0.78, zopf: headH * 0.3, locken: 0 }[style] ?? 0

  if (style === 'locken') {
    // Lockenkopf als Traube von Kreisen entlang der Kuppe.
    const blobs = []
    for (let i = 0; i < 11; i++) {
      const t = i / 10
      const a = Math.PI * (0.02 + t * 0.96)
      blobs.push(
        <circle
          key={i}
          cx={CX - Math.cos(a) * hw * 0.98}
          cy={CY - headH * 0.08 - Math.sin(a) * headH * 0.42}
          r={hw * 0.3}
        />,
      )
    }
    return (
      <g fill={hair}>
        <path d={kuppe} />
        {blobs}
      </g>
    )
  }

  return (
    <g fill={hair}>
      {laenge > 0 && (
        <>
          <path d={seite(-1, laenge)} />
          <path d={seite(1, laenge)} />
        </>
      )}
      <path d={kuppe} />
      {style === 'zopf' && (
        <ellipse cx={CX + hw * 0.96} cy={CY + headH * 0.32} rx={hw * 0.26} ry={hw * 0.4} />
      )}
    </g>
  )
}

export default function Portrait({ face, size = 108, id = 'p' }) {
  const f = face
  const eyeL = CX - f.eyeGap / 2
  const eyeR = CX + f.eyeGap / 2
  const eyeY = CY + f.eyeY

  return (
    <svg viewBox="0 0 100 116" width={size} height={size * 1.16} className="block">
      <defs>
        <clipPath id={`${id}-frame`}>
          <rect x="0" y="0" width="100" height="116" rx="1" />
        </clipPath>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b9bfb4" />
          <stop offset="100%" stopColor="#8d968a" />
        </linearGradient>
        <filter id={`${id}-grain`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="4" result="n" />
          <feColorMatrix in="n" type="saturate" values="0" result="g" />
          <feComponentTransfer in="g" result="soft">
            <feFuncA type="linear" slope="0.14" />
          </feComponentTransfer>
          <feBlend in="SourceGraphic" in2="soft" mode="multiply" />
        </filter>
      </defs>

      <g clipPath={`url(#${id}-frame)`} filter={`url(#${id}-grain)`}>
        <rect width="100" height="116" fill={`url(#${id}-bg)`} />

        {/* Schultern */}
        <path d={`M 8 116 q 6 -26 42 -26 q 36 0 42 26 z`} fill={f.shirt} />
        <path d={`M 42 92 l 8 10 l 8 -10 l -4 -3 l -4 4 l -4 -4 z`} fill="#e7e2d6" opacity="0.85" />

        {/* Hals – wird oben vom Kinn überdeckt, der Schatten sitzt darunter */}
        <rect x={CX - 8.5} y={CY + f.headH * 0.2} width="17" height="34" rx="6" fill={f.skin} />
        <ellipse cx={CX} cy={CY + f.headH * 0.5} rx="11" ry="5" fill="#000" opacity="0.14" />

        {/* Ohren (hinter dem Kopf, daher nur die Außenkante sichtbar) */}
        <ellipse cx={CX - f.headW * 0.5} cy={eyeY + 5} rx={f.ears * 0.68} ry={f.ears} fill={f.skin} />
        <ellipse cx={CX + f.headW * 0.5} cy={eyeY + 5} rx={f.ears * 0.68} ry={f.ears} fill={f.skin} />

        {/* Kopf: Kuppe oben, zum Kinn hin zulaufend. Breite und Höhe liegen
            fast gleichauf, sonst entsteht der typische Eierkopf. */}
        <path
          d={`M ${CX - f.headW * 0.5} ${CY - f.headH * 0.06}
              C ${CX - f.headW * 0.5} ${CY - f.headH * 0.56}, ${CX + f.headW * 0.5} ${CY - f.headH * 0.56}, ${CX + f.headW * 0.5} ${CY - f.headH * 0.06}
              C ${CX + f.headW * 0.5} ${CY + f.headH * 0.26}, ${CX + f.headW * 0.5 * f.jaw * 0.72} ${CY + f.headH * 0.48}, ${CX} ${CY + f.headH * 0.48}
              C ${CX - f.headW * 0.5 * f.jaw * 0.72} ${CY + f.headH * 0.48}, ${CX - f.headW * 0.5} ${CY + f.headH * 0.26}, ${CX - f.headW * 0.5} ${CY - f.headH * 0.06}
              Z`}
          fill={f.skin}
        />

        <Hair f={f} />

        {/* Brauen */}
        {/* Brauen in Haarfarbe – schwarze Brauen unter blondem Haar sind das
            klassische Verräter-Detail bei generierten Gesichtern. */}
        <g stroke={f.hair} strokeOpacity="0.8" strokeWidth={f.browThick} strokeLinecap="round">
          <line x1={eyeL - 5} y1={eyeY - f.browY + f.browAngle * 0.2} x2={eyeL + 5} y2={eyeY - f.browY - f.browAngle * 0.2} />
          <line x1={eyeR - 5} y1={eyeY - f.browY - f.browAngle * 0.2} x2={eyeR + 5} y2={eyeY - f.browY + f.browAngle * 0.2} />
        </g>

        {/* Augen.
            Ein Auge ist keine weiße Scheibe mit Punkt: Das Lid überdeckt die
            Iris oben, und ohne die dunkle Lidkante wirkt der Blick aufgerissen.
            Beides zusammen macht aus dem Cartoon-Auge einen ruhigen Blick. */}
        <g>
          {[eyeL, eyeR].map((cx, k) => (
            <g key={k}>
              <clipPath id={`${id}-eye${k}`}>
                <ellipse cx={cx} cy={eyeY} rx={f.eyeSize} ry={f.eyeSize * 0.66} />
              </clipPath>
              <ellipse cx={cx} cy={eyeY} rx={f.eyeSize} ry={f.eyeSize * 0.66} fill="#f1ece1" />
              <g clipPath={`url(#${id}-eye${k})`}>
                <circle cx={cx} cy={eyeY + 0.3} r={f.eyeSize * 0.62} fill="#5b432c" />
                <circle cx={cx} cy={eyeY + 0.3} r={f.eyeSize * 0.3} fill="#191210" />
                {/* Lidschatten von oben */}
                <rect
                  x={cx - f.eyeSize}
                  y={eyeY - f.eyeSize}
                  width={f.eyeSize * 2}
                  height={f.eyeSize * 0.5}
                  fill="#000"
                  opacity="0.22"
                />
              </g>
              {/* Lidkante */}
              <path
                d={`M ${cx - f.eyeSize} ${eyeY - 0.2} a ${f.eyeSize} ${f.eyeSize * 0.66} 0 0 1 ${f.eyeSize * 2} 0`}
                fill="none"
                stroke="#241a14"
                strokeOpacity="0.62"
                strokeWidth="0.9"
                strokeLinecap="round"
              />
            </g>
          ))}
        </g>

        {/* Nase */}
        <path
          d={`M ${CX} ${eyeY + 2} l -${f.noseW * 0.3} ${f.noseLen} q ${f.noseW} 2 ${f.noseW * 1.3} -1`}
          fill="none"
          stroke="#000"
          strokeOpacity="0.3"
          strokeWidth="1.4"
          strokeLinecap="round"
        />

        {/* Mund */}
        <path
          d={`M ${CX - f.mouthW / 2} ${eyeY + f.mouthY} q ${f.mouthW / 2} ${f.mouthCurve} ${f.mouthW} 0`}
          fill="none"
          stroke="#7d4038"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {f.freckles && (
          <g fill="#000" opacity="0.16">
            {[-7, -4, 4, 7, 0].map((dx, i) => (
              <circle key={i} cx={CX + dx} cy={eyeY + 7 + (i % 2) * 2} r="0.8" />
            ))}
          </g>
        )}

        {f.glasses && (
          <g fill="none" stroke="#2c2a26" strokeWidth="1.5" opacity="0.9">
            <circle cx={eyeL} cy={eyeY} r={f.eyeSize + 3} />
            <circle cx={eyeR} cy={eyeY} r={f.eyeSize + 3} />
            <line x1={eyeL + f.eyeSize + 3} y1={eyeY} x2={eyeR - f.eyeSize - 3} y2={eyeY} />
          </g>
        )}

        {/* Vignette und Lichtstich der Fotokabine */}
        <rect width="100" height="116" fill="url(#none)" />
        <radialGradient id={`${id}-vig`} cx="50%" cy="42%" r="72%">
          <stop offset="60%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.34" />
        </radialGradient>
        <rect width="100" height="116" fill={`url(#${id}-vig)`} />
      </g>
    </svg>
  )
}
