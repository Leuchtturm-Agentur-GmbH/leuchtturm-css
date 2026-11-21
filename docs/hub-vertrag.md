# Vertrag: agenturhub → leuchtturm-css

Stand: 21.11.2026, Entwurf. Kennzeichnung: **[Ralf]** · **[Vorschlag]** · **[Offen]**.

Wie der Hub die Marke eines Kunden an eine Astro-Site mit `leuchtturm-css` gibt. Nach Leitstand-Regel 3 steht der Vertrag hier, im Repo, das die Werte braucht: Namen, Bereiche und Rechnung der Grundwerte legt `leuchtturm-css` fest ([grundwerte.md](grundwerte.md)). Wo die Datei im Repo der Site liegt, legt der Vertrag der Site fest (Hub-Plan, offener Punkt 10).

Ändert sich ein Name oder Bereich, zuerst diese Datei, dann beide Seiten im Code prüfen. `leuchtturm-css` geht zuerst live (unten, «Reihenfolge»).

## Besitz

| Was | Besitzer | Anderswo |
|---|---|---|
| Farben, Schriften und Grundwerte einer Marke | Hub (`brand_versions`, mit Verlauf) | in der Site nur lesbar, erzeugt |
| Namen, Bereiche, Standardwerte, Ableitung fehlender Farben, Rechnung der Tokens | `leuchtturm-css` | der Hub prüft nur gegen die Bereiche |
| Wie die Site die Datei einbindet, Schriftdateien laden | Repo der Site | |

Nie in beide Richtungen abgleichen. Eine Änderung an der Marke geht im Hub, nie in der erzeugten Datei.

## Ausgabe: `marke.css` [Vorschlag]

Eine CSS-Datei, kein JSON. So braucht die Site kein Skript beim Build, und dieselbe Datei funktioniert in jeder Site. Der Hub schreibt sie per Pull Request (Hub-Plan 13.6). `brand.json` bleibt für andere Zwecke (Etch, MCP), braucht `leuchtturm-css` aber nicht.

```css
/*
	Erzeugt vom agenturhub der Leuchtturm Agentur. Nicht hier ändern: Änderungen kommen aus dem Hub.
	Marke: Beispiel AG, Fassung vom 21.11.2026. Für leuchtturm-css ab 0.1.
*/

@layer grundwerte {
	:root {
		--vw-min: 360;
		--vw-max: 1440;
		/* … alle Grundwerte, Reihenfolge wie in grundwerte.md … */
		--gutter-max: 64;

		--heading-font-family: 'Fraunces', Georgia, serif;
		--text-font-family: 'Inter', system-ui, sans-serif;

		--primary: #ffd200;
		--primary-text-light: 0;
	}
}
```

Regeln:

1. **Immer `@layer grundwerte { :root { … } }`.** Nur Grundwerte, nie Tokens (`--space-m`, `--primary-light` …).
2. **Alle Grundwerte ausser den Farben immer vollständig**, auch wenn sie dem Preset oder Standard gleichen. So ändert sich eine Site nicht, wenn `leuchtturm-css` einen Standardwert ändert.
3. **Farben nur, wenn die Marke sie hat.** Pflicht ist nur `--primary`. Fehlende Rollen leitet `leuchtturm-css` ab ([grundwerte.md](grundwerte.md), Abschnitt Farben). Der Hub füllt nie eine Rolle mit einer erfundenen Farbe.
4. **Feste Reihenfolge**, kein Datum der Erzeugung, nur das Datum der Fassung: Gleiche Werte geben dieselben Bytes (wie `brand.json`, Hub-Plan 13.6).
5. Zahlen ohne Einheit, so kurz wie möglich (`1.25`, nicht `1.250`). Farben `#rrggbb` klein.

## Felder

### Grundwerte (ohne Farben und Schriften)

Die Liste und die Bereiche stehen in [grundwerte.md](grundwerte.md), heute 31 Werte: `--vw-min`, `--vw-max`, `--type-min`, `--type-max`, `--type-ratio-min`, `--type-ratio-max`, `--heading-weight`, `--heading-tracking`, `--heading-leading`, `--text-leading`, `--space-min`, `--space-max`, `--space-ratio`, `--section-min`, `--section-max`, `--radius-base`, `--line-width`, `--line-width-strong`, `--shadow-y`, `--shadow-blur`, `--shadow-opacity`, `--btn-radius-base`, `--btn-weight`, `--shade-ultra-light`, `--shade-light`, `--shade-dark`, `--shade-ultra-dark`, `--color-saturation`, `--content-max`, `--gutter-min`, `--gutter-max`.

Der Hub prüft beim Speichern:

