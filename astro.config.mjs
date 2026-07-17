import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import pagefind from 'astro-pagefind';
import siteConfig from './src/site.config.ts';

// https://astro.build/config
export default defineConfig({
  // Served from a GitHub Pages project site: https://kpab.github.io/astro-haze/
  site: 'https://kpab.github.io',
  base: '/astro-haze',
  // MDX is always enabled so `.mdx` files in the content collections render
  // (the blog/projects globs already accept them). Sitemap and Pagefind are
  // gated by their `features` flags in site.config. Pagefind indexes the
  // static output on build and serves the prebuilt index during `astro dev`
  // (run a build once to generate it).
  integrations: [
    mdx(),
    ...(siteConfig.features.sitemap ? [sitemap()] : []),
    ...(siteConfig.features.search ? [pagefind()] : [])
  ],
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