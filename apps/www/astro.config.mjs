import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.serviciospinamar.com',
  integrations: [react(), sitemap({ customPages: ['https://www.serviciospinamar.com/trabajos/'] })],
  // Static build: all pages are prerendered at build time into dist/ (flat structure
  // served by nginx). /trabajos reads the API during the build via PUBLIC_API_BASE_URL
  // (defined in src/data/trabajos/api.ts): dev default http://localhost:8000,
  // production default https://cms.serviciospinamar.com.
  output: 'static',
});
