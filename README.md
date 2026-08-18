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

## Tag 12: der letzte Vorgang

Der Schlusstag war lange der vierzehnte Vorgang wie jeder andere. Jetzt läuft
alles zusammen, was das Spiel über dich weiß.

Alle drei Stammgäste treten ein letztes Mal an, und ihre Zeile hängt nicht
mehr an der letzten Begegnung, sondern am ganzen Verlauf – dafür darf ein
Auftritt statt fester Varianten eine Funktion mitbringen (`zeileAus`). Ein
Wiedersehen kommt mit „letztes Mal haben Sie …" aus, ein Abschied nicht.

**Milan Petrov steht garantiert an letzter Stelle.** Zum ersten Mal in zwölf
Tagen sind seine Papiere einwandfrei – er hat seine Mutter geweckt. Und genau
heute steht schon am Morgen in der Dienstanweisung:

> Von dem Schüler Milan Petrov, 9b, sind keine Entschuldigungen mehr
> anzunehmen.
> *Die Vorgänge der vergangenen Wochen sind dem Rektorat bekannt.*

Die einzige Anordnung im Spiel, die einen Namen nennt statt eines Merkmals –
und die Begründung ist die Pointe. Wer ihn elf Tage lang gedeckt hat, liest
darin, dass es aufgefallen ist. Wer ihn jedes Mal abgewiesen hat, liest
dasselbe und weiß nicht, ob es um ihn geht oder um einen selbst. Das Rektorat
sagt es nicht.

Danach kommt kein Vorgang mehr. `letzter: true` erzwingt den allerletzten
Platz der Schicht – ein Abschied, auf den noch drei Fremde folgen, ist keiner.
Der letzte Platz ist außerdem für Kuriositäten gesperrt.

### Ein Stammgast darf seine Klasse nicht verlieren

Beim Bauen aufgefallen: Emil stand an Tag 12 plötzlich in der 10a statt in der
7a. Ursache war die Kollisionsauflösung, die einen Schüler ohne Attest aus
einer Klausurklasse herausschiebt, damit die Fehlerquote stimmt. Für einen
beliebigen Schüler ist das richtig – bei einer Figur nimmt es ihr das, was sie
über zwölf Tage wiedererkennbar macht. Acht Tage zuvor hatte eine Anordnung
genau seine Klasse genannt.

Gelöst an der Wurzel: Der Klausurplan schließt die Klassen der heute
auftretenden Stammgäste von vornherein aus. Die Auflösung bloß für Figuren zu
überspringen hätte nicht gereicht – dann stünde ein Stammgast ohne Attest in
einer Klausurklasse und hätte einen Verstoß, den das Drehbuch nie vorgesehen
hat. Betroffen war übrigens auch Tag 11, lange bevor es Tag 12 gab.

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

## Kuriositäten

Zwölf Tage Formularprüfung sind lang. Ohne Ausreißer wird aus Konzentration
Abstumpfung. An fünf Tagen – 3, 5, 7, 9 und 12 – steht deshalb ein Vorgang,
bei dem man kurz auflacht.

**Absurde Gründe** stehen auf einer Entschuldigung, an der sonst nichts
auszusetzen ist. „Wurde im Supermarkt eingeschlossen", „Familiäre
Verpflichtungen (Schildkröte)". Darin liegt der Witz und gleichzeitig eine
Prüfung: Im Regelwerk steht kein Wort davon, dass ein Grund glaubwürdig sein
muss. Wer so etwas abweist, weist einen Unschuldigen ab – nach Bauchgefühl
statt nach Dienstanweisung. Dieselbe Lektion wie bei den Anordnungen, nur von
der anderen Seite.

**Dreiste Fälschungen** sitzen ausschließlich auf Vorgängen, die ohnehin
gefälscht sind. Sie machen einen schweren Fall zum geschenkten – ein
Durchatmen zwischen zwei kniffligen. Unter der Linie steht dann, was jemand
ohne nachzudenken hingeschrieben hat: „Mutti". „Mama (echt)". Gelegentlich mit
Nachtrag: *P.S.: Bitte nicht zu Hause anrufen.*

Auf einer gültigen Entschuldigung dürfen sie unter keinen Umständen
erscheinen. Ein Gag, der genaues Hinsehen bestraft, wäre das Gegenteil von
dem, was das Spiel will – `signaturePath` ignoriert das `dreist`-Kennzeichen
deshalb, solange `forgery === 0` ist, und ein Test prüft für mehrere Seeds,
dass die echte Kurve bitgenau dieselbe bleibt.

### Warum die Krakelei ungleichmäßig sein muss

Der erste Entwurf zeichnete drei bis vier gleich hohe Zacken in gleichen
Abständen. Das Ergebnis las sich als Sinuskurve – also als etwas, das jemand
*sorgfältig* gezeichnet hat. Der Witz liegt aber genau darin, dass sich
niemand Mühe gegeben hat. Jetzt bekommt jede Spitze eine eigene Höhe, die
Abstände schwanken, die Grundlinie sackt nach rechts weg, und der letzte
Strich verliert die Lust.

### Auch hier: gesetzt, nicht gewürfelt

Der erste Entwurf warf an jedem Tag eine Münze (55 %). Heraus kamen fünf
Kuriositäten, alle zwischen Tag 6 und 10, und eine einzige dreiste Fälschung
im ganzen Spiel – bei festen Seeds für jeden Spieler dieselbe Klumpung.
Derselbe Fehler wie bei der Verstoßquote, nur an anderer Stelle.

Die Tage stehen jetzt fest. Frei bleiben Tag 1 und 2 (wer die Regeln noch
lernt, soll nicht am Sonderfall lernen, was normal ist) sowie 4, 8 und 10
(dort ergeht eine Anordnung, die ohne Konkurrenz wirken soll). Verschont
bleiben außerdem der erste Vorgang des Tages, alle Stammgäste, der Betroffene
der Anordnung und der Fall, an dem die heute eingeführte Regel vorgeführt
wird.

## Störungen

