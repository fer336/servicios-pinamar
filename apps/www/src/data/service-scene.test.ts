import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { sceneModes } from './service-scene.ts';
import { servicePages } from './service-pages.ts';

// The home 3D scene offers exactly the four on-site services, in this order.
assert.deepEqual(sceneModes.map((mode) => mode.id), ['pintura', 'hidrolavado', 'plomeria', 'gas']);

for (const mode of sceneModes) {
  // Each mode links to its existing service page.
  assert.equal(mode.href, `/servicios/${mode.id}/`);
  assert.ok(servicePages.some((page) => page.slug === mode.id), `missing service page for ${mode.id}`);
  // The fallback image is shown before the scene loads and when WebGL is unavailable.
  assert.ok(existsSync(new URL(`../../public${mode.fallbackImage}`, import.meta.url)), `missing ${mode.fallbackImage}`);
  assert.ok(mode.label && mode.title && mode.description, `incomplete copy for ${mode.id}`);
}

// three.js must stay out of the initial bundle: only a dynamic import is allowed.
const sceneSource = readFileSync(new URL('../components/ServiceScene.tsx', import.meta.url), 'utf8');
assert.match(sceneSource, /import\(\s*['"]three['"]\s*\)/, 'ServiceScene must load three with a dynamic import');
assert.equal(/^import\s+(?!type\b)[^;]*from\s+['"]three['"]/m.test(sceneSource), false, 'no static value import of three');

// The home mounts the island lazily and every "Ver en 3D" link targets a known mode.
const homeSource = readFileSync(new URL('../pages/index.astro', import.meta.url), 'utf8');
assert.match(homeSource, /<ServiceScene[^>]*client:visible/, 'ServiceScene must hydrate with client:visible');
const cardModes = [...homeSource.matchAll(/sceneMode: '([a-z]+)'/g)].map((match) => match[1]);
assert.deepEqual(cardModes, sceneModes.map((mode) => mode.id), 'every service card links to its scene mode');
const cardSource = readFileSync(new URL('../components/ServiceCard.astro', import.meta.url), 'utf8');
assert.match(cardSource, /data-scene-mode=\{sceneMode\}/, 'ServiceCard renders the "Ver en 3D" link');
