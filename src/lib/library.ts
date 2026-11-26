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

type LibraryCollection = 'playbooks' | 'essays';
type LibraryKind = 'Playbook' | 'Essay';

const KIND_BY_COLLECTION: Record<LibraryCollection, LibraryKind> = {
  playbooks: 'Playbook',
  essays: 'Essay',
};

export type LibraryWork = {
  [K in LibraryCollection]: {
    kind: (typeof KIND_BY_COLLECTION)[K];
    slug: string;
    href: string;
    title: string;
    summary: string;
    theme: Theme;
    themeSlug: ThemeSlug;
    entry: CollectionEntry<K>;
  };
}[LibraryCollection];

function mapLibraryWork<K extends LibraryCollection>(
  collection: K,
  entry: CollectionEntry<K>,
): LibraryWork {
  return {
    kind: KIND_BY_COLLECTION[collection],
    slug: entry.id,
    href: `/library/${collection}/${entry.id}`,
    title: entry.data.title,
    summary: entry.data.summary,
    theme: entry.data.theme,
    themeSlug: themeToSlug(entry.data.theme),
    entry,
  } as LibraryWork;
}

async function fetchPublishedCollections() {
  const [playbooks, essays] = await Promise.all([
    getCollection('playbooks', ({ data }) => data.published),
    getCollection('essays', ({ data }) => data.published),
  ]);
  return { playbooks, essays };
}

function compareWork(a: LibraryWork, b: LibraryWork): number {
  return a.title.localeCompare(b.title) || a.slug.localeCompare(b.slug);
}

export async function getPublishedLibraryWork(theme?: Theme): Promise<LibraryWork[]> {
  const { playbooks, essays } = await fetchPublishedCollections();

  const combined: LibraryWork[] = [
    ...playbooks.map((entry) => mapLibraryWork('playbooks', entry)),
    ...essays.map((entry) => mapLibraryWork('essays', entry)),
  ].sort(compareWork);

  if (!theme) {
    return combined;
  }
  return combined.filter((work) => work.theme === theme);
}

export async function hasLibraryWork(): Promise<boolean> {
  const { playbooks, essays } = await fetchPublishedCollections();
  return playbooks.length + essays.length > 0;
}
