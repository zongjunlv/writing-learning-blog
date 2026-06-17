const fallbackMap: Record<string, string> = {
  长生界: "changshengjie",
  吞噬星空: "tunshi-xingkong",
  神墓: "shenmu",
  莽荒纪: "manghuangji",
  盘龙: "panlong",
  万古神帝: "wangu-shendi",
};

export function createPostSlug(date: string, sampleTitle: string): string {
  const normalizedDate = date.trim();
  const known = fallbackMap[sampleTitle.trim()];
  if (known) {
    return `${normalizedDate}-${known}`;
  }

  const ascii = sampleTitle
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${normalizedDate}-${ascii || "daily-learning"}`;
}
