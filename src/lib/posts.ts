import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** Words-per-minute used for the reading-time estimate. */
const WORDS_PER_MINUTE = 200;

/**
 * Estimate reading time (in whole minutes) from a Markdown body's word count.
 * Computed locally so the theme stays free of remark/rehype plugins.
 */
export function readingTime(body: string | undefined): number {
  const words = (body ?? '').split(/\s+/).filter(Boolean).length;
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

/** Unique tags across the given posts with their post counts, most-used first. */
export function collectTags(posts: Post[]): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** Posts carrying a given tag (case-insensitive). */
export function postsByTag(posts: Post[], tag: string): Post[] {
  const needle = tag.toLowerCase();
  return posts.filter((post) =>
    post.data.tags.some((t) => t.toLowerCase() === needle)
  );
}

/** A URL-safe slug for a tag (lowercase, non-alphanumerics collapsed to "-"). */
export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
