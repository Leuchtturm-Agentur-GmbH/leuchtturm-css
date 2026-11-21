# Grundwerte

Eine Site setzt nur diese Werte (Layer `grundwerte`). Alles andere rechnet `src/tokens.css` daraus. Die KI ändert nie die Tokens, nur die Grundwerte. Standardwerte: `src/grundwerte.css`. Presets: `src/presets/` (Charakter, ohne Farben). Die Farben kommen aus der Marke.

## So bestimmt die KI die Werte

Wie die Werte gespeichert, geprüft und an die Site gegeben werden: [hub-vertrag.md](hub-vertrag.md).

1. Quelle lesen: Ralfs Anweisung oder Marke, Brand Voice und Briefing im Hub (MCP `agenturhub`).
2. Das nächste Preset wählen (`technisch`, `freudig`, `ruhig`, `edel`, Tabelle unten) und alle Werte davon übernehmen. Farben nur aus der Marke, fehlende Rollen leer lassen.
3. Nur abweichen, wo die Quelle es verlangt. Jede Abweichung in einem Satz begründen.
4. Jeden Wert im erlaubten Bereich halten. Paare (`-min` und `-max`) so setzen, dass `min ≤ max`.

| Preset | Charakter | passt zu |
|---|---|---|
| `technisch` | präzise Systemschrift, dünne Linien, kleine Radien, keine Schatten, gedämpfte Stufen | Technik, Handwerk mit System, Beratung, Software |
| `freudig` | kräftige Überschriften, grosse Sprünge, Pillen, weiche Schatten, satte Farben | Kinder, Freizeit, Gastronomie, Kampagnen |
| `ruhig` | leichte Serife, viel Zeilenabstand, sehr grosse Sections, Pillen, gedeckte Farben | Yoga, Gesundheit, Therapie, Natur |
| `edel` | grosse, leichte Serife mit hohem Kontrast, sehr viel Weissraum, schmaler Inhalt, eckig, feine Linien, stark gedämpfte Stufen | Mode, Schmuck, Hotel, Architektur, Immobilien |

## Einheiten

| Art | Schreibweise | Beispiel |
|---|---|---|
| Länge | px ohne Einheit. Das CSS rechnet Schrift, Abstände, Radien und Breiten in `rem` um, Linien und Schatten in `px` | `--space-min: 16` |
| Laufweite | em ohne Einheit | `--heading-tracking: -0.01` |
| Verhältnis, Zeilenabstand | Zahl | `--type-ratio-max: 1.25` |
| Anteil | Zahl von 0 bis 1 | `--shadow-opacity: 0.1` |
| Farbe | Hex `#rrggbb` | `--primary: #2f5aa8` |
| Schrift | Liste wie in `font-family` | `'Inter', system-ui, sans-serif` |

Ohne Einheit, weil CSS heute noch nicht Länge durch Länge teilen kann (fluide Werte brauchen das) und weil Hub und Prüfung so nur Zahlen vergleichen.

## Fluide Werte

Unterhalb von `--vw-min` gilt der Wert `…-min`, oberhalb von `--vw-max` der Wert `…-max`, dazwischen wächst er gleichmässig (`clamp()`). Das gilt für Schrift, Abstände, Sections und `--gutter`. Breakpoints braucht es dafür nicht.

Gemessen wird die Breite des nächsten Containers (`100cqi`), ohne Container die des Fensters. Bekommt ein Element `container-type: inline-size`, richten sich Überschriften, Abstände und Buttons darin nach seiner Breite: Eine `h3` in einer schmalen Karte ist kleiner als in einer breiten Section. Dabei gilt:

- Fliesstext erbt die Grösse vom `body` und bleibt gleich, nur was selbst `font-size: var(--…)` setzt, passt sich an (Überschriften, Buttons, `--text-*`).
- Ein Container ist schmaler als das Fenster (Gutter, `--content-width`). In einem Container erreichen die Werte `…-max` erst, wenn er selbst `--vw-max` breit ist, in einer Spalte von 800px also nie ganz.
- In Bedingungen von `@container` und `@media` gehen keine Variablen. Komponenten schreiben ihre Grenzen in `rem`.
- [Offen] Ob `section` und Raster in den Grundstilen (Layer `layout`) Container werden, entscheidet sich mit dem Layout. Bis dahin setzt eine Komponente `container-type` selbst.

