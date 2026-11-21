# Buttons

Wie in ACSS: Ein Link oder `<button>` wird mit einer Klasse zum Button. Kein eigenes CSS nötig.

```html
<a class="btn--primary" href="/kurse">Kurse ansehen</a>
<a class="btn--primary btn--outline" href="/kontakt">Kontakt</a>
<button class="btn--action btn--l">Anmelden</button>
```

## Klassen

| Klasse | Wirkung |
|---|---|
| `btn--{farbe}` | Fläche in der Farbe der Rolle, Text hell oder dunkel nach `--{farbe}-text-light`. Hover: `--{farbe}-hover` |
| `btn--{farbe}-light` | Fläche `--{farbe}-light`, Text `--{farbe}-ultra-dark`. Hover: `-semi-light` |
| `btn--{farbe}-dark` | Fläche `--{farbe}-dark`, Text `--{farbe}-ultra-light`. Hover: `-ultra-dark` |
| `btn--outline` | zusammen mit einer Farbklasse: durchsichtig, Rahmen und Text in der Farbe, beim Hover gefüllt |
| `btn--xs`, `btn--s`, `btn--l`, `btn--xl`, `btn--xxl` | Grösse über die Schrift (`--text-*`), die Abstände wachsen in em mit |

Farben: `primary`, `secondary`, `tertiary`, `accent`, `base`, `neutral` und die semantischen `success`, `danger`, `warning`, `info` wie in ACSS, dazu `action` (Rolle im Hub für Knöpfe und Links, in den ACSS-Docs nicht als Button aufgeführt).

Ist die Farbe zu hell für Text (`--{farbe}-text-light` 0, z. B. Gelb), sind Rahmen und Text von `btn--{farbe} btn--outline` in `--text-dark`. Die dunklen Stufen heller Farben werden trüb (Gelb wird Oliv), `btn--{farbe}-dark` dann nicht verwenden.

Auf hellen Flächen passen `btn--{farbe}` und `-dark`, auf dunklen `btn--{farbe}` und `-light`. Outline nur mit einer Farbe, die sich vom Hintergrund abhebt: `btn--primary-light btn--outline` ist auf hellem Grund kaum sichtbar, `btn--base` auf `bg--dark` gar nicht.

Fokus: Rahmen in `--heading-color`, darum passt er auf jeder Fläche (`bg--*`).

## Grundwerte

- `--btn-radius-base`: Radius in px. 999 heisst Pille.
- `--btn-weight`: Schriftgewicht.
- `--{farbe}-text-light`: 1 heisst Text `--text-light` auf der Farbe, 0 heisst `--text-dark`.

Bereiche und Begriffe: [grundwerte.md](grundwerte.md).

## Tokens

Namen wie in ACSS: `--btn-padding-block`, `--btn-padding-inline`, `--btn-min-width`, `--btn-line-height`, `--btn-font-size`, `--btn-font-weight`, `--btn-font-family`, `--btn-letter-spacing`, `--btn-text-transform`, `--btn-text-decoration`, `--btn-text-decoration-hover`, `--btn-border-width` (= `--border-size-strong`), `--btn-border-style`, `--btn-radius`, `--btn-border-radius`.

Jede Farbklasse setzt `--btn-background`, `--btn-text-color`, `--btn-border-color` (je mit `-hover`) und `--btn-outline-color`. Ein eigener Button in der Site setzt dieselben Variablen und nimmt sonst die gemeinsame Regel:

```css
.btn--marke {
	--btn-background: var(--primary-ultra-dark);
	--btn-background-hover: var(--black);
	--btn-text-color: var(--white);
	--btn-text-color-hover: var(--white);
	--btn-border-color: var(--primary-ultra-dark);
	--btn-border-color-hover: var(--black);
	--btn-outline-color: var(--primary-ultra-dark);
}
```

Die gemeinsame Regel gilt nur für die Klassen in `src/buttons.css`. Eine neue Farbklasse dort in die Liste aufnehmen oder in der Site `display`, Abstände usw. selbst setzen.

## Offen

- Kontrast jeder Variante: `npm run pruefen -- --hinweise`. `btn--action` unter 4.5 ist ein Fehler, alle anderen Varianten ein Hinweis. AA verlangt 4.5, für fetten Text ab 18.66px 3. Heute darunter z. B. `-dark` heller Farben (Gelb, `warning`) und mehrere Rollen der Testmarke «Salbei».
- [Offen] Sobald `oklch(from …)` Baseline Widely available ist, kann das CSS `--{farbe}-text-light` selbst aus der Helligkeit rechnen.
- [Offen] Weitere Tokens aus ACSS (`--btn-width`, `--btn-justify-content` …) erst, wenn eine Site sie braucht.
