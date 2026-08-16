import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { getPublishedPosts } from '@/lib/posts';
import { renderOgImage } from '@/lib/og';

/**
 * Social cards, one per post and case study, rendered at build time.
 *
 * The path is derived from the entry id alone, so the URL a platform scraped
 * last month still resolves after a rebuild. Pointing `og:image` at the hero
 * image instead — as the detail pages used to — meant a content-hashed
 * `_astro/…` URL that changed on every build and threw away the cached
 * preview each time.
 */
export async function getStaticPaths() {
  const posts = await getPublishedPosts();
  const projects = await getCollection('projects');

  return [
    ...posts.map((post) => ({
      params: { slug: `blog/${post.id}` },
      props: { title: post.data.title, eyebrow: 'Article' },
    })),
    ...projects.map((project) => ({
      params: { slug: `work/${project.id}` },
      props: { title: project.data.title, eyebrow: 'Case study' },
    })),
  ];
}

export async function GET(context: APIContext) {
  const { title, eyebrow } = context.props as {
    title: string;
    eyebrow: string;
  };

  return new Response(await renderOgImage({ title, eyebrow }), {
    headers: { 'Content-Type': 'image/png' },
  });
}
