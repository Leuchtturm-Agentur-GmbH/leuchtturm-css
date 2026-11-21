# leuchtturm-css

CSS-Framework der Leuchtturm Agentur für die Astro-Sites, angelehnt an Automatic.css (ACSS). In Etch bleibt ACSS.

- Reines CSS, kein Tailwind im Kern. Für Sites mit Tailwind kommt später eine kleine Zusatzdatei mit `@theme inline`.
- Dieselben Namen der Tokens wie ACSS (`--primary`, `--bg-light`, `--space-m`, `--h2`, `--content-gap`, `btn--primary` …), damit die Regeln aus Etch auch für Astro gelten. Übernommen werden nur Namen und Ideen, kein CSS von ACSS.
- Der Charakter einer Site steckt in rund 25 Grundwerten (Schrift, Abstände, Radius, Linien, Schatten, Farbstufen). Alles andere rechnet das CSS daraus. Die Grundwerte und die Farben kommen aus dem Hub (Marke).

Konzept und Entscheid: `frischknecht-brain/agentur/leuchtturm-css.md`, Entscheid vom 21.11.2026 in `frischknecht-brain/strategie/entscheide.md`.

## Stand

Erste Fassung der Grundwerte und Tokens (21.11.2026). Gebaut wird zuerst, was die Site des Atelier für Yoga braucht. Bei der zweiten Site wird geprüft, was gemeinsam ist. Noch nicht: Reset, Grundstile, Buttons, Zusatzdatei für Tailwind, Prüfskript.

## Aufbau

- `src/leuchtturm.css`: Einstieg, Reihenfolge der Layer, bindet die Teile ein.
- `src/grundwerte.css`: Layer `grundwerte`, rund 30 Grundwerte und 11 Farben mit neutralen Standardwerten. Nur diese setzt eine Site.
- `src/tokens.css`: Layer `tokens`, daraus gerechnet (Schrift, Abstände, Radien, Rahmen, Schatten, Farbstufen, Kontext-Farben, Breiten).
- `src/presets/`: vollständige Sätze von Grundwerten, `technisch`, `freudig`, `ruhig`. Nach `leuchtturm.css` einbinden.
- `docs/grundwerte.md`: pro Grundwert Wirkung, Bereich und Begriffe. Grundlage für die KI und das spätere Prüfskript.
- `test/index.html`: Testseite mit allen Skalen und Farben, Preset umschaltbar.

## Einbinden

Noch nicht festgelegt. Vorgesehen: als Abhängigkeit über Git, z. B. `"leuchtturm-css": "github:Leuchtturm-Agentur-GmbH/leuchtturm-css#v0.1.0"`, dann in der Site `@import 'leuchtturm-css';`.

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
