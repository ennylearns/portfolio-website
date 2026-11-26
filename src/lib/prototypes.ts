import { getCollection, type CollectionEntry } from 'astro:content';

/** Returns all published Prototypes ordered by their configured display order. */
export async function getPublishedPrototypes(): Promise<CollectionEntry<'prototypes'>[]> {
  const prototypes = await getCollection('prototypes', ({ data }) => data.published);
  return prototypes.sort((a, b) => a.data.order - b.data.order);
}

/** Returns the highest-priority published Prototype marked as featured. */
export async function getFeaturedPrototype(): Promise<
  CollectionEntry<'prototypes'> | undefined
> {
  const prototypes = await getPublishedPrototypes();
  return prototypes.find((prototype) => prototype.data.featured);
}
