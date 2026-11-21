# Reset, Grundstile, Layout

Was `leuchtturm-css` global setzt, damit eine Site für Text, Listen, Zitate, Bilder, Formulare und Sections kein eigenes CSS braucht. Wie in ACSS: Erst eigenes CSS schreiben, wenn etwas grundsätzlich anders aussehen soll.

Alle Regeln ohne Spezifität (`:where()`), in eigenen Layern. Komponenten (`components`), Hilfsklassen (`utilities`) und die Site (`site`) gewinnen immer, ohne `!important`.

## Reset (`src/reset.css`, Layer `reset`)

- `box-sizing: border-box` überall, `margin: 0` auf allen Elementen. Abstände kommen über `gap`, die Grundstile und `.smart-spacing`.
- iOS vergrössert die Schrift im Querformat nicht (`text-size-adjust`).
- Weiches Scrollen zu Ankern, ausser bei «Bewegung reduzieren».
- Bilder, Videos und SVG sind Blöcke und nie breiter als ihr Platz.
- Formularfelder erben die Schrift.
- `button` ohne Klasse hat keinen Hintergrund, keinen Rahmen und keinen Abstand des Browsers, dafür die Hand als Zeiger: für Knöpfe, die nicht wie ein Button aussehen (Menü, Schliessen, Akkordeon). Wie ein Button aussehen: `btn--*`.
- `ul` und `ol` mit `role="list"` haben keine Punkte und keinen Einzug: für Listen, die Layout sind (Navigation, Karten).
- `[hidden]` bleibt versteckt.

## Grundstile (`src/base.css`, Layer `base`)

| Element | Was | Tokens |
|---|---|---|
| `body` | Hintergrund, Text, Schrift, Gewicht (`--text-font-weight`), Grösse, Zeilenabstand, Farbe von Checkboxen | `--body-bg-color`, `--body-color`, `--text-*`, `--action` |
| `h1` … `h6` | Farbe, Schrift, Gewicht (pro Stufe `--h1-font-weight` …), Laufweite, Zeilenabstand, Grösse, ausgeglichene Zeilen, Silbentrennung (braucht `lang` auf `<html>`) | `--heading-*`, `--h1` … `--h6` |
| `p`, `li`, `figcaption`, `blockquote` | schöner Umbruch (`text-wrap: pretty`, wo der Browser es kann) | |
| `a` | Farbe, Unterstreichung mit Abstand, Hover | `--link-*` |
| `ul`, `ol` | Einzug, Abstand zwischen Punkten, Punkte gedämpft. Listen mit `role="list"` (Layout) ohne Einzug und ohne Abstand zwischen den Punkten | `--list-indent-spacing`, `--list-item-spacing` |
| `blockquote` in `figure` | Linie links, Schrift der Überschriften, Fussnote gedämpft | `--blockquote-*` |
| `figure` mit Bild | Bild volle Breite mit Radius, Legende klein und gedämpft | `--radius` |
| `input`, `select`, `textarea` | volle Breite, Rahmen in `--neutral`, Radius, immer hell mit dunklem Text. Ungültig (`:user-invalid`, erst nach der Eingabe, oder `aria-invalid="true"`): Rahmen in `--danger` | `--danger` |
| `label`, `legend` | Gewicht wie Buttons, Label als Block | `--btn-font-weight` |
| `:focus-visible` | Rahmen in der Farbe der Fläche, mindestens 2px, mit Abstand. Auf dunklen Flächen `--action`, wenn sie hell ist ([flaechen.md](flaechen.md)) | `--focus-color`, `--focus-width`, `--focus-offset` |
| `::selection` | Markierung in `--primary-light` | |
| `small`, `code`, `hr` | Grösse, Monospace, Linie | |

Zitate brauchen den Aufbau wie in ACSS:

```html
<figure>
	<blockquote><p>Zitat</p></blockquote>
	<figcaption>Name, <cite>Quelle</cite></figcaption>
</figure>
```

Ein Zitat anders gestalten: die Variablen am Element setzen, z. B. `--blockquote-background`, `--blockquote-border-width`. Text und Fussnote nehmen `--blockquote-text-color` und `--blockquote-footer-color`, wenn gesetzt, sonst die Farben der Fläche.

## Layout (`src/layout.css`, Layer `layout`)

Wie in ACSS bekommt jede `section` (nicht verschachtelt) automatisch:

- oben und unten `--section-padding-block` (= `--section-space-m`), seitlich `--section-padding-inline` (= `--gutter`),
- zwischen ihren Kindern `--container-gap`,
- für jedes Kind die Breite des Inhalts (`--content-width`), zentriert.

Darum nie `padding` auf eine Section schreiben. Eine Section mit anderem Abstand setzt `--section-padding-block: var(--section-space-l)` o. ä.

## Nur für Screenreader: `.hidden-accessible` (`src/utilities.css`)

Name wie in ACSS. Unsichtbar, aber vorgelesen: Beschriftung eines Icons, Überschrift einer Navigation, `caption` einer Tabelle. Bekommt das Element oder etwas darin den Fokus, ist es wieder sichtbar, darum geht es auch für einen Link «Zum Inhalt».

```html
<button class="menu"><svg aria-hidden="true">…</svg><span class="hidden-accessible">Menü</span></button>
```

Nicht für Inhalt, der für alle versteckt sein soll: dafür `hidden`.

## Rich Content: `.smart-spacing` (`src/utilities.css`)

Für Text aus einem Editor, Blogartikel, rechtliche Seiten. Die Klasse auf den umgebenden Block:

```html
<div class="artikel__text smart-spacing">…</div>
```

- zwischen allen Kindern `--paragraph-spacing` (= `--space-s`),
- vor Überschriften `--heading-spacing` (= `--space-l`),
- nach Überschriften `--space-xs`, damit die Überschrift zum Text gehört.

Darin keine eigenen Abstände setzen.

## Offen

- [Offen] Sections als Container (`container-type`), siehe [grundwerte.md](grundwerte.md), «Fluide Werte».
- [Offen] Radius für Bilder ausserhalb von `figure` (ACSS: «auto radius»).
- [Offen] Formulare von cform bringen ihr eigenes CSS mit, prüfen, ob sie sich mit diesen Grundstilen vertragen.
- [Offen] `--paragraph-spacing` und `--heading-spacing` hängen an den Abständen. Ob es eigene Grundwerte braucht, zeigt die erste Site.
