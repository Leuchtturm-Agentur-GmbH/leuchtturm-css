# leuchtturm-css

CSS-Framework der Leuchtturm Agentur für die Astro-Sites, angelehnt an Automatic.css (ACSS). In Etch bleibt ACSS.

- Reines CSS, kein Tailwind im Kern. Für Sites mit Tailwind kommt später eine kleine Zusatzdatei mit `@theme inline`.
- Dieselben Namen der Tokens wie ACSS (`--primary`, `--bg-light`, `--space-m`, `--h2`, `--content-gap`, `btn--primary` …), damit die Regeln aus Etch auch für Astro gelten. Übernommen werden nur Namen und Ideen, kein CSS von ACSS.
- Der Charakter einer Site steckt in rund 25 Grundwerten (Schrift, Abstände, Radius, Linien, Schatten, Farbstufen). Alles andere rechnet das CSS daraus. Die Grundwerte und die Farben kommen aus dem Hub (Marke).

Konzept und Entscheid: `frischknecht-brain/agentur/leuchtturm-css.md`, Entscheid vom 21.11.2026 in `frischknecht-brain/strategie/entscheide.md`.

## Stand

Grundgerüst. Gebaut wird zuerst, was die Site des Atelier für Yoga braucht. Bei der zweiten Site wird geprüft, was gemeinsam ist.

## Einbinden

Noch nicht festgelegt. Vorgesehen: als Abhängigkeit über Git, z. B. `"leuchtturm-css": "github:Leuchtturm-Agentur-GmbH/leuchtturm-css#v0.1.0"`, dann in der Site `@import 'leuchtturm-css';`.

## Befehle

```bash
npm run format
```

```bash
npm run format:check
```