- jeder Wert ist eine Zahl im Bereich aus `grundwerte.md`,
- bei Paaren `-min ≤ -max` (`--vw-*`, `--type-*`, `--type-ratio-*`, `--space-*`, `--section-*`, `--gutter-*`), dazu `--line-width ≤ --line-width-strong`,
- `--heading-weight` und `--btn-weight` sind Schnitte, die die Schrift der Marke hat (`fonts.heading.weights` bzw. `fonts.text.weights`).

Ein Wert ausserhalb des Bereichs wird nicht gespeichert, mit Hinweis auf den Bereich.

Gespeichert werden sie im Hub mit dem Namen ohne `--` als Schlüssel, z. B. `{"type-min": 16, "radius-base": 2, …}`, dazu das Preset, von dem die KI ausging, und die Begründung jeder Abweichung in einem Satz (Konzept, «Ablauf mit dem Hub»).

### Schriften

| Grundwert | Aus dem Hub | Regel |
|---|---|---|
| `--heading-font-family` | `fonts.heading.family` | Name in einfachen Anführungszeichen, dann Ersatz. Fehlt die Schrift: Grundwert weglassen, dann gilt die Systemschrift |
| `--text-font-family` | `fonts.text.family` | wie oben |

Ersatz am Ende: `system-ui, sans-serif`. [Offen] Für Schriften mit Serifen oder Monospace braucht es die Art der Schrift im Hub (`serif`, `sans`, `mono`), sonst fällt eine Serifenschrift auf eine Schrift ohne Serifen zurück. Vorschlag: Feld `kind` bei `fonts.heading` und `fonts.text`, Ersatz `Georgia, serif` bzw. `ui-monospace, monospace`.

Die Schriftdateien lädt die Site (Fontsource, eigene Datei), nicht `marke.css`.

### Farben

| Grundwert | Aus dem Hub |
|---|---|
| `--primary`, `--secondary`, `--tertiary`, `--accent`, `--action`, `--base`, `--neutral`, `--bg-light`, `--bg-dark`, `--text-light`, `--text-dark` | `colors[rolle]`, nur wenn gesetzt. Reihenfolge wie `FARBROLLEN` |

Rollen, die `leuchtturm-css` nicht kennt (eine neue Rolle im Hub), lässt der Hub weg, bis sie hier eingetragen sind.

Die semantischen Farben `--success`, `--danger`, `--warning`, `--info` sind keine Rollen der Marke. Der Hub gibt sie nicht aus, es gelten die Standardwerte von `leuchtturm-css` ([grundwerte.md](grundwerte.md)). Kollidiert eine mit der Marke, überschreibt die Site sie im Layer `site`.

- [Offen] Ob der Hub warnen soll, wenn `--primary` nahe an `--danger` oder `--success` liegt.

### Textfarbe auf jeder Rolle: `--{rolle}-text-light`

Für jede gesetzte Rolle aus `primary`, `secondary`, `tertiary`, `accent`, `action`, `base`, `neutral` rechnet der Hub `--{rolle}-text-light` und gibt es direkt nach den Farben aus. Die KI wählt es nicht.

1. Textfarben bestimmen, so wie `leuchtturm-css` sie ableitet:
   - hell = `colors['text-light']`, sonst `#ffffff`
   - dunkel = `colors['text-dark']`, sonst `colors.base`, sonst `#1d1f22`
2. Kontrast nach WCAG 2 zwischen der Rolle und hell, und zwischen der Rolle und dunkel.
3. `1`, wenn der Kontrast zu hell grösser oder gleich ist, sonst `0`.

Für Rollen, die die Marke nicht hat, gibt der Hub nichts aus: Sie übernehmen den Wert ihrer Quelle.

Der Wert steuert drei Dinge: Text auf Buttons der Rolle, Rahmen und Text von Outline-Buttons, Links (bei `action`). `0` heisst dort: die Farbe ist zu hell für Text auf hellem Grund.

[Offen] Der Hub warnt, wenn keine der beiden Seiten 4.5 erreicht (WCAG AA). Das ist eine Eigenschaft der Markenfarbe, kein Fehler: speichern ja, Hinweis zeigen.

## Beispiel: Marke mit nur Gelb

Hub: `colors = {"primary": "#ffd200"}`, Schriften Inter, Grundwerte vom Preset «technisch».

```css
@layer grundwerte {
	:root {
		--vw-min: 360;
		/* … 31 Grundwerte … */
		--gutter-max: 64;

		--heading-font-family: 'Inter', system-ui, sans-serif;
		--text-font-family: 'Inter', system-ui, sans-serif;

		--primary: #ffd200;
		--primary-text-light: 0;
	}
}
```

Kontrast `#ffd200` zu Weiss 1.45, zu `#1d1f22` 11.4, also `0`. `leuchtturm-css` macht daraus: Knöpfe gelb mit dunklem Text, Links und Outline dunkel, helle Sections grau, dunkle Flächen fast schwarz.

