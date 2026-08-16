import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';
import { render } from 'astro:content';
import { getContainerRenderer as mdxContainerRenderer } from '@astrojs/mdx/container-renderer';
import sanitizeHtml from 'sanitize-html';
import { getPublishedPosts } from '@/lib/posts';
import { withBase } from '@/lib/url';
import siteConfig, { resolvedOgLocale } from '@/site.config';

// Tags a feed reader can be expected to render. Everything outside this list is
// dropped: <script>/<style> because a feed is untrusted input downstream, and
// Astro's own wrappers because they carry no meaning outside the page.
const ALLOWED_TAGS = [
  'p',
  'br',
  'hr',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'strong',
  'em',
  'del',
  'sub',
  'sup',
  'blockquote',
  'ul',
  'ol',
  'li',
  'a',
  'img',
  'figure',
  'figcaption',
  'picture',
  'source',
  'pre',
  'code',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
  'section',
];

const ALLOWED_ATTRIBUTES: sanitizeHtml.IOptions['allowedAttributes'] = {
  a: ['href', 'title'],
  img: ['src', 'alt', 'title', 'width', 'height', 'srcset', 'sizes'],
  source: ['srcset', 'sizes', 'type'],
  th: ['colspan', 'rowspan', 'scope'],
  td: ['colspan', 'rowspan'],
  code: ['class'], // language-* survives so readers can highlight
};

/**
 * Resolve a URL found in post HTML against the feed's own origin.
 *
 * A feed item is read outside the site, so a root-relative `/astro-haze/…` or a
 * document-relative `./diagram.png` resolves against whatever host the reader
 * is on. Anchors are dropped entirely rather than made absolute: an in-page
 * `#heading` link points at the article page, not at the feed entry.
 */
function absolutize(value: string, base: URL): string | undefined {
  if (value.startsWith('#')) return undefined;
  try {
    return new URL(value, base).href;
  } catch {
    return undefined;
  }
}

/** Rewrite the URL-bearing attributes of one tag to absolute form. */
function absolutizeAttributes(
  attribs: Record<string, string>,
  base: URL,
): Record<string, string> {
  const next = { ...attribs };
  for (const key of ['href', 'src'] as const) {
    const raw = next[key];
    if (!raw) continue;
    const resolved = absolutize(raw, base);
    if (resolved) next[key] = resolved;
    else delete next[key];
  }
  // srcset is a comma-separated list of "url descriptor" pairs.
  for (const key of ['srcset'] as const) {
    const raw = next[key];
    if (!raw) continue;
    const rewritten = raw
      .split(',')
      .map((candidate) => {
        const [url, ...descriptors] = candidate.trim().split(/\s+/);
        if (!url) return undefined;
        const resolved = absolutize(url, base);
        return resolved ? [resolved, ...descriptors].join(' ') : undefined;
      })
      .filter((candidate): candidate is string => Boolean(candidate));
    if (rewritten.length) next[key] = rewritten.join(', ');
    else delete next[key];
  }
  return next;
}

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();

  // context.site is astro.config's `site` (no base). @astrojs/rss uses this
  // for the channel <link>, so the base must be appended here or the feed's
  // homepage points at the origin root instead of the project site.
  const site = context.site
    ? new URL(import.meta.env.BASE_URL, context.site)
    : siteConfig.url;
  const siteUrl = new URL(site);

  // The stored `rendered.html` still holds astro:assets placeholders for images
  // in the body, so rendering the entry's Content component is what produces
  // the same optimized markup the page itself serves.
  //
  // The MDX renderer has to be handed over explicitly: a bare container knows
  // how to render `.md` but throws NoMatchingRenderer on the first `.mdx` post,
  // and the blog glob accepts both.
  const container = await AstroContainer.create({
    renderers: await loadRenderers([mdxContainerRenderer()]),
  });

  const items = await Promise.all(
    posts.map(async (post) => {
      const link = withBase(`/blog/${post.id}/`);
      const { Content } = await render(post);
      const html = await container.renderToString(Content);
      const base = new URL(link, siteUrl);

      return {
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.pubDate,
        link,
        categories: post.data.tags,
        author: post.data.author,
        content: sanitizeHtml(html, {
          allowedTags: ALLOWED_TAGS,
          allowedAttributes: ALLOWED_ATTRIBUTES,
          transformTags: {
            '*': (tagName, attribs) => ({
              tagName,
              attribs: absolutizeAttributes(attribs, base),
            }),
          },
        }),
      };
    }),
  );

  return rss({
    title: `${siteConfig.name} — Blog`,
    description: siteConfig.description,
    site,
    items,
    customData: `<language>${resolvedOgLocale.toLowerCase().replace('_', '-')}</language>`,
  });
}