## Die Werte

Begriffe: was die Quelle sagt und in welche Richtung es den Wert schiebt. ↑ heisst grösser, ↓ kleiner.

### Breiten der Ansicht

| Grundwert | Wirkung | Standard | Bereich | Begriffe |
|---|---|---|---|---|
| `--vw-min` | Breite in px (Container oder Fenster), ab der die Werte zu wachsen beginnen | 360 | 320–400 | selten ändern |
| `--vw-max` | Breite in px (Container oder Fenster), ab der die Werte ihr Maximum haben | 1440 | 1200–1920 | selten ändern. Grösser, wenn die Site sehr breit wirken soll |

### Schrift

| Grundwert | Wirkung | Standard | Bereich | Begriffe |
|---|---|---|---|---|
| `--type-min` | Grösse des Fliesstexts (`--text-m`) auf dem Handy, px | 16 | 15–19 | ↑ freudig, zugänglich, ältere Zielgruppe, ruhig · ↓ technisch, dicht, viel Information |
| `--type-max` | Grösse des Fliesstexts auf grossen Bildschirmen, px | 18 | 16–22 | wie `--type-min` |
| `--type-ratio-min` | Sprung zwischen den Stufen auf dem Handy. Steuert, wie viel grösser `--h1` als der Text ist | 1.2 | 1.125–1.3 | ↑ laut, plakativ, freudig · ↓ sachlich, zurückhaltend. Auf dem Handy kleiner als `-max` halten |
| `--type-ratio-max` | Sprung zwischen den Stufen auf grossen Bildschirmen | 1.25 | 1.15–1.5 | ↑ freudig, editorial, grosse Bühne, Kampagne · ↓ technisch, präzise, Werkzeug |
| `--heading-weight` | Schriftgewicht der Überschriften | 600 | 300–900 | ↑ kräftig, freudig, laut, Handwerk · ↓ edel, ruhig, leicht, elegant. Nur Schnitte, die die Schrift hat |
| `--heading-tracking` | Laufweite der Überschriften, em | -0.01 | -0.04–0.02 | ↓ (enger) kräftig, modern, grosse Überschriften · 0 bis ↑ ruhig, edel, Serifen, Versalien |
| `--heading-leading` | Zeilenabstand der Überschriften | 1.15 | 1.0–1.3 | ↓ kompakt, plakativ, freudig · ↑ ruhig, luftig, Serifen |
| `--text-leading` | Zeilenabstand des Fliesstexts | 1.6 | 1.4–1.85 | ↑ ruhig, luftig, lange Texte, Zugänglichkeit · ↓ dicht, technisch, kurze Texte |
| `--heading-font-family` | Schrift der Überschriften | Systemschrift | Liste, mit Ersatz am Ende | aus der Marke im Hub, nicht von der KI erfunden |
| `--text-font-family` | Schrift des Fliesstexts | Systemschrift | Liste, mit Ersatz am Ende | aus der Marke im Hub |

Stufen: `--text-xs` = Grundgrösse × Verhältnis hoch −1, `--text-s` hoch −0.5, `--text-m` hoch 0, `--text-l` 1, `--text-xl` 2, `--text-xxl` 3. Überschriften: `--h6` hoch 0 bis `--h1` hoch 5. Beispiel: 18px und 1.25 ergeben `--h1` 55px.

### Abstände

| Grundwert | Wirkung | Standard | Bereich | Begriffe |
|---|---|---|---|---|
| `--space-min` | Grundschritt `--space-m` auf dem Handy, px | 16 | 12–24 | ↑ grosszügig, ruhig, freudig, edel · ↓ dicht, technisch, viel Information |
| `--space-max` | Grundschritt auf grossen Bildschirmen, px | 24 | 16–40 | wie `--space-min` |
| `--space-ratio` | Sprung zwischen den Stufen `--space-xs` bis `--space-xxl` | 1.5 | 1.25–1.75 | ↑ starke Gliederung, klare Gruppen, freudig · ↓ gleichmässig, ruhig, dicht |
| `--section-min` | Abstand oben und unten in einer Section (`--section-space-m`) auf dem Handy, px | 64 | 40–112 | ↑ Weissraum, ruhig, edel, technisch · ↓ dicht, viel Inhalt, Shop |
| `--section-max` | dasselbe auf grossen Bildschirmen, px | 128 | 80–224 | wie `--section-min` |