An Inhalt fehlte es nicht – acht Regeln, drei Werkzeuge, Anordnungen,
Kuriositäten, wiederkehrende Figuren. Was fehlte, war Abwechslung in der
**Form**: Jeder der zwölf Tage hatte denselben Ablauf, und eine neunte Regel
hätte daran nichts geändert.

Eine Störung ändert keine Regel, sie nimmt ein Werkzeug weg.

| Tag | Störung | Wirkung |
| --- | --- | --- |
| 6 | Lupe an die Fachschaft Kunst verliehen | Vergleichen mit bloßem Auge |
| 8 | Amtsleitung gestört | Kein Anruf möglich |
| 11 | Lichtbilder zur Digitalisierung abgeholt | §7 Lichtbildabgleich ruht |

Der Gewinn liegt weniger im gestörten Tag als in allen anderen: **Man merkt
erst, was ein Werkzeug einem abnimmt, wenn es einmal fehlt.** Die Lupe benutzt
man nach drei Tagen automatisch; an dem Tag, an dem sie verliehen ist, sieht
man zum ersten Mal, wie viel sie trägt.

Tag 8 ist mit Bedacht gewählt: Das ist der Tag, an dem das Rektorat anordnet,
Atteste einer bestimmten Praxis nicht anzuerkennen – und ausgerechnet dort
kann man dann nicht nachfragen.

### Zwei Grundsätze

**Immer angekündigt.** Die Störung steht am Morgen im Briefing und den ganzen
Tag über im Regelwerk. Ein Werkzeug, das ohne Vorwarnung fehlt, ist kein
Ereignis, sondern ein Fehler – der Spieler würde zu Recht annehmen, dass etwas
kaputt ist.

**Nie eine Falle.** Nimmt eine Störung einer Regel die Grundlage, wird die
Regel für den Tag ausgesetzt: sichtbar durchgestrichen im Regelwerk, und
`buildQueue` baut den zugehörigen Verstoß gar nicht erst ein. An Tag 11 gibt
es null Lichtbild-Verstöße, an Tag 10 und 12 wieder welche.

Gestaltet ist die Störung bewusst anders als eine Anordnung: kein Rot, kein
Rahmen, sondern ein schlichter Vermerk. Wer beide gleich aussehen ließe,
machte aus einer defekten Leitung eine Zumutung des Rektorats.

Drei auf zwölf Tage, nicht mehr. Eine Störung, die jeden zweiten Tag kommt,
ist keine mehr, sondern der Normalzustand.

## Nasse und zerrissene Atteste

Nicht jedes Attest kommt als sauberes Blatt über den Tresen. Manche waren in
einer Jackentasche, als es regnete; manche sind gerissen. Die Frage bei so
etwas entscheidet alles:

> Erzeugt der Zustand eine **Entscheidung** oder nur **Arbeit**?

Ein Trocknungsvorgang, bei dem man dreißig Sekunden wartet, ist Arbeit. Ein
Klebeband-Werkzeug, mit dem man Kanten aneinanderpinselt, ist Arbeit – und
dazu ein viertes Objekt auf einem Schreibtisch, der schon voll ist. Beides
wäre bei 132 Vorgängen eine Strafe, kein Ereignis.

Deshalb die andere Fassung: **Ein beschädigtes Papier verbirgt eine Angabe,
und die Angabe ist auf zwei Wegen zu bekommen.** Der Zustand fügt keinen
Handgriff hinzu, er nimmt eine Selbstverständlichkeit weg – man kann das Blatt
nicht mehr einfach lesen.

**Nass.** Der bescheinigte Zeitraum ist verlaufen; darüber liegt der Rand
eines eingetrockneten Flecks. Man sieht, dass dort etwas steht, und liest es
nicht. Zwei Auswege: Die Lupe holt die Striche unter der zerlaufenen Tinte
hervor, oder die Praxis liest den Zeitraum am Telefon vor – und das kostet
einen von zwei Anrufen.

**Zerrissen.** Das Attest kommt in zwei Stücken, und der Riss läuft
**senkrecht**. Das ist der ganze Trick: Ein waagerechter Riss ließe die
Zeitraumzeile unversehrt und wäre bloß Verzierung. Senkrecht trennt er sie
mitten durch – links steht „vom 15. b", rechts „is 17. März", und keine
Hälfte sagt etwas aus. Man zieht die Stücke aneinander, sie rasten ein, fertig.
Kein Klebeband, kein Werkzeug, keine Wartezeit.

### Der Riss läuft bei 33 %, nicht in der Mitte

Ausgemessen, nicht geschätzt. Der erste Entwurf riss bei 47 % – mittig, wie
ein Riss eben aussieht. Auf dem Bildschirm stand danach auf dem **linken**
Stück „vom 15. bis 17." vollständig zu lesen: Die Zeile ist bei 12 px
Schriftgröße nur rund 133 px breit, der Schnitt kam erst dahinter. Der Riss
war reine Zierde – man konnte den Zeitraum ablesen, ohne irgendetwas
zusammenzuschieben.

Bei 33 % fällt der Schnitt rund 60 bis 90 px hinter den Textanfang, also
mitten in die Zeitangabe. Jede Hälfte nennt dann eine Zahl und verschweigt,
wofür sie steht.

### Was die Lupe auf einer losen Hälfte zeigt: nichts

Die Lupe vergrößert keine Bildpunkte, sie zeichnet ihren Inhalt neu. Ohne
Gegenmaßnahme läse man unter dem Glas den vollständigen Zeitraum von einer
Hälfte ab, auf der er physisch gar nicht steht – der Riss wäre umsonst.
Solange die Stücke getrennt liegen, trägt die Zeile deshalb kein Lupenziel.
Nach dem Zusammenfügen wieder.

### Vier Tage, und die Reihenfolge ist Absicht

