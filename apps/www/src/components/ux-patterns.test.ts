import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');
const css = read('../styles/global.css');
const header = read('./Header.astro');
const layout = read('../layouts/BaseLayout.astro');

// 1. Content is visible by default. The hidden "before reveal" state only exists when the IntersectionObserver
//    fallback is armed (html.js-reveal), so a failed or blocked script never leaves sections at opacity 0.
assert.equal(/(^|\})\s*\[data-animate\]\s*\{[^}]*opacity:\s*0/m.test(css), false, '[data-animate] must not be hidden by default');
assert.match(css, /html\.js-reveal \[data-animate\]:not\(\.is-visible\)\{opacity:0/, 'hidden state must be scoped to the js-reveal fallback');
// Native scroll-driven reveal, feature-detected with the entry range and only without a reduced-motion preference.
assert.match(css, /@media \(prefers-reduced-motion:no-preference\)\{@supports \(\(animation-timeline:view\(\)\) and \(animation-range:entry\)\)/);
assert.match(css, /animation-timeline:view\(\)/);
// The fallback is armed in <head> only when scroll-driven animations are missing and motion is allowed.
assert.match(layout, /CSS\.supports\('\(animation-timeline: view\(\)\) and \(animation-range: entry\)'\)/);
assert.match(layout, /prefers-reduced-motion: no-preference/);
assert.match(layout, /classList\.add\('js-reveal'\)/);

// 2. Navigation: every link reachable at every width. No link is hidden between 761px and 1050px.
assert.equal(/nav a:nth-last-child\(-n\+2\)\{display:none\}/.test(css), false, 'nav links must not be hidden on tablets');
// The collapsed menu is a native popover (Esc and outside tap close it), opened declaratively by the button.
assert.match(header, /id="main-menu"[^>]*popover="auto"/);
assert.match(header, /popovertarget="main-menu"/);
assert.equal(/aria-expanded/.test(header), false, 'popovertarget exposes the expanded state natively');

// 3. Touch targets: at least 44px on coarse pointers for the menu, nav and footer links.
assert.match(css, /@media \(pointer:coarse\)\{:root\{--target-size:44px\}\}/);
assert.match(css, /\.menu-button\{[^}]*min-inline-size:44px;min-block-size:44px/);
assert.match(css, /:where\(\.nav-menu a,\.footer-grid a\)\{min-block-size:var\(--target-size\)/);

// 4. Typography: balanced headings, no orphans in body text.
assert.match(css, /:where\(h1,h2,h3\)\{text-wrap:balance\}/);
assert.match(css, /:where\(p,li\)\{text-wrap:pretty\}/);

console.log('ux-patterns.test.ts: ok');