Stufen: `--space-*` = Grundschritt × `--space-ratio` hoch −2 (xs) bis 3 (xxl). `--section-space-*` nimmt halbe Schritte (hoch −1 bis 1.5), damit `xxl` nicht ausufert.

### Form

| Grundwert | Wirkung | Standard | Bereich | Begriffe |
|---|---|---|---|---|
| `--radius-base` | Grundradius `--radius`, px. `--radius-s` ist die Hälfte, `--radius-l` das Doppelte, `--radius-xl` das Dreifache | 6 | 0–32 | ↑ freudig, weich, nahbar, Kinder, Gesundheit · ↓ präzise, technisch, seriös, Architektur, edel. 0 heisst eckig |
| `--line-width` | Stärke der Linie `--border`, px | 1 | 0.5–3 | ↑ kräftig, verspielt, freudig · ↓ fein, präzise, edel |
| `--line-width-strong` | Stärke der kräftigen Linie `--border-strong`, px | 2 | `--line-width` bis 4 | wie `--line-width` |

### Tiefe

| Grundwert | Wirkung | Standard | Bereich | Begriffe |
|---|---|---|---|---|
| `--shadow-y` | Versatz des Schattens nach unten, px (Stufe 2; Stufe 1 die Hälfte, Stufe 3 das Doppelte) | 4 | 0–16 | ↑ greifbar, verspielt, App · 0 flach, technisch, editorial |
| `--shadow-blur` | Weichheit des Schattens, px | 16 | 0–48 | ↑ weich, freudig, ruhig · ↓ hart, grafisch |
| `--shadow-opacity` | Deckkraft des Schattens | 0.1 | 0–0.25 | 0 keine Schatten (technisch, flach) · ↑ greifbar, freudig. Über 0.2 wirkt schnell billig |

### Buttons

| Grundwert | Wirkung | Standard | Bereich | Begriffe |
|---|---|---|---|---|
| `--btn-radius-base` | Radius der Buttons `--btn-radius`, px. 999 heisst Pille | 6 | 0–32 oder 999 | 999 freudig, weich, nahbar, ruhig · klein präzise, technisch, seriös. Meist gleich `--radius-base` oder Pille |
| `--btn-weight` | Schriftgewicht der Buttons | 600 | 400–800 | ↑ kräftig, freudig, laut · ↓ ruhig, edel. Nur Schnitte, die die Schrift hat |

Doku zu den Klassen: [buttons.md](buttons.md).

### Farbstufen

Die Stufen jeder Rolle (`--primary-ultra-light` bis `--primary-ultra-dark`) entstehen, indem Weiss oder Schwarz zur Rolle gemischt wird. Die Rolle selbst (`--primary`) bleibt genau die Farbe aus der Marke.

| Grundwert | Wirkung | Standard | Bereich | Begriffe |
|---|---|---|---|---|
| `--shade-ultra-light` | Anteil Weiss in `*-ultra-light` (Flächen) | 0.92 | 0.85–0.97 | ↑ zarter, ruhig, technisch · ↓ farbiger, freudig. Bei tiefer `--color-saturation` eher ↓, sonst verschwinden die Flächen im Seitenhintergrund |
| `--shade-light` | Anteil Weiss in `*-light`. `*-semi-light` hat die Hälfte davon | 0.7 | 0.5–0.85 | wie `--shade-ultra-light` |
| `--shade-dark` | Anteil Schwarz in `*-dark`. `*-semi-dark` hat die Hälfte davon | 0.35 | 0.2–0.5 | ↑ schwerer, ernster · ↓ heller, freundlicher |
| `--shade-ultra-dark` | Anteil Schwarz in `*-ultra-dark` | 0.7 | 0.5–0.85 | wie `--shade-dark` |
| `--color-saturation` | Sättigung der Stufen gegenüber der Rolle. 1 heisst gleich satt | 1 | 0.4–1 | ↓ gedämpft, ruhig, technisch, edel, natürlich · 1 satt, freudig, Kampagne |

