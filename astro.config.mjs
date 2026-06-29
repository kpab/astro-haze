import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import siteConfig from './src/site.config.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://astro-haze.pages.dev',
  // MDX is always enabled so `.mdx` files in the content collections render
  // (the blog/projects globs already accept them). Sitemap is gated by the
  // `features.sitemap` flag in site.config.
  integrations: [mdx(), ...(siteConfig.features.sitemap ? [sitemap()] : [])],
  output: 'static',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto'
  },
  vite: {
    build: {
      cssMinify: true
    }
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    },
    format: ['avif', 'webp']
  },
  // Markdown is handled by Sätteri (Astro 7 default). GFM — tables, task
  // lists, footnotes — is enabled out of the box, so no config is needed.
  server: {
    port: 3000,
    host: true
  },
  devToolbar: {
    enabled: true
  }
});