/**
 * Ein zusammengefalteter Geldschein auf dem Tresen.
 *
 * Bisher stand die Bestechung nur als Satz in der Sprechblase. Als Gegenstand
 * auf dem Schreibtisch wiegt sie deutlich schwerer: Der Schein liegt halb
 * unter der Entschuldigung, du musst ihn beiseiteschieben, um darunter zu
 * lesen – und dabei jedes Mal wieder anfassen.
 *
 * Bewusst keine Nachbildung eines echten Zahlungsmittels: erfundene
 * Ornamentik, kein Hoheitszeichen, keine Kennungen. Es soll erkennbar Geld
 * sein, nicht ein bestimmter Schein.
 */

export default function Geldschein({ betrag = 20, tilt = -6 }) {
  const papier = '#8f9c86'
  const druck = '#2f4034'

  return (
    <div
      className="relative"
      style={{
        width: 168,
        transform: `rotate(${tilt}deg)`,
        filter: 'drop-shadow(0 3px 5px rgb(0 0 0 / 0.45))',
      }}
    >
      <svg viewBox="0 0 168 84" width="168" role="img" aria-label={`${betrag} Euro`}>
        <defs>
          {/* Guillochen: ineinandergelegte Wellen, wie sie auf Wertpapieren
              den Untergrund bilden. */}
          <pattern id="guilloche" width="168" height="84" patternUnits="userSpaceOnUse">
            {Array.from({ length: 11 }, (_, i) => (
              <path
                key={i}
                d={`M 0 ${8 + i * 7} q 42 -9 84 0 q 42 9 84 0`}
                fill="none"
                stroke={druck}
                strokeWidth="0.6"
                opacity="0.28"
              />
            ))}
          </pattern>
        </defs>

        <rect width="168" height="84" rx="2" fill={papier} />
        <rect width="168" height="84" fill="url(#guilloche)" />
        <rect x="4" y="4" width="160" height="76" rx="1" fill="none" stroke={druck} strokeWidth="1" opacity="0.5" />

        {/* Wertangabe in zwei Ecken */}
        <text x="14" y="30" fill={druck} fontSize="21" fontWeight="700" fontFamily="ui-monospace, monospace">
          {betrag}
        </text>
        <text
          x="154"
          y="70"
          textAnchor="end"
          fill={druck}
          fontSize="14"
          fontWeight="700"
          fontFamily="ui-monospace, monospace"
          opacity="0.8"
        >
          {betrag}
        </text>

        {/* Ornamentfeld statt Porträt */}
        <ellipse cx="84" cy="42" rx="26" ry="30" fill="none" stroke={druck} strokeWidth="0.8" opacity="0.55" />
        <ellipse cx="84" cy="42" rx="19" ry="23" fill="none" stroke={druck} strokeWidth="0.6" opacity="0.4" />
        <text x="84" y="47" textAnchor="middle" fill={druck} fontSize="9" opacity="0.6" fontFamily="ui-monospace, monospace">
          ★
        </text>

        <text x="14" y="72" fill={druck} fontSize="5.5" opacity="0.55" fontFamily="ui-monospace, monospace" letterSpacing="1">
          ZAHLUNGSMITTEL
        </text>

        {/* Knickfalte quer über den Schein */}
        <rect x="0" y="40" width="168" height="1.5" fill="#000" opacity="0.18" />
        <rect x="0" y="41.5" width="168" height="1.5" fill="#fff" opacity="0.14" />
      </svg>
    </div>
  )
}