Mehr als 1 geht nicht: `color-mix()` kann nur zum Grau hin mischen. Die Sättigung wirkt nur auf die Stufen, nicht auf die Rolle und nicht auf Hover.

Grenze: Weil Weiss und Schwarz gemischt werden, ist `*-ultra-light` einer dunklen Rolle dunkler als die einer hellen. ACSS setzt feste Helligkeiten. Das geht erst mit `oklch(from …)`, das noch nicht «Baseline Widely available» ist.

### Breiten

| Grundwert | Wirkung | Standard | Bereich | Begriffe |
|---|---|---|---|---|
| `--content-max` | Breite des Inhalts `--content-width`, px | 1280 | 960–1440 | ↓ ruhig, editorial, viel Text, edel · ↑ Bilder, Raster, Shop |
| `--gutter-min` | Abstand zum Rand `--gutter` auf dem Handy, px | 16 | 16–32 | ↑ ruhig, luftig |
| `--gutter-max` | Abstand zum Rand auf grossen Bildschirmen, px | 64 | 32–128 | ↑ Weissraum, ruhig, edel |

Im Konzept heisst dieser Wert noch `--content-width`. Den Namen trägt hier das Token aus ACSS, darum `--content-max`.

### Farben

Hex `#rrggbb`, Rollen wie im Hub (`agenturhub/src/lib/server/marke.ts`, `FARBROLLEN`). Die Farben kommen aus der Marke, die KI erfindet sie nicht. Die Presets enthalten keine Farben.

**Pflicht ist nur `--primary`.** Viele Marken haben nur eine Farbe und Weiss (z. B. Gelb). Der Hub gibt nur die Rollen aus, die die Marke hat. Fehlt eine Rolle, leitet das CSS sie aus den gesetzten ab, nie aus einer fremden Farbe:

| Grundwert | Rolle | fehlt sie, gilt |
|---|---|---|
| `--primary` | Hauptfarbe | Pflicht (Standard nur für die Testseite: Blau) |
| `--secondary` | Zweitfarbe | `--primary` |
| `--tertiary` | Drittfarbe | `--secondary` |
| `--accent` | Akzent, sparsam | `--primary` |
| `--action` | Aktion: Knöpfe, Links | `--primary` |
| `--base` | Basis: Text, dunkle Flächen | fast Schwarz `#1d1f22` |
| `--neutral` | Neutral: Linien, Grautöne | 60% `--base` mit Weiss (Grau) |
| `--bg-light` | Hintergrund hell | 10% `--neutral` mit Weiss (helles Grau für Sections im Wechsel) |
| `--bg-dark` | Hintergrund dunkel | `--base` |
| `--text-light` | Text auf dunkel | Weiss |
| `--text-dark` | Text auf hell | `--base` |

Ergebnis bei nur Gelb: Seite fast weiss, Sections `bg--light` hellgrau, dunkle Flächen und Text fast schwarz, Knöpfe gelb mit dunklem Text, Links und Outline-Buttons dunkel. Mit Gelb und Schwarz (`--base`) wird das Grau aus Schwarz gemischt, also neutral.

Pro Rolle `primary`, `secondary`, `tertiary`, `accent`, `action`, `base`, `neutral` dazu:

| Grundwert | Wirkung | Bereich | fehlt er, gilt |
|---|---|---|---|
| `--{rolle}-text-light` | Textfarbe auf der Rolle, z. B. in `btn--primary`: 1 heisst `--text-light`, 0 heisst `--text-dark`. 0 heisst auch: die Farbe ist zu hell für Text auf hellem Grund, darum nehmen Links (bei `action`) und Outline-Buttons dann `--text-dark` | 0 oder 1 | der Wert der Rolle, aus der sie abgeleitet ist. `base` und `neutral`: 1 |

