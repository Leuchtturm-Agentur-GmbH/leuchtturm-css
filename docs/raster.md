# Raster und Breiten

Wie in ACSS: Spalten über die Tokens `--grid-*` oder die Klassen `grid--*`, Breiten über `--width-*` oder `width--*`. Keine neuen Grundwerte, der Vertrag mit dem Hub bleibt gleich. Code: `src/raster.css` (Layer `utilities`), Tokens in `src/tokens.css`.

```html
<div class="grid--3 grid--m-1">…</div>
<ul class="grid--auto-3" role="list">…</ul>
<p class="width--60">…</p>
```

## Tokens

| Token | Wert |
|---|---|
| `--grid-1` … `--grid-12` | gleich breite Spalten, `repeat(n, minmax(0, 1fr))` |
| `--grid-1-2`, `--grid-1-3`, `--grid-2-1`, `--grid-2-3`, `--grid-3-1`, `--grid-3-2` | zwei Spalten im Verhältnis |
| `--grid-gap` | Abstand in Rastern, `--space-m` |
| `--grid-auto-min` | Mindestbreite einer Zelle in `.grid--auto-*`, 288px. In ACSS ohne Namen (dort `--min`) |
| `--width-10` … `--width-90` | Anteil von `--content-width` in Zehnteln |

`minmax(0, 1fr)` statt `1fr`: Ein langes Wort oder ein breites Bild macht eine Spalte sonst breiter als die anderen.

Eigenes CSS mobile first, wie die ACSS-Doku es verlangt:

```css
.angebote {
	display: grid;
	gap: var(--grid-gap);

	@media (width >= 48em) {
		grid-template-columns: var(--grid-3);
	}
}
```

## Klassen

| Klasse | Wirkung |
|---|---|
| `grid--1` … `grid--12`, `grid--1-2` … | `display: grid`, Spalten aus dem Token, Abstand `--grid-gap` |
| `grid--m-{n}`, `grid--s-{n}`, `grid--xs-{n}` | andere Spalten ab dieser Breite des Fensters abwärts. `n` ist 1 bis 6 oder ein Verhältnis (`grid--m-1-2`). Zusammen mit einer festen Klasse verwenden |
| `grid--auto-2` … `grid--auto-6` | höchstens so viele Spalten. Die Zellen stapeln, sobald sie schmaler als `--grid-auto-min` würden |
| `width--10` … `width--90` | `inline-size: 100%`, `max-inline-size: var(--width-n)` |
| `width--full` | volle Breite des Platzes, auch als Kind einer Section |

Grenzen wie in ACSS: `m` bis 992px, `s` bis 768px, `xs` bis 478px. Sie stehen in `em` fest im CSS, weil Media Queries keine Variablen lesen. Die Klassen sind desktop first wie in ACSS: `grid--4 grid--s-2 grid--xs-1` heisst vier Spalten, ab 768px abwärts zwei, ab 478px abwärts eine.

## Spalten nie zu schmal

Eine Spalte wird nie schmaler als `--grid-auto-min` (288px). Wird sie es, stapeln die Spalten: `grid--auto-*` macht das selbst, bei festen Rastern gehört eine Stufe dazu (`grid--1-3 grid--s-1`). Die Überschriften werden in schmalen Spalten nicht kleiner gerechnet, `--h2` bleibt auch in 100px 42px gross. Läuft eine Überschrift aus der Spalte, ist das Layout zu eng, nicht die Schrift zu gross. Für Karten und Seitenleisten eine kleinere Stufe wählen (`h3`, `h4`).

## Fest oder automatisch

- **`grid--auto-*`** richtet sich nach dem eigenen Platz, nicht nach dem Fenster. Für Karten, Teams und Logos meist die bessere Wahl: dieselbe Klasse passt in die volle Breite und in eine Seitenspalte. Mit `style="--grid-auto-min: 12rem"` schmalere Zellen erlauben.
- **`grid--{n}` mit `grid--{bp}-{n}`**, wenn die Spaltenzahl fest sein muss, etwa Bild und Text im Verhältnis `grid--1-2`.

`grid--auto-3` zeigt nur drei Spalten, wenn drei Zellen mit `--grid-auto-min` hineinpassen (bei 288px und Abstand 24px ab 912px). Sonst zwei oder eine.

Abstand ändern: `--grid-gap` setzen, nicht `gap`. `grid--auto-*` rechnet die Spalten mit `--grid-gap`. Wer nur `gap` grösser macht, bekommt eine Spalte weniger, als Platz wäre: Die Zellen passen mit dem grösseren Abstand nicht mehr in eine Zeile.

```html
<ul class="grid--auto-4" role="list" style="--grid-gap: var(--space-l)">…</ul>
```

## Breiten

`--width-*` ist ein Anteil von `--content-width`, nicht vom Platz: `width--50` ist bei `--content-max: 1280` immer höchstens 640px breit, auch in einer schmalen Spalte (dort volle Breite). Für Text, der nicht über die ganze Breite laufen soll, z. B. ein Lead mit `width--60`. Als Kind einer Section bleibt es mittig, sonst links.

Wie in ACSS: keine eigenen `max-width` auf Containern. Sections geben ihren Kindern `--content-width` schon mit, siehe [grundstile.md](grundstile.md).

## Offen

- [Offen] Raster mit Container Queries statt Fenster (`grid--m-*` nach der Breite der Section): erst, wenn Sections Container werden (siehe [grundwerte.md](grundwerte.md)).
- [Offen] `grid--auto-*` über 6 und `grid--l-*`, `grid--xl-*` aus ACSS erst, wenn eine Site sie braucht.
- [Offen] Ob `--grid-auto-min` ein Grundwert im Hub werden soll. Heute ein Token, das eine Site oder ein Element überschreibt.
