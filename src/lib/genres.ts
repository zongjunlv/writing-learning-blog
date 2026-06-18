import type { CollectionEntry } from "astro:content";

export interface GenreGroup {
  name: string;
  slug: string;
  posts: CollectionEntry<"posts">[];
}

export function createGenreSlug(genre: string): string {
  return (
    genre
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[/?#[\]@!$&'()*+,;=:%\\]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "genre"
  );
}

export function getGenreHref(base: string, genre: string): string {
  return `${base}genres/${encodeURIComponent(createGenreSlug(genre))}/`;
}

export function collectGenreGroups(posts: CollectionEntry<"posts">[]): GenreGroup[] {
  const groups = new Map<string, GenreGroup>();

  for (const post of posts) {
    for (const rawGenre of post.data.genres) {
      const name = rawGenre.trim();
      if (!name) {
        continue;
      }

      const slug = createGenreSlug(name);
      const group = groups.get(slug) ?? { name, slug, posts: [] };
      group.posts.push(post);
      groups.set(slug, group);
    }
  }

  return Array.from(groups.values())
    .map((group) => ({
      ...group,
      posts: group.posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf()),
    }))
    .sort((a, b) => {
      if (b.posts.length !== a.posts.length) {
        return b.posts.length - a.posts.length;
      }
      return a.name.localeCompare(b.name, "zh-CN");
    });
}