Die KI wählt diesen Wert nicht nach Geschmack. Der Hub rechnet ihn für jede Rolle, die er ausgibt, aus dem Kontrast nach WCAG: die Seite mit dem höheren Kontrast gewinnt. Das CSS kann das erst mit `oklch(from …)` selbst.

Grenze: Die dunklen Stufen heller Farben werden durch das Mischen mit Schwarz trüb (Gelb wird Oliv, z. B. `btn--primary-dark`). Bei solchen Marken die dunklen Stufen nicht verwenden.

#### Semantische Farben

Wie in ACSS: Zustände, nicht Marke. Der Hub gibt sie nicht aus, es gelten die Standardwerte. Eine Site überschreibt sie im Layer `site` nur, wenn sie mit der Marke kollidieren, etwa `--danger` bei einer roten Marke oder `--success` bei einer grünen.

| Grundwert | Wirkung | Standard | Kontrast zu Weiss | `-text-light` |
|---|---|---|---|---|
| `--success` | Erfolg, bestätigt | `#1e7b3a` Grün | 5.3 | 1 |
| `--danger` | Fehler, löschen; Rahmen ungültiger Felder | `#c62828` Rot | 5.6 | 1 |
| `--warning` | Warnung | `#f5b800` Gelb | 1.8 | 0 (Text dunkel, 9.2) |
| `--info` | Hinweis | `#1d6fb8` Blau | 5.2 | 1 |

Stufen, `-hover`, `-text` und Buttons wie bei den Rollen. `--color-saturation` gilt auch für ihre Stufen: In «ruhig» sind sie gedämpft, die Farbe selbst bleibt.

## Was daraus gerechnet wird

`src/tokens.css`, Namen wie in ACSS:

- Schrift: `--text-xs … --text-xxl`, `--h1 … --h6`, `--heading-font-weight`, `--heading-letter-spacing`, `--heading-line-height`, `--text-line-height`.
- Abstände: `--space-xs … --space-xxl`, `--section-space-xs … --section-space-xxl`.
- Breiten: `--content-width`, `--gutter`, `--content-gap` (`--space-m`), `--container-gap` (`--space-xl`), `--grid-gap` (`--space-m`), `--width-10 … --width-90`.
- Raster: `--grid-1 … --grid-12`, `--grid-1-2`, `--grid-1-3`, `--grid-2-1`, `--grid-2-3`, `--grid-3-1`, `--grid-3-2`, `--grid-auto-min`, siehe [raster.md](raster.md).
- Form: `--radius`, `--radius-s`, `--radius-m`, `--radius-l`, `--radius-xl`, `--radius-circle` (Pille, 50vw), `--radius-50` (Kreis, 50%), `--border-size`, `--border-style`, `--border-color-dark`, `--border-color-light`, `--border`.
- Tiefe: `--box-shadow-1`, `--box-shadow-2`, `--box-shadow-3`.
- Buttons: `--btn-*`, siehe [buttons.md](buttons.md).
- Grundstile: `--paragraph-spacing`, `--heading-spacing`, `--list-indent-spacing`, `--list-item-spacing`, `--section-padding-block`, `--section-padding-inline`, `--link-*`, `--focus-color`, `--focus-width`, `--focus-offset`, `--blockquote-*`, siehe [grundstile.md](grundstile.md).
- Farben: pro Rolle `primary`, `secondary`, `tertiary`, `accent`, `action`, `base`, `neutral` und für `success`, `danger`, `warning`, `info` die Stufen `-ultra-light`, `-light`, `-semi-light`, `-semi-dark`, `-dark`, `-ultra-dark`, `-hover`. Dazu `--white`, `--black`, `--bg-ultra-light`, `--bg-ultra-dark`, `--body-bg-color`, `--text-dark-muted`, `--text-light-muted`.
- Farben, die von der Fläche abhängen: `--body-color`, `--heading-color`, `--body-color-muted`, `--link-color`, `--link-color-hover`. Die Klassen `bg--*` stellen sie um, siehe [flaechen.md](flaechen.md).

