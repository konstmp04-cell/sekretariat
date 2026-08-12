# Sekretariat

Ein Dokumentenprüf-Spiel im Geist von *Papers, Please*: Du sitzt im
Schulsekretariat und entscheidest über eingereichte Entschuldigungen.
Stimmt die Unterschrift mit der in der Schülerakte hinterlegten überein?
Wurde die Notiz vor dem Fehltag ausgestellt? Fehlt bei vier Fehltagen das
Attest?

## Spielen

**https://konstmp04-cell.github.io/sekretariat/**

Rein statisch, kein Backend – der gesamte Spielstand liegt im Browser. Wer
den Link öffnet, fängt bei Tag 1 an; geteilte Spielstände gibt es nicht.

## Stand

Durchgehend spielbar von Tag 1 bis Tag 12: Titelbildschirm, Dienstanweisung
zum Schichtbeginn, Schicht mit verschiebbaren Dokumenten, Tagesabrechnung,
Speicherstand, Klangebene und drei Enden mit Abschlusszeugnis. Weitere
Dokumentarten und die Story stehen noch aus.

## Das Zeugnis

Am Ende bekommt in einer Schule auch der Prüfende eins – mit Note von 1 bis 6
aus der Trefferquote. Die aufschlussreichste Zeile ist dabei nicht „korrekt",
sondern die Aufteilung darunter: **durchgewunken** (Verstoß übersehen) gegen
**zu Unrecht abgewiesen** (Unschuldigen abgewiesen). Das eine ist
Nachlässigkeit, das andere Härte – zwei völlig verschiedene Arten, den Job
schlecht zu machen, die eine bloße Fehlerzahl verschluckt.

## Wiederkehrende Figuren

Drei Schüler kommen mehrfach, behalten über alle Tage dasselbe Gesicht und
dieselbe Elternunterschrift – und erinnern sich daran, wie entschieden wurde.

- **Milan Petrov** fälscht an vier Tagen. Mit jedem Mal wird der Grund
  deutlicher, warum.
- **Nora Weiss** legt einen Zwanziger unter die Entschuldigung. Ein dritter
  Knopf erscheint.
- **Emil Sander** hat beim zweiten Auftritt eindeutig ungültige Papiere und
  einen wahren Grund.

Darin liegt der Zweck: Eine Regel zu brechen kostet nichts, solange der Fall
anonym ist. Sie zu brechen, wenn jemand vor dir steht, den du kennst, ist
etwas anderes.

Die Auftritte stehen fest im Drehbuch. Was der Spieler entschieden hat, fließt
ausschließlich in den Dialog ein, nie in die Papiere – sonst wäre der Fall
nicht mehr fair prüfbar. Der Verlauf liegt in `stand.begegnungen` und wandert
mit in den Speicherstand.

## Die Schülerzeitung

Am Schichtbeginn liegt neben der Dienstanweisung „Der Pausenhof". Sie hat zwei
Aufgaben: Die Heizung fällt aus, die Turnhalle säuft ab, die Grippewelle rollt
an – Dinge, die ohne dein Zutun geschehen und die Welt größer machen als den
Schalter.

Wichtiger aber: Sie ist der Ort, an dem die Schule auf **dich** reagiert. Das
Rektorat sagt dir nie ins Gesicht, dass es etwas mitbekommen hat. Stattdessen
liest du eine Zeile, die zu deutlich klingt, um Zufall zu sein.

## Anordnungen des Rektorats

An den Tagen 4, 8 und 10 kam bisher keine neue Regel dazu – das letzte
Drittel wurde länger, aber nicht interessanter. Dort steht jetzt etwas
anderes: eine Anordnung, die **neben** dem Regelwerk gilt und jemanden
trifft, dessen Papiere in Ordnung sind.

| Tag | Anordnung | Trifft |
| --- | --- | --- |
| 4 | 7a nur noch mit Attest | Emil Sander, erster Auftritt |
| 8 | Atteste einer Praxis gelten nicht mehr | irgendwen |
| 10 | 10a wird gar nicht mehr angenommen | Nora Weiss |

Bis dahin hatte jeder Fall eine richtige Antwort, und der Spieler suchte sie
bloß. Eine Anordnung hat keine. Wer sie befolgt, weist einen Unschuldigen ab;
wer sie missachtet, stellt sich gegen das Rektorat.

