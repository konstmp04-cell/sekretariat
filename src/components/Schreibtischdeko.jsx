/**
 * Der Schreibtisch als bewohnter Arbeitsplatz.
 *
 * Bisher war die Fläche eine dunkle Platte mit Papieren darauf. Was fehlte,
 * waren die Dinge, die einen Arbeitsplatz zu jemandes Arbeitsplatz machen:
 * eine abgewetzte Schreibunterlage, Kratzer in der Platte, eine kalt
 * gewordene Tasse.
 *
 * Die Gummistempel lagen zunächst ebenfalls hier – sie sind inzwischen
 * Bedienelement geworden und stehen in Stempelwerkzeug.jsx.
 *
 * Alles hier ist reine Kulisse – `pointer-events: none` und unterhalb der
 * Dokumente, damit nichts das Verschieben stört.
 *
 * Der Tisch altert über die zwölf Tage: mehr Kaffeeränder, mehr Kratzer.
 * Bewusst so langsam, dass es niemand bemerkt – zwischen zwei Tagen kommt
 * je ein Ring oder Kratzer dazu. Gespürt wird es trotzdem: An Tag 12 sieht
 * der Arbeitsplatz benutzt aus, an Tag 1 sah er ordentlich aus, und dazwischen
 * hat man selbst dort gesessen.
 */

/** Tasse von oben – der Kaffee ist längst kalt. */
function Tasse() {
  return (
    <svg viewBox="0 0 78 70" width="70">
      <ellipse cx="36" cy="62" rx="26" ry="5" fill="#000" opacity="0.4" />
      {/* Henkel */}
      <path d="M 58 30 q 16 0 16 12 q 0 12 -16 12" fill="none" stroke="#cfc7b8" strokeWidth="6" />
      <circle cx="36" cy="36" r="28" fill="#ddd5c6" />
      <circle cx="36" cy="36" r="23" fill="#c4bbaa" />
      <circle cx="36" cy="36" r="21" fill="#3b2a1c" />
      {/* Lichtreflex auf der Oberfläche */}
      <ellipse cx="28" cy="28" rx="8" ry="5" fill="#7a5a3c" opacity="0.45" />
    </svg>
  )
}

/** Alle möglichen Spuren – aufgedeckt wird davon nur der Anfang der Liste. */
const KAFFEERAENDER = [
  { left: '72%', top: '76%', r: 30 },
  { left: '78%', top: '68%', r: 22 },
  { left: '64%', top: '84%', r: 26 },
  { left: '12%', top: '18%', r: 19 },
  { left: '83%', top: '81%', r: 15 },
  { left: '55%', top: '12%', r: 24 },
  { left: '30%', top: '88%', r: 17 },
]

const KRATZER = [
  'M 88 62 l 130 -14',
  'M 1180 520 l 96 22',
  'M 1220 130 l 60 -8',
  'M 150 560 l 80 10',
  'M 1090 600 l 120 -30',
  'M 420 92 l 150 12',
  'M 700 640 l -110 16',
  'M 980 240 l 70 -22',
  'M 260 380 l 96 -6',
  'M 1140 330 l -84 18',
]

export default function Schreibtischdeko({ tag = 1 }) {
  // Zwei Ringe und fünf Kratzer zu Beginn, danach je Tag einer mehr.
  const ringe = KAFFEERAENDER.slice(0, Math.min(KAFFEERAENDER.length, 2 + Math.floor(tag / 2)))
  const kratzer = KRATZER.slice(0, Math.min(KRATZER.length, 5 + Math.floor(tag / 2.5)))

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none">
      {/* --- Schreibunterlage ------------------------------------------- */}
      <div
        className="absolute rounded-[3px]"
        style={{
          left: '11%',
          top: '1%',
          width: '70%',
          height: '82%',
          background:
            // Sehr dunkel und entsaettigt: Eine kraeftig gruene Unterlage
            // zieht sofort alle Aufmerksamkeit auf sich und laesst den
            // Schreibtisch wie einen Billardtisch wirken. Sie soll den
            // Arbeitsbereich rahmen, nicht ihn beherrschen.
            'linear-gradient(150deg, #1f2823 0%, #1a221d 45%, #161c19 100%)',
          boxShadow:
            'inset 0 0 70px rgb(0 0 0 / 0.55), 0 1px 0 rgb(255 255 255 / 0.025), 0 8px 20px -6px rgb(0 0 0 / 0.6)',
        }}
      >
        {/* Abgewetzte Mitte, wo die Hände liegen */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 45% 40% at 45% 55%, rgb(190 200 180 / 0.045), transparent 70%)',
          }}
        />
        {/* Genarbte Oberfläche */}
        <svg className="absolute inset-0 h-full w-full opacity-30 mix-blend-overlay">
          <filter id="leder">
            <feTurbulence type="fractalNoise" baseFrequency="0.62" numOctaves="4" seed="21" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#leder)" />
        </svg>
        {/* Lederecken */}
        {[
          { left: 0, top: 0, rot: 0 },
          { right: 0, top: 0, rot: 90 },
          { left: 0, bottom: 0, rot: 270 },
          { right: 0, bottom: 0, rot: 180 },
        ].map((e, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              ...e,
              width: 54,
              height: 54,
              background: 'linear-gradient(135deg, #3c2f22 48%, transparent 48%)',
              transform: `rotate(${e.rot}deg)`,
              transformOrigin: 'center',
              opacity: 0.8,
            }}
          />
        ))}
        {/* Kaffeeränder auf der Unterlage – mit den Tagen werden es mehr. */}
        {ringe.map((k, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: k.left,
              top: k.top,
              width: k.r * 2,
              height: k.r * 2,
              border: '3px solid rgb(60 40 20 / 0.35)',
              filter: 'blur(0.4px)',
            }}
          />
        ))}
      </div>

      {/* --- Kratzer in der Tischplatte ---------------------------------- */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.13]">
        {kratzer.map((d, i) => (
          <path key={i} d={d} stroke="#e8e2d2" strokeWidth="1" fill="none" />
        ))}
      </svg>

      {/* --- Tasse ------------------------------------------------------- */}
      {/* Unten links, unterhalb des Klausurplans. */}
      <div className="absolute" style={{ left: '3%', top: '82%' }}>
        <Tasse />
      </div>
    </div>
  )
}
