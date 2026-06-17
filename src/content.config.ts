import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    sampleTitle: z.string(),
    authorName: z.string(),
    genres: z.array(z.string()).min(1),
    learningGoals: z.array(z.string()).min(1),
    sourceStatus: z.string(),
    copyrightLevel: z.literal("abstract-only"),
    tags: z.array(z.string()).min(1),
    summary: z.string(),
  }),
});

const topics = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/topics" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
  }),
});

const rules = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/rules" }),
  schema: z.object({
    title: z.string(),
    category: z.string(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
  }),
});

const checklists = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/checklists" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = {
  posts,
  topics,
  rules,
  checklists,
};
