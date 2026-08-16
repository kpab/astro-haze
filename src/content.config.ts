import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';
import { classifyHref } from '@/lib/url';

// A blank value is never a usable URL: `href=""` reloads the page and `src=""`
// re-requests it, both without a word of warning. Surrounding whitespace is
// trimmed off rather than carried into the markup.
const nonBlank = z.string().trim().min(1, { message: 'Must not be empty' });

// Values rendered into `href`. Every shape withBase() can resolve is accepted —
// URLs, root-relative and relative paths, anchors, mailto:/tel: — so the schema
// never rejects content the renderer handles. Only scheme-based injection
// (javascript:, data:, …) is turned away.
const href = nonBlank.refine((v) => classifyHref(v) !== 'unsafe', {
  message:
    'Must be an http(s) URL, a path, an anchor (#…), or a mailto:/tel: link',
});

// Values rendered into `<img src>`. Anchors and mailto:/tel: can never resolve
// to an image, so they are rejected on top of the href rules.
const imageSrc = nonBlank.refine(
  (v) => {
    const kind = classifyHref(v);
    return kind === 'external' || kind === 'absolute' || kind === 'relative';
  },
  { message: 'Must be an http(s) URL or a path to an image file' },
);

// Blog collection — Markdown content via the Content Layer glob loader.
// `image()` runs hero images through astro:assets (AVIF/WebP + responsive
// srcset). Frontmatter paths are resolved relative to the Markdown file.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: image().optional(),
      heroImageAlt: z.string().optional(),
      tags: z.array(z.string()).default([]),
      author: z.string().default('Anonymous'),
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
    }),
});

// Portfolio / Projects collection — Markdown content. Cover and gallery
// images go through astro:assets via `image()`.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      description: z.string().optional(),
      cover: image(),
      coverAlt: z.string().optional(),
      // A bare path (alt is auto-generated) or { src, alt } for a custom alt.
      // Both are normalized to { src, alt? } so every consumer sees one shape.
      images: z
        .array(
          z.preprocess(
            (v) => (typeof v === 'string' ? { src: v } : v),
            z.object({ src: image(), alt: z.string().min(1).optional() }),
          ),
        )
        .optional(),
      tech: z.array(z.string()),
      role: z.string(),
      // Four digits — catches a mistyped magnitude without ruling out the
      // retrospective work people legitimately list.
      year: z
        .number()
        .int()
        .min(1000, { message: 'Must be a four-digit year' })
        .max(9999, { message: 'Must be a four-digit year' }),
      featured: z.boolean().default(false),
      links: z
        .object({
          live: z.url().optional(),
          github: z.url().optional(),
          case: href.optional(),
        })
        .optional(),
      client: z.string().optional(),
      duration: z.string().optional(),
    }),
});

// Landing page sections — data (JSON/YAML) via the Content Layer glob loader
const landing = defineCollection({
  loader: glob({
    pattern: '**/*.{json,yaml,yml}',
    base: './src/content/landing',
  }),
  schema: z.object({
    hero: z.object({
      title: z.string(),
      subtitle: z.string(),
      description: z.string(),
      cta: z.object({
        primary: z.object({ text: z.string(), href }),
        secondary: z.object({ text: z.string(), href }).optional(),
      }),
      image: imageSrc.optional(),
    }),
    features: z
      .array(
        z.object({
          title: z.string(),
          description: z.string(),
          icon: z.string().optional(),
          image: imageSrc.optional(),
        }),
      )
      .optional(),
    benefits: z
      .array(
        z.object({
          title: z.string(),
          description: z.string(),
          icon: z.string().optional(),
        }),
      )
      .optional(),
    pricing: z
      .array(
        z.object({
          name: z.string(),
          price: z.string(),
          period: z.string().optional(),
          description: z.string(),
          features: z.array(z.string()),
          highlighted: z.boolean().default(false),
          cta: z.object({ text: z.string(), href }),
        }),
      )
      .optional(),
    gallery: z
      .array(
        z.object({
          src: imageSrc,
          // Empty alt would silently demote a content image to decorative.
          alt: z.string().min(1),
          caption: z.string().optional(),
        }),
      )
      .optional(),
    testimonials: z
      .array(
        z.object({
          name: z.string(),
          role: z.string(),
          company: z.string().optional(),
          content: z.string(),
          avatar: imageSrc.optional(),
          rating: z.number().min(1).max(5).optional(),
        }),
      )
      .optional(),
    faq: z
      .array(z.object({ question: z.string(), answer: z.string() }))
      .optional(),
    finalCta: z
      .object({
        title: z.string(),
        description: z.string(),
        button: z.object({ text: z.string(), href }),
      })
      .optional(),
  }),
});

export const collections = { blog, projects, landing };
