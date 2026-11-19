import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { blogPosts } from './blog-posts.ts';

// User: "si, pero debes usar infomracion veraz no inventarla" — every new note cites the sources its facts come from.
const bySlug = (slug: string) => blogPosts.find((post) => post.slug === slug) as any;
const newPosts = ['mosquitos-pinamar-cuando-fumigar', 'permiso-poda-pinos-pinamar'];

for (const slug of newPosts) {
  const post = bySlug(slug);
  assert.ok(post, `missing blog post: ${slug}`);
  assert.match(post.h1, /Pinamar/, `${slug}: h1 must name Pinamar`);
  assert.ok(post.description.length <= 165, `${slug}: description too long (${post.description.length})`);
  assert.ok(post.sources?.length >= 2, `${slug}: needs at least two sources`);
  for (const source of post.sources) assert.match(source.href, /^https:\/\//, `${slug}: source must be an https link`);
}

const text = (slug: string) => JSON.stringify(bySlug(slug));
// Mosquitos: facts from the provincial health ministry and Pinamar's Zoonosis office.
assert.match(text('mosquitos-pinamar-cuando-fumigar'), /Tapá, lavá, tirá y girá/);
assert.match(text('mosquitos-pinamar-cuando-fumigar'), /menos de 10 días/);
assert.match(text('mosquitos-pinamar-cuando-fumigar'), /Zoonosis/);
// Poda: Decreto 1292/2024, who authorizes, the Cariló 25% cap from the municipal form.
assert.match(text('permiso-poda-pinos-pinamar'), /Decreto 1292\/2024/);
assert.match(text('permiso-poda-pinos-pinamar'), /Dirección de Obras Particulares/);
assert.match(text('permiso-poda-pinos-pinamar'), /25 ?%/);

// The post template renders the sources list.
const template = readFileSync(fileURLToPath(new URL('../pages/blog/[slug].astro', import.meta.url)), 'utf8');
assert.match(template, /post\.sources/, 'blog template must render post.sources');

console.log('blog-posts.test.ts: ok');
