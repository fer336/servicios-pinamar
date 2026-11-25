import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { journeyStops } from './home-journey.ts';

// The original services with Electricidad after Gas, then three herrería stops, durlock and carpintería.
assert.deepEqual(
  journeyStops.map((stop) => stop.service),
  ['Pintura', 'Hidrolavado', 'Plomería', 'Gas', 'Electricidad', 'Fumigaciones', 'Jardinería y poda', 'Herrería · Rejas', 'Herrería · Carteles', 'Herrería · Techos', 'Durlock', 'Carpintería']
);
assert.deepEqual(
  journeyStops.slice(7).map((stop) => stop.href),
  ['/servicios/herreria/', '/servicios/herreria/', '/servicios/herreria/', '/servicios/durlock/', '/servicios/carpinteria/']
);
assert.equal(journeyStops[4].href, '/servicios/electricidad/');
// User: "no pongas nada en detalle solo que hacenos electricidad domesti a y de obras nuevas".
assert.match(journeyStops[4].description, /domiciliaria/);
assert.match(journeyStops[4].description, /obras nuevas/);

// S5: every stop links to an existing service page.
const servicePages = readFileSync(new URL('./service-pages.ts', import.meta.url), 'utf8');
for (const stop of journeyStops) {
  assert.match(stop.href, /^\/servicios\/[a-z-]+\/$/);
  assert.ok(servicePages.includes(`slug: '${stop.href.split('/')[2]}'`), `${stop.href} has no service page`);
  assert.equal(stop.camera.length, 6);
}

// S4: three.js and the crew stay byte-identical (scene.js is now a local, coastal derivative in src/scene) to the design package (sha256 from SHA256-ORIGINALES.json).
const originals: Record<string, string> = {
  'three.min.js': 'e2750e9b671bde4a3b351cb5164e2bad81f8298b48ff54cf493e42f43271b28e',
  'crew.js': '4ee942d89838114dea0c131ccf2156494eab09483d53a0468ef2935b5df523c5',
  'three-LICENSE.txt': '852e0e8699169bf9f6fdc6bda3e682d078dcbc738b5d33e74df594721bff271d'
};
for (const [file, hash] of Object.entries(originals)) {
  const bytes = readFileSync(new URL(`../vendor/home-journey/${file}`, import.meta.url));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), hash, `${file} was modified`);
}

const scene = readFileSync(new URL('../scene/house-scene.js', import.meta.url), 'utf8');
assert.ok(scene.includes('function buildHouseViewer(host)'), 'the viewer entry point must stay');
assert.ok(scene.includes('// Forest:'), 'the forest must be part of the scene');
assert.equal(scene.includes('0x5fc1c7'), false, 'no sea in the scene');
assert.equal(scene.includes('0x96a684'), false, 'the green island top must be gone');

// The new trades: one worker per new stop, welders with sparks, and every stop with its mobile framing.
const trades = readFileSync(new URL('../scene/trades-crew.js', import.meta.url), 'utf8');
assert.ok(trades.includes('function buildTradesCrew(scene)'), 'the trades crew entry point must exist');
assert.equal((trades.match(/^\s*\['[^']+', '[^']+'\],?$/gm) || []).length, journeyStops.length - 7, 'one message pair per new stop');
// The package electrician (crew index 6) plays the Electricidad stop, right after Gas.
assert.ok(scene.includes('const crew=[...base.slice(0,4),base[6],base[4],base[5],'), 'electricidad must use the package electrician');
assert.ok(trades.includes('sparks.push'), 'welders throw sparks');
assert.ok(scene.includes('buildTradesCrew(scene)'), 'the scene builds the new trades');
for (const name of ['mobileSpans', 'mobileHalfHeights']) {
  const values = scene.match(new RegExp(`const ${name}=\\[([^\\]]+)\\]`))?.[1].split(',') ?? [];
  assert.equal(values.length, journeyStops.length, `${name} needs one value per stop`);
}
const journeyComponent = readFileSync(new URL('../components/HomeJourney.astro', import.meta.url), 'utf8');
assert.ok(journeyComponent.includes('trades-crew.js?url'), 'the trades crew script is loaded');

// Page scroll passes straight to the sections below; the tour opens only on demand (tap on the house or a service).
const client = readFileSync(new URL('../scripts/home-journey.js', import.meta.url), 'utf8');
assert.equal(/addEventListener\('scroll'/.test(client), false, 'page scroll must not drive the journey');
assert.ok(client.includes("host.addEventListener('click'"), 'tapping the house opens the tour');
assert.ok(client.includes('hj-touring'), 'the page is locked while the tour is open');
assert.ok(journeyComponent.includes('id="enterTour"'), 'there is a visible button to open the tour');

console.log('home-journey data ok');
