import { describe, expect, it } from "vitest";
import { createPostSlug } from "../src/lib/slug";

describe("createPostSlug", () => {
  it("uses known romanized slugs for Chinese sample titles", () => {
    expect(createPostSlug("2026-06-17", "长生界")).toBe("2026-06-17-changshengjie");
  });

  it("uses an ASCII fallback for unknown English titles", () => {
    expect(createPostSlug("2026-06-18", "New Sample Book")).toBe("2026-06-18-new-sample-book");
  });

  it("uses daily-learning when no safe slug can be derived", () => {
    expect(createPostSlug("2026-06-19", "《》")).toBe("2026-06-19-daily-learning");
  });
});
