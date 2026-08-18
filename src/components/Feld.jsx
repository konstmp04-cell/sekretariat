/**
 * Ein antippbares Feld auf einem Dokument.
 *
 * Über einen Kontext und nicht über Eigenschaften: Sonst müsste die Menge der
 * markierten Felder durch ExcuseNote, StudentFile, Attest, Klausurplan und
 * jedes künftige Dokument durchgereicht werden, nur damit ganz unten eine
 * Umrandung erscheint. Die Dokumente sollen sagen, WAS ein Feld ist, und
 * nichts davon wissen, ob gerade jemand darauf zeigt.
 *
 * Markiert wird mit `outline`, nicht mit `border`: Ein Rahmen verschöbe die
 * Zeile um zwei Pixel, und auf einem handgeschriebenen Zettel fällt genau das
 * auf.
 */

import { createContext, useContext } from 'react'

const Kontext = createContext({ markiert: new Set(), aktiv: false })

export function Markierung({ markiert, aktiv, children }) {
  return <Kontext.Provider value={{ markiert, aktiv }}>{children}</Kontext.Provider>
}

export default function Feld({ id, as: Tag = 'span', className = '', style, children }) {
  const { markiert, aktiv } = useContext(Kontext)
  const an = markiert.has(id)

  return (
    <Tag
      data-feld={aktiv ? id : undefined}
      className={`${className} ${aktiv ? 'feld-aktiv' : ''}`}
      style={{
        // Inline-Block, damit die Umrandung eine Zeile umschließt statt über
        // zwei Zeilen zu zerfallen.
        display: Tag === 'span' ? 'inline-block' : undefined,
        borderRadius: 2,
        outline: an ? '2px solid var(--color-brass)' : 'none',
        outlineOffset: 2,
        background: an ? 'rgb(185 150 89 / 0.16)' : 'transparent',
        transition: 'outline-color 120ms ease, background 120ms ease',
        ...style,
      }}
    >
      {children}
    </Tag>
  )
}
