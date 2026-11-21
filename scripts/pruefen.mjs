/*
	Prüfskript: npm run pruefen [-- datei.css …]

	Ohne Dateien: prüft, ob src/grundwerte.json, src/grundwerte.css und die Tabellen in docs/grundwerte.md
	übereinstimmen, dann den Standard, jedes Preset und jede Marke in test/marken/ (je mit Standard und mit jedem Preset).
	Mit Dateien: prüft genau diese Kombination, in der Reihenfolge der Site (z. B. Preset, dann marke.css).

	Fehler beenden mit Code 1. Hinweise nur mit --hinweise ausführlich, sonst als Zahl.
*/

import { readFileSync, readdirSync } from 'node:fs';
import { basename, join } from 'node:path';
import { pruefen, variablenAusCss } from '../src/pruefen.js';

const wurzel = new URL('..', import.meta.url).pathname;
const lesen = (pfad) => readFileSync(join(wurzel, pfad), 'utf8');

const grundwerte = JSON.parse(lesen('src/grundwerte.json'));
const standard = variablenAusCss(lesen('src/grundwerte.css'));
const basis = variablenAusCss(lesen('src/tokens.css'), { ...standard });

const argumente = process.argv.slice(2);
const ausfuehrlich = argumente.includes('--hinweise');
const dateien = argumente.filter((a) => !a.startsWith('--'));

let fehlerZahl = 0;

function melden(titel, meldungen) {
	const fehler = meldungen.filter((m) => m.art === 'fehler');
	const hinweise = meldungen.filter((m) => m.art === 'hinweis');
	fehlerZahl += fehler.length;
	const zusatz = hinweise.length ? `, ${hinweise.length} Hinweis${hinweise.length > 1 ? 'e' : ''}` : '';
	console.log(`${fehler.length ? '✗' : '✓'} ${titel}${fehler.length ? `: ${fehler.length} Fehler` : ''}${zusatz}`);
	for (const m of fehler) console.log(`    Fehler: ${m.text}`);
	if (ausfuehrlich) for (const m of hinweise) console.log(`    Hinweis: ${m.text}`);
}

/* Grundwerte.json, grundwerte.css und die Doku müssen dasselbe sagen */
function selbstpruefung() {
	const meldungen = [];
	const fehler = (text) => meldungen.push({ art: 'fehler', text });
	const doku = lesen('docs/grundwerte.md');
	const zeilen = new Map();
	for (const m of doku.matchAll(/^\| `--([\w-]+)` \|[^|]*\| ([^|]+) \| ([^|]+) \|/gm)) {
		zeilen.set(m[1], { standard: m[2].trim(), bereich: m[3].trim() });
	}
	const zahl = (t) => parseFloat(t.replace('−', '-'));
	for (const [name, b] of Object.entries(grundwerte.zahlen)) {
		const css = standard[`--${name}`];
		if (css === undefined) fehler(`--${name} fehlt in src/grundwerte.css.`);
		else if (zahl(css) !== b.standard)
			fehler(`--${name}: Standard ${b.standard} in grundwerte.json, ${css} in grundwerte.css.`);
		const z = zeilen.get(name);
		if (!z) {
			fehler(`--${name} fehlt in der Tabelle in docs/grundwerte.md.`);
			continue;
		}
		if (zahl(z.standard) !== b.standard)
			fehler(`--${name}: Standard ${b.standard} in grundwerte.json, ${z.standard} in der Doku.`);
		const bereich =
			z.bereich.match(/(-?[\d.]+|`--[\w-]+`)\s*[–-]\s*(-?[\d.]+)/) ?? z.bereich.match(/(`--[\w-]+`) bis (-?[\d.]+)/);
		if (!bereich) fehler(`--${name}: Bereich «${z.bereich}» in der Doku nicht lesbar.`);
		else {
			const min = bereich[1].startsWith('`') ? null : zahl(bereich[1]);
			if ((min !== null && min !== b.min) || zahl(bereich[2]) !== b.max) {
				fehler(`--${name}: Bereich ${b.min}–${b.max} in grundwerte.json, ${z.bereich} in der Doku.`);
			}
		}
	}
	for (const name of Object.keys(standard)) {
		const kurz = name.slice(2);
		const bekannt =
			kurz in grundwerte.zahlen ||
			grundwerte.schriften.includes(kurz) ||
			grundwerte.farben.marke.includes(kurz) ||
			grundwerte.farben.semantisch.includes(kurz) ||
			grundwerte.farben['mit-text'].some((r) => kurz === `${r}-text-light`);
		if (!bekannt) fehler(`${name} steht in grundwerte.css, fehlt aber in grundwerte.json.`);
	}
	return meldungen;
}

const site = (pfade) => pfade.reduce((v, p) => variablenAusCss(readFileSync(p, 'utf8'), v), {});
const pruefe = (titel, pfade) => melden(titel, pruefen({ grundwerte, basis, site: site(pfade) }));

if (dateien.length) {
	pruefe(dateien.map((d) => basename(d)).join(' + '), dateien);
} else {
	melden('grundwerte.json, grundwerte.css und Doku stimmen überein', selbstpruefung());
	const presets = readdirSync(join(wurzel, 'src/presets')).filter((d) => d.endsWith('.css'));
	const marken = readdirSync(join(wurzel, 'test/marken')).filter((d) => d.endsWith('.css'));
	pruefe('Standard', []);
	for (const p of presets) pruefe(`Preset ${basename(p, '.css')}`, [join(wurzel, 'src/presets', p)]);
	for (const m of marken) {
		const marke = join(wurzel, 'test/marken', m);
		pruefe(`Marke ${basename(m, '.css')}`, [marke]);
		for (const p of presets)
			pruefe(`Marke ${basename(m, '.css')} + ${basename(p, '.css')}`, [join(wurzel, 'src/presets', p), marke]);
	}
}

if (fehlerZahl) {
	console.log(`\n${fehlerZahl} Fehler.`);
	process.exit(1);
}