| Tag | Zustand | Fall |
| --- | --- | --- |
| 4 | nass | einwandfrei |
| 6 | zerrissen | einwandfrei – und ausgerechnet der Tag, an dem die Lupe verliehen ist. Zusammenschieben braucht kein Werkzeug. |
| 9 | nass | Attestzeitraum stimmt nicht – der Tag, an dem §7 neu dazukommt. Der Fleck sitzt genau auf dem Feld, um das es geht. |
| 11 | zerrissen | Attestzeitraum stimmt nicht – der Riss trennt „von" und „bis". |

Erst zwei saubere Fälle, dann zwei faule. Wäre es umgekehrt, lernte man
„beschädigt heißt Verstoß" und bräuchte gar nicht mehr hinzusehen; wären alle
vier sauber, lernte man „beschädigt heißt egal". Beides wäre schlimmer als gar
keine Beschädigung.

Die Regelprüfung bleibt unberührt: `validate.js` liest weiterhin die
Dokumentdaten und weiß nicht, ob ein Blatt nass war. Der Zustand ist
Darstellung und Handhabung, nie Bewertung.

### An Tag 4 gibt es kein Attest, also wird eins nachgereicht

Klingt nach Trickserei, ist die einzig ehrliche Lösung. Ein Attest entsteht
erst ab drei Fehltagen, und kurze Schichten mit kurzen Fehlzeiten haben
schlicht keins: An Tag 4 lag genau eines auf dem ganzen Tresen, und das gehörte
dem letzten Vorgang – der für Sonderfälle gesperrt ist. Ohne Gegenmaßnahme
fiele der erste Wasserschaden ersatzlos aus, ausgerechnet der, an dem man die
Sache gefahrlos lernen soll.

Ein einwandfreier Vorgang bekommt deshalb ein Attest, das sämtliche Fehltage
abdeckt. Das ist nachweislich folgenlos: §3 kann es nur erfüllen, §7 deckt es
vollständig, §5 ebenso. Es kann keinen Verstoß erzeugen, nur einen verhindern
– und der Vorgang war ohnehin einwandfrei.

## Das Telefon

Bis hierher gab es genau zwei Verben: links stempeln, rechts stempeln. Die
Lupe ist ein drittes, aber ein passives – sie zeigt nur genauer, was ohnehin
dasteht. Was fehlte, war ein Werkzeug, das nicht entscheidet, sondern
**herausfindet**.

Drei Nummern, jede beantwortet die Frage ihres Dokuments:

| Anruf | Beantwortet |
| --- | --- |
| Praxis | Deckt das Attest wirklich alle Fehltage ab? |
| Eltern | Stammt die Unterschrift von ihnen? |
| Rektorat | Liegt etwas gegen diesen Schüler vor? |

Die Praxis erscheint nur, wenn ein Attest vorliegt – sonst wäre die Nummer
eine leere Verlockung.

### Zwei Anrufe am Tag, und das ist die wichtigste Zahl

Ein Telefon, das Gewissheit gibt, macht genaues Hinsehen überflüssig. Wer bei
jedem Zweifel anrufen darf, braucht die Lupe nie wieder – und damit wäre die
Kernhandlung des Spiels erledigt.

Bei zwei Anrufen auf bis zu vierzehn Vorgänge ist es keine Abkürzung, sondern
eine Rettungsleine, die man sich für den einen Fall aufspart, bei dem man
wirklich nicht weiterkommt. Der eigentliche Gewinn ist deshalb nicht die
Auskunft, sondern die Frage davor: *Verbrauche ich das jetzt, oder traue ich
meinen Augen?*

Der Vorrat wird zu jedem Schichtbeginn neu gefüllt und **nicht** gespeichert –
eine Tagesration, die über Nacht überlebt, wäre keine.

### Die Auskunft liest die Papiere, nicht den Generator

Wie bei der Regelprüfung werden die Antworten aus den tatsächlichen
Dokumentdaten abgeleitet und nie aus dem Feld `verstoss`. Ein Telefon, das die
Absicht des Generators ausplaudert, würde bei jedem Fehler im Generator
mitlügen.

Gesprochen wird in wörtlicher Rede und im Tonfall der jeweiligen Stelle: Die
Praxis ist beflissen, das Rektorat einsilbig, Eltern sind überrascht oder
verlegen. Eine Auskunft, die wie eine Datenbankantwort klingt, nimmt dem Anruf
genau das, wofür er da ist.

> **Mutter Ritter:** „Ich habe heute gar nichts geschrieben. Was steht denn da
> unten drunter?"

Das Wählen dauert gut zwei Sekunden – Scheibe zurück, zwei Rufzeichen. Auch
das ist Absicht: Ein Anruf soll sich nach „das dauert jetzt" anfühlen.

## Der Lehrer mit dem Stapel

Alle 132 Vorgänge hatten dieselbe Form: eine Person, ein Zettel, zwei Stempel.
Störungen, Anordnungen und beschädigte Papiere färben einen Vorgang ein, aber
sie ändern nicht, was er **ist**. An Tag 8 und Tag 10 steht deshalb etwas
anderes am Schalter.

Herr Brenner ist Jahrgangsstufenleiter und reicht die Entschuldigungen seines
Jahrgangs gesammelt ein. Vor dir liegen fünf Vorgänge auf einmal, und die Frage
ist nicht mehr „ja oder nein", sondern:

> **Welcher von diesen fünf?**

Ein anderes Verb – nicht entscheiden, sondern heraussuchen –, und es braucht
kein neues Werkzeug: Wer einen Vorgang beanstandet, kennzeichnet ihn und
stempelt rot; wer nichts findet, nimmt den Stapel geschlossen an. Dieselben
zwei Stempel wie immer, nur mit einem Schritt davor.

### Warum der Jahrgang und nicht eine Klasse

Ein Klassenlehrer brächte fünf Zettel derselben Klasse – und dann träfe die
Klausurregel entweder alle fünf oder keinen. Aus „welcher von diesen" würde
„alle oder keiner", und die ganze Form wäre umsonst. Beim Jahrgang hat jeder
Zettel seine eigene Klasse, und der Aushang muss fünfmal nachgeschlagen werden.
Genau dafür hängt er da.

### Nur drei Regeln greifen

