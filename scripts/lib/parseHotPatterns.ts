export interface ParsedDailyLearning {
  date: string;
  sampleTitle: string;
  authorName: string;
  learningGoals: string[];
  genres: string[];
  sourceUrls: string[];
  sourceStatus: string;
  selectionReason: string;
  learningItems: string[];
  exercise: string;
}

function stripBulletLabel(line: string, label: string): string | undefined {
  const prefix = `- ${label}：`;
  if (!line.startsWith(prefix)) {
    return undefined;
  }
  return line.slice(prefix.length).trim();
}

function parseDate(sectionTitle: string): string {
  const match = sectionTitle.match(/（(\d{4}-\d{2}-\d{2})）/);
  if (!match) {
    throw new Error("Cannot find date in 今日样本 heading");
  }
  return match[1];
}

function cleanValue(value: string): string {
  return value.replace(/[。；;，,]+$/g, "").trim();
}

function parseLearningGoals(value: string): string[] {
  return value
    .replace("副目标：", "、")
    .split(/[、，；;]+/)
    .map(cleanValue)
    .filter(Boolean);
}

function parseGenres(value: string): string[] {
  return value
    .split("｜")
    .map(cleanValue)
    .filter(Boolean)
    .slice(0, 8);
}

function parseNumberedLearningItems(lines: string[], startIndex: number): string[] {
  const items: string[] = [];
  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (line.startsWith("- 自我对照练习")) {
      break;
    }
    const match = line.match(/^\d+\.\s+(.+)$/);
    if (match) {
      items.push(match[1].trim());
    }
  }
  return items;
}

export function parseTodaySection(markdown: string): ParsedDailyLearning {
  const start = markdown.indexOf("### 1.0 今日样本");
  if (start === -1) {
    throw new Error("Cannot find ### 1.0 今日样本 section");
  }

  const rest = markdown.slice(start);
  const next = rest.indexOf("\n### 1.1 ");
  const section = next === -1 ? rest : rest.slice(0, next);
  const lines = section.split(/\r?\n/);
  const heading = lines[0];

  const parsed: ParsedDailyLearning = {
    date: parseDate(heading),
    sampleTitle: "",
    authorName: "",
    learningGoals: [],
    genres: [],
    sourceUrls: [],
    sourceStatus: "",
    selectionReason: "",
    learningItems: [],
    exercise: "",
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();
    parsed.sampleTitle = stripBulletLabel(line, "书名") ?? parsed.sampleTitle;
    parsed.authorName = stripBulletLabel(line, "作者") ?? parsed.authorName;

    const goals = stripBulletLabel(line, "本次主学习目标");
    if (goals) {
      parsed.learningGoals = parseLearningGoals(goals);
    }

    const genres = stripBulletLabel(line, "类型标签（用于检索与迁移）");
    if (genres) {
      parsed.genres = parseGenres(genres);
    }

    const reason = stripBulletLabel(line, "选择理由（可复用）");
    if (reason) {
      parsed.selectionReason = reason;
    }

    if (line.startsWith("- 来源/榜单依据：")) {
      parsed.sourceStatus = line.replace("- 来源/榜单依据：", "").trim();
    }

    if (/^-\s+https?:\/\//.test(line)) {
      parsed.sourceUrls.push(line.replace(/^-+\s+/, "").trim());
    }

    if (line.startsWith("- 本次学习到的内容")) {
      parsed.learningItems = parseNumberedLearningItems(lines, index);
    }

    const exercise = stripBulletLabel(line, "自我对照练习（禁止复刻）");
    if (exercise) {
      parsed.exercise = exercise;
    }
  }

  const missing = [
    ["sampleTitle", parsed.sampleTitle],
    ["authorName", parsed.authorName],
    ["selectionReason", parsed.selectionReason],
    ["exercise", parsed.exercise],
  ].filter(([, value]) => !value);

  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.map(([key]) => key).join(", ")}`);
  }

  if (parsed.learningItems.length < 5 || parsed.learningItems.length > 10) {
    throw new Error(`Expected 5-10 learning items, got ${parsed.learningItems.length}`);
  }

  return parsed;
}
