import { existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineCollection, z } from 'astro:content';
import { glob, type Loader } from 'astro/loaders';

function hasMarkdownFiles(dir: string): boolean {
  if (!existsSync(dir)) {
    return false;
  }
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory() && hasMarkdownFiles(fullPath)) {
      return true;
    }
    if (entry.isFile() && /\.(md|mdx)$/i.test(entry.name)) {
      return true;
    }
  }
  return false;
}

function safeGlob(options: Parameters<typeof glob>[0]): Loader {
  const inner = glob(options);
  return {
    name: inner.name,
    load: async (context) => {
      await inner.load(context);
      const basePath = resolve(
        fileURLToPath(context.config.root),
        String(options.base ?? '.'),
      );
      if (!hasMarkdownFiles(basePath)) {
        context.store.clear();
      }
    },
  };
}

const libraryWorkSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  published: z.boolean(),
  theme: z.enum(['Daily Life', 'Business', 'Economy']),
  publishedAt: z.coerce.date().optional(),
});

export const collections = {
  playbooks: defineCollection({
    loader: safeGlob({
      pattern: '**/*.{md,mdx}',
      base: './src/content/playbooks',
    }),
    schema: libraryWorkSchema,
  }),
  essays: defineCollection({
    loader: safeGlob({
      pattern: '**/*.{md,mdx}',
      base: './src/content/essays',
    }),
    schema: libraryWorkSchema,
  }),
};