Auf einem Sammelblatt steht kein Lichtbild, keine hinterlegte Unterschrift und
kein Sperrvermerk – zu fünf fremden Kindern liegt keine Akte auf dem Tisch.
Prüfbar sind die Regeln, die mit dem Zettel allein auskommen: **§2
Ausstellungsdatum, §3 Attestpflicht, §5 Klausurtage.**

Das ist keine Einschränkung, sondern der Grund für die Form. §5 ist die einzige
Regel, bei der man nicht zwei Felder vergleicht, sondern auf einem zweiten Blatt
nachschlägt – und sie kam im ganzen Spiel dreimal vor.

Der Widerspruch ist bei einer Sammelvorlage abgeschaltet: Herr Brenner hat die
Zettel eingesammelt, nicht geschrieben. Ihn mit dem Datum eines fremden Kindes
zu konfrontieren wäre keine Frage an den Richtigen.

### Verstanden wird es an vier Stellen gleichzeitig

Zwölf Tage lang bedeutete jeder Vorgang „grün oder rot". Wer den zusätzlichen
Schritt nicht sofort begreift, stempelt einfach grün und erfährt nie, dass es
hier etwas anderes zu tun gab. Vier Dinge sagen es, ohne dass ein Kasten mit
einer Bedienungsanleitung aufgeht:

1. Der Lehrer sagt es beim Hinlegen: „Wenn einer nicht in Ordnung ist, sagen
   Sie mir welcher."
2. Auf dem Kopf des Formulars steht die Anweisung im Amtston, so wie sie auf
   einem echten Sammelbogen stünde.
3. Die Zeilen sehen anklickbar aus: nummeriert, mit einem leeren Ankreuzfeld
   am Rand.
4. Wer trotzdem rot stempelt, ohne etwas gekennzeichnet zu haben, bekommt
   **keine Fehlentscheidung, sondern eine Rückfrage**: „Welcher Vorgang wird
   beanstandet?"

Der vierte Punkt ist der entscheidende. Eine Mechanik, die man beim ersten
Versuch falsch bedienen *kann*, muss beim ersten Versuch nachfragen statt zu
bestrafen.

### Der zweite Stapel ist sauber

Läge in beiden ein Fehler, lernte man „bei Brenner ist immer einer dabei" und
suchte nur noch, bis man ihn gefunden hat. Der zweite Stapel ist in Ordnung –
und man erfährt das erst, indem man alle fünf durchgeht.

### Tag 8 ist ausgemessen, nicht gewählt

Tag 7 wäre die naheliegende Stelle gewesen: der ruhigste späte Tag. Er kostete
aber den Lichtbildabgleich zwei seiner vier Vorkommen, weil der Stapel einen
Platz belegt und an Tag 7 ausgerechnet §6 eingeführt wird. Vier Tage
durchgerechnet:

| Tag | Klausurtage | Lichtbildabgleich | |
| --- | --- | --- | --- |
| 7 | 5 | **2** | frisst die neue Regel |
| **8** | **4** | **3** | gewählt |
| 9 | 5 | 3 | aber Attestpflicht 12→10, und Tag 9 ist ohnehin der vollste |
| 12 | 5 | 3 | aber Attestzeitraum 3→2, und der letzte Tag gehört dem Abschied |

### Ein Balancing-Versuch, der nicht funktioniert hat

Eine Auszählung hatte gezeigt: Klausurtage kam über zwölf Tage nur dreimal vor –
in vier Prozent aller Vorgänge. Der naheliegende Schluss war, jede Regel alle
vier Tage zu erzwingen. Zwei Fassungen wurden gebaut und durchgerechnet:

| Fassung | Ergebnis |
| --- | --- |
| Umwidmung eines zufälligen Platzes | Klausur 3→5, **Lichtbild 4→2** |
| Umwidmung vom ältesten Verstoß | Klausur 3→5, **Lichtbild 4→2** |

Beide Male wanderte das Problem nur weiter. Umwidmen ist ein Nullsummenspiel:
Bei rund 48 Verstößen auf acht Regeln lässt sich keine anheben, ohne eine andere
zu senken, und bei sechs Verstößen am Tag wären drei erzwungene Plätze die halbe
Schicht. Die Spanne blieb bei 2 bis 12.

Die Zusicherung bleibt deshalb beim Einführungstag. Das eigentliche Problem –
§5 kommt zu selten vor, um im Gedächtnis zu bleiben – löst die Sammelvorlage
besser als jede Umverteilung: An zwei Tagen liegen fünf Klassen auf einmal da,
die alle gegen den Aushang zu prüfen sind.

## Der Widerspruch

Bis hierher hatte das Spiel genau zwei Entscheidungsverben: links stempeln,
rechts stempeln. Lupe und Telefon helfen beim Herausfinden, entscheiden aber
nichts. Und wer einen Fehler fand, stempelte ab – der Schüler sagte dazu kein
Wort. Der Moment, in dem man jemandem zeigt, was man gefunden hat, fehlte
vollständig.

Ab Tag 2 tippt man zwei Angaben nacheinander an und hält sie ihm hin.

### Wozu, wenn es nichts zu erfahren gibt?

Das ist die eigentliche Frage, denn eine Auskunft gibt es hier nicht zu holen:
Wer einen Verstoß gesehen hat, weiß ihn auch ohne Nachfrage. Der Gewinn liegt
woanders.

> **Das Spiel kann jetzt „übersehen" von „durchgehen lassen" unterscheiden.**

Wer blind abstempelt, hat den Fehler vielleicht nicht gesehen. Wer erst
konfrontiert und **danach** „entschuldigt" stempelt, hat sich entschieden. Das
ist kein Buchhaltungsdetail, sondern der Unterschied zwischen Schlamperei und
Milde – und bis jetzt konnte das Spiel ihn nicht sehen. Am Ende steht er im
Zeugnis als eigene Zeile, das Rektorat rechnet ihn zusätzlich an, und die
Schülerschaft dankt ihn ganz anders als ein Versehen.

