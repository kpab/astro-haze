import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

// Blog collection — Markdown content via the Content Layer glob loader
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    tags: z.array(z.string()).default([]),
    author: z.string().default('Anonymous'),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});

// Portfolio / Projects collection — Markdown content
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    description: z.string().optional(),
    cover: z.string(),
    coverAlt: z.string().optional(),
    images: z.array(z.string()).optional(),
    tech: z.array(z.string()),
    role: z.string(),
    year: z.number(),
    featured: z.boolean().default(false),
    links: z
      .object({
        live: z.url().optional(),
        github: z.url().optional(),
        case: z.string().optional(),
      })
      .optional(),
    client: z.string().optional(),
    duration: z.string().optional(),
  }),
});

// Landing page sections — data (JSON/YAML) via the Content Layer glob loader
const landing = defineCollection({
  loader: glob({ pattern: '**/*.{json,yaml,yml}', base: './src/content/landing' }),
  schema: z.object({
    hero: z.object({
      title: z.string(),
      subtitle: z.string(),
      description: z.string(),
      cta: z.object({
        primary: z.object({ text: z.string(), href: z.string() }),
        secondary: z.object({ text: z.string(), href: z.string() }).optional(),
      }),
      image: z.string().optional(),
    }),
    features: z
      .array(
        z.object({
          title: z.string(),
          description: z.string(),
          icon: z.string().optional(),
          image: z.string().optional(),
        })
      )
      .optional(),
    benefits: z
      .array(
        z.object({
          title: z.string(),
          description: z.string(),
          icon: z.string().optional(),
        })
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
          cta: z.object({ text: z.string(), href: z.string() }),
        })
      )
      .optional(),
    gallery: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string(),
          caption: z.string().optional(),
        })
      )
      .optional(),
    testimonials: z
      .array(
        z.object({
          name: z.string(),
          role: z.string(),
          company: z.string().optional(),
          content: z.string(),
          avatar: z.string().optional(),
          rating: z.number().min(1).max(5).optional(),
        })
      )
      .optional(),
    faq: z
      .array(z.object({ question: z.string(), answer: z.string() }))
      .optional(),
    finalCta: z
      .object({
        title: z.string(),
        description: z.string(),
        button: z.object({ text: z.string(), href: z.string() }),
      })
      .optional(),
  }),
});

// Team members — data (optional)
const team = defineCollection({
  loader: glob({ pattern: '**/*.{json,yaml,yml}', base: './src/content/team' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    bio: z.string(),
    avatar: z.string(),
    social: z
      .object({
        twitter: z.string().optional(),
        linkedin: z.string().optional(),
        github: z.string().optional(),
      })
      .optional(),
  }),
});

export const collections = { blog, projects, landing, team };
