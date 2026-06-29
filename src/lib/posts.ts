import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** Words-per-minute used for the reading-time estimate. */
const WORDS_PER_MINUTE = 200;

/**
 * Estimate reading time (in whole minutes) from a Markdown body's word count.
 * Computed locally so the theme stays free of remark/rehype plugins.
 *
 * Returns 0 when there's no body text — notably for `.mdx` entries, whose
 * `body` is undefined — so callers can hide the estimate rather than print a
 * misleading "1 min read".
 */
export function readingTime(body: string | undefined): number {
  const words = (body ?? '').split(/\s+/).filter(Boolean).length;
  if (words === 0) return 0;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

/**
 * All non-draft blog posts, newest first. Drafts are visible in `astro dev`
 * but excluded from production builds.
 */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) =>
    import.meta.env.PROD ? data.draft !== true : true
  );
  return posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
}

/**
 * Given a newest-first list, find the chronologically newer/older neighbours
 * of the post with `id` for prev/next navigation.
 */
export function getAdjacentPosts(posts: Post[], id: string) {
  const index = posts.findIndex((p) => p.id === id);
  return {
    newer: index > 0 ? posts[index - 1] : undefined,
    older:
      index >= 0 && index < posts.length - 1 ? posts[index + 1] : undefined,
  };
}

/** A URL-safe slug for a tag (lowercase, non-alphanumerics collapsed to "-"). */
export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Unique tags grouped by slug, most-used first. Tags that share a slug
 * (case/punctuation variants like "Astro" and "astro") are merged into one
 * entry with a representative display label and a combined post count; tags
 * that slugify to an empty string (e.g. "★") are dropped so they can't produce
 * a `/tags/` route or a duplicate getStaticPaths param.
 */
export function collectTags(
  posts: Post[]
): { tag: string; slug: string; count: number }[] {
  const bySlug = new Map<string, { tag: string; count: number }>();
  for (const post of posts) {
    // Count each slug at most once per post.
    const seen = new Set<string>();
    for (const raw of post.data.tags) {
      const slug = tagSlug(raw);
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);
      const existing = bySlug.get(slug);
      if (existing) existing.count += 1;
      else bySlug.set(slug, { tag: raw, count: 1 });
    }
  }
  return [...bySlug.entries()]
    .map(([slug, { tag, count }]) => ({ tag, slug, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** Posts carrying any tag that resolves to the given slug. */
export function postsByTag(posts: Post[], slug: string): Post[] {
  return posts.filter((post) =>
    post.data.tags.some((t) => tagSlug(t) === slug)
  );
}