Drei Bedingungen, ohne die das nicht funktioniert – und die alle drei
maschinell geprüft werden:

**Anweisungsfälle zählen nicht in die Trefferquote.** `pruefeEntscheidung`
gibt für sie `richtig: null` zurück, nicht `false`. Andernfalls stünde am
Ende im Zeugnis, der Spieler habe sich geirrt, weil er einen Unschuldigen
nicht abgewiesen hat – und das Spiel behauptete damit, es habe doch eine
richtige Antwort gegeben. Im Zeugnis erscheinen sie als eigener Abschnitt
ohne Note und ohne Farbe.

**Der Betroffene hat einwandfreie Papiere.** Läge zusätzlich ein Verstoß vor,
wäre der Fall ohnehin abzulehnen und die Anordnung bliebe folgenlos.
`buildQueue` stellt deshalb sicher, dass an jedem Anordnungstag mindestens
ein passender, makelloser Fall vorkommt – notfalls wird einer passend
gemacht, wobei nur verändert wird, was die Anordnung selbst prüft.

**Keine Seite ist rechnerisch günstiger.** Befolgen bringt beim Rektorat
(+4) genau so viel, wie es bei der Schülerschaft kostet (−6), und umgekehrt.
Der erste Entwurf lag bei +4/−8 gegen −8/+6 – da war Verweigern zwei Punkte
billiger, und aus der Zumutung wäre eine neunte Regel mit Rechenweg
geworden.

Die mittlere Anordnung trifft bewusst niemanden, den man kennt, sondern
jeden, der zufällig bei der falschen Ärztin war. So wächst sich eine
Maßnahme aus: erst ein Name, dann ein Merkmal.

## Wenn Geld im Spiel war

Dreistufig, und zwar bewusst: Ein sofortiger Rauswurf wäre billig – man lädt
neu und weiß Bescheid. **Drohung schlägt Schaden.**

1. Am nächsten Morgen ein interner Vermerk: „Der Vorgang wird beobachtet."
2. Förmliche Verwarnung.
3. Die Schicht endet mitten im Vorgang.

Am Ende steht dann kein Zeugnis, sondern ein **Disziplinarbescheid** – dasselbe
Papier, dieselbe Amtssprache, aber ohne Note. Und selbst wer es bei einer
einzigen Zuwendung belässt, findet im Zeugnis eine Zeile: *„Ein Vorgang blieb
aktenkundig."* Kein Punktabzug, keine Strafe – nur der Vermerk, dass es nicht
vergessen wurde.

## Die Lupe

Ab Tag 11 weicht eine Fälschung nur noch in einer einzigen Schlaufe vom
Original ab, ein Passfoto womöglich nur in der Brauenform. Dafür liegt eine
Lupe auf dem Schreibtisch.

Der Kniff: Sie vergrößert **keinen Bildschirmausschnitt**, sondern lässt das
Dokument darunter neu zeichnen – in groß. Unterschriften und Porträts
entstehen ohnehin aus einem Seed und lassen sich in jeder Größe ausgeben; das
Ergebnis ist gestochen scharf statt vergrößert-verpixelt.

Was unter der Linse liegt, ermittelt `document.elementsFromPoint`. Jeder
vergrößerbare Bereich trägt ein `data-lupe`-Kennzeichen. Mitgeführt wird auch
die Relativlage – eine Lupe, die stets die Mitte zeigt, wäre keine: Der Punkt
unter dem Glas muss auch im Glas erscheinen.

## Ablauf

```
TITEL → BRIEFING → SCHICHT → ABRECHNUNG → BRIEFING → … → ENDE
```

Tag 1 beginnt mit einer einzigen Regel und sechs Vorgängen. Jeder Tag bringt
einen Schüler mehr, an vier Tagen kommt je eine Regel dazu. Nicht die Schüler
werden schwieriger – die Anzahl der Dinge, die gleichzeitig im Kopf sein
müssen, wächst.

Das Spiel endet auf drei Arten: Rektorat bei 0 (Entlassung), Schülerschaft
bei 0 (die Schule wendet sich ab) oder Tag 12 überstanden. Geprüft wird immer
erst nach Schichtende – man arbeitet seinen Tag zu Ende und erfährt danach,
dass es der letzte war.

## Entwicklung

```bash
npm install
npm run dev
```

## Zwei Ruf-Leisten statt Miete

