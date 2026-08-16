import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import pagefind from 'astro-pagefind';
import siteConfig from './src/site.config.ts';
import { satteri } from '@astrojs/markdown-satteri';
import satteriBaseUrls from './src/lib/satteri-base-urls.ts';

// Served from a GitHub Pages project site: https://kpab.github.io/astro-haze/
const SITE = 'https://kpab.github.io';
const BASE = '/astro-haze';
const BLOG_DIR = 'src/content/blog';

/** Every Markdown/MDX file under `dir`, as paths relative to it. */
function listEntries(dir) {
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((e) => e.isFile() && /\.mdx?$/.test(e.name))
    .map((e) => relative(dir, join(e.parentPath, e.name)));
}

/** The value of a single frontmatter key, or undefined when it isn't set. */
function frontmatterValue(source, key) {
  const block = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source);
  if (!block) return undefined;
  const match = new RegExp(`^${key}:\\s*(.+)$`, 'm').exec(block[1]);
  return match?.[1].trim().replace(/^['"]|['"]$/g, '');
}

/**
 * `lastmod` per blog URL, keyed by pathname.
 *
 * astro.config runs outside the Astro module graph, so `astro:content` — and
 * with it the parsed collection — isn't importable here. The two date fields
 * are read straight from the frontmatter instead; anything unparseable is
 * skipped so a bad date costs that page its `lastmod` rather than the build.
 *
 * Projects deliberately get no entry: their schema carries `year` only, and a
 * year is too coarse to claim as a modification timestamp.
 */
function blogLastmod() {
  const prefix = `${BASE}/blog/`.replace(/\/+/g, '/');
  const map = new Map();
  for (const file of listEntries(BLOG_DIR)) {
    const source = readFileSync(join(BLOG_DIR, file), 'utf8');
    const raw =
      frontmatterValue(source, 'updatedDate') ??
      frontmatterValue(source, 'pubDate');
    const date = raw ? new Date(raw) : undefined;
    if (!date || Number.isNaN(date.valueOf())) continue;
    const id = file.replace(/\.mdx?$/, '').replaceAll('\\', '/');
    map.set(`${prefix}${id}/`, date.toISOString());
  }
  return map;
}

const LASTMOD = blogLastmod();

// https://astro.build/config
export default defineConfig({
  site: SITE,
  base: BASE,
  // MDX is always enabled so `.mdx` files in the content collections render
  // (the blog/projects globs already accept them). Sitemap and Pagefind are
  // gated by their `features` flags in site.config. Pagefind indexes the
  // static output on build and serves the prebuilt index during `astro dev`
  // (run a build once to generate it).
  integrations: [
    mdx(),
    ...(siteConfig.features.sitemap
      ? [
          sitemap({
            serialize(item) {
              const lastmod = LASTMOD.get(new URL(item.url).pathname);
              return lastmod ? { ...item, lastmod } : item;
            },
          }),
        ]
      : []),
    ...(siteConfig.features.search ? [pagefind()] : []),
  ],
  output: 'static',
  // GitHub Pages 301-redirects slash-less directory requests to the
  // trailing-slash form, so internal links must match to avoid a redirect
  // hop and a canonical/link mismatch.
  trailingSlash: 'always',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      cssMinify: true,
    },
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
    format: ['avif', 'webp'],
  },
  // Markdown is handled by Sätteri (Astro 7 default). GFM — tables, task
  // lists, footnotes — is on out of the box, so the processor is named here
  // only to extend its hast pass with the plugin that applies `base` to
  // root-relative URLs an author writes in a body, which Astro otherwise
  // passes through untouched. MDX inherits this config, so `.mdx` bodies get
  // the same treatment.
  markdown: {
    processor: satteri({ hastPlugins: [satteriBaseUrls(BASE)] }),
  },
  server: {
    port: 3000,
    host: true,
  },
  devToolbar: {
    enabled: true,
  },
});
