import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const prototypes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/prototypes' }),
  schema: z.object({
    title: z.string().min(1),
    summary: z.string().min(1),
    published: z.boolean(),
    order: z.number().int(),
    featured: z.boolean(),
    scope: z.enum(['AI Craft', 'Nigeria / Africa']),
    repoUrl: z.string().url().optional(),
    demoUrl: z.string().url().optional(),
  }),
});

export const collections = { prototypes };
