# Flächen: helle und dunkle Sections

Wie in ACSS: Eine Klasse auf der Section (oder Karte, Leiste …) setzt den Hintergrund. Text, Überschriften, Links und Linien darin passen sich von selbst an.

```html
<section class="bg--dark">
	<h2>Retreats</h2>
	<p>Text in --text-light, ohne eigene Regel.</p>
	<div class="karte bg--light">Helle Karte in der dunklen Section</div>
</section>
```

| Klasse | Hintergrund | Text, Überschriften | gedämpft | Links | Linien | Fokus |
|---|---|---|---|---|---|---|
| `bg--ultra-light` | `--bg-ultra-light` | `--text-dark` | `--text-dark-muted` | `--action`, Hover `--action-hover` | `--border-color-dark` | `--text-dark` |
| `bg--light` | `--bg-light` | `--text-dark` | `--text-dark-muted` | `--action`, Hover `--action-hover` | `--border-color-dark` | `--text-dark` |
| `bg--dark` | `--bg-dark` | `--text-light` | `--text-light-muted` | `--action-light`, Hover `--text-light` | `--border-color-light` | `--action`, wenn hell, sonst `--text-light` |
| `bg--ultra-dark` | `--bg-ultra-dark` | `--text-light` | `--text-light-muted` | `--action-light`, Hover `--text-light` | `--border-color-light` | wie `bg--dark` |

Fokus auf dunklen Flächen: Ist `--action` hell (`--action-text-light` 0, z. B. Gold oder Gelb), hebt sie sich auf Dunkel ab und wird die Farbe des Fokus. Sonst `--text-light`. Ohne neuen Grundwert. Eine andere Farbe setzt die Site im Layer `site` mit `--focus-color` in `.bg--dark, .bg--ultra-dark`.

Die Klassen setzen dazu `color-scheme`, damit Scrollbalken und Formularfelder des Browsers passen.

## So funktioniert es

Die Klassen (`src/utilities.css`, Layer `utilities`) setzen nicht die Farbe jedes Elements, sondern stellen die Kontext-Tokens um:

- `--body-color`, `--heading-color`, `--link-color`, `--link-color-hover` (Namen wie in ACSS)
- `--body-color-muted` (nicht in ACSS) für gedämpften Text
- `--border` und `--border-strong`
- `--focus-color` (Name wie in ACSS)

Die Grundstile (`src/base.css`, Layer `base`, ohne Spezifität) nehmen für Text, Überschriften und Links nur diese Tokens. Darum gilt für Komponenten:

- **Text:** `color` nicht setzen (erbt) oder `var(--body-color)`, gedämpft `var(--body-color-muted)`. Nie `--text-dark` direkt, sonst stimmt es auf dunklen Flächen nicht.
- **Linien:** `var(--border)`, nicht `--border-color-dark`.
- **Eigene Fläche** (Karte, Leiste): selbst eine Klasse `bg--*` geben. Eine Fläche ohne Klasse (z. B. `--primary-ultra-light`) übernimmt die Farben der Section, darum nur Flächen nehmen, die dazu passen.

`--border` muss die Klasse neu setzen: Ein Token auf `:root` legt die Farbe dort fest und ändert sie beim Erben nicht mehr. Für jedes weitere Token, das von der Fläche abhängt (Buttons, Fokus), gilt dasselbe.

## Unterschiede zu ACSS

- ACSS stellt pro Fläche in den Einstellungen ein, welche Farbe Text, Überschrift, Link, Button und Icon bekommen. Hier ist die Zuordnung fest (Tabelle oben). Es braucht dafür keine Grundwerte.

## Offen

- [Offen] Buttons pro Fläche (ACSS: `bg-dark-button`), sobald die Buttons gebaut werden.
- Kontrast der Links auf `bg--light` und `bg--dark` prüft `npm run pruefen`, den Fokus (mindestens 3) als Hinweis.
