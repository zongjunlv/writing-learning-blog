import { describe, expect, it } from "vitest";
import { parseTodaySection } from "../scripts/lib/parseHotPatterns";

const sample = `### 1.0 今日样本（2026-06-17）

- 书名：长生界
- 作者：辰东
- 本次主学习目标：写作素材、写作技巧；副目标：写作思路、写作体系。
- 来源/榜单依据：正版平台与公开旁证。
  - https://example.com/book
- 类型标签（用于检索与迁移）：玄幻｜东方玄幻｜长生追问
- 选择理由（可复用）：适合学习误入异界和长生代价。
- 本次学习到的内容（可直接用于写作）：
  1. 开篇先给现实压迫。
  2. 误入异界要切断旧路线。
  3. 地形必须影响行动。
  4. 古物先给功能。
  5. 段尾落硬结果。
- 自我对照练习（禁止复刻）：设计不同设定的练习。

### 1.1 历史样本（2026-06-16）
`;

describe("parseTodaySection", () => {
  it("parses today's learning section", () => {
    const parsed = parseTodaySection(sample);
    expect(parsed.date).toBe("2026-06-17");
    expect(parsed.sampleTitle).toBe("长生界");
    expect(parsed.authorName).toBe("辰东");
    expect(parsed.genres).toEqual(["玄幻", "东方玄幻", "长生追问"]);
    expect(parsed.learningItems).toHaveLength(5);
    expect(parsed.sourceUrls).toEqual(["https://example.com/book"]);
  });
});
