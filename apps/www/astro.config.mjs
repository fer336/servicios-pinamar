import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.serviciospinamar.com',
  integrations: [react(), sitemap({ customPages: ['https://www.serviciospinamar.com/trabajos/'] })],
  // Hybrid: static by default, on-demand SSR for pages marked
  // `export const prerender = false` (e.g. /trabajos, which reads the live API).
  // Note: Astro >=5.18 removed the `output: 'hybrid'` option; `output: 'static'`
  // with an adapter configured behaves the same way.
  // Pages that hit the API resolve its URL via PUBLIC_API_BASE_URL (defined in
  // src/data/trabajos/api.ts): dev default http://localhost:8000, production
  // default https://cms.serviciospinamar.com.
  output: 'static',
  adapter: node({ mode: 'standalone' }),
});
