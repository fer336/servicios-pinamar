import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

// Every service with works (all service pages except "planos") must be uploadable from the CMS and listed by the site gallery.
const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');
const slugs = [...read('../service-pages.ts').matchAll(/^ {4}slug: '([a-z-]+)'/gm)].map((match) => match[1]).filter((slug) => slug !== 'planos');
assert.ok(slugs.includes('herreria') && slugs.includes('durlock') && slugs.includes('carpinteria'));

const surfaces: Record<string, string> = {
  'www SERVICE_SLUG': read('./api.ts'),
  'www trabajos index': read('./index.ts'),
  'cms api': read('../../../../cms/src/lib/api.ts'),
  'www carousel labels': read('../../components/WorkCarousel.tsx'),
  'cms dashboard tabs': read('../../../../cms/src/components/Dashboard.tsx')
};
for (const slug of slugs) {
  for (const [name, text] of Object.entries(surfaces)) assert.match(text, new RegExp(`['"]${slug}['"]|\\b${slug}:`), `${slug} missing in ${name}`);
  assert.ok(existsSync(new URL(`./${slug}.json`, import.meta.url)), `${slug}.json missing`);
}
console.log('services sync ok');
