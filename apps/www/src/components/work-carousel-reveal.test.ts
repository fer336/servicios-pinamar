import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// BaseLayout reveals [data-animate] elements with a one-shot querySelectorAll at page load.
// WorkCarousel renders cards client-side after fetching the API, so any card that is not in the
// prerendered HTML would never be observed and would stay at opacity 0 (invisible but clickable).
const source = readFileSync(new URL('./WorkCarousel.tsx', import.meta.url), 'utf8');

assert.equal(
  /\bdata-animate\b/.test(source),
  false,
  'WorkCarousel must not rely on the global [data-animate] reveal observer'
);