### Drei Ausgänge

| Ausgang | Was er bedeutet | Was er kostet |
| --- | --- | --- |
| **Ertappt** | Der Widerspruch besteht wirklich | −1 bei der Schülerschaft |
| **Daneben** | Die Felder gehören zusammen, widersprechen sich aber nicht | −4 bei der Schülerschaft |
| **Kein Paar** | Die Felder haben miteinander nichts zu tun | nichts |

Der letzte Fall ist wichtig: Ein Vergreifen in der Bedienung ist keine
Anschuldigung und wird auch nicht wie eine behandelt. So lässt sich die
Paartabelle gefahrlos lernen – und weil sie über alle Tage dieselbe bleibt,
verrät das Ausprobieren nichts über den Fall, der gerade auf dem Tisch liegt.

Das Vierfache für einen unberechtigten Vorwurf ist der ganze Grund, warum sich
die Tabelle nicht einfach am lebenden Objekt durchprobieren lässt: Bei acht
Paaren auf 132 Vorgänge wäre systematisches Abklappern sonst die beste
Strategie, und das Prüfen wäre wieder wertlos – dieselbe Rechnung wie bei den
zwei Anrufen am Tag.

### Acht Paare, und jedes ist eindeutig

| Regel | Die beiden Angaben |
| --- | --- |
| §1 Unterschrift | Unterschrift auf der Notiz ↔ hinterlegte Unterschrift |
| §2 Ausstellungsdatum | Datum ↔ Fehltage |
| §3 Attestpflicht | Fehltage ↔ die Person am Fenster |
| §4 Namensabgleich | Name auf der Notiz ↔ Name in der Akte |
| §5 Klausurtage | Klasse ↔ Aushang |
| §6 Lichtbildabgleich | Aktenfoto ↔ die Person am Fenster |
| §7 Attestzeitraum | Attestzeitraum ↔ Fehltage |
| §8 Sperrvermerk | Sperrvermerk ↔ die Person am Fenster |

„Fehltage" kommt dreimal vor, „die Person" ebenfalls – aber nie mit demselben
Gegenüber. Ohne diese Eindeutigkeit müsste das Spiel raten, was gemeint war,
und die Antwort fiele gelegentlich auf die falsche Regel. Ein Prüfskript
rechnet alle 12 × 12 Kombinationen durch und schlägt Alarm, sobald zwei Felder
auf zwei Regeln passen.

### Milans Lüge bröckelt

Der eigentliche Grund für die ganze Mechanik. Milan wird über vier Tage viermal
mit derselben gefälschten Unterschrift konfrontiert. Mit der Regelzeile käme
viermal derselbe Satz, und aus einem Menschen würde ein Formular:

- **Tag 2** – „Die schreibt schnell, wenn sie es eilig hat. Das ist ihre, ganz sicher."
- **Tag 5** – „Ich hab Ihnen doch gesagt, dass diesmal alles richtig ist. Gucken Sie noch mal."
- **Tag 8** – „… Ja. Die ist von mir. Das wissen Sie doch längst."
- **Tag 11** – „Ja, ich schreibe sie. Soll ich sie um sechs wecken, damit Sie einen Haken machen können?"

Beim vierten Mal hört der Vorhalt auf, ihm etwas nachzuweisen, und fängt an,
etwas über den zu sagen, der ihn macht.

Emil ist der Gegenfall: Sein Verstoß steht fest, und sein Grund stimmt
trotzdem. Ihn zu konfrontieren fördert nichts zutage – es zeigt nur, dass man
ihn zum Sagen gezwungen hat. „Ich weiß. Es fehlt. Ich kann Ihnen nur sagen,
dass es so war."

### Tippen ist nicht Ziehen

Die Dokumente sind verschiebbar, ihre Felder antippbar – ohne Unterscheidung
löste jedes Zurechtschieben eine Konfrontation aus. Gemessen wird die Strecke
zwischen Aufsetzen und Loslassen: über vier Pixel ist es ein Zug, darunter ein
Tipp. Vier und nicht null, weil auch wer tippt ein bisschen wackelt.

Welches Feld getroffen wurde, ermittelt `document.elementsFromPoint` und nicht
das Ereignisziel: Seit `setPointerCapture` das Blatt festhält, ist `e.target`
immer der Blattrahmen und nie das Feld darunter. Dieselbe Technik benutzt die
Lupe, um zu wissen, worüber sie schwebt.

Die Markierung selbst läuft über einen React-Kontext. Sonst müsste die Menge
der angetippten Felder durch jedes Dokument durchgereicht werden, nur damit
ganz unten eine Umrandung erscheint – die Dokumente sollen sagen, **was** ein
Feld ist, und nichts davon wissen, ob gerade jemand darauf zeigt.

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

## Der Flur lebt

Über dem Schalter hingen drei verwaschene Brustbilder als Andeutung einer
Warteschlange – unbewegt, und dadurch eher Tapete als Warteschlange. Jetzt
stehen dort Menschen, der Nächste läuft heran, und gelegentlich geht jemand
durch, der mit dem Schalter nichts zu tun hat.

**Kein Hineinzoomen.** Das Vorbild zoomt nicht, es zeigt beides gleichzeitig:
oben den Posten, unten den Schreibtisch. Wer hineinzoomte, verdeckte die
Papiere und ließe den Spieler warten – bei 132 Vorgängen dieselbe Rechnung wie
beim Stempel, der nicht gezogen werden muss.

### Die Papiere kommen mit der Person, nicht vor ihr

Zuerst lagen die Unterlagen vom ersten Bild an auf dem Tisch, während ihr
Besitzer noch durch den Flur lief. Der Gedanke dahinter war „nicht warten
lassen", das Ergebnis war ein Widerspruch: Die Papiere waren vor dem Menschen
am Schalter, und der Anmarsch sah dadurch nach Zierleiste aus statt nach
Vorgang. Niemand hatte etwas abgegeben, und trotzdem lag alles da.

