import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.serviciospinamar.com',
  integrations: [react(), sitemap()],
  output: 'static',
});
