import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");
const postsDir = join(projectRoot, "src", "content", "posts");

interface ValidationIssue {
  file: string;
  message: string;
}

const requiredFrontmatter = [
  "title",
  "date",
  "sampleTitle",
  "authorName",
  "genres",
  "learningGoals",
  "sourceStatus",
  "copyrightLevel",
  "tags",
  "summary",
];

function countLearningItems(content: string): number {
  const match = content.match(/## 本次学到什么([\s\S]*?)(\n## |$)/);
  if (!match) {
    return 0;
  }
  return match[1].split(/\r?\n/).filter((line) => /^\d+\.\s+/.test(line.trim())).length;
}

function findCopyrightRisks(content: string): string[] {
  const risks: string[] = [];
  const forbiddenPhrases = ["原文如下", "章节原文", "大段摘录", "以下是正文", "复制原文"];
  for (const phrase of forbiddenPhrases) {
    if (content.includes(phrase)) {
      risks.push(`contains forbidden phrase: ${phrase}`);
    }
  }

  const longQuotedChinese = content.match(/“[^”]{30,}”/g) ?? [];
  if (longQuotedChinese.length >= 3) {
    risks.push("contains three or more long quoted Chinese passages");
  }

  const chapterChain = content.match(/第[一二三四五六七八九十百千万\d]+章/g) ?? [];
  if (chapterChain.length >= 4) {
    risks.push("mentions four or more chapter markers");
  }

  const blockquotes = content.split(/\r?\n/).filter((line) => line.trim().startsWith(">"));
  if (blockquotes.length > 2) {
    risks.push("contains more than two blockquote lines");
  }

  return risks;
}

function validateFile(file: string): ValidationIssue[] {
  const fullPath = join(postsDir, file);
  const raw = readFileSync(fullPath, "utf8");
  const parsed = matter(raw);
  const issues: ValidationIssue[] = [];

  for (const field of requiredFrontmatter) {
    if (parsed.data[field] === undefined || parsed.data[field] === "") {
      issues.push({ file, message: `missing frontmatter field: ${field}` });
    }
  }

  if (parsed.data.copyrightLevel !== "abstract-only") {
    issues.push({ file, message: "copyrightLevel must be abstract-only" });
  }

  const learningItemCount = countLearningItems(parsed.content);
  if (learningItemCount < 5 || learningItemCount > 10) {
    issues.push({ file, message: `expected 5-10 learning items, got ${learningItemCount}` });
  }

  for (const heading of ["## 我容易犯的反向错误", "## 可执行检查清单", "## 自我练习", "## 来源与版权边界"]) {
    if (!parsed.content.includes(heading)) {
      issues.push({ file, message: `missing required section: ${heading}` });
    }
  }

  for (const risk of findCopyrightRisks(parsed.content)) {
    issues.push({ file, message: risk });
  }

  return issues;
}

const files = readdirSync(postsDir).filter((file) => file.endsWith(".md") || file.endsWith(".mdx"));
const issues = files.flatMap(validateFile);

if (issues.length > 0) {
  for (const issue of issues) {
    console.error(`${issue.file}: ${issue.message}`);
  }
  process.exit(1);
}

console.log(`Validated ${files.length} public post(s).`);
