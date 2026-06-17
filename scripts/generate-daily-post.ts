import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createPostSlug } from "../src/lib/slug";
import { parseTodaySection, type ParsedDailyLearning } from "./lib/parseHotPatterns";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");
const defaultSourcePath = "/Users/jungle/.codex/skills/chinese-novelist/references/hot-male-xuanhuan-patterns.md";
const sourcePath = process.env.HOT_PATTERNS_PATH || defaultSourcePath;

function yamlList(values: string[]): string {
  return values.map((value) => `  - ${JSON.stringify(value)}`).join("\n");
}

function publicSafeText(value: string): string {
  return value.replace(/[“”]/g, "").trim();
}

function renderPost(parsed: ParsedDailyLearning): string {
  const tags = Array.from(new Set([...parsed.genres.slice(0, 3), ...parsed.learningGoals]));
  const sourceLinks = Array.from(new Set(parsed.sourceUrls)).map((url) => `- ${url}`).join("\n");
  const learningItems = parsed.learningItems.map((item, index) => `${index + 1}. ${publicSafeText(item)}`).join("\n");

  return `---
title: "今天从《${parsed.sampleTitle}》学到什么"
date: "${parsed.date}"
sampleTitle: "${parsed.sampleTitle}"
authorName: "${parsed.authorName}"
genres:
${yamlList(parsed.genres.length > 0 ? parsed.genres : ["玄幻"])}
learningGoals:
${yamlList(parsed.learningGoals.length > 0 ? parsed.learningGoals : ["写作技巧"])}
sourceStatus: "正版平台与公开来源旁证，榜单证据不足处使用限定表达"
copyrightLevel: "abstract-only"
tags:
${yamlList(tags.length > 0 ? tags : ["每日学习"])}
summary: "记录从《${parsed.sampleTitle}》提炼出的新手可执行写作规则、反向错误和检查清单。"
---

## 今天学哪本

今天学习《${parsed.sampleTitle}》。这篇日志只记录可迁移的写作规律，不复述正文，不复刻设定。

## 为什么选它

${publicSafeText(parsed.selectionReason)}

## 我作为新手最想学什么

我想从这本样本里学习：${parsed.learningGoals.join("、") || "写作技巧"}。重点看它怎样把题材承诺落到具体场景、动作、压力和段落结果上。

## 本次学到什么

${learningItems}

## 我容易犯的反向错误

- 只记住样本题材名词，却没有提炼它解决了什么写作问题。
- 把世界观、地图、设定当成高级感来源，忽略目标、阻力、代价和下一步行动。
- 用残句、空泛形容词或专名堆叠代替完整句、准确动词和清楚因果。

## 可执行检查清单

- [ ] 本篇学习是否能转化为 5 条以上写作检查问题？
- [ ] 每条规则是否能指导下一章的开篇、冲突、爽点、压迫或文字修订？
- [ ] 是否避开了样本专有人物、设定组合、章节路线和原句？
- [ ] 是否把抽象词落到了目标、阻力、代价、动作或段尾结果？

## 自我练习

${publicSafeText(parsed.exercise)}

## 来源与版权边界

${sourceLinks || "- 今日来源链接记录在内部规律库中。"}

本文是个人写作学习日志，只记录抽象写作规律、文字执行方法和自我练习，不摘录原文，不复述完整剧情，不提供替代原作阅读的内容。
`;
}

const markdown = readFileSync(sourcePath, "utf8");
const parsed = parseTodaySection(markdown);
const slug = createPostSlug(parsed.date, parsed.sampleTitle);
const outputPath = join(projectRoot, "src", "content", "posts", `${slug}.mdx`);

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, renderPost(parsed), "utf8");

console.log(`Generated ${outputPath}`);
