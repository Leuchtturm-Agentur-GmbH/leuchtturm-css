# CLAUDE.md

Regeln für Sitzungen in diesem Repo. Es gilt zusätzlich der Leitstand `~/Coding/CLAUDE.md`, die Regeln hier gehen vor.

## Worum es geht

CSS-Framework für die Astro-Sites der Agentur, angelehnt an ACSS. Konzept: `frischknecht-brain/agentur/leuchtturm-css.md`. Vor grösseren Änderungen dort lesen.

## Regeln

1. **Nur Namen und Ideen von ACSS, kein CSS von ACSS.** ACSS ist kommerziell. Namen der Tokens wie in ACSS (`etch-studio/agent-docs/acss/`), keine erfundenen Namen, wo ACSS einen hat.
2. **Grundwerte und gerechnete Tokens trennen.** Eine Site setzt nur Grundwerte (Layer `grundwerte`). Tokens, Grundstile und Komponenten verweisen nur auf Tokens, nie auf feste Werte.
3. **Jeder Grundwert ist dokumentiert:** was er bewirkt, erlaubter Bereich, welche Begriffe ihn in welche Richtung schieben. Ohne diese Doku kein neuer Grundwert.
4. **Nur CSS, das «Baseline Widely available» ist**, sonst mit Fallback. Beispiel: Farbstufen mit `color-mix()`, nicht mit `oklch(from …)`.
5. **Grundstile ohne Spezifität** (`:where()`), damit der Layer `site` immer gewinnt, ohne `!important`.
6. Logische Eigenschaften (`margin-block`, `max-inline-size`), `rem` statt `px` ausser bei Linien.
7. **Klein bleiben.** Nur bauen, was eine Site wirklich braucht. Keine Sammlung von Hilfsklassen.

## Arbeitsweise

- Dieses Repo deployt nichts. Gearbeitet wird direkt auf `main`, Push nur auf Wunsch von Ralf.
- Sites binden eine Version mit Tag ein. Änderungen am Aussehen bekommen eine neue Version, damit keine Site sich unbemerkt ändert.
- Vor jedem Commit `npm run format:check`.
- Kommentare und Doku auf Deutsch, Schweizer Schreibweise.
