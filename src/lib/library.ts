import { getCollection, type CollectionEntry } from 'astro:content';

export const THEMES = ['Daily Life', 'Business', 'Economy'] as const;
export type Theme = (typeof THEMES)[number];

export const THEME_SLUGS = {
  'Daily Life': 'daily-life',
  Business: 'business',
  Economy: 'economy',
} as const satisfies Record<Theme, string>;

export type ThemeSlug = (typeof THEME_SLUGS)[Theme];

const SLUG_TO_THEME: Record<ThemeSlug, Theme> = {
  'daily-life': 'Daily Life',
  business: 'Business',
  economy: 'Economy',
};

export function themeToSlug(theme: Theme): ThemeSlug {
  return THEME_SLUGS[theme];
}

export function slugToTheme(slug: string): Theme | undefined {
  return SLUG_TO_THEME[slug as ThemeSlug];
}

export type LibraryWork =
  | {
      kind: 'Playbook';
      slug: string;
      href: string;
      title: string;
      summary: string;
      theme: Theme;
      themeSlug: ThemeSlug;
      publishedAt?: Date;
      entry: CollectionEntry<'playbooks'>;
    }
  | {
      kind: 'Essay';
      slug: string;
      href: string;
      title: string;
      summary: string;
      theme: Theme;
      themeSlug: ThemeSlug;
      publishedAt?: Date;
      entry: CollectionEntry<'essays'>;
    };

function mapPlaybook(entry: CollectionEntry<'playbooks'>): LibraryWork {
  return {
    kind: 'Playbook',
    slug: entry.id,
    href: `/library/playbooks/${entry.id}`,
    title: entry.data.title,
    summary: entry.data.summary,
    theme: entry.data.theme,
    themeSlug: themeToSlug(entry.data.theme),
    publishedAt: entry.data.publishedAt,
    entry,
  };
}

function mapEssay(entry: CollectionEntry<'essays'>): LibraryWork {
  return {
    kind: 'Essay',
    slug: entry.id,
    href: `/library/essays/${entry.id}`,
    title: entry.data.title,
    summary: entry.data.summary,
    theme: entry.data.theme,
    themeSlug: themeToSlug(entry.data.theme),
    publishedAt: entry.data.publishedAt,
    entry,
  };
}

function compareWork(a: LibraryWork, b: LibraryWork): number {
  const timeA = a.publishedAt ? a.publishedAt.getTime() : -Infinity;
  const timeB = b.publishedAt ? b.publishedAt.getTime() : -Infinity;
  if (timeA !== timeB) {
    return timeB - timeA;
  }
  return a.title.localeCompare(b.title);
}

export async function getPublishedLibraryWork(theme?: Theme): Promise<LibraryWork[]> {
  const [playbooks, essays] = await Promise.all([
    getCollection('playbooks', ({ data }) => data.published),
    getCollection('essays', ({ data }) => data.published),
  ]);

  const combined: LibraryWork[] = [
    ...playbooks.map(mapPlaybook),
    ...essays.map(mapEssay),
  ].sort(compareWork);

  if (!theme) {
    return combined;
  }
  return combined.filter((item) => item.theme === theme);
}

export async function hasLibraryWork(): Promise<boolean> {
  const [playbooks, essays] = await Promise.all([
    getCollection('playbooks', ({ data }) => data.published),
    getCollection('essays', ({ data }) => data.published),
  ]);
  return playbooks.length + essays.length > 0;
}

export function formatWorkDate(date?: Date): string | undefined {
  if (!date) return undefined;
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