Jetzt erscheinen Porträt, Wortmeldung und Unterlagen gemeinsam mit der
Ankunft – das Rascheln liegt auf diesem Punkt, nicht auf dem Beginn des
Anmarsches. **Zusätzliche Wartezeit entsteht dadurch nicht:** Porträt und
Wortmeldung warteten ohnehin schon, in diesen zwei Sekunden gab es bisher nur
Papiere ohne den Menschen, der sie erklärt.

Mit den Papieren gesperrt sind Stempel und Telefon – auch über die Tastatur,
sonst stempelte man einen leeren Tresen. Der Apparat bleibt dabei stehen, er
gehört dem Schreibtisch und nicht dem Schüler; die Nummernliste sagt nur „Es
steht noch niemand am Schalter."

Außerhalb dieser Bedingung stehen Lupe und Klausuraushang: Beide gehören dem
Tag, nicht dem Vorgang. Der Aushang ist zugleich das einzige, was sich während
des Anmarsches lesen lässt – und dafür ist er dort genau richtig.

### Wie schnell jemand geht

Der erste Einbau ließ die Figur vom linken Bildrand in 780 ms zur Mitte
laufen. Nachgerechnet: 614 Pixel in 0,78 Sekunden, also 787 Pixel je Sekunde,
verteilt auf zweieinhalb Schritte – **236 Pixel je Schritt, fünfzehn
Körperbreiten**. Das liest sich nicht als Gehen, sondern als Schlittern.

| | Strecke | Tempo | Schritte | je Schritt |
| --- | --- | --- | --- | --- |
| erster Einbau | 614 px | 787 px/s | 2,6 | 236 px · 15 Körperbreiten |
| jetzt | 224 px | 112 px/s | 5,3 | 43 px · 2,7 Körperbreiten |

Beides musste sich ändern: langsamer allein hätte den Anmarsch quälend lang
gemacht, kürzer allein hätte ihn kaum sichtbar. Damit die Strecke so kurz sein
darf, steht die Warteschlange dichter am Fenster – und in umgekehrter
Richtung aufgereiht, damit der Nächste ganz vorn steht und der Anmarsch genau
dort beginnt, wo er eben noch gewartet hat.

### Der Laufzyklus

Vier handgesetzte Bilder, 8 × 17 Pixel, dieselbe Symbolschrift wie die
Porträts – dadurch trägt jede Figur automatisch Haar- und Hautton des
Gesichts, das gleich am Schalter steht.

Drei Dinge entscheiden, ob eine Pixelfigur läuft oder gleitet:

**Auf und Ab.** Beim Durchschwingen steht der Körper einen Pixel höher als
beim Aufsetzen. Fehlt das, schwebt die Figur über dem Boden, egal wie gut die
Beine gezeichnet sind. Der wichtigste Punkt und der, den man am ehesten
vergisst.

**Gegenschwung.** Der Arm geht vor, wenn das Bein derselben Seite zurückgeht.
Schwingen beide gleich, sieht es aus wie Marschieren.

**Ruhiger Kopf.** Er ist vier Pixel breit; jede Bewegung darin liest sich als
Zucken.

### Zwei verworfene Entwürfe

Der erste war zehn Pixel breit mit acht Pixel Rumpf – eine Tonne, keine
Schulter. Die Arme lagen als einzelne Pixel in Rumpffarbe an der Seite und
verschmolzen vollständig.

Der zweite bekam eine Kontur, so wie die Porträts sie haben. Das war der
eigentliche Denkfehler: **Bei 44 × 52 Pixeln ist ein dunkler Rand ein
Prozentsatz der Fläche, bei acht Pixeln Breite ist er die Hälfte der Figur.**
Heraus kam schwarzes Gekritzel. Was bei großen Rastern Form gibt, zerstört sie
bei kleinen.

Getrennt wird jetzt über Farbe statt über Linien: Oberteil hell, Hose dunkler,
Arm noch dunkler, Schuhe fast schwarz. Der dunkle Flur liefert den
Außenkontrast, den sonst die Kontur liefern müsste. Der Arm bekam zunächst
denselben Ton wie die Hose (24 % dunkler) und war unsichtbar – er ist genau
ein Pixel breit, und auf einem Pixel trägt ein Unterschied von 24 % nichts.
Jetzt sind es 50 %.

## Der Tag vergeht

Über die Schicht wandert das Licht am Schalterfenster von kaltem Morgen über
den hellen Mittag zum tiefen, warmen Nachmittag, und der Raum sinkt dabei ab.
Vorgang 12 von 14 fühlt sich dadurch spät an, statt es nur zu heißen; am
letzten Tag steht Milan im Dämmerlicht.

**Flackerndes Licht wäre der naheliegende Einfall gewesen – und der einzige,
der das Spiel etwas kostet.** Die Kernhandlung ist, zwei fast identische
Kurven zu vergleichen. Alles, was die Helligkeit ändert, WÄHREND man hinsieht,
macht das schwerer und liest sich, als arbeite das Spiel gegen einen.

Verträglich wird es durch eine Grenze: Verändert wird ausschließlich die
Rückwand mit dem Schalterfenster. Der Schreibtisch, auf dem die Dokumente
liegen, behält über den ganzen Tag dieselbe Beleuchtung. Das Licht spielt
dort, wo man nichts prüfen muss.

Gemessen wird der Fortschritt in Vorgängen, nicht in Minuten – wer lange über
einem Fall grübelt, soll dafür nicht in die Dämmerung geraten.

### Farbe trägt das, nicht Helligkeit

Der erste Entwurf lag zwischen 0,13 und 0,20 Deckung bei ähnlichen Farbtönen.
Im Screenshot unterschied sich die Wand zwischen Morgen und Nachmittag um drei
von 255 Helligkeitsstufen – also um nichts. Jetzt läuft sie von kaltem
Blaugrau (150 190 232) nach Bernstein (232 130 46). Helligkeit taugt hier
ohnehin schlecht: Am Ende wäre es einfach dunkel, und dunkel liest sich als
Nacht, nicht als später Nachmittag.

