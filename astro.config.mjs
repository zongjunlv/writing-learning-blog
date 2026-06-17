import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://zongjunlv.github.io",
  base: "/writing-learning-blog",
  integrations: [mdx()],
});
