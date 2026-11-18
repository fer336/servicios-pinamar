import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { intermediaryHeadline, intermediarySteps, intermediaryText } from './partner-copy.ts';
import { servicePages } from './service-pages.ts';

const wwwRoot = fileURLToPath(new URL('../../', import.meta.url));
const selfPath = fileURLToPath(import.meta.url);

// S1: the three new trade pages exist.
const slugs = servicePages.map((service) => service.slug as string);
for (const slug of ['herreria', 'durlock', 'carpinteria']) {
  assert.ok(slugs.includes(slug), `missing service page: ${slug}`);
}

// S6: herrería covers the user's list of works.
const herreria = servicePages.find((service) => service.slug === 'herreria');
const herreriaText = JSON.stringify(herreria).toLowerCase();
for (const term of ['rejas', 'perfil c', 'caño estructural', 'frentes', 'portones corredizos', 'elevadizos', 'parrillas', 'carteles']) {
  assert.ok(herreriaText.includes(term), `herrería page must mention "${term}"`);
}

// S9: no personal gas credential block remains on any service page.
for (const service of servicePages) {
  assert.equal('credential' in service, false, `${service.slug} still publishes a personal credential`);
}

// S7: the home states the intermediary model.
const home = readFileSync(join(wwwRoot, 'src/pages/index.astro'), 'utf8');
assert.equal(intermediaryHeadline, 'Menos llamados, más soluciones.');
assert.equal(intermediaryText, 'Centralizamos la consulta, el presupuesto y la coordinación. El profesional se ocupa de lo suyo.');
assert.deepEqual(intermediarySteps.map((step) => step.title), ['Consultás', 'Verificamos y conectamos', 'El profesional trabaja y responde por su trabajo']);
assert.ok(home.includes('{intermediaryHeadline}') && home.includes('{intermediaryText}'), 'home must render the intermediary band');
// The warranty belongs to the professional, never to Servicios Pinamar.
assert.equal(/garantizamos/i.test(home + JSON.stringify(intermediarySteps)), false);

// S1: llms.txt lists the new pages.
const llms = readFileSync(join(wwwRoot, 'public/llms.txt'), 'utf8');
for (const slug of ['herreria', 'durlock', 'carpinteria']) {
  assert.ok(llms.includes(`/servicios/${slug}/`), `llms.txt must list /servicios/${slug}/`);
}

// S8 + S9: no architect mention and no personal credential anywhere in the site sources.
const textExtensions = new Set(['.ts', '.tsx', '.js', '.astro', '.css', '.json', '.txt', '.md', '.svg', '.html']);
const skipDirs = new Set(['vendor', 'node_modules']);
const forbidden = [/soliz/i, /7040/, /3316-SG/i, /arquitect/i];

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return skipDirs.has(name) ? [] : walk(path);
    return textExtensions.has(extname(name)) ? [path] : [];
  });

const offenders = [...walk(join(wwwRoot, 'src')), ...walk(join(wwwRoot, 'public'))]
  .filter((path) => path !== selfPath)
  .flatMap((path) => {
    const source = readFileSync(path, 'utf8');
    return forbidden.filter((pattern) => pattern.test(source)).map((pattern) => `${path.slice(wwwRoot.length)} ${pattern}`);
  });
assert.deepEqual(offenders, []);

console.log('service-pages.test.ts: ok');