## Der Raum klingt, auch wenn man nichts tut

Bis hierher löste der Spieler jeden einzelnen Klang selbst aus. Ohne seine
Hand war es vollkommen still – ein Raum, in dem nichts passiert, solange man
nichts tut, ist kein Raum, sondern eine Oberfläche.

Während der Schicht läuft jetzt ein Grundton: das Brummen der
Leuchtstoffröhre (50 Hz plus erste Oberwelle – die Oberwelle unterscheidet
eine Röhre von einem Trafo) und ein schmales Band tiefen Rauschens für das
Gebäude. Sehr leise. Er soll auffallen, wenn er **wegfällt**, nicht wenn er da
ist.

Zweimal je Schicht läutet die Pausenglocke, und danach wird der Flur für neun
Sekunden laut: gedämpftes Stimmengewirr durch eine geschlossene Tür, dazu
vereinzelt Schritte. Ein langsames Wogen liegt darüber, weil eine
Menschenmenge nie gleichförmig ist – ohne das bliebe es Rauschen und klänge
nach Wasserhahn. Das ist der einzige Vorgang im ganzen Spiel, den nicht der
Spieler auslöst.

Gemessen, wie alles hier: Der Flur kam zunächst auf 0,46 Spitzenpegel und lag
damit bei 71 % des Stempelschlags – kein Hintergrund mehr, sondern ein
Vordergrund, der den wichtigsten Klang des Spiels zudeckt. Jetzt liegt er bei
0,21, also auf Höhe des Papierraschelns.

| Klang | Peak | Dauer |
| --- | --- | --- |
| Stempel | 0.69 | 91 ms |
| Glocke | 0.69 | 1165 ms |
| Summer | 0.50 | 340 ms |
| Flur | 0.21 | 9100 ms |
| Klick | 0.17 | 15 ms |
| Papier | 0.17 | 126 ms |
| Haken | 0.14 | 134 ms |

### Wetter sieht man nur am Licht

Der erste Gedanke war Regen am Fenster. Der geht nicht, und zwar aus einem
Grund, der beim Hinsehen sofort auffällt: **Das Sekretariat hat kein Fenster
nach draußen.** Sichtbar sind der Schalter zum Flur und die Rückwand.
Regentropfen ließen sich nur an eine Scheibe zeichnen, die es nicht gibt.

So merkt man Wetter in einem Innenraum ohnehin nicht. Man merkt es am Licht:
An einem Regentag bleibt es flach und kalt und wird nie warm, so spät es auch
wird – der Nachmittag findet einfach nicht statt. Das Wetter greift deshalb in
den Tagesverlauf ein, statt etwas obendrauf zu zeichnen.

Die Tage sind an die Zeitung gebunden. Am vierten meldet der Pausenhof
„Turnhalle nach Wasserschaden gesperrt" – dass es an genau diesem Tag regnet,
macht aus zwei Systemen eines. Im Kopf der Zeitung steht die Wetterzeile
(`Dauerregen · 6 °C`), und damit hat der Spieler die Erklärung für das Licht
am Morgen selbst gelesen.

### Der Schreibtisch altert

Über die zwölf Tage kommen Kaffeeränder und Kratzer dazu: von drei auf sieben
Ringe, von fünf auf neun Kratzer. Bewusst so langsam, dass es niemand bemerkt.
Gespürt wird es trotzdem – an Tag 12 sieht der Arbeitsplatz benutzt aus, an
Tag 1 sah er ordentlich aus, und dazwischen hat man selbst dort gesessen.

### Ergebnis kopieren

Im Zeugnis steht ein zweiter Knopf, der das Ergebnis als Text in die
Zwischenablage legt. Zum Testen gedacht: „War ganz cool" lässt sich nicht
vergleichen, zwei Zeugnisse nebeneinander schon. Vor allem verrät die
Aufteilung mehr als die Note – wer durchwinkt und wer Unschuldige abweist, hat
auf völlig verschiedene Art schlecht gespielt.

```
SEKRETARIAT – Abschlusszeugnis
Ende: Halbjahr überstanden
Tage im Dienst: 12 von 12
Vorgänge: 132
Korrekt: 115 · Beanstandet: 17 (87 %)
Note: 2 – gut
Verstöße erkannt: 41 von 53
Durchgewunken: 12 · Zu Unrecht abgewiesen: 4
Anordnungen: 3 befolgt, 3 nicht
Zuwendungen angenommen: 1
Ansehen: Rektorat 11 % · Schülerschaft 100 %
```

Fällt die Zwischenablage aus (kein HTTPS, verweigerte Freigabe), geht es über
ein unsichtbares Textfeld – lieber altmodisch als gar nicht.

### Auf schmalen Bildschirmen: ein Satz statt eines Rätsels

Der Schalter ist für einen Rechnerbildschirm gebaut. Auf einem Telefon startet
die Schülerakte außerhalb des sichtbaren Bereichs, und ohne sie gibt es keine
hinterlegte Unterschrift zum Vergleichen – also keine Spielhandlung. Ein
Handy-Layout wäre die richtige Antwort, steht aber noch aus.

Bis dahin erscheint unter 1024 px ein Hinweis. Er kostet nichts und macht aus
„das Spiel ist kaputt" ein „das Spiel gehört woanders hin". Wegklicken lässt
er sich trotzdem – bevormundet wird niemand.

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

### Junge Regeln kommen häufiger dran

Eine Auszählung über alle zwölf Tage brachte eine Schieflage ans Licht, die
beim Spielen nur als Gefühl auftaucht:

| Regel | ab Tag | vorher | nachher |
| --- | --- | --- | --- |
| Unterschrift prüfen | 1 | 7× | 6× |
| Ausstellungsdatum | 2 | **16×** | 10× |
| Attestpflicht | 3 | 7× | 12× |
| Namensabgleich | 5 | 7× | 8× |
| Klausurtage | 6 | 5× | 3× |
| Lichtbildabgleich | 7 | **2×** | 5× |
| Attestzeitraum | 9 | 2× | 2× |
| Sperrvermerk | 11 | 2× | 2× |