Anders als im Vorbild gibt es kein Haushaltsbudget, sondern zwei gegenläufige
Werte: Der **Rektor** belohnt korrekte Entscheidungen, die **Schülerschaft**
belohnt Milde. Beide gleichzeitig zu bedienen ist nicht vorgesehen – wer
regelkonform durchgreift, verliert die Sympathie der Schule, wer zu oft ein
Auge zudrückt, fliegt.

## Architektur

Die Spiellogik ist bewusst frei von React, damit sie testbar und ohne
UI-Änderungen balancierbar bleibt:

```
src/game/
  rng.js            Deterministischer Zufall (mulberry32) – alles seedbasiert
  signature.js      Prozedurale Unterschriften inkl. Fälschungsabweichung
  face.js           Gesichtsparameter für Passfotos
  pixelGrid.js      Pixel-Raster-Werkzeug (Symbole statt Farben)
  portraitArt.js    Handgesetzte Augen, Brauen, Nasen, Münder
  pixelPortrait.js  Baut daraus ein fertiges 44x52-Porträt
  applicant.js      Schülergenerierung + Warteschlange, gesteuerte Fehlerquote
  validate.js       Regelwerk und Prüfung einer Entscheidung
  days.js           Dienstplan: Länge und neue Regeln je Tag
  spielstand.js     Ablaufsteuerung als reiner Reducer + Speicherstand
  audio.js          Synthetisierte Klangebene (keine Audiodateien)

src/components/     Reine Darstellung (Papier, Handschrift, Stempel, Dokumente)
```

### Warum die Porträts Pixel-Art sind

Der erste Versuch waren glatte Vektorgesichter aus Ellipsen und Bézierkurven.
Das hat ein hartes Deckenlimit: In hoher Auflösung ist jede Ungenauigkeit
gestochen scharf sichtbar, und das Ergebnis landet unweigerlich bei
„generierter Avatar" statt bei Atmosphäre.

Die Porträts im Vorbild sind rund 40x50 Pixel groß – und funktionieren
*deswegen*. Auf so kleinem Raster liest das Auge grobe Formen als Charakter,
und es gibt keine Kurve, die schief sitzen könnte. Grob ist dort Stil, nicht
Schwäche.

Die Arbeit ist deshalb aufgeteilt: Silhouette, Hals, Schultern und Haaransatz
entstehen prozedural, weil eine gefüllte Ellipse auf diesem Raster ohnehin
exakt das ist, was ein Zeichner hinsetzen würde. Augen, Brauen, Nasen und
Münder sind dagegen Pixel für Pixel handgesetzt – dort entscheidet ein
einzelner Punkt über den Gesichtsausdruck, und das lässt sich nicht aus
Parametern ableiten.

In `portraitArt.js` stehen keine Farben, sondern Symbole (`s` = Haut,
`h` = Haar, `k` = Kontur). Die Palette wird erst beim Rendern aufgelegt.
Dieselbe Zeichnung funktioniert dadurch mit jedem Hautton und jeder Haarfarbe.

### Auf diesem Raster entscheidet die Haarsilhouette

Für Gesichtszüge ist bei 44x52 Pixeln schlicht kein Platz – ob eine Figur zu
ihrem Namen passt, hängt fast vollständig am Umriss der Frisur. `makeFace()`
bekommt das Geschlecht deshalb übergeben und wählt daraus die Frisur; Kiefer,
Augengröße, Brauenstärke und die Lippenfarbe ziehen leicht mit.

Zwei Dinge waren dabei entscheidend. Erstens folgte die Seitenpartie der
Kieferlinie: Weil die Kopfbreite zum Kinn hin gegen null geht, lief langes
Haar spitz zusammen und verschwand – es las sich wie ein Kurzhaarschnitt.
Langes Haar behält jetzt seine Breite und fällt an der Wange vorbei auf die
Schultern. Zweitens hatten Pony und Locken nur zwei bis vier Zeilen
Seitenhaar; eine Mindestlänge sorgt dafür, dass das Gesicht in jedem Fall
gerahmt wird.

Das sind Bildkonventionen des Mediums, keine Aussage über Menschen – sie
sorgen dafür, dass Foto und Akteneintrag zusammenpassen.

### Warum die Gesichter unheimlich wirkten

Vier Ursachen, alle typisch für Pixelporträts:

