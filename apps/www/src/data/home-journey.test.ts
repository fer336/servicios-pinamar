import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { journeyStops } from './home-journey.ts';

// S2: six services, in this order, and no Electricidad.
assert.deepEqual(
  journeyStops.map((stop) => stop.service),
  ['Pintura', 'Hidrolavado', 'Plomería', 'Gas', 'Fumigaciones', 'Jardinería y poda']
);
assert.equal(JSON.stringify(journeyStops).toLowerCase().includes('electric'), false);

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
assert.ok(scene.includes('0x2b9bb7'), 'the sea must be part of the scene');
assert.equal(scene.includes('0x96a684'), false, 'the green island top must be gone');

console.log('home-journey data ok');
