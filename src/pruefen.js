/*
	Prüfung der Grundwerte einer Site: Bereiche, Paare, Schriften, Textfarbe auf den Rollen und Kontraste nach WCAG.
	Ohne Abhängigkeiten, damit der Hub die Datei direkt verwenden kann (import { pruefen } from 'leuchtturm-css/pruefen').

	Die Farben rechnet das Skript wie der Browser aus den Formeln in src/tokens.css: var(), calc() und color-mix()
	in oklab und oklch. So prüft es genau die Farben, die eine Site zeigt, auch die abgeleiteten Rollen.

	Eingabe: der Text der Dateien in der Reihenfolge, in der die Site sie einbindet (leuchtturm.css zuerst, dann Preset
	und Marke). Ergebnis: Liste von Meldungen { art: 'fehler' | 'hinweis', text }.
*/

/* Deklarationen --name: wert; aus CSS, ohne Kommentare. Spätere überschreiben frühere. */
export function variablenAusCss(css, ziel = {}) {
	const ohneKommentare = css.replace(/\/\*[\s\S]*?\*\//g, '');
	for (const m of ohneKommentare.matchAll(/(--[\w-]+)\s*:\s*([^;{}]+);/g)) {
		ziel[m[1]] = m[2].trim();
	}
	return ziel;
}

/* ---------- Werte lesen ---------- */

function zerlegen(text) {
	const teile = [];
	const re =
		/\s*(?:(#[0-9a-fA-F]+)|(-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?)(%|[a-zA-Z]+)?|(--[\w-]+|[a-zA-Z_][\w-]*)(\()?|([(),*/+-]))/y;
	let pos = 0;
	while (pos < text.length) {
		re.lastIndex = pos;
		const m = re.exec(text);
		if (!m) {
			if (/^\s*$/.test(text.slice(pos))) break;
			throw new Error(`Nicht lesbar: «${text.slice(pos)}»`);
		}
		pos = re.lastIndex;
		if (m[1]) teile.push({ t: 'hex', v: m[1] });
		else if (m[2] !== undefined) teile.push({ t: 'zahl', v: parseFloat(m[2]), e: m[3] ?? '' });
		else if (m[4] && m[5]) teile.push({ t: 'fn', v: m[4].toLowerCase() });
		else if (m[4]) teile.push({ t: 'wort', v: m[4] });
		else teile.push({ t: 'op', v: m[6] });
	}
	return teile;
}

/* Baum: Funktionen mit Argumenten (durch Komma getrennt), jedes Argument eine Liste von Teilen */
function baum(teile) {
	let i = 0;
	function liste(bisKlammer) {
		const args = [[]];
		while (i < teile.length) {
			const t = teile[i++];
			if (t.t === 'op' && t.v === ')') {
				if (bisKlammer) return args;
				throw new Error('Klammer zu viel');
			}
			if (t.t === 'op' && t.v === ',') args.push([]);
			else if (t.t === 'fn') args.at(-1).push({ t: 'fn', v: t.v, args: liste(true) });
			else if (t.t === 'op' && t.v === '(') args.at(-1).push({ t: 'fn', v: 'calc', args: liste(true) });
			else args.at(-1).push(t);
		}
		if (bisKlammer) throw new Error('Klammer fehlt');
		return args;
	}
	return liste(false);
}

/* ---------- Farben ---------- */

const linear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const gamma = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

function srgbZuOklab([r, g, b]) {
	[r, g, b] = [r, g, b].map(linear);
	const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
	const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
	const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
	return [
		0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
		1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
		0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
	];
}

function oklabZuSrgb([L, a, b]) {
	const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
	const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
	const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
	return [
		4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
		-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
		-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
	].map((c) => Math.min(1, Math.max(0, gamma(c))));
}

const oklabZuOklch = ([L, a, b]) => {
	const C = Math.hypot(a, b);
	return [L, C, C < 1e-6 ? null : ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360];
};
const oklchZuOklab = ([L, C, H]) => [
	L,
	C * Math.cos(((H ?? 0) * Math.PI) / 180),
	C * Math.sin(((H ?? 0) * Math.PI) / 180)
];

/* Eine Farbe: Werte im Raum «raum» (srgb, oklab oder oklch), null heisst «none», dazu Deckkraft */
const farbe = (raum, werte, alpha = 1) => ({ farbe: true, raum, werte, alpha });

function imRaum(f, raum) {
	if (f.raum === raum) return f.werte;
	const lab =
		f.raum === 'srgb' ? srgbZuOklab(f.werte) : f.raum === 'oklch' ? oklchZuOklab(f.werte.map((w) => w ?? 0)) : f.werte;
	if (raum === 'oklab') return lab;
	if (raum === 'oklch') return oklabZuOklch(lab);
	return oklabZuSrgb(lab);
}

export function hexZuFarbe(hex) {
	let h = hex.slice(1);
	if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join('');
	const w = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
	return farbe('srgb', w, h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1);
}

/* color-mix() nach CSS Color 5: Anteile normalisieren, mit vormultiplizierter Deckkraft mischen, none übernehmen */
function mischen(raum, f1, p1, f2, p2) {
	if (p1 == null && p2 == null) [p1, p2] = [50, 50];
	else if (p1 == null) p1 = 100 - p2;
	else if (p2 == null) p2 = 100 - p1;
	const summe = p1 + p2;
	if (summe <= 0) throw new Error('color-mix mit 0%');
	const t = p2 / summe;
	const faktorAlpha = Math.min(1, summe / 100);
	const a = imRaum(f1, raum);
	const b = imRaum(f2, raum);
	const alpha = f1.alpha * (1 - t) + f2.alpha * t;
	const hue = raum === 'oklch' ? 2 : -1;
	const werte = a.map((x, i) => {
		let y = b[i];
		if (x == null && y == null) return null;
		if (x == null) return y;
		if (y == null) return x;
		if (i === hue) {
			let d = y - x;
			if (d > 180) d -= 360;
			if (d < -180) d += 360;
			return (x + d * t + 360) % 360;
		}
		const wert = x * f1.alpha * (1 - t) + y * f2.alpha * t;
		return alpha === 0 ? 0 : wert / alpha;
	});
	return farbe(raum, werte, alpha * faktorAlpha);
}

/* Für den Kontrast: Farbe als sRGB, mit Deckkraft über den Hintergrund gelegt */
function aufGrund(f, grund) {
	const v = imRaum(f, 'srgb');
	if (f.alpha >= 1) return v;
	const g = grund ? aufGrund(grund) : [1, 1, 1];
	return v.map((c, i) => c * f.alpha + g[i] * (1 - f.alpha));
}

const leuchtdichte = (rgb) => {
	const [r, g, b] = rgb.map(linear);
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export function kontrast(vorne, hinten) {
	const h = aufGrund(hinten);
	const v = aufGrund(vorne, hinten);
	const [a, b] = [leuchtdichte(v), leuchtdichte(h)].sort((x, y) => y - x);
	return (a + 0.05) / (b + 0.05);
}

export function alsHex(f) {
	return (
		'#' +
		aufGrund(f)
			.map((c) =>
				Math.round(c * 255)
					.toString(16)
					.padStart(2, '0')
			)
			.join('')
	);
}

/* ---------- Auswerten ---------- */

const benannt = { white: '#ffffff', black: '#000000' };

export function rechner(variablen) {
	const fertig = new Map();
	const unterwegs = new Set();

	function variable(name) {
		if (fertig.has(name)) return fertig.get(name);
		if (!(name in variablen)) throw new Error(`${name} ist nicht gesetzt`);
		if (unterwegs.has(name)) throw new Error(`${name} verweist auf sich selbst`);
		unterwegs.add(name);
		try {
			const w = wert(variablen[name]);
			fertig.set(name, w);
			return w;
		} catch (e) {
			throw new Error(`${name}: ${e.message}`);
		} finally {
			unterwegs.delete(name);
		}
	}

	function wert(text) {
		const args = baum(zerlegen(text));
		if (args.length !== 1) throw new Error(`Liste statt Wert: «${text}»`);
		return ausdruck(args[0]);
	}

	function einzeln(t) {
		if (t.t === 'hex') return hexZuFarbe(t.v);
		if (t.t === 'zahl') return { zahl: t.v, einheit: t.e };
		if (t.t === 'wort') {
			if (t.v in benannt) return hexZuFarbe(benannt[t.v]);
			if (t.v === 'transparent') return farbe('srgb', [0, 0, 0], 0);
			if (t.v === 'none') return { none: true };
			throw new Error(`Unbekanntes Wort «${t.v}»`);
		}
		if (t.t === 'fn') return funktion(t.v, t.args);
		throw new Error(`Unerwartet «${t.v}»`);
	}

	function funktion(name, args) {
		if (name === 'var') {
			const n = args[0][0].v;
			if (n in variablen || args.length < 2) return variable(n);
			return ausdruck(args.slice(1).flat());
		}
		if (name === 'calc') return ausdruck(args[0]);
		if (name === 'color-mix') {
			const [art, ...rest] = args;
			const raum = art[1]?.v;
			if (art[0]?.v !== 'in' || !['oklab', 'oklch', 'srgb'].includes(raum)) throw new Error(`color-mix in «${raum}»`);
			/* Jedes Argument: Farbe, optional gefolgt vom Anteil (50% oder calc(…)) */
			const teil = (liste) => {
				if (liste.length < 1 || liste.length > 2) throw new Error('color-mix: Argument nicht lesbar');
				const f = einzeln(liste[0]);
				if (!f.farbe) throw new Error('color-mix ohne Farbe');
				if (liste.length === 1) return [f, null];
				const a = einzeln(liste[1]);
				if (a.einheit !== '%') throw new Error('color-mix: Anteil ohne %');
				return [f, a.zahl];
			};
			const [f1, p1] = teil(rest[0]);
			const [f2, p2] = teil(rest[1]);
			return mischen(raum, f1, p1, f2, p2);
		}
		if (name === 'oklch' || name === 'oklab') {
			const w = args[0].filter((t) => !(t.t === 'op' && t.v === '/'));
			const zahlen = w.slice(0, 3).map((t) => {
				const e = einzeln(t);
				if (e.none) return null;
				return e.einheit === '%' ? e.zahl / 100 : e.zahl;
			});
			const alpha = w[3] ? einzeln(w[3]) : { zahl: 1 };
			return farbe(name, zahlen, alpha.einheit === '%' ? alpha.zahl / 100 : alpha.zahl);
		}
		throw new Error(`Funktion ${name}() kann das Skript nicht rechnen`);
	}

	/* Rechnen mit Zahlen: + und - binden schwächer als * und / */
	function ausdruck(teile) {
		if (teile.length === 0) throw new Error('Leerer Wert');
		const summanden = [[]];
		const vorzeichen = [1];
		for (const t of teile) {
			if (t.t === 'op' && (t.v === '+' || t.v === '-') && summanden.at(-1).length) {
				summanden.push([]);
				vorzeichen.push(t.v === '+' ? 1 : -1);
			} else summanden.at(-1).push(t);
		}
		const werte = summanden.map(produkt);
		if (werte.length === 1) return werte[0];
		let summe = 0;
		let einheit = '';
		werte.forEach((w, i) => {
			if (w.farbe) throw new Error('Rechnen mit Farbe');
			summe += vorzeichen[i] * w.zahl;
			einheit ||= w.einheit;
		});
		return { zahl: summe, einheit };
	}

	function produkt(teile) {
		let w = einzeln(teile[0]);
		for (let i = 1; i < teile.length; i += 2) {
			const op = teile[i].v;
			const r = einzeln(teile[i + 1]);
			if (w.farbe || r.farbe) throw new Error('Rechnen mit Farbe');
			w = { zahl: op === '*' ? w.zahl * r.zahl : w.zahl / r.zahl, einheit: w.einheit || r.einheit };
		}
		return w;
	}

	return { variable, wert };
}

/* ---------- Prüfen ---------- */

const generisch =
	/(^|,)\s*(serif|sans-serif|monospace|cursive|fantasy|system-ui|ui-serif|ui-sans-serif|ui-monospace|ui-rounded)\s*$/;

/*
	grundwerte: Inhalt von src/grundwerte.json
	basis: Variablen aus leuchtturm.css (Grundwerte mit Standard und Tokens)
	site: Variablen, die Preset und Marke setzen (nur die, in der Reihenfolge der Site zusammengeführt)
*/
export function pruefen({ grundwerte, basis, site }) {
	const meldungen = [];
	const fehler = (text) => meldungen.push({ art: 'fehler', text });
	const hinweis = (text) => meldungen.push({ art: 'hinweis', text });

	const { zahlen, paare, schriften, farben } = grundwerte;
	const alleFarben = [...farben.marke, ...farben.semantisch];
	const bekannt = new Set([
		...Object.keys(zahlen),
		...schriften,
		...alleFarben,
		...farben['mit-text'].map((r) => `${r}-text-light`)
	]);
	const standardNamen = new Set(Object.keys(basis));

	/* Nur bekannte Grundwerte setzen */
	for (const name of Object.keys(site)) {
		const kurz = name.slice(2);
		if (bekannt.has(kurz)) continue;
		if (standardNamen.has(name))
			fehler(`${name} ist ein Token, kein Grundwert. Tokens nie direkt setzen, den Grundwert ändern.`);
		else fehler(`${name} kennt leuchtturm-css nicht (Tippfehler?).`);
	}

	const alle = { ...basis, ...site };
	const r = rechner(alle);
	const zahl = (name) => {
		const w = r.variable(`--${name}`);
		if (w.farbe || w.einheit) throw new Error(`--${name} muss eine Zahl ohne Einheit sein`);
		return w.zahl;
	};

	/* Zahlen im Bereich */
	for (const [name, b] of Object.entries(zahlen)) {
		let w;
		try {
			w = zahl(name);
		} catch (e) {
			fehler(e.message);
			continue;
		}
		if (b.auch?.includes(w)) continue;
		if (w < b.min || w > b.max) {
			fehler(`--${name}: ${w} liegt ausserhalb ${b.min}–${b.max}${b.auch ? ` (oder ${b.auch.join(', ')})` : ''}.`);
		}
	}
	for (const [a, b] of paare) {
		try {
			if (zahl(a) > zahl(b)) fehler(`--${a} (${zahl(a)}) ist grösser als --${b} (${zahl(b)}).`);
		} catch {
			/* schon oben gemeldet */
		}
	}

	/* Schriften: Liste mit Ersatz am Ende */
	for (const name of schriften) {
		const w = alle[`--${name}`];
		if (!w) fehler(`--${name} fehlt.`);
		else if (!generisch.test(w)) fehler(`--${name}: am Ende fehlt eine allgemeine Schrift wie sans-serif oder serif.`);
	}

	/* Farben: Hex in der Marke, alle rechenbar */
	for (const name of farben.pflicht) {
		if (!(`--${name}` in site) && !(`--${name}` in basis)) fehler(`--${name} fehlt, sie ist Pflicht.`);
	}
	for (const name of alleFarben) {
		const gesetzt = site[`--${name}`];
		if (gesetzt && !/^#[0-9a-f]{6}$/i.test(gesetzt) && !/^var\(--[\w-]+\)$/.test(gesetzt)) {
			hinweis(`--${name}: «${gesetzt}» ist nicht #rrggbb. Der Hub gibt Hex aus.`);
		}
	}

	const f = {};
	const holen = (name) => {
		if (!(name in f)) {
			try {
				const w = r.variable(name);
				if (!w.farbe) throw new Error(`${name} ist keine Farbe`);
				f[name] = w;
			} catch (e) {
				fehler(e.message);
				f[name] = null;
			}
		}
		return f[name];
	};
	const zwei = (n) => n.toFixed(2);

	/* Textfarbe auf der Rolle: --{rolle}-text-light muss die Seite mit dem höheren Kontrast sein */
	for (const rolle of farben['mit-text']) {
		const grund = holen(`--${rolle}`);
		const hell = holen('--text-light');
		const dunkel = holen('--text-dark');
		if (!grund || !hell || !dunkel) continue;
		let gesetzt;
		try {
			gesetzt = zahl(`${rolle}-text-light`);
		} catch (e) {
			fehler(e.message);
			continue;
		}
		if (gesetzt !== 0 && gesetzt !== 1) {
			fehler(`--${rolle}-text-light muss 0 oder 1 sein, nicht ${gesetzt}.`);
			continue;
		}
		const kHell = kontrast(hell, grund);
		const kDunkel = kontrast(dunkel, grund);
		const richtig = kHell >= kDunkel ? 1 : 0;
		/* Ganz abgeleitete Rollen erben Farbe und Wert von ihrer Quelle, der Fehler steht schon dort */
		const abgeleitet = !(`--${rolle}` in site) && !(`--${rolle}-text-light` in site);
		if (gesetzt !== richtig && !(abgeleitet && Object.keys(site).length)) {
			const quelle = `--${rolle}-text-light` in site ? '' : ' (abgeleitet, in der Marke setzen)';
			fehler(
				`--${rolle}-text-light ist ${gesetzt}${quelle}, richtig ist ${richtig}: hell ${zwei(kHell)}, dunkel ${zwei(kDunkel)} auf ${alsHex(grund)}.`
			);
		}
	}

	/* Kontraste. Fehler: Text, den jede Seite hat. Hinweis: Varianten, die eine Site wählt. */
	const paarePruefen = (liste, art) => {
		for (const [vorne, hinten, wo, mindestens = 4.5] of liste) {
			const v = holen(vorne);
			const h = holen(hinten);
			if (!v || !h) continue;
			const k = kontrast(v, h);
			if (k < mindestens) {
				const text = `${wo}: Kontrast ${zwei(k)}, verlangt ${mindestens} (${vorne} ${alsHex(v)} auf ${hinten} ${alsHex(h)}).`;
				art === 'fehler' ? fehler(text) : hinweis(text);
			}
		}
	};

	paarePruefen(
		[
			['--text-dark', '--body-bg-color', 'Text auf der Seite'],
			['--text-dark', '--bg-light', 'Text auf bg--light'],
			['--text-dark', '--bg-ultra-light', 'Text auf bg--ultra-light'],
			['--text-light', '--bg-dark', 'Text auf bg--dark'],
			['--text-light', '--bg-ultra-dark', 'Text auf bg--ultra-dark'],
			['--_link-color-light', '--body-bg-color', 'Links auf der Seite'],
			['--_link-color-light', '--bg-light', 'Links auf bg--light'],
			['--action-light', '--bg-dark', 'Links auf bg--dark'],
			['--action-text', '--action', 'btn--action']
		],
		'fehler'
	);

	const varianten = [];
	for (const rolle of farben['mit-text']) {
		if (rolle !== 'action') varianten.push([`--${rolle}-text`, `--${rolle}`, `btn--${rolle}`]);
		varianten.push([`--${rolle}-ultra-dark`, `--${rolle}-light`, `btn--${rolle}-light`]);
		varianten.push([`--${rolle}-ultra-light`, `--${rolle}-dark`, `btn--${rolle}-dark`]);
	}
	paarePruefen(
		[
			['--text-dark-muted', '--body-bg-color', 'Gedämpfter Text auf der Seite'],
			['--text-light-muted', '--bg-dark', 'Gedämpfter Text auf bg--dark'],
			['--danger', '--white', 'Rahmen ungültiger Felder', 3],
			...varianten
		],
		'hinweis'
	);

	return meldungen;
}