**Die Augen lagen auf den Haaren.** Der auffälligste Fehler, und ein reiner
Zeichenfehler: Die Seitensträhne wuchs von der Kopfkante nach *innen* und ragte
bis zu drei Pixel in die Augenpartie. Da Haar vor den Augen gezeichnet wird,
landete deren Außenkante anschließend auf dem Haar – die Augen wirkten
aufgesetzt. Die Strähne beginnt jetzt an der Silhouette und wächst nach außen.

**Zu viel Augenweiß.** Große helle Flächen im Auge lesen sich als Starren.
Reinweiß ist einem gedeckten Ton gewichen, und die frühere Variante mit einer
kompletten weißen Zeile ist entfallen.

**Der Mund hatte die Farbe der Außenkontur** und las sich dadurch als Schnitt
im Gesicht. Er hat jetzt einen eigenen warmen Ton.

**Vollkommene Symmetrie.** Kein echtes Gesicht ist spiegelgleich. Eine Braue
sitzt einen Pixel höher als die andere – mehr braucht es nicht.

### Klang ohne Audiodateien

Alles wird zur Laufzeit über Web Audio synthetisiert. Drei Grundsätze:

**Geschichtet.** Ein Stempelschlag besteht aus vier Lagen: dumpfer Aufprall
mit Tonhöhensturz, Gummi-Knack, Papier-Knirschen und einem hellen Transienten.
Ein einzelner Oszillator klingt immer nach Piepser, egal wie man ihn stimmt.

**Nie zweimal gleich.** Tonhöhe, Anschlagshärte und der Startversatz im
Rauschpuffer werden bei jeder Wiedergabe neu gewürfelt. Ohne das entsteht ab
der dritten Wiederholung der „Maschinengewehr-Effekt", und das Ohr erkennt
die Konserve.

**Ein gemeinsamer Raum.** Ein kurzer Hall aus abklingendem Rauschen liegt über
allem. Das ist beim Ton dasselbe Prinzip wie die begrenzte Farbpalette beim
Bild – es macht aus Einzeleffekten eine Welt.

Die Klangbauer nehmen ihren `AudioContext` als Parameter, statt auf einen
globalen zuzugreifen. Dadurch lassen sie sich in einen `OfflineAudioContext`
rendern und messen. Gemessene Pegel (Peak / Dauer):

| Klang | Peak | Dauer |
| --- | --- | --- |
| Glocke | 0.69 | 1030 ms |
| Stempel | 0.52 | 86 ms |
| Summer | 0.48 | 340 ms |
| Klick | 0.19 | 14 ms |
| Papier | 0.17 | 271 ms |
| Haken | 0.14 | 123 ms |

Genau diese Messung hat zwei Fehler aufgedeckt, die beim Hören leicht
durchgerutscht wären: Papierrascheln und Bestätigungston lagen ursprünglich
bei 0.06 und waren gegen den Stempelschlag praktisch unhörbar.

### Der Ton darf nicht der einzige Kanal sein

Viele spielen ohne Lautstärke. Für sie gab es nach einer Entscheidung nur die
Textzeile am unteren Rand – und dorthin schaut niemand, solange er die
Papiere ansieht. Ob eine Entscheidung richtig war, ließ sich sonst erst an
den beiden Ruf-Balken ablesen, also zu spät und zu indirekt.

Deshalb leuchtet jetzt für 900 ms der Bildschirmrand auf, grün oder rot. Nur
der Rand und nicht die Fläche: Ein Schwall über den ganzen Schirm wäre in
dieser gedeckten Farbwelt ein Fremdkörper und sähe nach Quiz-App aus. Schnell
hell, langsam weg – so liest es sich als Aufleuchten, nicht als Blinken.

Zwei Feinheiten, die nicht offensichtlich sind:

**Grün ist kräftiger angesetzt als Rot.** Bei gleicher Deckung wirkt das
dunkle Tannengrün gegen den fast schwarzen Schreibtisch deutlich blasser als
das warme Rot.

**Anordnungen bekommen keinen Schein.** Dort hat das Spiel kein Urteil
abzugeben, und eine Farbe wäre schon eines – aus demselben Grund bleibt dort
auch der Bestätigungston aus.

Bei `prefers-reduced-motion` wird der Schein länger und gleichmäßiger, statt
wie die übrigen Animationen auf 1 ms gekürzt zu werden: Er ist für manche die
einzige Rückmeldung, die ankommt. Farbe bleibt dabei nie das alleinige
Signal – die Textzeile nennt den Grund weiterhin im Klartext.

