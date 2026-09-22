import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { whatsapp, whatsappMessage, whatsappNumber } from './service-pages.ts';

const CONTACT_URL = 'https://wa.me/5492254423359';

// Every contact CTA routes to the single business number.
assert.ok(whatsapp.startsWith(`${CONTACT_URL}?text=`));
assert.equal(whatsappNumber, CONTACT_URL);
assert.equal(/guido/i.test(whatsappMessage('gas')), false, 'message must not greet a specific technician');

const schemaSource = readFileSync(new URL('../layouts/BaseLayout.astro', import.meta.url), 'utf8');
assert.equal(schemaSource.includes("telephone: '+54 9 2254 42-3359'"), true);
assert.equal(/2267 52-1448|5492267521448|5492267416252/.test(schemaSource), false);
