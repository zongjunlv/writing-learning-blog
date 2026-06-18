import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

const vercelSite = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://writing-learning-blog.vercel.app";

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? vercelSite,
  base: process.env.PUBLIC_SITE_BASE ?? "/",
  integrations: [mdx()],
});
