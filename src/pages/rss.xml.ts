import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedPosts } from '@/lib/posts';
import { withBase } from '@/lib/url';
import siteConfig, { resolvedOgLocale } from '@/site.config';

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();

  // context.site is astro.config's `site` (no base). @astrojs/rss uses this
  // for the channel <link>, so the base must be appended here or the feed's
  // homepage points at the origin root instead of the project site.
  const site = context.site
    ? new URL(import.meta.env.BASE_URL, context.site)
    : siteConfig.url;

  return rss({
    title: `${siteConfig.name} — Blog`,
    description: siteConfig.description,
    site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: withBase(`/blog/${post.id}/`),
      categories: post.data.tags,
      author: post.data.author,
    })),
    customData: `<language>${resolvedOgLocale.toLowerCase().replace('_', '-')}</language>`,
  });
}
