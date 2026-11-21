# leuchtturm-css

CSS-Framework der Leuchtturm Agentur für die Astro-Sites, angelehnt an Automatic.css (ACSS). In Etch bleibt ACSS.

- Reines CSS, kein Tailwind im Kern. Für Sites mit Tailwind kommt später eine kleine Zusatzdatei mit `@theme inline`.
- Dieselben Namen der Tokens wie ACSS (`--primary`, `--bg-light`, `--space-m`, `--h2`, `--content-gap`, `btn--primary` …), damit die Regeln aus Etch auch für Astro gelten. Übernommen werden nur Namen und Ideen, kein CSS von ACSS.
- Der Charakter einer Site steckt in rund 25 Grundwerten (Schrift, Abstände, Radius, Linien, Schatten, Farbstufen). Alles andere rechnet das CSS daraus. Die Grundwerte und die Farben kommen aus dem Hub (Marke).

Konzept und Entscheid: `frischknecht-brain/agentur/leuchtturm-css.md`, Entscheid vom 21.11.2026 in `frischknecht-brain/strategie/entscheide.md`.

## Stand

Grundwerte, Tokens, Presets, Reset, Grundstile, Sections, `.smart-spacing`, Flächen `bg--*`, Buttons, Raster und Breiten stehen (21.11.2026). Gebaut wird zuerst, was die Site des Atelier für Yoga braucht. Bei der zweiten Site wird geprüft, was gemeinsam ist. Dazu die semantischen Farben `success`, `danger`, `warning`, `info`. Noch nicht: Zusatzdatei für Tailwind, Prüfskript.

## Aufbau

- `src/leuchtturm.css`: Einstieg, Reihenfolge der Layer, bindet die Teile ein.
- `src/grundwerte.css`: Layer `grundwerte`, 31 Grundwerte, 11 Farben der Marke, 4 semantische Farben und pro Farbe die Textfarbe darauf, mit neutralen Standardwerten. Nur diese setzt eine Site.
- `src/tokens.css`: Layer `tokens`, daraus gerechnet (Schrift, Abstände, Radien, Rahmen, Schatten, Farbstufen, Kontext-Farben, Breiten, Raster).
- `src/reset.css`: Layer `reset`, kleiner Reset.
- `src/base.css`: Layer `base`, Grundstile für Seite, Überschriften, Text, Links, Listen, Zitate, Bilder, Formulare und Fokus, nur mit Tokens. Doku: `docs/grundstile.md`.
- `src/layout.css`: Layer `layout`, Abstand und Breite der Sections wie in ACSS.
- `src/buttons.css`: Layer `components`, Buttons `btn--{farbe}`, `-light`, `-dark`, `btn--outline`, Grössen. Doku: `docs/buttons.md`.
- `src/utilities.css`: Layer `utilities`, Flächen `bg--ultra-light`, `bg--light`, `bg--dark`, `bg--ultra-dark` (Doku: `docs/flaechen.md`) und `.smart-spacing`.
- `src/raster.css`: Layer `utilities`, Raster `grid--*` und Breiten `width--*` wie in ACSS. Doku: `docs/raster.md`.
- `src/presets/`: vollständige Sätze von Grundwerten ohne Farben, `technisch`, `freudig`, `ruhig`. Nach `leuchtturm.css` einbinden. Die Farben kommen aus der Marke, Pflicht ist nur `--primary`, fehlende Rollen leitet das CSS ab.
- `docs/hub-vertrag.md`: Vertrag mit dem Hub. Wie die Marke als `marke.css` in die Site kommt, welche Werte der Hub rechnet und prüft.
- `docs/grundwerte.md`: pro Grundwert Wirkung, Bereich und Begriffe. Grundlage für die KI und das spätere Prüfskript.
- `test/index.html`: Testseite mit allen Skalen und Farben, Preset und Marke umschaltbar. Beispielmarken in `test/marken/`, auch solche mit nur Gelb.

## Einbinden

Als Abhängigkeit über Git mit Tag, z. B. `"leuchtturm-css": "github:Leuchtturm-Agentur-GmbH/leuchtturm-css#v0.1.0"`, dann in der Site:

```css
@import 'leuchtturm-css';
@import './marke.css';
```

`marke.css` erzeugt der Hub ([docs/hub-vertrag.md](docs/hub-vertrag.md)). Ohne Hub setzt die Site stattdessen ein Preset und ihre Farben im Layer `grundwerte`.

## Befehle

Testseite: Server starten, dann `http://localhost:4340/test/` öffnen.

```bash
python3 -m http.server 4340
```

```bash
npm run format
```

```bash
npm run format:check
```