Nicht in ACSS, hier zusätzlich: `--grid-auto-min`, `--border-size-strong`, `--border-strong` und `--body-color-muted` und `--{rolle}-text` (Textfarbe auf der Rolle). Die Zwischenwerte `--text-l-min`, `--text-l-max` usw. sind unitless px. Was mit `_` beginnt (`--_rem`, `--_fluid`, `--_primary` …), ist intern.

## Offen

- [Offen] Welche Rolle aus dem Hub ist der Seitenhintergrund? Heute: `--body-bg-color` = `--bg-ultra-light`, das aus `--bg-light` mit 60% Weiss gerechnet wird. Soll die Seite genau `--bg-light` zeigen, `--body-bg-color: var(--bg-light)` setzen oder eine eigene Rolle im Hub einführen.
- [Offen] Sprünge wie `--h1-to-h4` und `--space-xxl-to-m` aus ACSS fehlen noch. Erst bauen, wenn eine Site sie braucht.

## Prüfen

### Prüfskript

```bash
npm run pruefen
```

Die Bereiche stehen maschinenlesbar in `src/grundwerte.json`. Das Skript prüft zuerst, ob `grundwerte.json`, `src/grundwerte.css` und die Tabellen oben dasselbe sagen (Standard und Bereich). Wer einen Bereich ändert, ändert alle drei. Dann prüft es den Standard, jedes Preset und jede Marke in `test/marken/`, allein und mit jedem Preset.

Eine Site oder eine Marke aus dem Hub prüfen, Dateien in der Reihenfolge der Site:

```bash
npm run pruefen -- src/presets/ruhig.css pfad/zu/marke.css
```

`--hinweise` zeigt auch die Hinweise ausführlich. `npm run check` ist `format:check` und `pruefen` zusammen, vor jedem Commit.

**Fehler** (Code 1):

- Unbekannter Name (Tippfehler) oder ein Token statt eines Grundwerts gesetzt.
- Zahl ausserhalb des Bereichs, bei Paaren `-min` grösser als `-max`.
- Schrift ohne allgemeine Schrift am Ende (`sans-serif`, `serif` …).
- `--{rolle}-text-light` nicht die Seite mit dem höheren Kontrast. Bei einer abgeleiteten Rolle steht der Fehler bei der Quelle.
- Kontrast unter 4.5 (WCAG AA): `--text-dark` auf Seite, `bg--light` und `bg--ultra-light`, `--text-light` auf `bg--dark` und `bg--ultra-dark`, Links auf Seite, `bg--light` und `bg--dark`, Text auf `btn--action`.

**Hinweise** (Varianten, die eine Site wählt): Text auf `btn--{farbe}`, `-light` und `-dark` für jede Farbe und auf `btn--white` unter 4.5, gedämpfter Text unter 4.5, Fokus auf der Seite, `bg--dark` und `bg--ultra-dark` unter 3, Rahmen ungültiger Felder (`--danger` auf Weiss) unter 3, `--primary-ultra-light` auf der Seite unter 1.04 (Fläche kaum sichtbar; bei hellen Marken wie Gelb nicht zu ändern).

Die Farben rechnet das Skript wie der Browser aus den Formeln in `src/tokens.css` (`var()`, `calc()`, `color-mix()` in oklab und oklch), auch die abgeleiteten Rollen. Geprüft am Browser: dieselben Hex-Werte.

Der Hub kann dieselbe Prüfung verwenden: `import { pruefen, variablenAusCss } from 'leuchtturm-css/pruefen'` und die Bereiche aus `leuchtturm-css/grundwerte.json`. Ohne Abhängigkeiten.

### Testseite

```bash
python3 -m http.server 4340
```

Dann `http://localhost:4340/test/` öffnen und oben Preset und Marke wechseln (oder `?preset=freudig&marke=gelb`). Die Beispielmarken liegen in `test/marken/`, darunter «nur Primary», «Gelb» und «Gelb, Schwarz» mit fehlenden Rollen. Die Seite zeigt Skalen mit den Werten in px, Radien, Linien, Schatten, alle Farbstufen und die Kontext-Farben.