### Galerie-Ansicht

Unter `#galerie` liegen viele Porträts nebeneinander. Einzeln durchklicken
taugt nicht zur Beurteilung – Fehler im Generator zeigen sich erst in der
Masse. Drei Bugs, die erst dort auffielen: verschmelzende Brillengläser durch
zu geringen Augenabstand, ein schnurgerader Haaransatz, der jede Frisur wie
eine Mütze aussehen ließ, und ergraute Neuntklässler.

### Warum alles prozedural ist

Jeder Schüler braucht ein eigenes Gesicht und jedes Elternteil eine eigene
Unterschrift – gezeichnete Bilder wären hier nicht nur aufwendig, sondern
funktional falsch.

Der entscheidende Punkt: **Die Fälschungsmechanik fällt aus dem Grafiksystem
heraus.** Eine Unterschrift entsteht aus einem Seed. Eine Fälschung entsteht
aus *demselben* Seed mit verschobenen Stützpunkten – gleicher Schwung, gleiche
Länge, aber die Schlaufen sitzen daneben. Ein anderer Seed würde eine völlig
fremde Kurve ergeben, die jeder auf Anhieb erkennt. Über
`forgeryStrengthForDay()` wird die Abweichung mit fortschreitendem Spiel
immer subtiler.

### Der Lichtbildabgleich folgt demselben Muster

Ab Tag 7 muss das Passfoto in der Akte zur Person am Schalter passen. Ein
falsches Foto zeigt deshalb nicht eine fremde Person – das erkennt jeder auf
Anhieb und wäre keine Prüfung. Stattdessen werden einzelne Merkmale
desselben Gesichts verschoben, genau wie bei den Unterschriften.

Verschoben wird nur, was auf 44x52 Pixeln sichtbar ist: Haarfarbe, Frisur,
Brille, Augen- und Brauenform, Kopfform. Nase, Mund und Sommersprossen sind
hier drei Pixel groß – ein Unterschied daran wäre nicht subtil, sondern
unfair. Die Staffelung übernimmt `fotoAbweichungFuerTag()`: bis Tag 8 zwei
auffällige Merkmale, bis Tag 10 eines, danach nur noch ein feines.

Damit prüft das Spiel erstmals eine andere Wahrnehmung als „zwei Textfelder
vergleichen" – und die aufwendig gebauten Porträts bekommen eine Aufgabe.

### Fehlerquote wird gesetzt, nicht gewürfelt

`buildQueue()` legt vorab fest, wie viele Verstöße ein Tag enthält. Bei rein
zufälliger Verteilung gäbe es Tage ganz ohne Fehler (fühlt sich leer an) und
Tage voller Fälschungen (fühlt sich unfair an). Die Quote steigt mit dem Tag,
bleibt aber unter 45 % – darüber kippt das Spiel von „prüfen" zu
„grundsätzlich misstrauen".

Lange stand das nur so da. Tatsächlich entschied ein Münzwurf **je Vorgang**,
ob ein Verstoß eingebaut wird. Im Mittel stimmte die Quote damit, im
Einzelfall überhaupt nicht:

| Tag | vorgesehen | tatsächlich |
| --- | --- | --- |
| 7 | 5,1 | 8 |
| 8 | 5,9 | 9 |
| 12 | 6,3 | **11 von 14 – 79 %** |

Und weil sämtliche Seeds fest sind, war das kein Pech, das sich beim nächsten
Anlauf ausgleicht: **jeder** Spieler bekam denselben Tag 12. Genau der Tag,
an dem das Spiel enden soll, war der, an dem es von „prüfen" zu
„grundsätzlich misstrauen" kippte.

Gezogen wird jetzt eine Anzahl statt einer Folge von Münzwürfen, abgerundet
statt gerundet (sonst käme an Tag 8 mit 6 von 13 wieder eine Quote von 46 %
heraus). Stammgäste zählen in die Quote hinein, statt obendrauf zu kommen,
und die Zusicherung für neu eingeführte Regeln widmet einen bestehenden
Verstoß um, statt einen weiteren anzulegen.

## Steuerung

