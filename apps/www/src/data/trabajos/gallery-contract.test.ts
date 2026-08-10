import assert from 'node:assert/strict';
import { getLocalTrabajosPage, normalizeServiceFilter, SERVICE_SLUGS } from './api';

const allServices = [...SERVICE_SLUGS].sort();
assert.deepEqual(allServices, ['gas', 'hidrolavado', 'pintura', 'plomeria']);

assert.equal(normalizeServiceFilter('hidrolavado'), 'hidrolavado');
assert.equal(normalizeServiceFilter('no-existe'), undefined);
assert.equal(normalizeServiceFilter(null), undefined);

const hidrolavadoPage = getLocalTrabajosPage({ page: 1, limit: 12, service: 'hidrolavado' });
assert.ok(hidrolavadoPage.items.length > 0);
assert.ok(hidrolavadoPage.items.every((item) => item.service === 'hidrolavado'));
assert.ok(hidrolavadoPage.items.every((item) => item.images.length >= 1));

const allPage = getLocalTrabajosPage({ page: 1, limit: 20 });
const servicesInAllPage = new Set(allPage.items.map((item) => item.service));
assert.equal(servicesInAllPage.has('gas'), true);
assert.equal(servicesInAllPage.has('plomeria'), true);
assert.equal(servicesInAllPage.has('pintura'), true);
assert.equal(servicesInAllPage.has('hidrolavado'), true);

const firstWork = allPage.items[0];
assert.equal(firstWork.imageUrl, firstWork.images[0].imageUrl);
assert.equal(firstWork.thumbnailUrl, firstWork.images[0].thumbnailUrl);
assert.equal(firstWork.alt, firstWork.images[0].alt);