## Einbinden in der Site

```css
@import 'leuchtturm-css';
@import './marke.css';
```

`marke.css` nach `leuchtturm-css`, damit sie im selben Layer später kommt und gewinnt. Ein Preset aus `src/presets/` bindet die Site dann nicht ein: `marke.css` enthält schon alle Grundwerte. Die Version von `leuchtturm-css` hält die Site mit einem Tag fest.

## Versionen und Reihenfolge

- Der Kopf von `marke.css` nennt die kleinste Version von `leuchtturm-css`, für die sie passt.
- **Neuer Grundwert:** zuerst in `leuchtturm-css` mit Standardwert und Doku, neue Version. Dann gibt ihn der Hub aus. Eine Site mit älterer Version ignoriert den Wert (unbekannte Variable), nichts bricht.
- **Grundwert umbenannt oder entfernt:** neue Hauptversion von `leuchtturm-css`. Der Hub gibt pro Website die Fassung aus, die zur eingebundenen Version passt, oder alle Sites ziehen zusammen nach.
- **Bereich geändert:** zuerst hier, dann die Prüfung im Hub.

## Etch: dieselben Werte als Import für ACSS [Vorschlag]

Aus denselben Grundwerten erzeugt der Hub die Import-Datei für ACSS (Hub-Plan 13.6, offener Punkt 20). Abbildung, abgeleitet aus `etch-studio/projects/angan/acss/acss-brand.mjs` und dem Export der Einstellungen:

| Grundwert | Schlüssel in ACSS | Hinweis |
|---|---|---|
| `--vw-min`, `--vw-max` | `vp-min`, `vp-max` | |
| `--type-min`, `--type-max` | `base-text-mob`, `base-text-desk`, dazu `base-heading-mob`, `base-heading-desk` | gleiche Grundgrösse für Text und Überschriften |
| `--type-ratio-min` | `mob-text-scale`, `mob-heading-scale` | |
| `--type-ratio-max` | `text-scale`, `heading-scale` | ACSS rechnet die Stufen anders, die Grössen weichen etwas ab |
| `--heading-weight` | `heading-weight` | |
| `--heading-tracking` | `heading-letter-spacing` | mit Einheit, z. B. `-0.01em` |
| `--space-min`, `--space-max` | `base-space-min`, `base-space` | |
| `--space-ratio` | `space-scale`, `mob-space-scale` | |
| `--radius-base` | `base-radius` | mit Einheit, z. B. `2px` |
| `--line-width` | `border-size` | mit Einheit |
| `--btn-radius-base`, `--btn-weight` | `btn-border-radius`, `btn-font-weight` | 999 als `999px` |
| `--gutter-min`, `--gutter-max` | `gutter-min`, `gutter-max` | |
| Schriften | `heading-font-family`, `text-font-family` | |
| Farben | `color-{rolle}` und die Werte in oklch, wie `acss-brand.mjs` sie rechnet | Kontextrollen (`bg-light` …) als `var(--…)` oder Hex |

[Offen] Keine direkte Entsprechung: `--section-min`/`--section-max` (ACSS: `space-adjust-section`, ein Faktor), `--content-max`, Schatten, Farbstufen (ACSS: feste Helligkeiten), `--color-saturation`, die Ableitung fehlender Rollen und `--{rolle}-text-light`. Vor dem Bau das Format des Imports an einem Export prüfen (Hub-Plan, offener Punkt 20).

## Was der Hub dafür braucht [Offen]

Nicht Teil dieses Repos, als Liste für die Sitzung im Hub:

1. `brand_versions` um die Grundwerte erweitern (JSON, Schlüssel ohne `--`), dazu Preset und Begründungen. `radius` (heute Text wie `0.5rem`) geht in `radius-base` auf: einmal umrechnen, dann entfernen.
2. Prüfung der Bereiche. Der Hub liest sie aus `leuchtturm-css/grundwerte.json` statt sie abzuschreiben, oder verwendet gleich die Prüfung `leuchtturm-css/pruefen` (Bereiche, Paare, Schriften, `--{rolle}-text-light`, Kontraste), siehe [grundwerte.md](grundwerte.md), Abschnitt Prüfen.
3. Kontrast nach WCAG und `--{rolle}-text-light` (oben).
4. `marke.css` in `uebergabe.ts` als reine Funktion neben `brandJson`, Vorschau in der Karte «Übergabe».
5. Optional `kind` bei den Schriften.
6. Leitstand: diesen Vertrag in die Liste der Verträge in `~/Coding/CLAUDE.md` aufnehmen (liegt in `frischknecht-brain/leitstand/CLAUDE.md`).
