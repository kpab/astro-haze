import type { HastPluginDefinition } from 'satteri';
import { classifyHref, withBaseOf } from './url';

// Attributes that hold a single URL. Markdown itself only produces `a[href]`
// and `img[src]`; the rest cover elements an MDX body can render directly.
//
// Multi-URL attributes (`srcset`) are deliberately left alone: they only appear
// in hand-written markup, and a half-rewritten candidate list is worse than an
// untouched one.
const URL_ATTRIBUTES: Record<string, readonly string[]> = {
  a: ['href'],
  area: ['href'],
  audio: ['src'],
  embed: ['src'],
  iframe: ['src'],
  img: ['src'],
  object: ['data'],
  source: ['src'],
  track: ['src'],
  video: ['src', 'poster'],
};

/**
 * Prefix root-relative URLs in Markdown bodies with the configured base.
 *
 * Astro applies `base` to imported assets and `Astro.url`, but not to a URL an
 * author types into a body. On a project site — say `/astro-haze/` —
 * `[archive](/work/)` therefore renders as `href="/work/"`, which resolves
 * against the origin root and 404s.
 *
 * Only root-relative values are touched. External URLs, relative paths, anchors
 * and `mailto:` links are left exactly as written, and the prefixing is
 * idempotent, so an already-prefixed path passes through unchanged. The
 * classification comes from `classifyHref()` — the same function `withBase()`
 * and the content-collection validators use — so a URL cannot be judged one way
 * here and another way at render time.
 *
 * The base is a parameter rather than `import.meta.env.BASE_URL`: this plugin is
 * constructed from `astro.config`, which sits outside the app's module graph,
 * where that value is still the default `/`.
 *
 * Raw HTML blocks in `.md` are left alone — Sätteri keeps them as raw nodes
 * instead of parsing them into elements, so no attribute is ever visited there.
 */
export default function satteriBaseUrls(base: string): HastPluginDefinition {
  return {
    name: 'astro-haze:base-urls',
    element: {
      filter: Object.keys(URL_ATTRIBUTES),
      visit(node, ctx) {
        const attributes = URL_ATTRIBUTES[node.tagName];
        if (!attributes) return;
        for (const attribute of attributes) {
          const value = node.properties?.[attribute];
          if (typeof value !== 'string') continue;
          if (classifyHref(value) !== 'absolute') continue;
          ctx.setProperty(node, attribute, withBaseOf(base, value));
        }
      },
    },
  };
}