Entschieden wird über die beiden Gummistempel unten am Schreibtisch – ein
Klick genügt. Sie über das Dokument zu ziehen wäre naheliegend gewesen,
ergäbe bei rund 120 Vorgängen über zwölf Tage aber Fleißarbeit statt Haptik.

| Taste | Wirkung |
| --- | --- |
| `←` / `A` | Als unentschuldigt stempeln |
| `→` / `D` | Als entschuldigt stempeln |

## Nächste Schritte

In dieser Reihenfolge – jeder Punkt baut auf dem vorherigen auf:

1. Ein Finale für Tag 12 – der letzte Tag soll sich als letzter anfühlen und
   nicht als vierzehnter Vorgang wie jeder andere
2. Widerspruchs-Mechanik: zwei widersprüchliche Felder anklicken und den
   Schüler damit konfrontieren. Bisher gibt es genau zwei Verben, links
   stempeln und rechts stempeln

## Acht Regeln, drei Arten zu prüfen

| Tag | Regel | Art der Prüfung |
| --- | --- | --- |
| 1 | Unterschrift prüfen | Bild gegen Bild |
| 2 | Ausstellungsdatum | Feld gegen Feld |
| 3 | Attestpflicht | Vollständigkeit |
| 5 | Namensabgleich | Feld gegen Feld |
| 6 | Klausurtage | Nachschlagen im Aushang |
| 7 | Lichtbildabgleich | Bild gegen Bild |
| 9 | Attestzeitraum | Feld gegen Feld |
| 11 | Sperrvermerk | hebt alles andere auf |

Der Klausurplan ist dabei das einzige Dokument, das keinem Schüler gehört: Er
liegt den ganzen Tag auf dem Tisch und wechselt erst am nächsten Morgen. Die
Regel verlangt deshalb etwas anderes als alle übrigen – nicht vergleichen,
sondern nachschlagen und behalten.

Der Sperrvermerk wiederum ist die einzige Regel, die andere aufhebt: Die
Papiere können makellos sein, der Fall gehört trotzdem abgewiesen.

### Neue Regeln erscheinen garantiert am Einführungstag

`buildQueue` stellt sicher, dass jede an diesem Tag neu freigeschaltete Regel
mindestens einmal vorkommt. Ohne diese Zusicherung kann eine Regel am Tag
ihrer Einführung schlicht ausbleiben – bei acht Verstoßarten und rund sechs
Verstößen je Schicht ist das keineswegs unwahrscheinlich. Die Dienstanweisung
kündigt dann etwas an, das den ganzen Tag nicht vorkommt, und genau der
Moment, der das Spiel antreibt, läuft ins Leere.

## Das Attest ist ein eigenes Blatt

Ab drei Fehltagen liegt ein ärztliches Attest bei – nicht als Zeile auf der
Entschuldigung, sondern als drittes Dokument auf dem Schreibtisch. Es ist
bewusst getippt, gestempelt und amtlich gesetzt, während die Entschuldigung
handgeschrieben und krakelig ist: Auf einem vollen Tisch müssen sich die
Blätter schon an ihrer Erscheinung auseinanderhalten lassen, auch wenn nur
eine Ecke hervorschaut.

Daraus folgt die sechste Regel (ab Tag 9): Das Attest muss **sämtliche**
Fehltage abdecken. Wer nur prüft, *ob* ein Attest beiliegt, übersieht das –
und genau darin unterscheidet sie sich von der Attestpflicht aus Tag 3.

## Der Schreibtisch ist absichtlich zu klein

Die Dokumente liegen frei auf der Fläche, überlappen sich und lassen sich mit
der Maus verschieben; das zuletzt angefasste liegt oben. Das ist keine
Bequemlichkeit, sondern der Kern des Spielgefühls: Wer die Unterschrift mit
der Akte vergleichen will, muss die Blätter erst nebeneinanderlegen. Ohne
diese Handarbeit wäre der Vorgang ein Formular mit zwei Knöpfen.

Umgesetzt über Pointer-Events statt Maus-Events, damit dasselbe auch mit
Finger oder Stift funktioniert. `setPointerCapture` verhindert, dass ein
schnell gezogenes Blatt abreißt, sobald der Zeiger seinen Rand verlässt. Eine
Randbegrenzung hält immer mindestens 140 Pixel des Blattes auf der Fläche –
sonst ließe sich ein Dokument aus dem Bild schieben und wäre nicht mehr zu
greifen.