**Der Lichtbildabgleich kam in 132 Vorgängen zweimal vor.** Dahinter steckt
das gesamte Porträtsystem samt drei Schwierigkeitsstufen; der Spieler lernte
die Regel an Tag 7 und begegnete ihr in den restlichen sechs Tagen ein
einziges Mal.

Die Ursache war strukturell, nicht zufällig: Die Verstoßart wurde
gleichverteilt aus den *verfügbaren* Regeln gezogen, und eine Regel ab Tag 2
hat elf Tage lang Gelegenheiten, eine ab Tag 11 hat zwei. Die frühen fressen
alles auf – ausgerechnet die neuen, um die sich der jeweilige Tag dreht,
werden zur Rarität.

Gezogen wird jetzt gewichtet: `2 + 5 / (1 + Tag − abTag)`. Am Einführungstag
siebenfach, danach fallend gegen zwei. Alte Regeln verschwinden nicht, sie
treten zurück.

Die beiden Zahlen sind ausgemessen, nicht geschätzt. Ein erster Versuch mit
`1 + 6/Alter` kippte die Verteilung ins Gegenteil: „Unterschrift prüfen", die
Regel des ersten Tages, fiel auf sechs Fälle, von denen vier Milan gehörten –
die Kernmechanik des Spiels kam außerhalb des Drehbuchs zweimal vor. Von fünf
durchgerechneten Kombinationen liefert `2 + 5` die gleichmäßigste Verteilung.

Was übrig bleibt, ist keine Schieflage mehr, sondern Stichprobe: Bei rund 44
Verstößen auf acht Regeln entfallen auf jede etwa fünf Fälle, und bei fünf
Fällen schwankt es eben.

### Dreißig Gründe statt zehn

Dieselbe Auszählung: zehn Krankheitsgründe auf 132 Vorgänge, „Magen-Darm-
Infekt" neunzehnmal. Ab Tag 6 hatte man jeden zweimal gelesen. Jetzt sind es
dreißig, der häufigste kommt achtmal vor. Die Verteilung der Dauer bleibt
erhalten – an `tage` hängen gleich drei Regeln.

### Zufallsschüler dürfen nicht heißen wie die Stammgäste

In der Warteschlange von Tag 12 standen „Frieda Petrov" und „Theo Sander" –
unmittelbar vor Milan Petrovs Abschied und Emil Sanders letztem Auftritt. Ein
Nachname, den man mit einer Figur verbindet, an einem Fremden gelesen,
verwässert genau den Moment, auf den zwölf Tage zulaufen. Die Vor- und
Nachnamen der drei Figuren sind deshalb aus den Zufallstöpfen ausgenommen.

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

Die beiden großen Punkte der ursprünglichen Liste – ein Finale für Tag 12 und
die Widerspruchs-Mechanik – stehen. Offen ist:

1. Ein Elternteil, das persönlich kommt – der Lehrer mit dem Stapel steht,
   ein Erwachsener am Schalter ändert aber auch den Ton eines Einzelvorgangs
2. Mobiles Layout. Bis dahin steht unter 1024 px ein Hinweis statt eines
   Rätsels

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

## Auf großen Bildschirmen wächst die Bühne mit

Der Schalter ist durchweg in festen Pixeln gebaut: 392 Pixel breite
Entschuldigungen, 11 Pixel hohe Schrift, ein 44x52-Porträt. Für Pixelkunst ist
das richtig – eine Zeile, die auf halbe Pixel fällt, franst aus.

Nur bleibt dadurch auf einem 27-Zoll-Monitor alles exakt so groß wie auf einem
13-Zoll-Laptop, obwohl man doppelt so weit weg sitzt. Das Spiel wird nicht
kleiner, es wird bloß von weiter weg betrachtet – und die Schrift war für
Laptop-Abstand ausgelegt.

`Buehne.jsx` skaliert deshalb das Ganze nach Fenstergröße, in Viertelstufen
und gedeckelt bei 1,6:

| Fenster | Faktor | Unterschrift |
| --- | --- | --- |
| 1366x768 | 1,0 | 338 px |
| 1600x900 | 1,0 | 338 px |
| 1920x1080 | 1,25 | 423 px |
| 2560x1440 | 1,6 | 541 px |

**`zoom`, nicht `transform: scale`.** Der Unterschied entscheidet: `zoom`
skaliert das Layout, prozentuale Positionen und Umbrüche gelten weiter, die
Kulisse füllt das Fenster wie vorher. `scale` würde die fertige Zeichnung
nachträglich vergrößern – das ergäbe einen Briefmarkenrahmen mit schwarzen
Balken drumherum.

### Was daran gefährlich ist

`zoom` lässt zwei Koordinatensysteme auseinanderfallen. `clientX` und
`getBoundingClientRect()` liefern **sichtbare** Pixel, `left`/`top` und
`offsetWidth` dagegen die des **Layouts**. Jede Stelle, die beide verrechnet,
lässt das Papier dem Zeiger um den Faktor davonlaufen – bei 1,6 also um 60 %
zu weit.

Betroffen waren das Verschieben der Dokumente und die Lupe. Beide messen den
Faktor jetzt selbst, statt ihn durchgereicht zu bekommen:

```js
eltern.getBoundingClientRect().width / eltern.offsetWidth
```

Gemessen statt durchgereicht, weil sich die Browser-Vergrößerung obendrauf
multipliziert – ein durchgereichter Wert wüsste davon nichts.

Geprüft wird das nicht mit dem Auge, sondern mit der Zahl: Der Test zieht bei
jeder Fenstergröße ein Blatt um exakt 200/90 Pixel und besteht nur, wenn es
sich um 200/90 bewegt hat. Für die Lupe kommt die eigene Ruhegröße (0,76) noch
obendrauf – bei 2560x1440 also 158 × 0,76 × 1,6 = 192 sichtbare Pixel, und die
Linsenmitte muss trotzdem auf 0 Pixel genau unter dem Zeiger sitzen.

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
